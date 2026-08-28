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

  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!sale) {
    notFound()
  }

  // Sérialiser
  const serializedSale = {
    id: sale.id,
    quantity: sale.quantity,
    totalPrice: sale.totalPrice.toString(),
    soldAt: sale.soldAt.toISOString(),
    clientName: sale.clientName,
    clientPhone: sale.clientPhone,
    clientAddress: sale.clientAddress,
    variant: {
      color: sale.variant.color,
      size: sale.variant.size,
      product: {
        name: sale.variant.product.name,
        price: sale.variant.product.price.toString(),
        description: sale.variant.product.description,
        category: sale.variant.product.category,
      },
    },
  }

  return <Invoice sale={serializedSale} />
}