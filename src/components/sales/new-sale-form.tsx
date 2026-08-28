"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSale } from "@/lib/actions/sales"
import {
  User,
  Phone,
  MapPin,
  Package,
  Save,
  ArrowLeft,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: string
  variants: {
    id: string
    color: string
    size: string
    stock: number
  }[]
}

interface CartItem {
  variantId: string
  productName: string
  color: string
  size: string
  quantity: number
  price: number
  stock: number
}

export function NewSaleForm({ products }: { products: Product[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Client
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientAddress, setClientAddress] = useState("")

  // Panier
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState("")
  const [selectedVariantId, setSelectedVariantId] = useState("")
  const [quantity, setQuantity] = useState(1)

  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const selectedVariant = selectedProduct?.variants.find((v) => v.id === selectedVariantId)

  const addToCart = () => {
    if (!selectedProduct || !selectedVariant) return

    if (quantity > selectedVariant.stock) {
      setError(`Stock insuffisant. Disponible : ${selectedVariant.stock}`)
      return
    }

    const existingItem = cart.find((item) => item.variantId === selectedVariant.id)
    if (existingItem) {
      if (existingItem.quantity + quantity > selectedVariant.stock) {
        setError(`Stock insuffisant. Disponible : ${selectedVariant.stock}`)
        return
      }
      setCart(
        cart.map((item) =>
          item.variantId === selectedVariant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          variantId: selectedVariant.id,
          productName: selectedProduct.name,
          color: selectedVariant.color,
          size: selectedVariant.size,
          quantity,
          price: parseFloat(selectedProduct.price),
          stock: selectedVariant.stock,
        },
      ])
    }

    setSelectedProductId("")
    setSelectedVariantId("")
    setQuantity(1)
    setError("")
  }

  const removeFromCart = (variantId: string) => {
    setCart(cart.filter((item) => item.variantId !== variantId))
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!clientName.trim() || !clientPhone.trim()) {
        setError("Le nom et le téléphone du client sont requis")
        setIsLoading(false)
        return
      }

      if (cart.length === 0) {
        setError("Ajoutez au moins un produit au panier")
        setIsLoading(false)
        return
      }

      await createSale({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientAddress: clientAddress.trim() || null,
        items: cart.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
        })),
      })

      router.push("/sales")
      router.refresh()
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la vente")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations client */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-pink-100">
          <User className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-semibold text-gray-900">Informations client</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nom et prénom <span className="text-pink-600">*</span>
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: Marie Dupont"
              className="w-full px-4 py-2.5 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Téléphone <span className="text-pink-600">*</span>
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Ex: +229 01 23 45 67"
              className="w-full px-4 py-2.5 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Adresse
          </label>
          <input
            type="text"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            placeholder="Ex: Cotonou, Bénin"
            className="w-full px-4 py-2.5 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
        </div>
      </div>

      {/* Sélection produit */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-pink-100">
          <Package className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-semibold text-gray-900">Ajouter des produits</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Produit</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value)
                setSelectedVariantId("")
              }}
              className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            >
              <option value="">Sélectionner...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.price} FCFA
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Variante</label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              disabled={!selectedProductId}
            >
              <option value="">Sélectionner...</option>
              {selectedProduct?.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.color} - {variant.size} (Stock: {variant.stock})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Quantité</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={addToCart}
              disabled={!selectedVariantId}
              className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
              aria-label="Ajouter"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panier */}
        {cart.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Panier</h3>
            {cart.map((item) => (
              <div key={item.variantId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    {item.color} - {item.size} × {item.quantity} = {item.price * item.quantity} FCFA
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.variantId)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Retirer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="text-right">
              <p className="text-sm text-gray-500">Total :</p>
              <p className="text-2xl font-bold text-pink-600">{totalAmount} FCFA</p>
            </div>
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/sales"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-pink-200 text-gray-600 rounded-xl hover:bg-pink-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Retour
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200 text-sm sm:text-base flex-1 sm:flex-none order-1 sm:order-2"
        >
          {isLoading ? "Enregistrement..." : (
            <>
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              Enregistrer la vente
            </>
          )}
        </button>
      </div>
    </form>
  )
}