import Link from "next/link";
export default function Home() {
  return <main className="center"><section className="card">
    <img src="/logo.png" className="logo" alt="Seydikemer Emlak" />
    <p className="eyebrow">SEYDİKEMER EMLAK</p>
    <h1>Yönetim Paneli V1</h1>
    <p className="muted">Admin girişi ve koyu temalı kontrol paneli hazır.</p>
    <Link className="button" href="/admin">Yönetim Paneline Git</Link>
  </section></main>;
}
