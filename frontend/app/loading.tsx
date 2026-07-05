export default function Loading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "1.5rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header skeleton */}
      <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem" }}>
        <div className="skeleton" style={{ height: 32, width: 280 }} />
        <div className="skeleton" style={{ height: 16, width: 200, marginTop: 8 }} />
      </div>

      {/* Seismo line */}
      <div className="seismo-line" />

      {/* Stat cards skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        <div className="skeleton" style={{ height: 96 }} />
        <div className="skeleton" style={{ height: 96 }} />
        <div className="skeleton" style={{ height: 96 }} />
      </div>

      {/* Map + sidebar skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem", minHeight: 480 }}>
        <div className="skeleton" style={{ borderRadius: "0.75rem" }} />
        <div className="skeleton" style={{ borderRadius: "0.75rem" }} />
      </div>

      {/* Table skeleton */}
      <div className="skeleton" style={{ height: 320, borderRadius: "0.75rem" }} />
    </main>
  )
}
