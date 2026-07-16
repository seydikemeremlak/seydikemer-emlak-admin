import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <img src="/logo.png" alt="Seydikemer Emlak logosu" />
        <div>
          <strong>Seydikemer Emlak</strong>
          <span>Bölgenin güvenilir emlak rehberi</span>
        </div>
      </div>

      <div className="site-footer-links">
        <Link href="/">Ana Sayfa</Link>
        <Link href="/#mahalleler">Mahalleler</Link>
        <Link href="/admin">Yönetim</Link>
      </div>

      <p>© {new Date().getFullYear()} Seydikemer Emlak</p>
    </footer>
  );
}
