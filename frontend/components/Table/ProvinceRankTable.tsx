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
      className="rounded-xl p-4 overflow-x-auto border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="mb-3">
        <h2
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          10 Wilayah Paling Rawan Gempa
        </h2>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>
            {subtitle}
          </p>
        )}
      </div>

      <table className="w-full min-w-[540px]">
        <thead>
          <tr>
            {["#", "Provinsi", "Jumlah Gempa", "Avg. Mag", "Maks. Mag", "Skor Risiko"].map((h) => (
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
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 rounded-full shrink-0"
                      style={{ width: `${p.risk_score}%`, background: color }}
                    />
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
  )
}
