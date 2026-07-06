import type { Metadata } from "next"
import { Geist } from "next/font/google"
import Providers from "@/components/Providers"
import "leaflet/dist/leaflet.css"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "Indonesia Seismic Monitor",
  description: "Dashboard pemantauan aktivitas seismik Indonesia — data BMKG & USGS, diperbarui tiap 2 menit.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning wajib — next-themes menambah class "dark" setelah hydration
    <html lang="id" className={geist.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
