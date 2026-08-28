"use client"

import { useRouter } from "next/navigation"
import { ShoppingCart, Eye } from "lucide-react"

interface RecentSale {
  id: string
  quantity: number
  totalPrice: string
  soldAt: string
  clientName: string
  productName: string
  color: string
  size: string
}

export function RecentSales({ sales }: { sales: RecentSale[] }) {
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
            Dernières ventes
          </h2>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Aucune vente</p>
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
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-4 h-4 text-pink-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {sale.clientName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {sale.productName} - {sale.color} {sale.size}
                  </p>
                </div>
              </div>
              <div className="text-right ml-2 flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  {parseFloat(sale.totalPrice).toLocaleString()} FCFA
                </p>
                <p className="text-xs text-gray-400">{formatDate(sale.soldAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}