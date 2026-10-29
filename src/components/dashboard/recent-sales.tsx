"use client"

import { useRouter } from "next/navigation"
import { ShoppingCart, Package } from "lucide-react"

interface RecentOrder {
  id: string
  orderNumber: string
  clientName: string
  itemCount: number
  totalAmount: string
  createdAt: string
  firstItemImage: string | null // ✅ Image du premier article
}

export function RecentSales({ sales }: { sales: RecentOrder[] }) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-pink-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Dernières commandes
          </h2>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Aucune commande</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
              onClick={() => router.push(`/sales/${sale.id}/invoice`)}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* ✅ Image du premier article de la commande */}
                {sale.firstItemImage ? (
                  <img
                    src={sale.firstItemImage}
                    alt={sale.clientName}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-pink-100"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-pink-600" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {sale.clientName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {sale.orderNumber} • {sale.itemCount} article
                    {sale.itemCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right ml-2 flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  {parseFloat(sale.totalAmount).toLocaleString()} FCFA
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(sale.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}