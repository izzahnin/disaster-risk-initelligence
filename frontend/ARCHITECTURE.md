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
├── components/Map/EarthquakeMap.tsx
└── components/ThemeToggle.tsx

Lapisan 4 — Layout & Provider
└── app/layout.tsx

Lapisan 5 — Halaman & Konvensi Route
├── app/page.tsx        ← dashboard utama
├── app/loading.tsx     ← skeleton saat initial load
└── app/not-found.tsx   ← halaman 404
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

Props: `provinces: ProvinceSummary[]`, `totalEvents?`, `period?`

Fitur:
- Progress bar visual per baris (lebar = risk_score %)
- Warna progress bar: merah (≥70), oranye (40-70), hijau (<40)
- Kolom: #, Provinsi, Jumlah Gempa, Avg. Mag, Maks. Mag, Skor Risiko
- `overflow-x-auto` + `min-w-[540px]` agar bisa scroll horizontal di mobile
- Hanya tampilkan 10 besar (`slice(0, 10)`)

---

### 5. `components/Map/EarthquakeMap.tsx`
**Peran:** Peta interaktif Leaflet dengan titik-titik gempa live feed.

Props: `earthquakes: Earthquake[]`

Poin penting:
- Marked `"use client"` — Leaflet membutuhkan `window` object
- **Wajib di-import via `next/dynamic` dengan `ssr: false`** di page.tsx — jika tidak, build akan error karena Leaflet mencoba akses `window` saat SSR
- `useEffect` dipakai untuk fix Leaflet default marker icon path issue di Next.js
- Menggunakan `CircleMarker` (bukan `Marker`) agar warna bisa dikontrol programmatik
- Tile layer: **CartoDB Dark Matter** (dark mode) / **CartoDB Positron** (light mode) — switch otomatis via `useTheme`, gratis, tanpa API key
- Zoom dibatasi: `minZoom=4`, `maxZoom=12`, `maxBounds` sekitar wilayah Indonesia
- Tinggi responsif: 300px (mobile) → 400px (tablet) → 480px (desktop)

```
magnitude < 5  → CircleMarker hijau
magnitude 5-6  → CircleMarker oranye
magnitude > 6  → CircleMarker merah
```

---

### 6. `components/ThemeToggle.tsx`
**Peran:** Tombol toggle dark / light mode.

Menggunakan `useTheme` dari `next-themes`. Guard `mounted` state mencegah hydration mismatch — komponen tidak render apa-apa saat SSR, baru muncul setelah client mount.

---

### 7. `app/layout.tsx`
**Peran:** Root layout — setup global provider dan CSS.

Yang dilakukan:
1. Import Leaflet CSS (`leaflet/dist/leaflet.css`) — harus di layout agar tersedia saat hydration
2. Wrap seluruh app dengan `ThemeProvider` (next-themes) lalu `QueryClientProvider`
3. `suppressHydrationWarning` di `<html>` mencegah warning dari perbedaan class dark/light antara SSR dan client

---

### 8. `app/page.tsx`
**Peran:** Halaman dashboard — mengorkestrasikan semua komponen.

Alur render:
```
useEarthquakeData()
  ├── isLoading=true  → tampilkan skeleton placeholders
  ├── isError=true    → tampilkan pesan error
  └── data ready      → render StatCard × 3, EarthquakeMap, LiveFeed sidebar, ProvinceRankTable
```

Layout responsif: stat cards 1 kolom (mobile) → 3 kolom (sm+). Map + live feed stack vertikal (mobile) → grid 2 kolom (lg+).

---

### 9. `app/loading.tsx`
**Peran:** Konvensi Next.js App Router — ditampilkan saat initial page load sebelum `page.tsx` terhidrasi.

Menampilkan skeleton layout yang mencerminkan struktur dashboard: header, seismo-line, 3 stat card, peta + sidebar, tabel. Menggunakan class `.skeleton` dari `globals.css`.

Server Component — tidak butuh `"use client"`.

---

### 10. `app/not-found.tsx`
**Peran:** Konvensi Next.js App Router — ditampilkan saat route tidak ditemukan (404).

Desain bertema seismik: angka `404` besar dengan warna amber (`--color-accent`), seismo-line dekoratif, judul "Sinyal Tidak Ditemukan", link kembali ke dashboard.

Server Component — dark mode tetap bekerja karena CSS variables dikontrol via class `.dark` di `<html>`.

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
                └── ProvinceRankTable (tabel + progress bar risk score)
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
