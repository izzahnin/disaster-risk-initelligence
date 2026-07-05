package mapper

// bbox mendefinisikan bounding box (kotak pembatas) geografis satu provinsi.
// Koordinat menggunakan sistem WGS84 (standar GPS):
//   - Latitude: sumbu vertikal, negatif = selatan khatulistiwa
//   - Longitude: sumbu horizontal, positif = timur Greenwich
//
// Cara kerja: titik (lat, lng) dianggap masuk ke provinsi ini jika
// MinLat ≤ lat ≤ MaxLat DAN MinLng ≤ lng ≤ MaxLng
type bbox struct {
	Province               string
	MinLat, MaxLat         float64
	MinLng, MaxLng         float64
}

// provinceBoxes adalah bounding box 38 provinsi Indonesia.
// Koordinat bersumber dari Nominatim OpenStreetMap (via cmd/seed) dengan
// koreksi manual untuk provinsi hasil pemekaran 2022 yang belum tersedia di Nominatim.
// Akurasi cukup untuk klasifikasi gempa per provinsi — bukan batas administratif resmi BPS.
var provinceBoxes = []bbox{
	// ── Sumatera ──
	{"Aceh", 2.0, 5.9, 95.0, 98.3},
	{"Sumatera Utara", 1.0, 4.5, 97.5, 100.0},
	{"Sumatera Barat", -3.5, 0.5, 98.5, 101.5},
	{"Riau", 0.0, 3.0, 100.0, 109.0},
	{"Kepulauan Riau", -1.0, 4.5, 103.5, 109.0},
	{"Jambi", -3.5, 0.5, 101.5, 104.5},
	{"Sumatera Selatan", -5.5, -1.5, 102.0, 107.0},
	{"Kepulauan Bangka Belitung", -3.5, -1.0, 105.0, 108.5},
	{"Bengkulu", -5.5, -2.0, 101.0, 104.0},
	{"Lampung", -5.9, -3.5, 103.5, 106.0},

	// ── Jawa ──
	{"DKI Jakarta", -6.4, -6.1, 106.7, 107.0},
	{"Banten", -7.0, -5.9, 105.1, 106.7},
	{"Jawa Barat", -7.8, -5.9, 106.5, 108.8},
	{"Jawa Tengah", -8.2, -6.4, 108.5, 111.2},
	{"DI Yogyakarta", -8.2, -7.6, 110.0, 110.8},
	{"Jawa Timur", -8.8, -6.9, 111.0, 114.5},

	// ── Bali & Nusa Tenggara ──
	{"Bali", -8.9, -8.05, 114.35, 115.85},
	{"Nusa Tenggara Barat", -9.1, -8.0, 115.8, 119.1},
	{"Nusa Tenggara Timur", -11.1, -8.0, 118.9, 125.05},

	// ── Kalimantan ──
	{"Kalimantan Barat", -3.1, 2.1, 108.0, 114.8},
	{"Kalimantan Tengah", -4.7, 0.5, 111.0, 116.7},
	{"Kalimantan Selatan", -4.7, -1.2, 114.5, 117.5},
	{"Kalimantan Timur", -3.0, 2.5, 114.0, 119.0},
	{"Kalimantan Utara", 1.0, 4.3, 114.5, 117.9},

	// ── Sulawesi ──
	{"Sulawesi Utara", -1.0, 4.8, 123.0, 126.9},
	{"Gorontalo", 0.3, 1.3, 121.5, 123.5},
	{"Sulawesi Tengah", -3.5, 1.7, 119.5, 124.8},
	{"Sulawesi Barat", -3.6, -0.3, 118.7, 120.0},
	{"Sulawesi Selatan", -6.0, -0.5, 119.0, 122.0},
	{"Sulawesi Tenggara", -6.2, -2.55, 120.6, 125.8},

	// ── Maluku ──
	{"Maluku Utara", -2.5, 3.5, 124.0, 129.5},
	{"Maluku", -8.5, -2.8, 126.0, 135.6},

	// ── Papua (termasuk provinsi hasil pemekaran 2022) ──
	{"Papua Barat Daya", -4.5, -0.5, 129.0, 132.5},
	{"Papua Barat", -4.5, 0.5, 131.5, 135.5},
	{"Papua Pegunungan", -6.5, -2.5, 136.5, 141.0},
	{"Papua Tengah", -6.5, -1.5, 134.0, 139.0},
	{"Papua Selatan", -9.3, -4.3, 136.0, 141.0},
	{"Papua", -9.5, -1.0, 135.5, 141.0},
}

// MapToProvince menentukan nama provinsi berdasarkan koordinat (lat, lng).
// Iterasi linear melalui provinceBoxes — cocok pertama yang ditemukan langsung dikembalikan.
//
// Return value:
//   - Nama provinsi (misal "Jawa Barat") jika koordinat masuk dalam bbox-nya
//   - "Wilayah Lain" jika tidak cocok dengan bbox manapun
//
// "Wilayah Lain" bisa berarti:
//   - Gempa di laut antara provinsi (celah antar bbox)
//   - Gempa di negara tetangga yang dimonitor BMKG (Filipina, Timor Leste, PNG)
func MapToProvince(lat, lng float64) string {
	for _, b := range provinceBoxes {
		if lat >= b.MinLat && lat <= b.MaxLat && lng >= b.MinLng && lng <= b.MaxLng {
			return b.Province
		}
	}
	return "Wilayah Lain"
}
