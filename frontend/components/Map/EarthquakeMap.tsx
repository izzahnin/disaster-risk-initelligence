"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import type { Earthquake } from "@/lib/types"

interface Props {
  earthquakes: Earthquake[]
}

function markerColor(magnitude: number): string {
  if (magnitude >= 6) return "#ef4444"
  if (magnitude >= 5) return "#f97316"
  return "#22c55e"
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'

export default function EarthquakeMap({ earthquakes }: Props) {
  const { resolvedTheme } = useTheme()
  const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT

  useEffect(() => {
    // Fix Leaflet default marker icon path issue in Next.js
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet")
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
  }, [])

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      minZoom={4}
      maxZoom={12}
      maxBounds={[[-20, 85], [15, 155]]}
      maxBoundsViscosity={0.8}
      className="h-[300px] sm:h-[400px] lg:h-[480px] rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--color-border)" }}
      scrollWheelZoom={true}
    >
      <TileLayer key={tileUrl} url={tileUrl} attribution={TILE_ATTRIBUTION} />
      {earthquakes.map((eq) => (
        <CircleMarker
          key={eq.id}
          center={[eq.latitude, eq.longitude]}
          radius={Math.max(4, eq.magnitude * 2)}
          pathOptions={{
            color: "rgba(255,255,255,0.6)",
            fillColor: markerColor(eq.magnitude),
            fillOpacity: 0.85,
            weight: 1.5,
          }}
        >
          <Popup>
            <div className="map-popup">
              <strong>M {eq.magnitude}</strong>
              <p>{eq.region}</p>
              <p>Provinsi: {eq.province}</p>
              <p>Kedalaman: {eq.depth_km} km</p>
              <p>{formatTime(eq.time)}</p>
              {eq.tsunami_potential && (
                <p className="popup-tsunami">⚠ Berpotensi tsunami</p>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
