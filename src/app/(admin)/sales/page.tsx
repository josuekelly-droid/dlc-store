import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { SalesList } from "@/components/sales/sales-list"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function SalesPage() {
  const sales = await prisma.sale.findMany({
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      soldAt: "desc",
    },
  })

  // Sérialiser les données
  const serializedSales = sales.map((sale) => ({
    id: sale.id,
    quantity: sale.quantity,
    totalPrice: sale.totalPrice.toString(),
    soldAt: sale.soldAt.toISOString(),
    clientName: sale.clientName,
    clientPhone: sale.clientPhone,
    clientAddress: sale.clientAddress,
    variant: {
      id: sale.variant.id,
      color: sale.variant.color,
      size: sale.variant.size,
      stock: sale.variant.stock,
      product: {
        id: sale.variant.product.id,
        name: sale.variant.product.name,
        price: sale.variant.product.price.toString(),
      },
    },
  }))

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ventes</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Gérez vos ventes et commandes clients
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

      {/* Liste des ventes */}
      <Suspense fallback={<SalesSkeleton />}>
        <SalesList sales={serializedSales} />
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