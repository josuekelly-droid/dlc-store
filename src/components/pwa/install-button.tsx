"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Vérifier si déjà installé
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsVisible(false)
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice

    if (choice.outcome === "accepted") {
      console.log("PWA installée !")
      setIsVisible(false)
    }

    setDeferredPrompt(null)
  }

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:w-96 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-pink-200 p-4 flex items-center gap-3">
        <img
          src="/logo/logo-dlc-store.png"
          alt="DLC Store"
          className="w-10 h-10 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Installer DLC Store</p>
          <p className="text-xs text-gray-500">Accès rapide depuis votre écran d'accueil</p>
        </div>
        <button
          onClick={handleInstall}
          className="inline-flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <Download className="w-3 h-3" />
          Installer
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}