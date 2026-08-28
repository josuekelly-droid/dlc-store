import { prisma } from "@/lib/prisma"
import { StatsCards } from "./stats-cards"
import { LowStock } from "./low-stock"
import { SalesChart } from "./sales-chart"
import { TopProducts } from "./top-products"
import { CategoryChart } from "./category-chart"
import { RecentSales } from "./recent-sales"

export async function DashboardContent() {
  // Récupération des statistiques
  const [
    totalProducts,
    totalVariants,
    totalStock,
    totalSales,
    totalRevenue,
    lowStockVariants,
    recentSales,
    salesForChart,
    topProducts,
    categoryStats,
  ] = await Promise.all([
    // Compteurs
    prisma.product.count(),
    prisma.variant.count(),
    prisma.variant.aggregate({ _sum: { stock: true } }),
    prisma.sale.count(),
    prisma.sale.aggregate({ _sum: { totalPrice: true } }),
    
    // Stock faible (≤ 5)
    prisma.variant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
    
    // Dernières ventes
    prisma.sale.findMany({
      take: 5,
      orderBy: { soldAt: "desc" },
      include: {
        variant: {
          include: { product: true },
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
    prisma.sale.groupBy({
      by: ["variantId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }).then(async (grouped) => {
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
            revenue: (g._sum.quantity || 0) * parseFloat(variant.product.price.toString()),
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
  ])

  // Conversion des Decimal en number
  const totalStockValue = totalStock._sum.stock ?? 0
  const totalRevenueValue = totalRevenue._sum.totalPrice
    ? parseFloat(totalRevenue._sum.totalPrice.toString())
    : 0

  // Sérialiser les données
  const serializedLowStock = lowStockVariants.map((v) => ({
    id: v.id,
    color: v.color,
    size: v.size,
    stock: v.stock,
    productName: v.product.name,
  }))

  const serializedRecentSales = recentSales.map((sale) => ({
    id: sale.id,
    quantity: sale.quantity,
    totalPrice: sale.totalPrice.toString(),
    soldAt: sale.soldAt.toISOString(),
    clientName: sale.clientName,
    productName: sale.variant.product.name,
    color: sale.variant.color,
    size: sale.variant.size,
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
      {/* Cartes de statistiques */}
      <StatsCards
        totalProducts={totalProducts}
        totalVariants={totalVariants}
        totalStock={totalStockValue}
        totalSales={totalSales}
        totalRevenue={totalRevenueValue}
        lowStockCount={lowStockVariants.length}
      />

      {/* Stock faible */}
      <LowStock variants={serializedLowStock} />

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={serializedSalesForChart} />
        <TopProducts products={serializedTopProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart categories={serializedCategoryStats} />
        <RecentSales sales={serializedRecentSales} />
      </div>
    </div>
  )
}