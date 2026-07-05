export interface Earthquake {
  id: string
  source: "bmkg" | "usgs"
  time: string
  latitude: number
  longitude: number
  magnitude: number
  depth_km: number
  region: string
  province: string
  tsunami_potential: boolean
}

export interface ProvinceSummary {
  province: string
  count: number
  avg_magnitude: number
  max_magnitude: number
  risk_score: number
}

export interface HistoricalSummary {
  period: string
  total_events: number
  by_province: ProvinceSummary[]
}

export interface StrongestEvent {
  magnitude: number
  province: string
}

export interface Stats {
  latest_event_minutes_ago: number
  avg_magnitude_last_15: number
  // null jika tidak ada gempa dalam 30 hari terakhir di data USGS
  strongest_last_30_days: StrongestEvent | null
}

export interface DashboardResponse {
  live_feed: Earthquake[]
  historical_summary: HistoricalSummary
  stats: Stats
  cached_at: string
  partial_data?: boolean
}
