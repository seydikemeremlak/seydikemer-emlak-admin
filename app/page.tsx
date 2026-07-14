"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Neighborhood = {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  is_active: boolean;
  sort_order: number;
};

type Settings = {
  company_name: string | null;
  company_slogan: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  instagram: string | null;
  home_title: string | null;
  home_description: string | null;
};

export default function HomePage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadHomepage();
  }, []);

  async function loadHomepage() {
    setLoading(true);
    setErrorMessage("");

    const client = supabase();

    const [settingsResult, neighborhoodsResult] = await Promise.all([
      client
        .from("settings")
        .select(
          "company_name, company_slogan, phone, whatsapp, email, address, instagram, home_title, home_description"
        )
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle(),

      client
        .from("neighborhoods")
        .select("id, name, slug, summary, is_active, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    if (settingsResult.error) {
      setErrorMessage(`Site ayarları alınamadı: ${settingsResult.error.message}`);
    } else {
      setSettings(settingsResult.data);
    }

    if (neighborhoodsResult.error) {
      setErrorMessage(
        `Mahalleler alınamadı: ${neighborhoodsResult.error.message}`
      );
    } else {
      setNeighborhoods(neighborhoodsResult.data ?? []);
    }

    setLoading(false);
  }

  const whatsappNumber =
    settings?.whatsapp?.replace(/\D/g, "") || "905375450400";

  return (
    <main className="site">
      <header className="header">
        <Link href="/" className="brand">
          <img src="/logo.png" alt="Seydikemer Emlak" />
          <div>
            <strong>{settings?.company_name || "Seydikemer Emlak"}</strong>
            <span>
              {settings?.company_slogan || "Güvenilir emlak ve yatırım rehberi"}
            </span>
          </div>
        </Link>

        <nav>
          <a href="#mahalleler">Mahalleler</a>
          <a href="#hakkimizda">Hakkımızda</a>
          <a href="#iletisim">İletişim</a>
          <Link href="/admin" className="adminLink">
            Yönetim
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="heroContent">
          <p className="eyebrow">SEYDİKEMER EMLAK VE YATIRIM REHBERİ</p>

          <h1>{settings?.home_title || "Seydikemer’i doğru bilgiyle keşfedin."}</h1>

          <p>
            {settings?.home_description ||
              "Seydikemer mahalleleri, emlak bilgileri ve yatırım rehberleri."}
          </p>

          <div className="heroButtons">
            <a href="#mahalleler" className="primaryButton">
              Mahalleleri İncele
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="secondaryButton"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="mahalleler">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">BÖLGE REHBERİ</p>
            <h2>Seydikemer Mahalleleri</h2>
            <p>
              Yönetim panelinden eklediğin aktif mahalleler burada otomatik
              olarak yayınlanır.
            </p>
          </div>

          <span className="count">{neighborhoods.length} Mahalle</span>
        </div>

        {loading ? (
          <p className="message">Mahalleler yükleniyor...</p>
        ) : errorMessage ? (
          <p className="message error">{errorMessage}</p>
        ) : neighborhoods.length === 0 ? (
          <p className="message">Henüz yayında mahalle bulunmuyor.</p>
        ) : (
          <div className="grid">
            {neighborhoods.map((item) => (
              <Link
                href={`/mahalle/${item.slug}`}
                className="neighborhoodCard"
                key={item.id}
              >
                <div className="cardVisual">
                  <span>📍</span>
                </div>

                <div className="cardBody">
                  <p className="cardLabel">SEYDİKEMER</p>
                  <h3>{item.name} Mahallesi</h3>
                  <p>
                    {item.summary ||
                      `${item.name} Mahallesi hakkında bölge ve yatırım bilgileri.`}
                  </p>
                  <strong>Mahalle rehberini aç →</strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="about" id="hakkimizda">
        <p className="eyebrow">BİLGİ ODAKLI EMLAK PLATFORMU</p>
        <h2>Sadece ilan değil, doğru bölge bilgisi</h2>
        <p>
          Seydikemer’de taşınmaz değerlendirmesi yaparken mahalle, ulaşım,
          altyapı, imar ve çevresel gelişmeler birlikte incelenmelidir.
        </p>
      </section>

      <section className="contact" id="iletisim">
        <div>
          <p className="eyebrow">İLETİŞİM</p>
          <h2>Bize ulaşın</h2>
        </div>

        <div className="contactItems">
          {settings?.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
          {settings?.email && (
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          )}
          {settings?.instagram && (
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}
          {settings?.address && <span>{settings.address}</span>}
        </div>
      </section>

      <footer>
        <strong>{settings?.company_name || "Seydikemer Emlak"}</strong>
        <span>© 2026 Tüm hakları saklıdır.</span>
      </footer>

      <style jsx>{`
        .site {
          min-height: 100vh;
          background: #f6f7fa;
          color: #13203a;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 16px clamp(20px, 5vw, 72px);
          border-bottom: 1px solid #e5e9f0;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #13203a;
          text-decoration: none;
        }

        .brand img {
          width: 54px;
          height: 54px;
          object-fit: contain;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand span {
          color: #6f7b8d;
          font-size: 12px;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        nav a {
          color: #273750;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .adminLink {
          padding: 10px 14px;
          border-radius: 9px;
          background: #13203a;
          color: white !important;
        }

        .hero {
          min-height: 600px;
          display: flex;
          align-items: center;
          padding: 80px clamp(20px, 7vw, 110px);
          background:
            radial-gradient(
              circle at 82% 18%,
              rgba(244, 123, 32, 0.35),
              transparent 25%
            ),
            linear-gradient(125deg, #071226, #17365f);
          color: white;
        }

        .heroContent {
          max-width: 820px;
        }

        .eyebrow {
          margin: 0;
          color: #f47b20;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .hero h1 {
          max-width: 820px;
          margin: 18px 0;
          font-size: clamp(48px, 7vw, 86px);
          line-height: 1.02;
        }

        .hero p:not(.eyebrow) {
          max-width: 720px;
          color: #d6e0ed;
          font-size: 19px;
        }

        .heroButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          padding: 14px 20px;
          border-radius: 11px;
          text-decoration: none;
          font-weight: 800;
        }

        .primaryButton {
          background: #f47b20;
          color: white;
        }

        .secondaryButton {
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: white;
        }

        .section {
          padding: 90px clamp(20px, 6vw, 90px);
        }

        .sectionHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 36px;
        }

        .sectionHeader h2,
        .about h2,
        .contact h2 {
          margin: 10px 0;
          font-size: clamp(34px, 4vw, 52px);
        }

        .sectionHeader p:not(.eyebrow) {
          max-width: 720px;
          color: #6f7b8d;
        }

        .count {
          padding: 9px 13px;
          border-radius: 999px;
          background: #fff0e5;
          color: #a84e10;
          font-size: 13px;
          font-weight: 800;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .neighborhoodCard {
          overflow: hidden;
          border: 1px solid #e0e5ed;
          border-radius: 20px;
          background: white;
          color: #13203a;
          text-decoration: none;
          transition: 0.25s;
        }

        .neighborhoodCard:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(18, 32, 58, 0.13);
        }

        .cardVisual {
          height: 180px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #17365f, #71998e);
          font-size: 38px;
        }

        .cardBody {
          padding: 24px;
        }

        .cardLabel {
          margin: 0;
          color: #f47b20;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .cardBody h3 {
          margin: 8px 0 10px;
          font-size: 22px;
        }

        .cardBody p:not(.cardLabel) {
          min-height: 70px;
          color: #6f7b8d;
        }

        .cardBody strong {
          color: #f47b20;
          font-size: 14px;
        }

        .message {
          padding: 28px;
          border: 1px solid #e0e5ed;
          border-radius: 15px;
          background: white;
          text-align: center;
        }

        .error {
          color: #b42318;
        }

        .about {
          padding: 90px clamp(20px, 7vw, 110px);
          background: #13203a;
          color: white;
        }

        .about p:last-child {
          max-width: 760px;
          color: #c9d4e4;
          font-size: 18px;
        }

        .contact {
          display: flex;
          justify-content: space-between;
          gap: 40px;
          padding: 75px clamp(20px, 7vw, 110px);
          background: white;
        }

        .contactItems {
          display: grid;
          gap: 10px;
          text-align: right;
        }

        .contactItems a {
          color: #f47b20;
          text-decoration: none;
          font-weight: 800;
        }

        .contactItems span {
          max-width: 460px;
          color: #6f7b8d;
        }

        footer {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 30px clamp(20px, 7vw, 110px);
          background: #071226;
          color: #cbd5e1;
        }

        footer strong {
          color: white;
        }

        @media (max-width: 900px) {
          nav a:not(.adminLink) {
            display: none;
          }

          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .contact {
            flex-direction: column;
          }

          .contactItems {
            text-align: left;
          }
        }

        @media (max-width: 620px) {
          .brand span {
            display: none;
          }

          .hero {
            min-height: 520px;
          }

          .hero h1 {
            font-size: 46px;
          }

          .sectionHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          footer {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}