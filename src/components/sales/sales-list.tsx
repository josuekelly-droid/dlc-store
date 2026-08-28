"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye, ShoppingCart, Phone, MapPin, User } from "lucide-react"

interface Sale {
  id: string
  quantity: number
  totalPrice: string
  soldAt: string
  clientName: string
  clientPhone: string
  clientAddress: string | null
  variant: {
    color: string
    size: string
    product: {
      name: string
      price: string
    }
  }
}

export function SalesList({ sales }: { sales: Sale[] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSales = sales.filter(
    (sale) =>
      sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.clientPhone.includes(searchTerm) ||
      sale.variant.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par client, téléphone ou produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base bg-white"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-pink-100">
            <tr>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Client</th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Produit</th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Qté</th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Total (XOF)</th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Date</th>
              <th className="text-right text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune vente trouvée</p>
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-pink-50 hover:bg-pink-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{sale.clientName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {sale.clientPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{sale.variant.product.name}</p>
                    <p className="text-xs text-gray-500">
                      {sale.variant.color} - {sale.variant.size}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{sale.quantity}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{sale.totalPrice} FCFA</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sale.soldAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => router.push(`/sales/${sale.id}/invoice`)}
                        className="p-2 rounded-lg hover:bg-pink-100 text-gray-500 hover:text-pink-600 transition-colors"
                        aria-label="Voir facture"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredSales.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune vente trouvée</p>
          </div>
        ) : (
          filteredSales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{sale.clientName}</h3>
                  <p className="text-sm text-gray-500 truncate">{sale.variant.product.name}</p>
                  <p className="text-xs text-gray-400">{sale.variant.color} - {sale.variant.size} × {sale.quantity}</p>
                </div>
                <button
                  onClick={() => router.push(`/sales/${sale.id}/invoice`)}
                  className="p-2 rounded-lg bg-pink-50 text-pink-600 ml-2"
                  aria-label="Voir facture"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-pink-600">{sale.totalPrice} FCFA</span>
                <span className="text-xs text-gray-400">{formatDate(sale.soldAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}