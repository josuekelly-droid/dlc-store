import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { ProductsList } from "@/components/products/products-list"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Convertir les Decimal en string pour les Client Components
  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: product.variants.map((variant) => ({
      ...variant,
      createdAt: variant.createdAt.toISOString(),
      updatedAt: variant.updatedAt.toISOString(),
    })),
  }))

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Gérez vos produits et leurs variantes
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-pink-200 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Nouveau produit
        </Link>
      </div>

      {/* Liste des produits */}
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsList products={serializedProducts} />
      </Suspense>
    </div>
  )
}

function ProductsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-white rounded-xl"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 bg-white rounded-xl"></div>
      ))}
    </div>
  )
}