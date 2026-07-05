import { useQuery } from "@tanstack/react-query"
import type { DashboardResponse } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090"

async function fetchEarthquakeData(): Promise<DashboardResponse> {
  const res = await fetch(`${API_URL}/api/earthquakes`)
  if (!res.ok) throw new Error("Gagal mengambil data gempa")
  return res.json()
}

export function useEarthquakeData() {
  return useQuery<DashboardResponse, Error>({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakeData,
    refetchInterval: 120_000,
    staleTime: 60_000,
  })
}
