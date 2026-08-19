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

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [externalUrl, setExternalUrl] = useState("");
    const [active, setActive] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

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
    async function addListing() {
  if (!title.trim()) {
    alert("İlan başlığı boş olamaz.");
    return;
  }

  setSaving(true);

  const client = supabase();

  const listingData = {
    title: title.trim(),
    image_url: imageUrl.trim() || null,
    external_url: externalUrl.trim() || null,
    active,
  };

  let error;

  if (editingId !== null) {
    const result = await client
      .from("listings")
      .update(listingData)
      .eq("id", editingId);

    error = result.error;
  } else {
    const result = await client
      .from("listings")
      .insert(listingData);

    error = result.error;
  }

  setSaving(false);

  if (error) {
    console.error("İlan kaydedilemedi:", error);
    alert("İlan kaydedilirken hata oluştu.");
    return;
  }

  setTitle("");
  setImageUrl("");
  setExternalUrl("");
  setActive(true);
  setEditingId(null);
  setShowForm(false);

  await loadListings();
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
                    <button type="button" onClick={() => setShowForm(true)}>
                        + Yeni İlan Ekle
                    </button>
                    <button type="button" onClick={loadListings}>
                        Yenile
                    </button>
                </div>
                {showForm && (
                    <div className="listing-form">
                        <h3>Yeni İlan Ekle</h3>

                        <input
                            type="text"
                            placeholder="İlan başlığı"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Görsel URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="İlan bağlantısı"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                        />

                        <label>
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                            Aktif
                        </label>

                        <div>
                            <button type="button" onClick={addListing} disabled={saving}>
                                {saving ? "Kaydediliyor..." : "Kaydet"}
                            </button>

                            <button type="button" onClick={() => setShowForm(false)}>
                                İptal
                            </button>
                        </div>
                    </div>
                )}

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
                                    <button
  type="button"
  onClick={() => {
    setEditingId(item.id);
    setTitle(item.title ?? "");
    setImageUrl(item.image_url ?? "");
    setExternalUrl(item.external_url ?? "");
    setActive(item.active !== false);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
>
  Düzenle
</button>

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