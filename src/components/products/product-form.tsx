"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createProduct } from "@/lib/actions/products"
import {
  Plus,
  Trash2,
  Package,
  Save,
  ArrowLeft,
  Upload,
  X,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react"
import Link from "next/link"

interface VariantInput {
  id?: string
  color: string
  size: string
  stock: number
}

export function ProductForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Champs du produit
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  
  // Variantes
  const [variants, setVariants] = useState<VariantInput[]>([
    { color: "", size: "", stock: 0 },
  ])

  const addVariant = () => {
    setVariants([...variants, { color: "", size: "", stock: 0 }])
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const updateVariant = (index: number, field: keyof VariantInput, value: string | number) => {
    const updatedVariants = [...variants]
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    }
    setVariants(updatedVariants)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      // Simuler un upload (à remplacer par UploadThing)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setImageUrl(base64)
        setImagePreview(base64)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError("Erreur lors de l'upload de l'image")
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImageUrl("")
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!name.trim()) {
        setError("Le nom du produit est requis")
        setIsLoading(false)
        return
      }

      if (!price || parseFloat(price) <= 0) {
        setError("Le prix doit être supérieur à 0")
        setIsLoading(false)
        return
      }

      const validVariants = variants.filter(
        (v) => v.color.trim() && v.size.trim() && v.stock >= 0
      )

      if (validVariants.length === 0) {
        setError("Ajoutez au moins une variante valide")
        setIsLoading(false)
        return
      }

      await createProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price),
        category: category.trim() || undefined,
        imageUrl: imageUrl || undefined,
        variants: validVariants.map((v) => ({
          color: v.color.trim(),
          size: v.size.trim(),
          stock: v.stock,
        })),
      })

      router.push("/products")
      router.refresh()
    } catch (err) {
      setError("Une erreur est survenue lors de la création du produit")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Carte : Informations produit */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-pink-100">
          <Package className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-semibold text-gray-900">Informations produit</h2>
        </div>

        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nom du produit <span className="text-pink-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Sac à main élégant"
            className="w-full px-4 py-2.5 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description détaillée du produit..."
            rows={3}
            className="w-full px-4 py-2.5 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base resize-none"
          />
        </div>

        {/* Prix et Catégorie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
              Prix (FCFA) <span className="text-pink-600">*</span>
            </label>
            <div className="relative">
              <input
                id="price"
                type="number"
                step="1"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                className="w-full px-4 py-2.5 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                XOF
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Catégorie
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Sacs à main"
              className="w-full px-4 py-2.5 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Upload Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Image du produit
          </label>
          
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Supprimer l'image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-pink-200 rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:border-pink-400 transition-colors"
            >
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Cliquez pour uploader une image
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG jusqu'à 4MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {isUploading && (
            <p className="text-sm text-pink-600 mt-2">Upload en cours...</p>
          )}
        </div>
      </div>

      {/* Carte : Variantes */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-600" />
            <h2 className="text-lg font-semibold text-gray-900">Variantes</h2>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Couleur <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) => updateVariant(index, "color", e.target.value)}
                  placeholder="Ex: Rose"
                  className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Taille <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                  placeholder="Ex: M"
                  className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Stock <span className="text-pink-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Supprimer la variante"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/products"
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
          {isLoading ? (
            <>
              <span className="animate-spin">⟳</span>
              Création...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              Créer le produit
            </>
          )}
        </button>
      </div>
    </form>
  )
}