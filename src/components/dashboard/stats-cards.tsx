"use client"

import {
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
} from "lucide-react"

interface StatsCardsProps {
  totalProducts: number
  totalVariants: number
  totalStock: number
  totalSales: number
  totalRevenue: number
  lowStockCount: number
}

export function StatsCards({
  totalProducts,
  totalVariants,
  totalStock,
  totalSales,
  totalRevenue,
  lowStockCount,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Produits",
      value: totalProducts.toString(),
      subtitle: `${totalVariants} variantes`,
      icon: Package,
      color: "bg-pink-50 text-pink-600",
    },
    {
      title: "Stock total",
      value: totalStock.toString(),
      subtitle: "Unités en stock",
      icon: Boxes,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Ventes",
      value: totalSales.toString(),
      subtitle: "Transactions",
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Chiffre d'affaires",
      value: `${totalRevenue.toLocaleString()} FCFA`,
      subtitle: "Revenu total",
      icon: DollarSign,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Stock faible",
      value: lowStockCount.toString(),
      subtitle: "À réapprovisionner",
      icon: AlertTriangle,
      color: "bg-orange-50 text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 sm:p-2.5 rounded-xl ${stat.color}`}>
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
          <h3 className="text-xs sm:text-sm text-gray-500 mb-1">{stat.title}</h3>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
            {stat.value}
          </p>
          <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  )
}