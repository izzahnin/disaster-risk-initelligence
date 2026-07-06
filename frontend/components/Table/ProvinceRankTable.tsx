import type { ProvinceSummary } from "@/lib/types"

interface Props {
  provinces: ProvinceSummary[]
  totalEvents?: number
  period?: string
}

function riskColor(score: number): string {
  if (score >= 70) return "var(--color-risk-high)"
  if (score >= 40) return "var(--color-risk-mid)"
  return "var(--color-risk-low)"
}

export default function ProvinceRankTable({ provinces, totalEvents, period }: Props) {
  const subtitle = totalEvents && period
    ? `${totalEvents.toLocaleString("id-ID")} gempa M≥4.5 dalam ${period} · sumber: USGS`
    : null

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="mb-3">
        <h2
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          10 Wilayah dengan Aktivitas Seismik Tertinggi
        </h2>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="overflow-x-auto md:overflow-x-clip">
      <table className="w-full min-w-[540px]">
        <thead>
          <tr>
            {["#", "Provinsi", "Jumlah Gempa", "Avg. Mag", "Maks. Mag", "Indeks Seismisitas (relatif)"].map((h) => (
              <th
                key={h}
                className="text-[0.7rem] uppercase tracking-wide text-left px-2 py-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {provinces.slice(0, 10).map((p, i) => {
            const color = riskColor(p.risk_score)
            return (
              <tr
                key={p.province}
                className="border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <td className="px-2 py-2 text-sm w-8" style={{ color: "var(--color-text-muted)" }}>
                  {i + 1}
                </td>
                <td className="px-2 py-2 text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  {p.province}
                </td>
                <td className="px-2 py-2 text-sm tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                  {p.count.toLocaleString("id-ID")}
                </td>
                <td className="px-2 py-2 text-sm tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                  {p.avg_magnitude.toFixed(1)}
                </td>
                <td className="px-2 py-2 text-sm tabular-nums font-medium" style={{ color: "var(--color-text)" }}>
                  {p.max_magnitude.toFixed(1)}
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${p.risk_score}%`, background: color }}
                      />
                    </div>
                    <span className="text-xs whitespace-nowrap tabular-nums" style={{ color }}>
                      {p.risk_score.toFixed(1)}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>

      <p className="text-[0.65rem] mt-3 leading-relaxed" style={{ color: "var(--color-text-muted)", opacity: 0.6 }}>
        Indeks seismisitas bersifat <strong>relatif antar provinsi</strong> — skor 100 berarti aktivitas kegempaan tertinggi dalam dataset ini, bukan ukuran absolut. Dihitung dari frekuensi gempa (skala log) dan rata-rata magnitudo (skala tetap M4.5–8.0), berdasarkan data USGS 6 bulan terakhir (M≥4.5). Tidak memperhitungkan kerentanan penduduk atau kapasitas mitigasi.
      </p>
    </div>
  )
}
