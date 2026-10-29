"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * ✅ NOUVEAU : Créer une commande avec plusieurs articles
 * Une seule facture = une commande avec N articles
 */
export async function createOrder(data: {
  clientName: string
  clientPhone: string
  clientAddress: string | null
  items: {
    variantId: string
    quantity: number
    totalPrice: number
  }[]
}) {
  // 1. Vérifier tous les stocks AVANT de créer quoi que ce soit
  for (const item of data.items) {
    const variant = await prisma.variant.findUnique({
      where: { id: item.variantId },
    })

    if (!variant) {
      throw new Error(`Variante introuvable : ${item.variantId}`)
    }

    if (variant.stock < item.quantity) {
      throw new Error(
        `Stock insuffisant pour la variante ${variant.color} ${variant.size}. Disponible : ${variant.stock}, demandé : ${item.quantity}`
      )
    }
  }

  // 2. Générer un numéro de commande unique (FAC-2026-0001)
  const year = new Date().getFullYear()
  const lastOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: `FAC-${year}-`,
      },
    },
    orderBy: {
      orderNumber: "desc",
    },
  })

  let nextNumber = 1
  if (lastOrder) {
    const parts = lastOrder.orderNumber.split("-")
    const lastNumber = parseInt(parts[2] || "0", 10)
    nextNumber = lastNumber + 1
  }

  const orderNumber = `FAC-${year}-${String(nextNumber).padStart(4, "0")}`

  // 3. Calculer le total et créer la commande avec ses articles
  const totalAmount = data.items.reduce((sum, item) => sum + item.totalPrice, 0)

  const order = await prisma.$transaction(async (tx) => {
    // Créer la commande avec tous les articles
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
        totalAmount,
        itemCount: data.items.length,
        items: {
          create: data.items.map((item) => {
            const variantUnitPrice = item.totalPrice / item.quantity
            return {
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: variantUnitPrice,
              totalPrice: item.totalPrice,
            }
          }),
        },
      },
      include: {
        items: true,
      },
    })

    // Décrémenter le stock de chaque variante
    for (const item of data.items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    return newOrder
  })

  // 4. Revalider les pages
  revalidatePath("/sales")
  revalidatePath("/products")
  revalidatePath("/dashboard")

  return order
}

/**
 * ✅ NOUVEAU : Supprimer une commande complète
 * Restaure le stock de tous les articles
 */
export async function deleteOrder(orderId: string) {
  // Récupérer la commande avec tous ses articles
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  })

  if (!order) {
    throw new Error("Commande introuvable")
  }

  // Transaction : restaurer le stock + supprimer la commande
  await prisma.$transaction(async (tx) => {
    // Restaurer le stock pour chaque article
    for (const item of order.items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      })
    }

    // Supprimer la commande (les Sale seront supprimés en cascade)
    await tx.order.delete({
      where: { id: orderId },
    })
  })

  // Revalider les pages
  revalidatePath("/sales")
  revalidatePath("/products")
  revalidatePath("/dashboard")
}

/**
 * ⚠️ ANCIENNE FONCTION : Gardée pour compatibilité
 * Utilisez `createOrder` à la place
 * @deprecated
 */
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
  return createOrder(data)
}

/**
 * ⚠️ ANCIENNE FONCTION : Gardée pour compatibilité
 * Utilisez `deleteOrder` à la place
 * @deprecated
 */
export async function deleteSale(saleId: string) {
  // Chercher la commande contenant cette vente
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    select: { orderId: true },
  })

  if (!sale) {
    throw new Error("Vente introuvable")
  }

  return deleteOrder(sale.orderId)
}