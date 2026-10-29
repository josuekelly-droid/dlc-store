"use client"

import { Trophy, Package } from "lucide-react"

interface TopProduct {
  name: string
  quantity: number
  revenue: number
  imageUrl: string | null // ✅ Ajout
}

export function TopProducts({ products }: { products: TopProduct[] }) {
  const maxQuantity = Math.max(...products.map((p) => p.quantity), 1)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-pink-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Top 5 produits
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* ✅ Rang */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : index === 1
                    ? "bg-gray-100 text-gray-600"
                    : index === 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-pink-50 text-pink-600"
                }`}
              >
                {index + 1}
              </div>

              {/* ✅ Image en petit carré */}
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-pink-100"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-pink-600" />
                </div>
              )}

              {/* ✅ Nom + barre de progression */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <span className="text-xs font-semibold text-pink-600 flex-shrink-0">
                    {product.quantity} vendu(s)
                  </span>
                </div>
                <div className="w-full bg-pink-50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all"
                    style={{
                      width: `${(product.quantity / maxQuantity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}