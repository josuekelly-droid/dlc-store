import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "DLC Store - Gestion de stock & Multi-services",
    template: "%s | DLC Store",
  },
  description:
    "DLC Store - Plateforme de gestion de stock professionnelle. Gérez vos produits, variantes, ventes et factures en toute simplicité. Boutique multi-services : sacs, accessoires et plus.",
  keywords: [
    "DLC Store",
    "gestion de stock",
    "boutique",
    "sacs",
    "accessoires",
    "vente",
    "facture",
    "inventaire",
    "Bénin",
    "Cotonou",
  ],
  authors: [{ name: "DLC Store" }],
  creator: "DLC Store",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo/logo-dlc-store.png",
    shortcut: "/logo/logo-dlc-store.png",
    apple: "/logo/logo-dlc-store.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DLC Store",
  },
  openGraph: {
    title: "DLC Store - Gestion de stock & Multi-services",
    description:
      "Plateforme de gestion de stock professionnelle pour votre boutique. Produits, variantes, ventes et factures.",
    type: "website",
    locale: "fr_FR",
    siteName: "DLC Store",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#f472b6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  )
}