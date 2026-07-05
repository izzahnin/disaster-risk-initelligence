import Link from "next/link"

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      <p
        style={{
          fontSize: "6rem",
          fontWeight: 700,
          lineHeight: 1,
          color: "var(--color-accent)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.04em",
        }}
      >
        404
      </p>

      <div className="seismo-line" style={{ width: 120 }} />

      <h1
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--color-text)",
          marginTop: "0.5rem",
        }}
      >
        Sinyal Tidak Ditemukan
      </h1>

      <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", maxWidth: 320 }}>
        Halaman yang kamu cari tidak ada atau telah dipindahkan.
      </p>

      <Link
        href="/"
        style={{
          marginTop: "1rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "var(--color-accent)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        ← Kembali ke Dashboard
      </Link>
    </main>
  )
}
