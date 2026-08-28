import Link from "next/link"
import {
  ShoppingBag,
  ArrowRight,
  Package,
  BarChart3,
  Truck,
  Store,
  Sparkles,
  Heart,
  Music2,
  MessageCircle,
  Phone,
  MapPin,
  Mail,
  ChevronRight,
  ThumbsUp,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ========== NAVBAR ========== */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/logo/logo-dlc-store.png"
                alt="DLC Store"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
              />
              <div>
                <h2 className="font-bold text-gray-900 text-lg sm:text-xl">DLC Store</h2>
                <p className="text-xs text-gray-500 hidden sm:block">Multi-services</p>
              </div>
            </div>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#accueil" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">Accueil</a>
              <a href="#apropos" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">À propos</a>
              <a href="#services" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">Services</a>
              <a href="#plateforme" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">Plateforme</a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">Contact</a>
            </div>

            {/* Bouton connexion */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-lg shadow-pink-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Espace Admin</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section id="accueil" className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100">
        {/* Décorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-pink-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-pink-300 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-pink-100 rounded-full opacity-20 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 text-center">
          {/* Logo */}
          <div className="inline-block mb-6 sm:mb-8">
            <img
              src="/logo/logo-dlc-store.png"
              alt="DLC Store"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-3xl mx-auto object-cover shadow-2xl"
            />
          </div>

          {/* Titre */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            DLC <span className="text-pink-600">Store</span>
          </h1>

          {/* Slogan */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Votre boutique multi-services de confiance
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            De la mode aux accessoires, DLC Store vous accompagne avec une gestion
            professionnelle et une expérience client exceptionnelle.
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium px-8 py-3 sm:px-10 sm:py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-pink-200 text-base w-full sm:w-auto"
            >
              <ShoppingBag className="w-5 h-5" />
              Accéder à la plateforme
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#apropos"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-gray-700 font-medium px-8 py-3 sm:px-10 sm:py-4 rounded-2xl transition-all border border-pink-200 text-base w-full sm:w-auto"
            >
              Découvrir DLC Store
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ========== À PROPOS ========== */}
      <section id="apropos" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              À propos de <span className="text-pink-600">DLC Store</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              DLC Store est bien plus qu'une simple boutique. C'est un espace multi-services
              dédié à la satisfaction de nos clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Carte 1 */}
            <div className="bg-pink-50 rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-services</h3>
              <p className="text-sm text-gray-600">
                Sacs, accessoires, et bien plus encore. DLC Store couvre plusieurs secteurs
                pour répondre à tous vos besoins.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="bg-pink-50 rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualité & Confiance</h3>
              <p className="text-sm text-gray-600">
                Chaque produit est sélectionné avec soin pour garantir qualité,
                durabilité et satisfaction client.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="bg-pink-50 rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">
                Une plateforme moderne de gestion pour un service efficace
                et une expérience client optimale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos <span className="text-pink-600">Services</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              DLC Store opère dans plusieurs secteurs d'activité
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: ShoppingBag, title: "Sacs & Maroquinerie" },
              { icon: Sparkles, title: "Accessoires mode" },
              { icon: Package, title: "Produits divers" },
              { icon: Store, title: "Boutique en ligne" },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900">{service.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PLATEFORME ========== */}
      <section id="plateforme" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre <span className="text-pink-600">Plateforme</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Une solution complète de gestion de stock pour une efficacité maximale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Fonctionnalité 1 */}
            <div className="border border-pink-100 rounded-2xl p-6 hover:border-pink-300 transition-colors">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestion des stocks</h3>
              <p className="text-sm text-gray-600">
                Suivi en temps réel de vos produits, variantes (couleur, taille) et quantités disponibles.
              </p>
            </div>

            {/* Fonctionnalité 2 */}
            <div className="border border-pink-100 rounded-2xl p-6 hover:border-pink-300 transition-colors">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Statistiques détaillées</h3>
              <p className="text-sm text-gray-600">
                Graphiques, chiffre d'affaires, top produits et alertes de stock faible automatiques.
              </p>
            </div>

            {/* Fonctionnalité 3 */}
            <div className="border border-pink-100 rounded-2xl p-6 hover:border-pink-300 transition-colors">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestion des ventes</h3>
              <p className="text-sm text-gray-600">
                Enregistrement des commandes clients avec factures PDF imprimables.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10 sm:mt-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium px-8 py-3 sm:px-10 sm:py-4 rounded-2xl transition-all shadow-lg shadow-pink-200 text-base"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CONTACT & RÉSEAUX SOCIAUX ========== */}
      <section id="contact" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Suivez-<span className="text-pink-600">nous</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Restez connecté avec DLC Store sur les réseaux sociaux
            </p>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@donat_dolce"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white border border-pink-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all hover:border-pink-400"
            >
              <Music2 className="w-6 h-6 text-black" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">TikTok</p>
                <p className="text-xs text-gray-500">@donat_dolce</p>
              </div>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1MAxwVmaVG/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white border border-pink-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all hover:border-pink-400"
            >
              <ThumbsUp className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Facebook</p>
                <p className="text-xs text-gray-500">DLC Store</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/22951512930"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white border border-pink-200 rounded-2xl px-6 py-4 hover:shadow-lg transition-all hover:border-pink-400"
            >
              <MessageCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">WhatsApp</p>
                <p className="text-xs text-gray-500">+229 01 51 51 29 30</p>
              </div>
            </a>
          </div>

          {/* Coordonnées */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 justify-center">
              <Phone className="w-5 h-5 text-pink-600" />
              <span className="text-sm text-gray-600">+229 01 51 51 29 30</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Mail className="w-5 h-5 text-pink-600" />
              <span className="text-sm text-gray-600">dolceakplogan01@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <MapPin className="w-5 h-5 text-pink-600" />
              <span className="text-sm text-gray-600">Cotonou, Bénin</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo/logo-dlc-store.png"
                alt="DLC Store"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold">DLC Store</p>
                <p className="text-xs text-gray-400">Multi-services & Gestion</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 text-center">
              © {new Date().getFullYear()} DLC Store. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}