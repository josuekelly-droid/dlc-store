"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { productSchema } from "@/lib/validations/product"

export async function createProduct(data: {
  name: string
  description?: string
  price: number
  category?: string
  imageUrl?: string
  variants: { color: string; size: string; stock: number }[]
}) {
  const validated = productSchema.parse(data)

  const product = await prisma.product.create({
    data: {
      name: validated.name,
      description: validated.description || null,
      price: validated.price,
      category: validated.category || null,
      imageUrl: validated.imageUrl || null,
      variants: {
        create: data.variants,
      },
    },
    include: {
      variants: true,
    },
  })

  // ✅ Ajouter le revalidatePath pour le dashboard
  revalidatePath("/products")
  revalidatePath("/dashboard")
  return product
}

export async function updateProduct(
  id: string,
  data: {
    name: string
    description?: string
    price: number
    category?: string
    imageUrl?: string
    variants: { id?: string; color: string; size: string; stock: number }[]
  }
) {
  const validated = productSchema.parse(data)

  // Mettre à jour le produit
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: validated.name,
      description: validated.description || null,
      price: validated.price,
      category: validated.category || null,
      imageUrl: validated.imageUrl || null,
    },
  })

  // Gérer les variantes
  for (const variant of data.variants) {
    if (variant.id) {
      // Mise à jour
      await prisma.variant.update({
        where: { id: variant.id },
        data: {
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
        },
      })
    } else {
      // Création
      await prisma.variant.create({
        data: {
          productId: id,
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
        },
      })
    }
  }

  // ✅ Ajouter le revalidatePath pour le dashboard
  revalidatePath("/products")
  revalidatePath("/dashboard")
  return product
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  })

  // ✅ Ajouter le revalidatePath pour le dashboard
  revalidatePath("/products")
  revalidatePath("/dashboard")
}

export async function deleteVariant(id: string) {
  await prisma.variant.delete({
    where: { id },
  })

  // ✅ Ajouter le revalidatePath pour le dashboard
  revalidatePath("/products")
  revalidatePath("/dashboard")
}