import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { ProductsList } from "@/components/products/products-list"
import Link from "next/link"
import { Plus } from "lucide-react"

// ✅ Force le rendu dynamique (pas de pré-rendu ISR avec cache lourd)
export const dynamic = "force-dynamic"

const ITEMS_PER_PAGE = 10

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || "1", 10))
  const searchQuery = params.search?.trim() || ""

  // ✅ Filtre de recherche côté serveur
  const whereClause = searchQuery
    ? {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" as const } },
          { category: { contains: searchQuery, mode: "insensitive" as const } },
        ],
      }
    : {}

  // ✅ Compter le total pour la pagination
  const totalProducts = await prisma.product.count({ where: whereClause })
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE))

  // ✅ Récupérer UNIQUEMENT la page courante avec select optimisé
  const products = await prisma.product.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      // ✅ Ne charger que les infos essentielles des variantes
      variants: {
        select: {
          id: true,
          color: true,
          size: true,
          stock: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  })

  // Sérialiser les Decimal et Date
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
            {totalProducts} produit{totalProducts > 1 ? "s" : ""} au total
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
        <ProductsList
          products={serializedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
          searchQuery={searchQuery}
        />
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