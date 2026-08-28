import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Nom trop long"),
  description: z.string().max(1000, "Description trop longue").optional().or(z.literal("")),
  price: z.coerce.number().positive("Le prix doit être positif").min(0.01, "Prix minimum : 0.01"),
  category: z.string().max(50, "Catégorie trop longue").optional().or(z.literal("")),
  imageUrl: z.string().url("URL invalide").optional().or(z.literal("")),
})

export type ProductFormData = z.infer<typeof productSchema>

export const variantSchema = z.object({
  color: z.string().min(1, "La couleur est requise"),
  size: z.string().min(1, "La taille est requise"),
  stock: z.coerce.number().int("Stock entier requis").min(0, "Stock minimum : 0"),
})

export type VariantFormData = z.infer<typeof variantSchema>