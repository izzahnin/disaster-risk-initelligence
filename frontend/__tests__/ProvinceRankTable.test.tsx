import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ProvinceRankTable from "@/components/Table/ProvinceRankTable"
import type { ProvinceSummary } from "@/lib/types"

const mockData: ProvinceSummary[] = [
  { province: "Maluku", count: 87, avg_magnitude: 5.1, max_magnitude: 6.8, risk_score: 95 },
  { province: "Aceh", count: 40, avg_magnitude: 4.8, max_magnitude: 5.9, risk_score: 45 },
  { province: "Lampung", count: 5, avg_magnitude: 4.2, max_magnitude: 4.5, risk_score: 10 },
]

describe("ProvinceRankTable", () => {
  it("renders all province names", () => {
    render(<ProvinceRankTable provinces={mockData} />)
    expect(screen.getByText("Maluku")).toBeInTheDocument()
    expect(screen.getByText("Aceh")).toBeInTheDocument()
    expect(screen.getByText("Lampung")).toBeInTheDocument()
  })

  it("renders empty table without crashing", () => {
    render(<ProvinceRankTable provinces={[]} />)
    expect(screen.getByText("Wilayah Berisiko Tertinggi")).toBeInTheDocument()
  })

  it("shows correct rank numbers", () => {
    render(<ProvinceRankTable provinces={mockData} />)
    const cells = screen.getAllByRole("cell")
    expect(cells[0].textContent).toBe("1")
  })
})
