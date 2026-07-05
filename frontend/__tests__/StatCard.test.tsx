import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import StatCard from "@/components/Stats/StatCard"

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Gempa Terakhir" value={5} unit="menit lalu" />)
    expect(screen.getByText("Gempa Terakhir")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("menit lalu")).toBeInTheDocument()
  })

  it("applies alert class when highlight is true", () => {
    render(<StatCard label="Test" value="M 6.5" highlight />)
    expect(screen.getByText("M 6.5").closest("p")).toHaveClass("stat-value--alert")
  })

  it("does not apply alert class when highlight is false", () => {
    render(<StatCard label="Test" value="4.2" />)
    expect(screen.getByText("4.2").closest("p")).not.toHaveClass("stat-value--alert")
  })
})
