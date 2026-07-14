"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Neighborhood = {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  map_url: string | null;
  population: string | null;
  altitude: string | null;
  area_size: string | null;
  transportation: string | null;
  infrastructure: string | null;
  zoning_note: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
};

export default function NeighborhoodDetailPage() {
  const params = useParams<{ slug: string }>();

  const [item, setItem] = useState<Neighborhood | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (params.slug) {
      loadNeighborhood(params.slug);
    }
  }, [params.slug]);

  async function loadNeighborhood(slug: string) {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase()
      .from("neighborhoods")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      setErrorMessage(error.message);
    } else {
      setItem(data as Neighborhood | null);
    }

    setLoading(false);
  }

  if (loading) {
    return <main className="messagePage">Mahalle yükleniyor...</main>;
  }

  if (errorMessage || !item) {
    return (
      <main className="messagePage">
        <h1>Mahalle bulunamadı</h1>
        <p>{errorMessage || "Bu mahalle yayında değil veya mevcut değil."}</p>
        <Link href="/">Ana Sayfaya Dön</Link>
      </main>
    );
  }

  return (
    <main>
      <section
        className="hero"
        style={
          item.image_url
            ? {
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(7, 18, 38, 0.92),
                    rgba(23, 54, 95, 0.55)
                  ),
                  url("${item.image_url}")
                `,
              }
            : undefined
        }
      >
        <div>
          <p>SEYDİKEMER MAHALLE REHBERİ</p>
          <h1>{item.name} Mahallesi</h1>
          <span>
            {item.summary ||
              `${item.name} Mahallesi hakkında bölge ve emlak rehberi.`}
          </span>
        </div>
      </section>

      <section className="content">
        <Link href="/">← Tüm mahallelere dön</Link>

        <div className="stats">
          {item.population && (
            <article>
              <small>Nüfus</small>
              <strong>{item.population}</strong>
            </article>
          )}

          {item.altitude && (
            <article>
              <small>Rakım</small>
              <strong>{item.altitude}</strong>
            </article>
          )}

          {item.area_size && (
            <article>
              <small>Yüzölçümü</small>
              <strong>{item.area_size}</strong>
            </article>
          )}

          {item.transportation && (
            <article>
              <small>Ulaşım</small>
              <strong>{item.transportation}</strong>
            </article>
          )}
        </div>

        <div className="layout">
          <article className="mainCard">
            <h2>{item.name} hakkında</h2>

            <p className="longText">
              {item.description ||
                item.summary ||
                "Bu mahallenin ayrıntılı tanıtım bilgileri yönetim panelinden eklenecektir."}
            </p>

            {item.infrastructure && (
              <section className="infoBlock">
                <h3>Altyapı</h3>
                <p>{item.infrastructure}</p>
              </section>
            )}

            {item.zoning_note && (
              <section className="infoBlock warning">
                <h3>İmar ve Tapu Bilgisi</h3>
                <p>{item.zoning_note}</p>
              </section>
            )}

            <div className="legalNote">
              Taşınmaz değerlendirmelerinde tapu, imar, yol ve altyapı bilgileri
              resmî kurumlardan ayrıca doğrulanmalıdır.
            </div>
          </article>

          {item.map_url && (
            <aside className="mapCard">
              <h2>Konum</h2>

              <iframe
                src={item.map_url}
                title={`${item.name} Mahallesi haritası`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </aside>
          )}
        </div>
      </section>

      <style jsx>{`
        main {
          min-height: 100vh;
          background: #f6f7fa;
          color: #13203a;
        }

        .hero {
          min-height: 480px;
          display: flex;
          align-items: flex-end;
          padding: 70px clamp(20px, 7vw, 110px);
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(244, 123, 32, 0.35),
              transparent 25%
            ),
            linear-gradient(125deg, #071226, #17365f);
          background-size: cover;
          background-position: center;
          color: white;
        }

        .hero div {
          max-width: 900px;
        }

        .hero p {
          margin: 0;
          color: #f47b20;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .hero h1 {
          margin: 15px 0;
          font-size: clamp(46px, 7vw, 82px);
          line-height: 1;
        }

        .hero span {
          color: #d4deeb;
          font-size: 18px;
        }

        .content {
          max-width: 1180px;
          margin: 0 auto;
          padding: 70px 20px;
        }

        .content > a {
          color: #f47b20;
          text-decoration: none;
          font-weight: 800;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin: 28px 0;
        }

        .stats article,
        .mainCard,
        .mapCard {
          border: 1px solid #e0e5ed;
          border-radius: 20px;
          background: white;
        }

        .stats article {
          padding: 20px;
        }

        .stats small,
        .stats strong {
          display: block;
        }

        .stats small {
          margin-bottom: 8px;
          color: #7b8798;
        }

        .stats strong {
          font-size: 22px;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.8fr);
          gap: 22px;
        }

        .mainCard,
        .mapCard {
          padding: 32px;
        }

        .mainCard h2,
        .mapCard h2 {
          margin-top: 0;
          font-size: 34px;
        }

        .longText,
        .infoBlock p {
          color: #667287;
          font-size: 17px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .infoBlock {
          margin-top: 30px;
          padding-top: 24px;
          border-top: 1px solid #e5e9f0;
        }

        .infoBlock h3 {
          margin-bottom: 8px;
        }

        .warning {
          padding: 20px;
          border: 0;
          border-left: 4px solid #f47b20;
          border-radius: 10px;
          background: #fff4eb;
        }

        .legalNote {
          margin-top: 28px;
          padding: 18px;
          border-radius: 10px;
          background: #eef2f7;
          color: #526174;
        }

        iframe {
          width: 100%;
          min-height: 420px;
          border: 0;
          border-radius: 14px;
        }

        .messagePage {
          min-height: 100vh;
          display: grid;
          place-content: center;
          padding: 30px;
          text-align: center;
        }

        .messagePage a {
          color: #f47b20;
        }

        @media (max-width: 900px) {
          .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .mainCard,
          .mapCard {
            padding: 22px;
          }
        }
      `}</style>
    </main>
  );
}