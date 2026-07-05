# Frontend Architecture — Urutan Baca & Alur Kerja

Dokumen ini menjelaskan file-file frontend dalam **urutan dependency** — dari fondasi data hingga halaman akhir. Membaca dalam urutan ini memberi gambaran lengkap tentang bagaimana data mengalir dari API backend hingga tampilan di browser.

---

## Urutan Baca (Bottom-Up)

```
Lapisan 1 — Kontrak Data
└── lib/types.ts

Lapisan 2 — Data Fetching
└── hooks/useEarthquakeData.ts

Lapisan 3 — Komponen UI (atomic, tidak saling bergantung)
├── components/Stats/StatCard.tsx
├── components/Table/ProvinceRankTable.tsx
├── components/Chart/ProvinceBarChart.tsx
└── components/Map/EarthquakeMap.tsx

Lapisan 4 — Layout & Provider
└── app/layout.tsx

Lapisan 5 — Halaman (orkestrasi semua komponen)
└── app/page.tsx
```

---

## Detail Per File

### 1. `lib/types.ts`
**Peran:** Definisi TypeScript interface untuk semua data yang datang dari backend.

Mirror 1:1 dari Go structs di backend. Tidak ada logic — hanya tipe data. Semua file lain yang menyentuh data API mengimport dari sini.

Interface utama:
- `Earthquake` — satu event gempa
- `ProvinceSummary` — agregat risiko per provinsi
- `DashboardResponse` — shape lengkap response `GET /api/earthquakes`

---

### 2. `hooks/useEarthquakeData.ts`
**Peran:** Satu-satunya titik di mana data di-fetch dari backend.

Menggunakan TanStack Query (`useQuery`):
- Fetch dari `NEXT_PUBLIC_API_URL/api/earthquakes`
- Cache otomatis selama 60 detik (`staleTime`)
- Auto-refetch tiap 2 menit (`refetchInterval: 120_000`)
- Return `{ data, isLoading, isError }` yang dipakai oleh `page.tsx`

```
API Backend → fetch() → TanStack Query cache → { data, isLoading, isError }
```

---

### 3. `components/Stats/StatCard.tsx`
**Peran:** Komponen atomic big-number card untuk sidebar statistik.

Props: `label`, `value`, `unit?`, `highlight?`

Tidak ada dependency internal. Bisa di-render dengan data apapun.
Kalau `highlight=true`, value ditampilkan dengan warna merah (untuk kondisi alert).

---

### 4. `components/Table/ProvinceRankTable.tsx`
**Peran:** Tabel ranking 10 provinsi tertinggi berdasarkan risk_score.

Props: `provinces: ProvinceSummary[]`

Fitur:
- Progress bar visual per baris (lebar = risk_score %)
- Warna progress bar: merah (≥70), oranye (40-70), hijau (<40)
- Hanya tampilkan 10 besar (`slice(0, 10)`)

---

### 5. `components/Chart/ProvinceBarChart.tsx`
**Peran:** Horizontal bar chart jumlah gempa per provinsi.

Props: `provinces: ProvinceSummary[]`

Menggunakan Recharts `BarChart` dengan layout `"vertical"`. Warna tiap bar mengikuti risk_score provinsi tersebut.

Marked `"use client"` karena Recharts tidak support SSR.

---

### 6. `components/Map/EarthquakeMap.tsx`
**Peran:** Peta interaktif Leaflet dengan titik-titik gempa live feed.

Props: `earthquakes: Earthquake[]`

Poin penting:
- Marked `"use client"` — Leaflet membutuhkan `window` object
- **Wajib di-import via `next/dynamic` dengan `ssr: false`** di page.tsx — jika tidak, build akan error karena Leaflet mencoba akses `window` saat SSR
- `useEffect` dipakai untuk fix Leaflet default marker icon path issue di Next.js
- Menggunakan `CircleMarker` (bukan `Marker`) agar warna bisa dikontrol programmatik
- Tile layer: CartoDB Dark (dark theme, gratis, tanpa API key)

```
magnitude < 5  → CircleMarker hijau
magnitude 5-6  → CircleMarker oranye
magnitude > 6  → CircleMarker merah
```

---

### 7. `app/layout.tsx`
**Peran:** Root layout — setup global provider dan CSS.

Yang dilakukan:
1. Import Leaflet CSS (`leaflet/dist/leaflet.css`) — harus di layout, bukan di komponen Map, agar tersedia saat hydration
2. Wrap seluruh app dengan `QueryClientProvider` dari TanStack Query
3. `QueryClient` dibuat dengan `useState` (bukan di luar komponen) agar setiap user session punya instance terpisah

Marked `"use client"` karena menggunakan `useState` untuk QueryClient.

---

### 8. `app/page.tsx`
**Peran:** Halaman dashboard — mengorkestrasikan semua komponen.

Alur render:
```
useEarthquakeData()
  ├── isLoading=true  → tampilkan skeleton placeholders
  ├── isError=true    → tampilkan pesan error
  └── data ready      → render StatCard × 3, EarthquakeMap, LiveFeed, ProvinceRankTable, ProvinceBarChart
```

`EarthquakeMap` di-import via `next/dynamic`:
```ts
const EarthquakeMap = dynamic(() => import("@/components/Map/EarthquakeMap"), {
  ssr: false,
  loading: () => <div className="skeleton earthquake-map" />,
})
```

---

## Alur Data Lengkap (API → Browser)

```
Backend GET /api/earthquakes
        │
        ▼
useEarthquakeData() [TanStack Query]
  ├── cache hit (< 60s) → return instantly
  └── cache miss → fetch, update cache, return data
        │
        ▼
page.tsx menerima { data, isLoading, isError }
        │
        ├── data.stats            → StatCard × 3
        ├── data.live_feed        → EarthquakeMap (Leaflet markers) + Live Feed sidebar
        └── data.historical_summary.by_province
                ├── ProvinceRankTable (tabel + progress bar)
                └── ProvinceBarChart  (Recharts bar chart)
```

---

## Catatan Tailwind v4

Project ini menggunakan **Tailwind CSS v4** yang berbeda dari v3:

| v3 | v4 |
|---|---|
| `tailwind.config.ts` | Tidak ada — konfigurasi di CSS |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `theme.extend.colors` | `@theme { --color-xxx: ... }` |
| `darkMode: 'class'` | `@variant dark (...)` atau CSS variables |

Semua custom styling project ini menggunakan **CSS classes manual** di `globals.css` (bukan utility classes Tailwind), agar lebih mudah dibaca dan di-maintain untuk komponen yang kompleks.
