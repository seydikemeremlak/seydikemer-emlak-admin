"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Neighborhood = {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  image_url: string | null;
  population: string | null;
  altitude: string | null;
  area_size: string | null;
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
  facebook: string | null;
  youtube: string | null;
  home_title: string | null;
  home_description: string | null;
  about_title: string | null;
  about_description: string | null;
};

type SortOption = "order" | "alphabetical" | "population" | "altitude";

function convertNumber(value: string | null) {
  if (!value) return 0;

  const cleanedValue = value
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");

  return Number(cleanedValue) || 0;
}

export default function HomePage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("order");

  useEffect(() => {
    void loadHomepage();
  }, []);

  async function loadHomepage() {
    setLoading(true);
    setErrorMessage("");

    const client = supabase();

    const [settingsResult, neighborhoodsResult] = await Promise.all([
      client
        .from("settings")
        .select(
          `
            company_name,
            company_slogan,
            phone,
            whatsapp,
            email,
            address,
            instagram,
            facebook,
            youtube,
            home_title,
            home_description,
            about_title,
            about_description
          `
        )
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle(),

      client
        .from("neighborhoods")
        .select(
          `
            id,
            name,
            slug,
            summary,
            image_url,
            population,
            altitude,
            area_size,
            is_active,
            sort_order
          `
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    if (settingsResult.error) {
      setErrorMessage(
        `Site ayarları alınamadı: ${settingsResult.error.message}`
      );
    } else {
      setSettings(settingsResult.data as Settings | null);
    }

    if (neighborhoodsResult.error) {
      setErrorMessage(
        `Mahalleler alınamadı: ${neighborhoodsResult.error.message}`
      );
    } else {
      setNeighborhoods(
        (neighborhoodsResult.data ?? []) as Neighborhood[]
      );
    }

    setLoading(false);
  }

  const filteredNeighborhoods = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");

    let result = neighborhoods.filter((item) => {
      if (!query) return true;

      return `${item.name} ${item.summary ?? ""}`
        .toLocaleLowerCase("tr-TR")
        .includes(query);
    });

    result = [...result];

    if (sortOption === "alphabetical") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name, "tr", {
          sensitivity: "base",
        })
      );
    }

    if (sortOption === "population") {
      result.sort(
        (a, b) =>
          convertNumber(b.population) -
          convertNumber(a.population)
      );
    }

    if (sortOption === "altitude") {
      result.sort(
        (a, b) =>
          convertNumber(b.altitude) -
          convertNumber(a.altitude)
      );
    }

    if (sortOption === "order") {
      result.sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }

        return a.name.localeCompare(b.name, "tr");
      });
    }

    return result;
  }, [neighborhoods, search, sortOption]);

  const whatsappNumber =
    settings?.whatsapp?.replace(/\D/g, "") || "905322448448";

  const phoneNumber =
    settings?.phone?.replace(/\s/g, "") || "";

  return (
    <main className="site">
      <header className="header">
        <Link href="/" className="brand">
          <img src="/logo.png" alt="Seydikemer Emlak" />

          <div>
            <strong>
              {settings?.company_name || "Seydikemer Emlak"}
            </strong>

            <span>
              {settings?.company_slogan ||
                "Güvenilir emlak ve yatırım rehberi"}
            </span>
          </div>
        </Link>

        <nav>
          <a href="#ana-sayfa">Ana Sayfa</a>
          <a href="#mahalleler">Seydikemer Rehberi</a>
          <a href="#emlak-bilgileri">Emlak Bilgileri</a>
          <a href="#hakkimizda">Hakkımızda</a>
          <a href="#iletisim" className="contactButton">
            İletişim
          </a>
        </nav>
      </header>

      <section className="hero" id="ana-sayfa">
        <div className="heroContent">
          <p className="eyebrow">
            SEYDİKEMER’İN DİJİTAL EMLAK REHBERİ
          </p>

          <h1>
            {settings?.home_title ||
              "Doğru bilgiyle, güvenli yatırım."}
          </h1>

          <p className="heroDescription">
            {settings?.home_description ||
              "Seydikemer’de arsa, tarla, tapu, imar ve bölgesel yatırım konularında sade, anlaşılır ve güvenilir bilgiler."}
          </p>

          <div className="heroButtons">
            <a href="#mahalleler" className="primaryButton">
              Mahalleleri Keşfet
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

          <div className="heroHighlights">
            <span>✓ Yerel bölge bilgisi</span>
            <span>✓ Sade anlatım</span>
            <span>✓ Doğrudan iletişim</span>
          </div>
        </div>
      </section>

      <section className="section" id="mahalleler">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">BÖLGE REHBERİ</p>

            <h2>Seydikemer Mahalleleri</h2>

            <p>
              Yönetim panelinden eklenen ve yayına alınan
              mahalleleri inceleyin.
            </p>
          </div>

          <span className="count">
            {filteredNeighborhoods.length} Mahalle
          </span>
        </div>

        <div className="filterBar">
          <label className="searchBox">
            <span>🔍</span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Mahalle ara..."
            />
          </label>

          <label className="sortBox">
            <span>Sırala:</span>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value as SortOption
                )
              }
            >
              <option value="order">Önerilen sıralama</option>
              <option value="alphabetical">Alfabetik</option>
              <option value="population">
                Nüfusa göre
              </option>
              <option value="altitude">Rakıma göre</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p className="message">
            Mahalleler yükleniyor...
          </p>
        ) : errorMessage ? (
          <p className="message error">
            {errorMessage}
          </p>
        ) : filteredNeighborhoods.length === 0 ? (
          <p className="message">
            Aramanıza uygun mahalle bulunamadı.
          </p>
        ) : (
          <div className="grid">
            {filteredNeighborhoods.map((item) => (
              <Link
                href={`/mahalle/${item.slug}`}
                className="neighborhoodCard"
                key={item.id}
              >
                <div
                  className="cardVisual"
                  style={
                    item.image_url
                      ? {
                          backgroundImage: `
                            linear-gradient(
                              180deg,
                              rgba(7, 18, 38, 0.08),
                              rgba(7, 18, 38, 0.78)
                            ),
                            url("${item.image_url}")
                          `,
                        }
                      : undefined
                  }
                >
                  {!item.image_url && (
                    <span className="locationIcon">
                      📍
                    </span>
                  )}

                  <span className="cardLocation">
                    Seydikemer
                  </span>
                </div>

                <div className="cardBody">
                  <p className="cardLabel">
                    MAHALLE REHBERİ
                  </p>

                  <h3>{item.name} Mahallesi</h3>

                  <p className="cardDescription">
                    {item.summary ||
                      `${item.name} Mahallesi hakkında bölge, yaşam ve yatırım bilgileri.`}
                  </p>

                  <div className="cardStats">
                    {item.population && (
                      <span>
                        <small>Nüfus</small>
                        <strong>
                          {item.population}
                        </strong>
                      </span>
                    )}

                    {item.altitude && (
                      <span>
                        <small>Rakım</small>
                        <strong>
                          {item.altitude}
                        </strong>
                      </span>
                    )}

                    {item.area_size && (
                      <span>
                        <small>Yüzölçümü</small>
                        <strong>
                          {item.area_size}
                        </strong>
                      </span>
                    )}
                  </div>

                  <div className="cardFooter">
                    <strong>
                      Mahalle rehberini aç
                    </strong>

                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section
        className="informationSection"
        id="emlak-bilgileri"
      >
        <div>
          <p className="eyebrow">EMLAK BİLGİLERİ</p>

          <h2>
            Taşınmaz almadan önce doğru bilgiyi edinin
          </h2>

          <p>
            Arsa, tarla ve konut satın alırken tapu,
            kadastro yolu, imar durumu, altyapı ve çevresel
            gelişmeler birlikte değerlendirilmelidir.
          </p>
        </div>

        <div className="informationGrid">
          <article>
            <span>01</span>
            <h3>Tapu Kontrolü</h3>
            <p>
              Tapu niteliği, hisse durumu, şerh ve
              takyidatlar kontrol edilmelidir.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>İmar Durumu</h3>
            <p>
              Yapılaşma koşulları ve kullanım amacı ilgili
              belediyeden doğrulanmalıdır.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Yol ve Altyapı</h3>
            <p>
              Kadastro yolu, elektrik, su ve diğer altyapı
              olanakları parsel bazında incelenmelidir.
            </p>
          </article>
        </div>
      </section>

      <section className="about" id="hakkimizda">
        <p className="eyebrow">
          BİLGİ ODAKLI EMLAK PLATFORMU
        </p>

        <h2>
          {settings?.about_title ||
            "Sadece ilan değil, doğru bölge bilgisi"}
        </h2>

        <p>
          {settings?.about_description ||
            "Seydikemer’de taşınmaz değerlendirmesi yaparken mahalle, ulaşım, altyapı, imar ve çevresel gelişmeler birlikte incelenmelidir. Amacımız kullanıcıların doğru ve anlaşılır bilgiye kolayca ulaşmasını sağlamaktır."}
        </p>
      </section>

      <section className="contact" id="iletisim">
        <div>
          <p className="eyebrow">İLETİŞİM</p>

          <h2>Bize ulaşın</h2>

          <p>
            Seydikemer’de emlak, arsa, tarla ve bölge
            bilgileri için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="contactItems">
          {settings?.phone && (
            <a href={`tel:${phoneNumber}`}>
              <small>Telefon</small>
              <strong>{settings.phone}</strong>
            </a>
          )}

          {settings?.email && (
            <a href={`mailto:${settings.email}`}>
              <small>E-posta</small>
              <strong>{settings.email}</strong>
            </a>
          )}

          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>Sosyal Medya</small>
              <strong>Instagram</strong>
            </a>
          )}

          {settings?.address && (
            <div>
              <small>Adres</small>
              <strong>{settings.address}</strong>
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="footerBrand">
          <img src="/logo.png" alt="" />

          <div>
            <strong>
              {settings?.company_name ||
                "Seydikemer Emlak"}
            </strong>

            <span>
              Güvenilir emlak ve yatırım rehberi
            </span>
          </div>
        </div>

        <span>
          © 2026 Seydikemer Emlak. Tüm hakları saklıdır.
        </span>
      </footer>

      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floatingWhatsapp"
      >
        WhatsApp
      </a>

      <style jsx>{`
        .site {
          min-height: 100vh;
          background: #f5f7fa;
          color: #0b1b38;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 14px clamp(20px, 6vw, 100px);
          border-bottom: 1px solid #e4e9f0;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(14px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          color: #0b1b38;
          text-decoration: none;
        }

        .brand img {
          width: 64px;
          height: 64px;
          object-fit: contain;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          font-size: 19px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .brand span {
          margin-top: 3px;
          color: #77849a;
          font-size: 12px;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 26px;
        }

        nav a {
          color: #17243b;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        nav a:hover {
          color: #f47b20;
        }

        .contactButton {
          padding: 14px 20px;
          border-radius: 13px;
          background: #0b1b38;
          color: white !important;
        }

        .hero {
          min-height: 665px;
          display: flex;
          align-items: center;
          padding: 85px clamp(20px, 8vw, 130px);
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(244, 123, 32, 0.22),
              transparent 24%
            ),
            linear-gradient(
              125deg,
              #07152e 0%,
              #15375f 72%,
              #28666c 100%
            );
          color: white;
        }

        .heroContent {
          max-width: 900px;
        }

        .eyebrow {
          margin: 0;
          color: #f47b20;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .hero h1 {
          max-width: 850px;
          margin: 20px 0;
          font-size: clamp(52px, 7vw, 92px);
          line-height: 0.98;
          letter-spacing: -3px;
        }

        .heroDescription {
          max-width: 760px;
          margin: 0;
          color: #d7e1ee;
          font-size: 20px;
          line-height: 1.7;
        }

        .heroButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 32px;
        }

        .primaryButton,
        .secondaryButton {
          padding: 15px 22px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 900;
        }

        .primaryButton {
          background: #f47b20;
          color: white;
        }

        .secondaryButton {
          border: 1px solid rgba(255, 255, 255, 0.38);
          color: white;
        }

        .heroHighlights {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin-top: 38px;
          color: #d7e1ee;
          font-size: 14px;
        }

        .heroHighlights span::first-letter {
          color: #41dbad;
        }

        .section {
          padding: 95px clamp(20px, 6vw, 100px);
        }

        .sectionHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 30px;
        }

        .sectionHeader h2,
        .informationSection h2,
        .about h2,
        .contact h2 {
          margin: 10px 0;
          font-size: clamp(35px, 4vw, 55px);
          line-height: 1.05;
          letter-spacing: -1.5px;
        }

        .sectionHeader p:not(.eyebrow) {
          max-width: 720px;
          color: #6c798d;
          line-height: 1.7;
        }

        .count {
          padding: 10px 15px;
          border-radius: 999px;
          background: #fff0e5;
          color: #a94d0e;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
        }

        .filterBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #e0e6ee;
          border-radius: 17px;
          background: white;
        }

        .searchBox {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 10px;
          padding: 0 12px;
        }

        .searchBox input {
          width: 100%;
          padding: 12px 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #0b1b38;
          font: inherit;
        }

        .sortBox {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #687589;
          font-size: 13px;
          font-weight: 800;
        }

        .sortBox select {
          padding: 11px 13px;
          border: 1px solid #dbe2eb;
          border-radius: 10px;
          outline: none;
          background: #f7f9fc;
          color: #17243b;
          font: inherit;
          font-weight: 700;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .neighborhoodCard {
          overflow: hidden;
          border: 1px solid #e0e5ed;
          border-radius: 21px;
          background: white;
          color: #13203a;
          text-decoration: none;
          transition:
            transform 0.25s,
            box-shadow 0.25s,
            border-color 0.25s;
        }

        .neighborhoodCard:hover {
          transform: translateY(-7px);
          border-color: rgba(244, 123, 32, 0.4);
          box-shadow: 0 23px 48px rgba(18, 32, 58, 0.14);
        }

        .cardVisual {
          position: relative;
          height: 205px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #17365f, #71998e);
          background-position: center;
          background-size: cover;
        }

        .locationIcon {
          font-size: 42px;
        }

        .cardLocation {
          position: absolute;
          right: 16px;
          bottom: 15px;
          padding: 7px 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          background: rgba(7, 18, 38, 0.72);
          color: white;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          backdrop-filter: blur(7px);
        }

        .cardBody {
          padding: 25px;
        }

        .cardLabel {
          margin: 0;
          color: #f47b20;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 1.6px;
        }

        .cardBody h3 {
          margin: 8px 0 12px;
          font-size: 24px;
        }

        .cardDescription {
          min-height: 72px;
          margin: 0;
          color: #687589;
          line-height: 1.6;
        }

        .cardStats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin: 19px 0;
        }

        .cardStats span {
          min-width: 0;
          padding: 11px 9px;
          border-radius: 11px;
          background: #f3f6fa;
        }

        .cardStats small,
        .cardStats strong {
          display: block;
        }

        .cardStats small {
          margin-bottom: 4px;
          color: #7b8798;
          font-size: 9px;
        }

        .cardStats strong {
          overflow: hidden;
          color: #13203a;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cardFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 17px;
          border-top: 1px solid #edf0f5;
          color: #f47b20;
          font-size: 13px;
        }

        .message {
          padding: 30px;
          border: 1px solid #e0e5ed;
          border-radius: 16px;
          background: white;
          text-align: center;
        }

        .error {
          color: #b42318;
        }

        .informationSection {
          padding: 95px clamp(20px, 7vw, 115px);
          background: #eef2f7;
        }

        .informationSection > div:first-child {
          max-width: 780px;
        }

        .informationSection > div:first-child > p:last-child {
          color: #667287;
          font-size: 18px;
          line-height: 1.7;
        }

        .informationGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .informationGrid article {
          padding: 30px;
          border: 1px solid #dde3eb;
          border-radius: 19px;
          background: white;
        }

        .informationGrid article > span {
          color: #f47b20;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 1.4px;
        }

        .informationGrid h3 {
          margin: 14px 0 9px;
          font-size: 22px;
        }

        .informationGrid p {
          margin: 0;
          color: #687589;
          line-height: 1.7;
        }

        .about {
          padding: 100px clamp(20px, 7vw, 115px);
          background: #0d1c37;
          color: white;
        }

        .about p:last-child {
          max-width: 800px;
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.8;
        }

        .contact {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 60px;
          padding: 90px clamp(20px, 7vw, 115px);
          background: white;
        }

        .contact > div:first-child > p:last-child {
          max-width: 560px;
          color: #687589;
          line-height: 1.7;
        }

        .contactItems {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .contactItems a,
        .contactItems div {
          display: grid;
          gap: 7px;
          padding: 20px;
          border: 1px solid #e1e6ed;
          border-radius: 15px;
          color: #13203a;
          text-decoration: none;
        }

        .contactItems small {
          color: #7b8798;
        }

        .contactItems strong {
          overflow-wrap: anywhere;
        }

        footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          padding: 30px clamp(20px, 7vw, 115px);
          background: #071226;
          color: #aebacc;
        }

        .footerBrand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footerBrand img {
          width: 47px;
          height: 47px;
          object-fit: contain;
        }

        .footerBrand strong,
        .footerBrand span {
          display: block;
        }

        .footerBrand strong {
          color: white;
        }

        .footerBrand span {
          margin-top: 3px;
          font-size: 11px;
        }

        .floatingWhatsapp {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 60;
          padding: 15px 21px;
          border-radius: 999px;
          background: #1fd16a;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.22);
          color: white;
          text-decoration: none;
          font-weight: 900;
        }

        @media (max-width: 1000px) {
          nav a:not(.contactButton) {
            display: none;
          }

          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .informationGrid {
            grid-template-columns: 1fr;
          }

          .contact {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .brand span {
            display: none;
          }

          .brand strong {
            font-size: 15px;
          }

          .brand img {
            width: 50px;
            height: 50px;
          }

          .contactButton {
            padding: 11px 14px;
          }

          .hero {
            min-height: 570px;
          }

          .hero h1 {
            font-size: 48px;
            letter-spacing: -2px;
          }

          .heroDescription {
            font-size: 17px;
          }

          .sectionHeader,
          .filterBar {
            align-items: stretch;
            flex-direction: column;
          }

          .sortBox {
            justify-content: space-between;
          }

          .sortBox select {
            flex: 1;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .contactItems {
            grid-template-columns: 1fr;
          }

          footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .floatingWhatsapp {
            right: 16px;
            bottom: 16px;
          }
        }
      `}</style>
    </main>
  );
}