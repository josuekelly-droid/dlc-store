import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EditProductForm } from "@/components/products/edit-product-form"

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Modifier le produit</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Modifiez les informations du produit et ses variantes
        </p>
      </div>

      {/* Formulaire */}
      <EditProductForm
        product={{
          id: product.id,
          name: product.name,
          description: product.description || "",
          price: product.price.toString(),
          category: product.category || "",
          imageUrl: product.imageUrl || "",
          variants: product.variants.map((v) => ({
            id: v.id,
            color: v.color,
            size: v.size,
            stock: v.stock,
          })),
        }}
      />
    </div>
  )
}