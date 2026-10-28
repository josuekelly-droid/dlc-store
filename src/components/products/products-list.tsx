"use client"

import { useState, Fragment, useTransition } from "react"
import { useRouter, usePathname } from "next/navigation"
import { deleteProduct } from "@/lib/actions/products"
import {
  Search,
  Edit,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  price: string
  category: string | null
  imageUrl: string | null
  variants: {
    id: string
    color: string
    size: string
    stock: number
  }[]
  createdAt: string
  updatedAt?: string
}

interface ProductsListProps {
  products: Product[]
  currentPage: number
  totalPages: number
  totalProducts: number
  searchQuery: string
}

export function ProductsList({
  products,
  currentPage,
  totalPages,
  totalProducts,
  searchQuery,
}: ProductsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [localProducts, setLocalProducts] = useState<Product[]>(products)

  const totalStock = (product: Product) =>
    product.variants.reduce((sum, v) => sum + v.stock, 0)

  // ✅ Recherche côté serveur avec navigation
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const params = new URLSearchParams()
    if (value.trim()) params.set("search", value.trim())
    params.set("page", "1")
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  // ✅ Navigation entre les pages
  const goToPage = (page: number) => {
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set("search", searchTerm.trim())
    params.set("page", page.toString())
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteProduct(id)
      setDeleteConfirm(null)
      setLocalProducts((prev) => prev.filter((p) => p.id !== id))
      router.refresh()
    } catch (err) {
      console.error("Erreur suppression:", err)
      alert("Erreur lors de la suppression du produit")
    } finally {
      setIsDeleting(false)
    }
  }

  const startItem = totalProducts === 0 ? 0 : (currentPage - 1) * 10 + 1
  const endItem = Math.min(currentPage * 10, totalProducts)

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base bg-white"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
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
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
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
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Produit</th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Catégorie</th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Prix (XOF)</th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Stock</th>
              <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Variantes</th>
              <th className="text-right text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {searchQuery ? "Aucun produit ne correspond à votre recherche" : "Aucun produit"}
                  </p>
                </td>
              </tr>
            ) : (
              localProducts.map((product) => (
                <Fragment key={product.id}>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.imageUrl && !product.imageUrl.startsWith("data:") ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-pink-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.category || "-"}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {product.price} FCFA
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          totalStock(product) === 0
                            ? "bg-red-50 text-red-600"
                            : totalStock(product) < 10
                            ? "bg-orange-50 text-orange-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {totalStock(product)} unités
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.variants.length}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() =>
                            setExpandedProduct(
                              expandedProduct === product.id ? null : product.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-pink-100 text-gray-500 hover:text-pink-600 transition-colors"
                          aria-label="Voir détails"
                        >
                          {expandedProduct === product.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                          className="p-2 rounded-lg hover:bg-pink-100 text-gray-500 hover:text-pink-600 transition-colors"
                          aria-label="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedProduct === product.id && (
                    <tr>
                      <td colSpan={6} className="bg-pink-50/50 px-6 py-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Variantes</h4>
                        <div className="space-y-2">
                          {product.variants.map((variant) => (
                            <div
                              key={variant.id}
                              className="flex items-center justify-between bg-white p-3 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700">{variant.color}</span>
                                <span className="text-xs text-gray-400">|</span>
                                <span className="text-sm text-gray-700">
                                  Taille: {variant.size}
                                </span>
                              </div>
                              <span
                                className={`text-sm font-medium ${
                                  variant.stock === 0
                                    ? "text-red-600"
                                    : variant.stock < 5
                                    ? "text-orange-600"
                                    : "text-green-600"
                                }`}
                              >
                                {variant.stock} en stock
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {localProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery ? "Aucun produit ne correspond à votre recherche" : "Aucun produit"}
            </p>
          </div>
        ) : (
          localProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                {product.imageUrl && !product.imageUrl.startsWith("data:") ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-pink-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{product.category || "-"}</p>
                  <p className="text-lg font-bold text-pink-600 mt-1">{product.price} FCFA</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    totalStock(product) === 0
                      ? "bg-red-50 text-red-600"
                      : totalStock(product) < 10
                      ? "bg-orange-50 text-orange-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {totalStock(product)} unités
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setExpandedProduct(expandedProduct === product.id ? null : product.id)
                    }
                    className="p-2 rounded-lg bg-pink-50 text-pink-600"
                    aria-label="Voir détails"
                  >
                    {expandedProduct === product.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => router.push(`/products/${product.id}/edit`)}
                    className="p-2 rounded-lg bg-pink-50 text-pink-600"
                    aria-label="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {expandedProduct === product.id && (
                <div className="mt-3 space-y-2">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">
                        {variant.color} - Taille: {variant.size}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          variant.stock === 0
                            ? "text-red-600"
                            : variant.stock < 5
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {variant.stock}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ✅ Pagination */}
      {totalProducts > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-500">
            Affichage de <span className="font-semibold text-gray-900">{startItem}</span> à{" "}
            <span className="font-semibold text-gray-900">{endItem}</span> sur{" "}
            <span className="font-semibold text-gray-900">{totalProducts}</span> produit
            {totalProducts > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-pink-200 rounded-lg text-gray-600 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-900">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-pink-200 rounded-lg text-gray-600 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}