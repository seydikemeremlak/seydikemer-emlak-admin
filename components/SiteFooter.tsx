import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <img
            src="/logo.png"
            alt="Seydikemer Emlak"
            className="footer-logo"
          />

          <h3>Seydikemer Emlak</h3>

          <p>
            Seydikemer ve çevresinde emlak, yatırım fırsatları ve mahalle
            rehberi.
          </p>
        </div>

        <div className="footer-column">
          <h4>Hızlı Menü</h4>

          <Link href="/">Ana Sayfa</Link>
          <Link href="/#mahalleler">Mahalleler</Link>
          <Link href="/analizler">Analizler</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/iletisim">İletişim</Link>
        </div>

        <div className="footer-column">
          <h4>İletişim</h4>

          <a href="tel:+905375450400">📞 0537 545 04 00</a>

          <a
            href="https://wa.me/905375450400"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 WhatsApp
          </a>

          <p>
            📍 Gerişburnu Mahallesi
            <br />
            68. Cadde No: 3/1
            <br />
            Seydikemer / Muğla
          </p>

          <a
            href="https://seydikemeremlak.com.tr"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 seydikemeremlak.com.tr
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Seydikemer Emlak
        <br />
        Tüm hakları saklıdır.
      </div>
    </footer>
  );
}