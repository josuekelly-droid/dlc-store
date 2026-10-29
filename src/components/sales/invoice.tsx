"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Printer,
  Download,
  ArrowLeft,
  Phone,
  MapPin,
  Package,
  Calendar,
} from "lucide-react"

interface OrderItem {
  id: string
  quantity: number
  unitPrice: string
  totalPrice: string
  variant: {
    color: string
    size: string
    product: {
      name: string
      category: string | null
      imageUrl: string | null // ✅ Ajout
    }
  }
}

interface Order {
  id: string
  orderNumber: string
  clientName: string
  clientPhone: string
  clientAddress: string | null
  totalAmount: string
  itemCount: number
  createdAt: string
  items: OrderItem[]
}

interface InvoiceProps {
  order: Order
}

export function Invoice({ order }: InvoiceProps) {
  const router = useRouter()
  const invoiceRef = useRef<HTMLDivElement>(null)

  const totalPrice = parseFloat(order.totalAmount)
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4">
      {/* Boutons d'action */}
      <div className="max-w-3xl mx-auto mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3 print:hidden">
        <button
          onClick={() => router.push("/sales")}
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-pink-200 text-gray-600 rounded-xl hover:bg-pink-50 transition-colors text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux ventes
        </button>
        <div className="flex gap-2 sm:gap-3 sm:ml-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl transition-colors text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-colors text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Facture */}
      <div
        ref={invoiceRef}
        className="max-w-3xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden print:shadow-none print:rounded-none"
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/logo/logo-dlc-store.png"
                alt="DLC Store"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl object-cover bg-white p-0.5 sm:p-1"
              />
              <div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">
                  DLC Store
                </h1>
                <p className="text-pink-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                  Vente de sacs et accessoires
                </p>
                <p className="text-pink-100 text-xs sm:text-sm flex items-center gap-1.5 mt-0.5 sm:mt-1">
                  <Phone className="w-3 h-3" />
                  +229 01 51 51 29 30
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-base sm:text-lg font-semibold">FACTURE</p>
              <p className="text-pink-100 text-xs sm:text-sm">
                {order.orderNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* Date et client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-1 sm:mb-2">
                Date
              </h3>
              <div className="flex items-center gap-2 text-gray-900 text-sm sm:text-base">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" />
                <span>{invoiceDate}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-1 sm:mb-2">
                Client
              </h3>
              <div className="space-y-0.5 sm:space-y-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {order.clientName}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-pink-600" />
                  {order.clientPhone}
                </p>
                {order.clientAddress && (
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-pink-600" />
                    {order.clientAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Mobile : liste des articles avec image */}
          <div className="sm:hidden space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Articles ({order.itemCount})
            </h3>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="border border-pink-100 rounded-xl overflow-hidden"
              >
                {/* En-tête de l'article avec image */}
                <div className="bg-pink-50 p-3 flex items-center gap-2.5">
                  {item.variant.product.imageUrl ? (
                    <img
                      src={item.variant.product.imageUrl}
                      alt={item.variant.product.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-pink-200"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-pink-600" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.variant.product.name}
                    </p>
                    {item.variant.product.category && (
                      <p className="text-xs text-gray-500">
                        {item.variant.product.category}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-3 space-y-1.5 text-sm">
                  <p className="text-xs text-gray-500">
                    {item.variant.color} - {item.variant.size}
                  </p>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantité</span>
                    <span className="font-medium text-gray-900">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prix unitaire</span>
                    <span className="text-gray-900">
                      {parseFloat(item.unitPrice).toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-pink-100 pt-1.5">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-pink-600">
                      {parseFloat(item.totalPrice).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Desktop : tableau des articles avec image */}
          <div className="hidden sm:block border border-pink-100 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-pink-50">
                <tr>
                  <th className="text-left text-xs sm:text-sm font-semibold text-gray-700 px-4 py-3">
                    Produit
                  </th>
                  <th className="text-left text-xs sm:text-sm font-semibold text-gray-700 px-4 py-3">
                    Variante
                  </th>
                  <th className="text-center text-xs sm:text-sm font-semibold text-gray-700 px-4 py-3">
                    Qté
                  </th>
                  <th className="text-right text-xs sm:text-sm font-semibold text-gray-700 px-4 py-3">
                    Prix unitaire
                  </th>
                  <th className="text-right text-xs sm:text-sm font-semibold text-gray-700 px-4 py-3">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-pink-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* ✅ Image dans la colonne Produit */}
                        {item.variant.product.imageUrl ? (
                          <img
                            src={item.variant.product.imageUrl}
                            alt={item.variant.product.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-pink-100"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-pink-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.variant.product.name}
                          </p>
                          {item.variant.product.category && (
                            <p className="text-xs text-gray-500">
                              {item.variant.product.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.variant.color} - {item.variant.size}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900 font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">
                      {parseFloat(item.unitPrice).toLocaleString()} FCFA
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {parseFloat(item.totalPrice).toLocaleString()} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 bg-pink-50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  Sous-total ({order.itemCount} article
                  {order.itemCount > 1 ? "s" : ""})
                </span>
                <span className="text-xs sm:text-sm text-gray-900">
                  {totalPrice.toLocaleString()} FCFA
                </span>
              </div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-gray-600">Taxes</span>
                <span className="text-xs sm:text-sm text-gray-900">0 FCFA</span>
              </div>
              <div className="border-t border-pink-200 pt-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Total
                </span>
                <span className="text-lg sm:text-xl font-bold text-pink-600">
                  {totalPrice.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="border-t border-pink-100 pt-4 sm:pt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              Merci de votre confiance !
            </p>
            <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">
              DLC Store - +229 01 51 51 29 30
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}