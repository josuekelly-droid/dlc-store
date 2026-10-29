"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { PieChart as PieIcon } from "lucide-react"

interface CategoryStat {
  name: string
  value: number
}

const COLORS = ["#f472b6", "#fb923c", "#60a5fa", "#34d399", "#a78bfa", "#fbbf24"]

export function CategoryChart({ categories }: { categories: CategoryStat[] }) {
  const total = categories.reduce((sum, c) => sum + c.value, 0)

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
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* ✅ Graphique (sans labels externes pour éviter le chevauchement mobile) */}
          <div className="w-full sm:w-1/2 h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  innerRadius="50%"
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {categories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} produit(s)`,
                    name as string,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #fce7f3",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ✅ Légende détaillée (remplace les labels sur le graphique) */}
          <div className="w-full sm:w-1/2 space-y-2">
            {categories.map((category, index) => {
              const percent = total > 0 ? (category.value / total) * 100 : 0
              return (
                <div
                  key={category.name}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="text-gray-700 truncate">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 flex-shrink-0">
                    {category.value}{" "}
                    <span className="text-gray-400 font-normal">
                      ({percent.toFixed(0)}%)
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}