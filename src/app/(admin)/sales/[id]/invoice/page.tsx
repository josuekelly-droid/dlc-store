import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Invoice } from "@/components/sales/invoice"

interface InvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params

  // ✅ Charger la commande avec TOUS ses articles
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  // Sérialiser
  const serializedOrder = {
    id: order.id,
    orderNumber: order.orderNumber,
    clientName: order.clientName,
    clientPhone: order.clientPhone,
    clientAddress: order.clientAddress,
    totalAmount: order.totalAmount.toString(),
    itemCount: order.itemCount,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      totalPrice: item.totalPrice.toString(),
      variant: {
        color: item.variant.color,
        size: item.variant.size,
        product: {
          name: item.variant.product.name,
          category: item.variant.product.category,
        },
      },
    })),
  }

  return <Invoice order={serializedOrder} />
}