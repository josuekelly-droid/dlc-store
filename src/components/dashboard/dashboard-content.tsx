import { prisma } from "@/lib/prisma"
import { StatsCards } from "./stats-cards"
import { LowStock } from "./low-stock"
import { SalesChart } from "./sales-chart"
import { TopProducts } from "./top-products"
import { CategoryChart } from "./category-chart"
import { RecentSales } from "./recent-sales"
import { MonthlyRevenue } from "./monthly-revenue"

export async function DashboardContent() {
  // Dates pour le mois en cours
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLast12Months = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  // Récupération des statistiques
  const [
    totalProducts,
    totalVariants,
    totalStock,
    totalOrders,
    totalRevenue,
    lowStockVariants,
    recentOrders,
    salesForChart,
    topProducts,
    categoryStats,
    currentMonthRevenue,
    last12MonthsSales,
  ] = await Promise.all([
    // Compteurs
    prisma.product.count(),
    prisma.variant.count(),
    prisma.variant.aggregate({ _sum: { stock: true } }),
    prisma.order.count(), // ✅ Compter les commandes
    prisma.sale.aggregate({ _sum: { totalPrice: true } }),

    // Stock faible (≤ 5)
    prisma.variant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),

    // ✅ Dernières commandes (au lieu des derniers articles)
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    }),

    // Ventes des 7 derniers jours pour le graphique
    prisma.sale.findMany({
      where: {
        soldAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { soldAt: "asc" },
      include: {
        variant: { include: { product: true } },
      },
    }),

    // Top produits
    prisma.sale
      .groupBy({
        by: ["variantId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      })
      .then(async (grouped) => {
        const result = []
        for (const g of grouped) {
          const variant = await prisma.variant.findUnique({
            where: { id: g.variantId },
            include: { product: true },
          })
          if (variant) {
            result.push({
              name: variant.product.name,
              quantity: g._sum.quantity || 0,
              revenue:
                (g._sum.quantity || 0) *
                parseFloat(variant.product.price.toString()),
            })
          }
        }
        return result
      }),

    // Répartition par catégorie
    prisma.product.groupBy({
      by: ["category"],
      _count: { id: true },
    }),

    // ✅ CA du mois en cours
    prisma.sale.aggregate({
      where: {
        soldAt: { gte: startOfMonth },
      },
      _sum: { totalPrice: true },
    }),

    // ✅ Ventes des 12 derniers mois (pour l'historique)
    prisma.sale.findMany({
      where: {
        soldAt: { gte: startOfLast12Months },
      },
      select: {
        soldAt: true,
        totalPrice: true,
      },
    }),
  ])

  // Conversion des Decimal en number
  const totalStockValue = totalStock._sum.stock ?? 0
  const totalRevenueValue = totalRevenue._sum.totalPrice
    ? parseFloat(totalRevenue._sum.totalPrice.toString())
    : 0

  // ✅ CA du mois en cours
  const currentMonthRevenueValue = currentMonthRevenue._sum.totalPrice
    ? parseFloat(currentMonthRevenue._sum.totalPrice.toString())
    : 0

  // ✅ Calcul de l'historique des 12 derniers mois
  const monthlyRevenuesMap = new Map<string, number>()

  // Initialiser les 12 mois à 0
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthlyRevenuesMap.set(key, 0)
  }

  // Remplir avec les données réelles
  for (const sale of last12MonthsSales) {
    const d = new Date(sale.soldAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (monthlyRevenuesMap.has(key)) {
      const current = monthlyRevenuesMap.get(key) || 0
      monthlyRevenuesMap.set(
        key,
        current + parseFloat(sale.totalPrice.toString())
      )
    }
  }

  // Construire le tableau final (du plus récent au plus ancien)
  const monthlyRevenues = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    return {
      month: d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      monthKey: key,
      revenue: monthlyRevenuesMap.get(key) || 0,
      isCurrent: i === 0,
    }
  })

  // Sérialiser les données
  const serializedLowStock = lowStockVariants.map((v) => ({
    id: v.id,
    color: v.color,
    size: v.size,
    stock: v.stock,
    productName: v.product.name,
  }))

  // ✅ Sérialiser les commandes récentes
  const serializedRecentOrders = recentOrders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    clientName: order.clientName,
    itemCount: order.itemCount,
    totalAmount: order.totalAmount.toString(),
    createdAt: order.createdAt.toISOString(),
    // Résumé des articles (max 2 affichés)
    itemsSummary: order.items
      .slice(0, 2)
      .map((item) => item.variant.product.name)
      .join(", "),
    hasMoreItems: order.items.length > 2,
  }))

  const serializedSalesForChart = salesForChart.map((sale) => ({
    date: sale.soldAt.toISOString(),
    totalPrice: parseFloat(sale.totalPrice.toString()),
  }))

  const serializedTopProducts = topProducts.map((p) => ({
    name: p.name,
    quantity: p.quantity,
    revenue: p.revenue,
  }))

  const serializedCategoryStats = categoryStats
    .filter((c) => c.category !== null)
    .map((c) => ({
      name: c.category || "Autre",
      value: c._count.id,
    }))

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques avec CA mensuel */}
      <StatsCards
        totalProducts={totalProducts}
        totalVariants={totalVariants}
        totalStock={totalStockValue}
        totalSales={totalOrders}
        totalRevenue={totalRevenueValue}
        currentMonthRevenue={currentMonthRevenueValue}
        monthlyRevenues={monthlyRevenues}
        lowStockCount={lowStockVariants.length}
      />

      {/* Stock faible */}
      <LowStock variants={serializedLowStock} />

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={serializedSalesForChart} />
        <TopProducts products={serializedTopProducts} />
      </div>

      {/* ✅ Historique CA mensuel */}
      <MonthlyRevenue data={monthlyRevenues} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart categories={serializedCategoryStats} />
        <RecentSales sales={serializedRecentOrders} />
      </div>
    </div>
  )
}