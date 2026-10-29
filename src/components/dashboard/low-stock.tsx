"use client"

import { AlertTriangle, Package } from "lucide-react"

interface LowStockVariant {
  id: string
  color: string
  size: string
  stock: number
  productName: string
  imageUrl: string | null // ✅ Ajout
}

export function LowStock({ variants }: { variants: LowStockVariant[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Stock faible (≤ 5 unités)
          </h2>
        </div>
        {variants.length > 0 && (
          <span className="text-xs sm:text-sm bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium">
            {variants.length} variante(s)
          </span>
        )}
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Aucun stock faible 🎉</p>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between bg-orange-50/50 p-3 rounded-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* ✅ Image du produit en petit carré */}
                {variant.imageUrl ? (
                  <img
                    src={variant.imageUrl}
                    alt={variant.productName}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-orange-100"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {variant.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {variant.color} - {variant.size}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 ${
                  variant.stock === 0
                    ? "bg-red-100 text-red-700"
                    : variant.stock <= 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {variant.stock} restant(s)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}