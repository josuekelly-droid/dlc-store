"use client"

import { TrendingUp, Package } from "lucide-react"

interface MonthlyRevenue {
  month: string
  monthKey: string
  revenue: number
  isCurrent: boolean
}

export function MonthlyRevenue({ data }: { data: MonthlyRevenue[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)
  const hasData = data.some((d) => d.revenue > 0)

  // Format compact pour mobile
  const formatRevenue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
    return value.toString()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Chiffre d'affaires mensuel
        </h2>
      </div>

      {!hasData ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {data.map((item) => (
            <div key={item.monthKey} className="flex items-center gap-2 sm:gap-3">
              {/* ✅ Mois - plus compact sur mobile */}
              <span
                className={`text-[10px] sm:text-xs w-20 sm:w-32 capitalize flex-shrink-0 truncate ${
                  item.isCurrent
                    ? "font-semibold text-pink-600"
                    : "text-gray-600"
                }`}
              >
                {item.month}
              </span>

              {/* ✅ Barre de progression */}
              <div className="flex-1 bg-gray-100 rounded-full h-5 sm:h-6 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.isCurrent ? "bg-pink-500" : "bg-pink-300"
                  }`}
                  style={{
                    width: `${Math.max((item.revenue / maxRevenue) * 100, 2)}%`,
                  }}
                />
              </div>

              {/* ✅ Montant - format compact sur mobile */}
              <span
                className={`text-[10px] sm:text-sm font-semibold w-14 sm:w-20 text-right flex-shrink-0 ${
                  item.isCurrent ? "text-pink-600" : "text-gray-700"
                }`}
              >
                {/* Format court sur mobile, complet sur desktop */}
                <span className="sm:hidden">{formatRevenue(item.revenue)}</span>
                <span className="hidden sm:inline">
                  {item.revenue.toLocaleString()} F
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}