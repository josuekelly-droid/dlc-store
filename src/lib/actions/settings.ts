"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hash, compare } from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Non autorisé")
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.user.id },
  })

  if (!admin) {
    throw new Error("Administrateur introuvable")
  }

  // Vérifier l'ancien mot de passe
  const isValid = await compare(data.currentPassword, admin.passwordHash)

  if (!isValid) {
    throw new Error("Mot de passe actuel incorrect")
  }

  // Hasher le nouveau mot de passe
  const newHash = await hash(data.newPassword, 12)

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      passwordHash: newHash,
    },
  })

  revalidatePath("/settings")
  return { success: true }
}

export async function updateEmail(data: { newEmail: string }) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Non autorisé")
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.user.id },
  })

  if (!admin) {
    throw new Error("Administrateur introuvable")
  }

  // Vérifier que l'email n'est pas déjà utilisé
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: data.newEmail },
  })

  if (existingAdmin && existingAdmin.id !== admin.id) {
    throw new Error("Cet email est déjà utilisé")
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      email: data.newEmail,
    },
  })

  revalidatePath("/settings")
  return { success: true }
}