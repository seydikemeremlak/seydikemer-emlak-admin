import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-brand" aria-label="Seydikemer Emlak ana sayfa">
        <img src="/logo.png" alt="Seydikemer Emlak logosu" />
        <div>
          <strong>Seydikemer Emlak</strong>
          <span>Güvenilir emlak ve yatırım rehberi</span>
        </div>
      </Link>

      <nav className="site-nav" aria-label="Ana menü">
        <Link href="/">Ana Sayfa</Link>
        <Link href="/#mahalleler">Mahalleler</Link>
        <Link href="/admin">Yönetim</Link>
      </nav>
    </header>
  );
}
