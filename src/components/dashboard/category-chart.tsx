"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { PieChart as PieIcon } from "lucide-react"

interface CategoryStat {
  name: string
  value: number
}

const COLORS = ["#f472b6", "#fb923c", "#60a5fa", "#34d399", "#a78bfa", "#fbbf24"]

export function CategoryChart({ categories }: { categories: CategoryStat[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-5 h-5 text-pink-600" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Produits par catégorie
        </h2>
      </div>

      {categories.length === 0 ? (
        <div className="flex items-center justify-center h-48 sm:h-64 text-gray-400">
          Aucune donnée disponible
        </div>
      ) : (
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} produit(s)`, "Total"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #fce7f3",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}