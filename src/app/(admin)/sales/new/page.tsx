import { prisma } from "@/lib/prisma"
import { NewSaleForm } from "@/components/sales/new-sale-form"

export default async function NewSalePage() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  // Sérialiser
  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price.toString(),
    variants: product.variants.map((v) => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nouvelle vente</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Enregistrez une commande client
        </p>
      </div>

      <NewSaleForm products={serializedProducts} />
    </div>
  )
}