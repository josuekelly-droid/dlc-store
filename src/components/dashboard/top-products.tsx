"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trophy } from "lucide-react"

interface TopProduct {
  name: string
  quantity: number
  revenue: number
}

export function TopProducts({ products }: { products: TopProduct[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-pink-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Top 5 produits
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="flex items-center justify-center h-48 sm:h-64 text-gray-400">
          Aucune donnée disponible
        </div>
      ) : (
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                formatter={(value) => [`${Number(value)} unités`, "Quantité"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #fce7f3",
                }}
              />
              <Bar dataKey="quantity" fill="#f472b6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}