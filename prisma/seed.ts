import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "dolceakplogan01@gmail.com"
  const password = "DolceAKPLOGAN2001@@"

  const passwordHash = await hash(password, 12)

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      passwordHash,
    },
    create: {
      email,
      passwordHash,
    },
  })

  console.log("✅ Admin créé avec succès !")
  console.log("📧 Email :", email)
  console.log("🔑 Mot de passe :", password)
}

main()
  .catch((e) => {
    console.error("❌ Erreur :", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })