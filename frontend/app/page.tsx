"use client"

import dynamic from "next/dynamic"
import { Clock, Activity, Zap } from "lucide-react"
import { useEarthquakeData } from "@/hooks/useEarthquakeData"
import StatCard from "@/components/Stats/StatCard"
import ProvinceRankTable from "@/components/Table/ProvinceRankTable"
import ThemeToggle from "@/components/ThemeToggle"

const EarthquakeMap = dynamic(() => import("@/components/Map/EarthquakeMap"), {
  ssr: false,
  loading: () => <div className="skeleton h-[300px] sm:h-[400px] lg:h-[480px]" />,
})

function formatEqTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })
  if (isToday) return time
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" }) + ", " + time
}

function magColorStyle(m: number): string {
  if (m >= 6) return "var(--color-risk-high)"
  if (m >= 5) return "var(--color-risk-mid)"
  return "var(--color-risk-low)"
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useEarthquakeData()

  return (
    <main className="min-h-screen flex flex-col gap-6 p-6 max-w-350 mx-auto">

      {/* Header */}
      <header className="flex justify-between items-start pb-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
            Disaster Risk{" "}
            <span style={{ color: "var(--color-accent)" }}>Intelligence</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="live-badge">
              <span style={{ letterSpacing: 0 }}>●</span>{" "}LIVE
            </span>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Pantau risiko gempa Indonesia secara real-time
            </span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Seismograf flatline — signature element */}
      <div className="seismo-line" />

      {/* Partial data warning */}
      {data?.partial_data && (
        <div
          className="rounded-lg px-4 py-2 text-sm border"
          style={{
            background: "rgba(217,119,6,0.08)",
            borderColor: "rgba(217,119,6,0.3)",
            color: "var(--color-accent)",
          }}
        >
          ⚠ Sebagian data tidak tersedia — salah satu sumber sedang tidak dapat dijangkau.
        </div>
      )}

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <div className="skeleton h-24" />
            <div className="skeleton h-24" />
            <div className="skeleton h-24" />
          </>
        ) : isError ? (
          <p className="col-span-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Gagal memuat data. Pastikan koneksi internet tersedia.
          </p>
        ) : data ? (
          <>
            <StatCard
              label="Gempa Terakhir Tercatat"
              value={data.stats.latest_event_minutes_ago}
              unit="menit lalu"
              highlight={data.stats.latest_event_minutes_ago < 30}
              icon={<Clock size={20} />}
            />
            <StatCard
              label="Rata-rata Kekuatan (15 Gempa Terakhir)"
              value={data.stats.avg_magnitude_last_15.toFixed(1)}
              unit="skala Richter"
              icon={<Activity size={20} />}
            />
            <StatCard
              label="Gempa Terkuat 30 Hari Terakhir"
              value={
                data.stats.strongest_last_30_days
                  ? `M ${data.stats.strongest_last_30_days.magnitude}`
                  : "Tidak ada data"
              }
              unit={data.stats.strongest_last_30_days?.province}
              highlight={(data.stats.strongest_last_30_days?.magnitude ?? 0) >= 6}
              icon={<Zap size={20} />}
            />
          </>
        ) : null}
      </section>

      {/* Map + Live Feed */}
      <section className="flex flex-col gap-2">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            Peta Sebaran Gempa
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            Menampilkan 15 gempa terbaru yang dipantau BMKG secara real-time. Ukuran titik menunjukkan kekuatan gempa.
          </p>
        </div>

        <div className="flex flex-col lg:grid gap-4" style={{ gridTemplateColumns: "1fr 340px" }}>
          <EarthquakeMap earthquakes={data?.live_feed ?? []} />

          <aside
            className="rounded-xl p-4 overflow-y-auto max-h-80 lg:max-h-[480px] border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
              Gempa Terkini
            </p>

            {isLoading && <div className="skeleton h-full" />}

            {data?.live_feed.map((eq) => (
              <div
                key={eq.id}
                className="flex items-start gap-2.5 py-2.5 border-b last:border-b-0"
                style={{ borderColor: "var(--color-border)" }}
              >
                {/* Magnitudo */}
                <span
                  className="text-base font-bold tabular-nums shrink-0 w-14"
                  style={{ color: magColorStyle(eq.magnitude) }}
                >
                  M {eq.magnitude}
                </span>

                {/* Detail */}
                <span className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-xs font-medium leading-snug truncate" style={{ color: "var(--color-text)" }}>
                    {eq.region}
                  </span>
                  <span className="text-[0.7rem] leading-snug" style={{ color: "var(--color-text-muted)" }}>
                    {formatEqTime(eq.time)} · {eq.depth_km} km
                    {eq.tsunami_potential && (
                      <span style={{ color: "var(--color-risk-high)" }}> · ⚠ Tsunami</span>
                    )}
                  </span>
                  {eq.province === "Wilayah Lain" && (
                    <span
                      className="text-[0.65rem] rounded px-1.5 py-0.5 w-fit border mt-0.5"
                      style={{
                        color: "var(--color-risk-mid)",
                        background: "rgba(234,88,12,0.08)",
                        borderColor: "rgba(234,88,12,0.25)",
                      }}
                    >
                      Di luar wilayah provinsi
                    </span>
                  )}
                </span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Tabel Risiko — full width */}
      <section className="flex flex-col gap-2">
        <ProvinceRankTable
          provinces={data?.historical_summary.by_province ?? []}
          totalEvents={data?.historical_summary.total_events}
          period={data?.historical_summary.period}
        />
      </section>

    </main>
  )
}
