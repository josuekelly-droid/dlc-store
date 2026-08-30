import { AdminLayout } from "@/components/admin/admin-layout"
import { InstallButton } from "@/components/pwa/install-button"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
      <InstallButton />
    </>
  )
}