"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteOrder } from "@/lib/actions/sales"
import {
  Search,
  Eye,
  Trash2,
  ShoppingCart,
  Phone,
  User,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Package,
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

export function SalesList({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [localOrders, setLocalOrders] = useState<Order[]>(orders)

  const filteredOrders = localOrders.filter(
    (order) =>
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientPhone.includes(searchTerm) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteOrder(id)
      setDeleteConfirm(null)
      setLocalOrders((prev) => prev.filter((o) => o.id !== id))
      router.refresh()
    } catch (err) {
      console.error("Erreur suppression:", err)
      alert("Erreur lors de la suppression de la commande")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par client, téléphone ou n° facture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base bg-white"
        />
      </div>

      {/* Modal de confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmer la suppression
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cette commande ? Le stock de tous les
              articles sera restauré automatiquement.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-pink-100">
            <tr>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">
                Facture
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">
                Client
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">
                Articles
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">
                Total (XOF)
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">
                Date
              </th>
              <th className="text-right text-sm font-medium text-gray-500 px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Aucune commande ne correspond à votre recherche"
                      : "Aucune commande"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="border-b border-pink-50 hover:bg-pink-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-pink-600">{order.orderNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{order.clientName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.clientPhone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700">
                        {order.itemCount} article{order.itemCount > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {parseFloat(order.totalAmount).toLocaleString()} FCFA
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-pink-100 text-gray-500 hover:text-pink-600 transition-colors"
                          aria-label="Voir détails"
                        >
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/sales/${order.id}/invoice`)}
                          className="p-2 rounded-lg hover:bg-pink-100 text-gray-500 hover:text-pink-600 transition-colors"
                          aria-label="Voir facture"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(order.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={6} className="bg-pink-50/50 px-6 py-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Articles de la commande
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between bg-white p-3 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Package className="w-4 h-4 text-pink-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.variant.product.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.variant.color} - {item.variant.size}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.quantity} × {parseFloat(item.unitPrice).toLocaleString()} ={" "}
                                  {parseFloat(item.totalPrice).toLocaleString()} FCFA
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchTerm
                ? "Aucune commande ne correspond à votre recherche"
                : "Aucune commande"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-pink-600">
                      {order.orderNumber}
                    </p>
                    <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full">
                      {order.itemCount} article{order.itemCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {order.clientName}
                  </h3>
                  <p className="text-xs text-gray-500">{order.clientPhone}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() =>
                      setExpandedOrder(expandedOrder === order.id ? null : order.id)
                    }
                    className="p-2 rounded-lg bg-pink-50 text-pink-600"
                    aria-label="Détails"
                  >
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => router.push(`/sales/${order.id}/invoice`)}
                    className="p-2 rounded-lg bg-pink-50 text-pink-600"
                    aria-label="Facture"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(order.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-pink-600">
                  {parseFloat(order.totalAmount).toLocaleString()} FCFA
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              {expandedOrder === order.id && (
                <div className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.variant.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.variant.color} - {item.variant.size} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {parseFloat(item.totalPrice).toLocaleString()} F
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}