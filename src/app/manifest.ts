import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DLC Store - Gestion de stock",
    short_name: "DLC Store",
    description: "Plateforme de gestion de stock pour DLC Store",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f472b6",
    orientation: "portrait",
    icons: [
      {
        src: "/logo/logo-dlc-store.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo/logo-dlc-store.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}