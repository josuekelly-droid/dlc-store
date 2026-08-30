import Link from "next/link"
import { Home, ArrowLeft, ShoppingBag } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 px-4 py-8 relative overflow-hidden">
      {/* Décorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-pink-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-pink-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* Logo */}
        <div className="inline-block mb-6 sm:mb-8">
          <img
            src="/logo/logo-dlc-store.png"
            alt="DLC Store"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl mx-auto object-cover shadow-lg"
          />
        </div>

        {/* Code 404 */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-pink-500 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Page introuvable
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-pink-200 text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Retour à l'accueil
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition-all border border-pink-200 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Aller au dashboard
          </Link>
        </div>

        {/* Copyright */}
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
          © {new Date().getFullYear()} DLC Store. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}