"use client"

import { TrendingUp } from "lucide-react"

interface MonthlyRevenue {
  month: string
  monthKey: string
  revenue: number
  isCurrent: boolean
}

export function MonthlyRevenue({ data }: { data: MonthlyRevenue[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Chiffre d'affaires mensuel
        </h2>
      </div>

      <div className="space-y-2.5">
        {data.map((item) => (
          <div key={item.monthKey} className="flex items-center gap-3">
            <span
              className={`text-xs w-28 sm:w-32 capitalize flex-shrink-0 ${
                item.isCurrent ? "font-semibold text-pink-600" : "text-gray-600"
              }`}
            >
              {item.month}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  item.isCurrent ? "bg-pink-500" : "bg-pink-300"
                }`}
                style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <span
              className={`text-xs sm:text-sm font-semibold w-20 text-right ${
                item.isCurrent ? "text-pink-600" : "text-gray-700"
              }`}
            >
              {item.revenue.toLocaleString()} F
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}