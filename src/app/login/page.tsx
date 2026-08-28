import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 px-4 py-8 sm:px-6 lg:px-8">
      {/* Décorations d'arrière-plan responsives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-pink-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-pink-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* En-tête responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block mb-3 sm:mb-4">
            <img
              src="/logo/logo-dlc-store.png"
              alt="DLC Store"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl mx-auto object-cover shadow-md sm:shadow-lg"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            DLC Store
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            Espace administrateur sécurisé
          </p>
        </div>

        {/* Formulaire avec chargement */}
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-pink-100">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-pink-100 rounded w-3/4"></div>
              <div className="h-10 bg-pink-50 rounded-xl"></div>
              <div className="h-10 bg-pink-50 rounded-xl"></div>
              <div className="h-12 bg-pink-200 rounded-xl"></div>
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>

        {/* Copyright responsive */}
        <p className="mt-4 sm:mt-6 md:mt-8 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} DLC Store. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}