import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "@/components/settings/settings-form"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const admin = await prisma.admin.findUnique({
    where: { email: session.user.email },
  })

  if (!admin) {
    redirect("/login")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Gérez votre compte administrateur
        </p>
      </div>
      <SettingsForm adminEmail={admin.email} />
    </div>
  )
}