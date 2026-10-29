import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { SalesList } from "@/components/sales/sales-list"
import Link from "next/link"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SalesPage() {
  // ✅ Récupérer les COMMANDES (pas les ventes individuelles)
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Sérialiser
  const serializedOrders = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    clientName: order.clientName,
    clientPhone: order.clientPhone,
    clientAddress: order.clientAddress,
    totalAmount: order.totalAmount.toString(),
    itemCount: order.itemCount,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      totalPrice: item.totalPrice.toString(),
      variant: {
        color: item.variant.color,
        size: item.variant.size,
        product: {
          name: item.variant.product.name,
        },
      },
    })),
  }))

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ventes</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {orders.length} commande{orders.length > 1 ? "s" : ""} enregistrée{orders.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/sales/new"
          className="inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-pink-200 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Nouvelle vente
        </Link>
      </div>

      {/* Liste des commandes */}
      <Suspense fallback={<SalesSkeleton />}>
        <SalesList orders={serializedOrders} />
      </Suspense>
    </div>
  )
}

function SalesSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-white rounded-xl"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 bg-white rounded-xl"></div>
      ))}
    </div>
  )
}