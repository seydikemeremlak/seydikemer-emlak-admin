"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: number;
  title: string | null;
  image_url: string | null;
  external_url: string | null;
  sort_order: number | null;
  active: boolean | null;
};

export default function Page() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    setLoading(true);

    const client = supabase();

const { data, error } = await client
  .from("listings")
  .select("*")
  .order("sort_order", { ascending: true })
  .order("id", { ascending: true });

    if (error) {
      console.error("İlanlar yüklenemedi:", error);
      setItems([]);
    } else {
      setItems(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <AdminShell>
      <header className="admin-topbar">
        <div>
          <p className="admin-kicker">V3 YAYIN SÜRÜMÜ</p>
          <h1>İlanlar</h1>
          <p>Supabase listings tablosundaki ilan kayıtları.</p>
        </div>
      </header>

      <section className="admin-panel">
        <div className="head">
          <h2>Kayıtlı İlanlar</h2>
          <button type="button" onClick={loadListings}>
            Yenile
          </button>
        </div>

        {loading ? (
          <p>İlanlar yükleniyor...</p>
        ) : items.length === 0 ? (
          <p>Henüz kayıtlı ilan bulunmuyor.</p>
        ) : (
          <div className="listing-grid">
            {items.map((item) => (
              <article className="listing-card" key={item.id}>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title ?? "İlan görseli"}
                  />
                )}

                <div className="listing-content">
                  <h3>{item.title ?? "Başlıksız ilan"}</h3>

                  <p>
                    Durum:{" "}
                    <strong>{item.active === false ? "Pasif" : "Aktif"}</strong>
                  </p>

                  {item.external_url && (
                    <a
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      İlanı Aç
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .admin-panel {
          background: #0d1a2a;
          border: 1px solid #23344a;
          border-radius: 18px;
          padding: 24px;
        }

        .head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        .head h2 {
          margin: 0;
        }

        .head button {
          border: 1px solid #344861;
          background: transparent;
          color: white;
          border-radius: 10px;
          padding: 10px 16px;
          cursor: pointer;
        }

        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .listing-card {
          overflow: hidden;
          border: 1px solid #263a52;
          border-radius: 16px;
          background: #07111f;
        }

        .listing-card img {
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
        }

        .listing-content {
          padding: 16px;
        }

        .listing-content h3 {
          margin: 0 0 10px;
          font-size: 18px;
          line-height: 1.35;
        }

        .listing-content p {
          margin: 0 0 14px;
          opacity: 0.8;
        }

        .listing-content a {
          display: inline-block;
          text-decoration: none;
          background: #ff7a00;
          color: white;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 700;
        }
      `}</style>
    </AdminShell>
  );
}