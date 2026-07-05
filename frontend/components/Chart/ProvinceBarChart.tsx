"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { ProvinceSummary } from "@/lib/types"

interface Props {
  provinces: ProvinceSummary[]
}

function barColor(score: number): string {
  if (score >= 70) return "var(--color-risk-high)"
  if (score >= 40) return "var(--color-risk-mid)"
  return "var(--color-risk-low)"
}

export default function ProvinceBarChart({ provinces }: Props) {
  const { resolvedTheme } = useTheme()

  // Recharts hanya menerima inline style — baca dari token yang sudah di-resolve per theme
  const chartColors = useMemo(() => {
    const dark = resolvedTheme === "dark"
    return {
      axis:         dark ? "#8a8781" : "#78756e",
      label:        dark ? "#f0ede8" : "#1a1917",
      tooltipBg:    dark ? "#1c1b19" : "#ffffff",
      tooltipBorder:dark ? "#2e2d2a" : "#e2e0db",
      tooltipText:  dark ? "#f0ede8" : "#1a1917",
    }
  }, [resolvedTheme])

  const data = provinces.slice(0, 10).map((p) => ({
    name: p.province,
    count: p.count,
    score: p.risk_score,
  }))

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <h2
        className="text-xs uppercase tracking-widest mb-3"
        style={{ color: "var(--color-text-muted)" }}
      >
        Jumlah Gempa per Provinsi
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 24 }}>
          <XAxis type="number" tick={{ fill: chartColors.axis, fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: chartColors.label, fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: chartColors.tooltipBg,
              border: `1px solid ${chartColors.tooltipBorder}`,
              borderRadius: 8,
            }}
            labelStyle={{ color: chartColors.tooltipText }}
            itemStyle={{ color: chartColors.axis }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
