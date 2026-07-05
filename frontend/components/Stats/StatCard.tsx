import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  highlight?: boolean
  icon?: ReactNode
}

export default function StatCard({ label, value, unit, highlight, icon }: StatCardProps) {
  return (
    <div
      className="rounded-xl px-6 py-5 border"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <p
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
        {icon && (
          <span style={{ color: "var(--color-accent)", opacity: 0.8 }}>
            {icon}
          </span>
        )}
      </div>
      <p
        className="text-4xl font-bold leading-none"
        style={{ color: highlight ? "var(--color-risk-high)" : "var(--color-text)" }}
      >
        {value}
        {unit && (
          <span
            className="text-sm font-normal ml-1.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {unit}
          </span>
        )}
      </p>
    </div>
  )
}
