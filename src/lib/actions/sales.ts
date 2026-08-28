"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createSale(data: {
  clientName: string
  clientPhone: string
  clientAddress: string | null
  items: {
    variantId: string
    quantity: number
    totalPrice: number
  }[]
}) {
  for (const item of data.items) {
    // Vérifier le stock
    const variant = await prisma.variant.findUnique({
      where: { id: item.variantId },
    })

    if (!variant || variant.stock < item.quantity) {
      throw new Error(`Stock insuffisant pour la variante ${item.variantId}`)
    }

    // Créer la vente
    await prisma.sale.create({
      data: {
        variantId: item.variantId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
      },
    })

    // Décrémenter le stock
    await prisma.variant.update({
      where: { id: item.variantId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    })
  }

  revalidatePath("/sales")
  revalidatePath("/products")
  revalidatePath("/dashboard")
}