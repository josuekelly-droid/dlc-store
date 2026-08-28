import { ProductForm } from "@/components/products/product-form"

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nouveau produit</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Ajoutez un produit avec ses variantes
        </p>
      </div>

      {/* Formulaire */}
      <ProductForm />
    </div>
  )
}