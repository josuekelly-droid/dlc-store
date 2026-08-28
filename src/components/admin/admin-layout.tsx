"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Produits", href: "/products", icon: Package },
  { name: "Ventes", href: "/sales", icon: ShoppingCart },
  { name: "Paramètres", href: "/settings", icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-pink-100">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Sidebar Mobile (Drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80%] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <img
                  src="/logo/logo-dlc-store.png"
                  alt="DLC Store"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="font-semibold text-gray-900">DLC Store</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-pink-50 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <SidebarContent
                pathname={pathname}
                onSignOut={handleSignOut}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-pink-100 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Bouton menu mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-pink-50 text-gray-600 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Titre de page */}
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                {getPageTitle(pathname)}
              </h1>
            </div>

            {/* Logo mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <img
                src="/logo/logo-dlc-store.png"
                alt="DLC Store"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  pathname,
  onSignOut,
  onNavigate,
}: {
  pathname: string
  onSignOut: () => void
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo section */}
      <div className="p-4 sm:p-5 border-b border-pink-100">
        <div className="flex items-center gap-3">
          <img
            src="/logo/logo-dlc-store.png"
            alt="DLC Store"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">DLC Store</h2>
            <p className="text-xs text-gray-500">Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base ${
                isActive
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-200"
                  : "text-gray-600 hover:bg-pink-50 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
              {item.name}
              {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-3 sm:p-4 border-t border-pink-100">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all text-sm sm:text-base"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    "/dashboard": "Tableau de bord",
    "/products": "Gestion des produits",
    "/sales": "Gestion des ventes",
    "/settings": "Paramètres",
  }
  return titles[pathname] || "DLC Store"
}