"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Render hanya setelah mount untuk menghindari hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg border transition-colors cursor-pointer"
      style={{
        borderColor: "var(--color-border)",
        color: "var(--color-text-muted)",
        backgroundColor: "transparent",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-surface-2)"
        ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)"
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"
        ;(e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)"
      }}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
