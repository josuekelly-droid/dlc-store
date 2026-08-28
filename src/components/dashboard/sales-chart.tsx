"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"

interface SalesChartProps {
  data: {
    date: string
    totalPrice: number
  }[]
}

export function SalesChart({ data }: SalesChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    }),
    total: d.totalPrice,
  }))

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-pink-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Ventes (7 derniers jours)
        </h2>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 sm:h-64 text-gray-400">
          Aucune donnée disponible
        </div>
      ) : (
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                tickFormatter={(value) => `${value} F`}
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, "Total"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #fce7f3",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#f472b6"
                strokeWidth={2}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}