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

interface InvoiceProps {
  sale: {
    id: string
    quantity: number
    totalPrice: string
    soldAt: string
    clientName: string
    clientPhone: string
    clientAddress: string | null
    variant: {
      color: string
      size: string
      product: {
        name: string
        price: string
        description: string | null
        category: string | null
      }
    }
  }
}

export function Invoice({ sale }: InvoiceProps) {
  const router = useRouter()
  const invoiceRef = useRef<HTMLDivElement>(null)

  const unitPrice = parseFloat(sale.variant.product.price)
  const totalPrice = unitPrice * sale.quantity
  const invoiceNumber = `FAC-${sale.id.slice(0, 8).toUpperCase()}`
  const invoiceDate = new Date(sale.soldAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // Utiliser l'impression pour générer le PDF
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Boutons d'action (masqués à l'impression) */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          onClick={() => router.push("/sales")}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-pink-200 text-gray-600 rounded-xl hover:bg-pink-50 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux ventes
        </button>
        <div className="flex gap-3 sm:ml-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Télécharger PDF
          </button>
        </div>
      </div>

      {/* Facture */}
      <div
        ref={invoiceRef}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:rounded-none"
      >
        {/* En-tête avec logo */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logo/logo-dlc-store.png"
                alt="DLC Store"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-white p-1"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">DLC Store</h1>
                <p className="text-pink-100 text-sm mt-1">Vente de sacs et accessoires</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">FACTURE</p>
              <p className="text-pink-100 text-sm">{invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Date et client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Date</h3>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-pink-600" />
                <span>{invoiceDate}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Client</h3>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{sale.clientName}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="w-3 h-3 text-pink-600" />
                  {sale.clientPhone}
                </p>
                {sale.clientAddress && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-pink-600" />
                    {sale.clientAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tableau des produits */}
          <div className="border border-pink-100 rounded-xl overflow-hidden">
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
                <tr className="border-t border-pink-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-pink-600" />
                      <div>
                        <p className="font-medium text-gray-900">{sale.variant.product.name}</p>
                        {sale.variant.product.category && (
                          <p className="text-xs text-gray-500">{sale.variant.product.category}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {sale.variant.color} - {sale.variant.size}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-900 font-medium">
                    {sale.quantity}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-600">
                    {unitPrice.toLocaleString()} FCFA
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                    {totalPrice.toLocaleString()} FCFA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 bg-pink-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Sous-total</span>
                <span className="text-sm text-gray-900">{totalPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Taxes</span>
                <span className="text-sm text-gray-900">0 FCFA</span>
              </div>
              <div className="border-t border-pink-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-pink-600">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="border-t border-pink-100 pt-6 text-center">
            <p className="text-sm text-gray-500">Merci de votre confiance !</p>
            <p className="text-xs text-gray-400 mt-1">
              Pour toute question, contactez-nous
            </p>
          </div>
        </div>
      </div>

      {/* Styles pour l'impression */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}