"use client"

import { useState, useEffect, useRef } from "react"
import {
  Package,
  Boxes,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  X,
} from "lucide-react"

interface MonthlyRevenue {
  month: string
  monthKey: string
  revenue: number
  isCurrent: boolean
}

interface StatsCardsProps {
  totalProducts: number
  totalVariants: number
  totalStock: number
  totalSales: number
  totalRevenue: number
  currentMonthRevenue: number
  monthlyRevenues: MonthlyRevenue[]
  lowStockCount: number
}

export function StatsCards({
  totalProducts,
  totalVariants,
  totalStock,
  totalSales,
  totalRevenue,
  currentMonthRevenue,
  monthlyRevenues,
  lowStockCount,
}: StatsCardsProps) {
  const [selectedMonth, setSelectedMonth] = useState<MonthlyRevenue>(
    monthlyRevenues[0] || {
      month: "Ce mois",
      monthKey: "",
      revenue: currentMonthRevenue,
      isCurrent: true,
    }
  )
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDropdown])

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
      subtitle: "Transactions totales",
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600",
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

      {/* ✅ Carte CA avec sélecteur de mois */}
      <div
        ref={dropdownRef}
        className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 font-medium transition-colors px-1.5 py-0.5 rounded-lg hover:bg-pink-50"
            aria-label="Changer de mois"
          >
            {selectedMonth.isCurrent ? "Ce mois" : "Historique"}
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
          CA {selectedMonth.isCurrent ? "ce mois" : "mensuel"}
        </h3>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
          {selectedMonth.revenue.toLocaleString()}
          <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1">FCFA</span>
        </p>
        <p className="text-xs text-gray-400 mt-1 capitalize truncate">
          {selectedMonth.month}
        </p>

        {/* Dropdown des mois */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-pink-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-pink-100 bg-pink-50">
              <span className="text-xs font-semibold text-gray-700">
                Chiffre d'affaires par mois
              </span>
              <button
                onClick={() => setShowDropdown(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {monthlyRevenues.map((m) => (
                <button
                  key={m.monthKey}
                  onClick={() => {
                    setSelectedMonth(m)
                    setShowDropdown(false)
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs hover:bg-pink-50 transition-colors flex items-center justify-between gap-2 ${
                    selectedMonth.monthKey === m.monthKey
                      ? "bg-pink-100 font-semibold"
                      : ""
                  }`}
                >
                  <span className="capitalize text-gray-700 truncate">
                    {m.month}
                    {m.isCurrent && (
                      <span className="ml-1.5 text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded-full">
                        Actuel
                      </span>
                    )}
                  </span>
                  <span
                    className={`font-semibold flex-shrink-0 ${
                      m.isCurrent ? "text-pink-600" : "text-gray-900"
                    }`}
                  >
                    {m.revenue.toLocaleString()} F
                  </span>
                </button>
              ))}
            </div>
            {/* Total général */}
            <div className="border-t border-pink-100 px-4 py-2.5 bg-gray-50 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Total général</span>
              <span className="font-bold text-pink-600">
                {totalRevenue.toLocaleString()} F
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}