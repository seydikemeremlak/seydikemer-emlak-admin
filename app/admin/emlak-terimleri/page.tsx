"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { supabase } from "@/lib/supabase";

type RealEstateTerm = {
  id: number;
  term: string | null;
  description: string | null;
  slug: string | null;
  category: string | null;
  sort_order: number | null;
  is_active: boolean | null;
};

export default function EmlakTerimleriPage() {
  const [terms, setTerms] = useState<RealEstateTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const formTitle = useMemo(
    () => (editingId === null ? "Yeni Terim Ekle" : "Terimi Düzenle"),
    [editingId]
  );

  async function loadTerms() {
    setLoading(true);
    setErrorMessage("");

    const client = supabase();

    const { data, error } = await client
      .from("real_estate_terms")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("term", { ascending: true });

    if (error) {
      console.error("Emlak terimleri yüklenemedi:", error);
      setErrorMessage("Emlak terimleri yüklenirken hata oluştu.");
      setTerms([]);
    } else {
      setTerms(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTerms();
  }, []);

  function createSlug(value: string) {
    return value
      .toLocaleLowerCase("tr-TR")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function resetForm() {
    setEditingId(null);
    setTerm("");
    setDescription("");
    setCategory("");
    setSortOrder("0");
    setIsActive(true);
    setShowForm(false);
  }

  function openNewForm() {
    setEditingId(null);
    setTerm("");
    setDescription("");
    setCategory("");
    setSortOrder("0");
    setIsActive(true);
    setShowForm(true);
  }

  function openEditForm(item: RealEstateTerm) {
    setEditingId(item.id);
    setTerm(item.term ?? "");
    setDescription(item.description ?? "");
    setCategory(item.category ?? "");
    setSortOrder(String(item.sort_order ?? 0));
    setIsActive(item.is_active ?? true);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function saveTerm() {
    if (!term.trim()) {
      alert("Terim alanını doldurun.");
      return;
    }

    setSaving(true);

    const client = supabase();

    const payload = {
      term: term.trim(),
      description: description.trim() || null,
      slug: createSlug(term),
      category: category.trim() || null,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    };

    let error;

    if (editingId === null) {
      const result = await client
        .from("real_estate_terms")
        .insert(payload);

      error = result.error;
    } else {
      const result = await client
        .from("real_estate_terms")
        .update(payload)
        .eq("id", editingId);

      error = result.error;
    }

    setSaving(false);

    if (error) {
      console.error("Terim kaydedilemedi:", error);
      alert("Terim kaydedilirken hata oluştu.");
      return;
    }

    resetForm();
    await loadTerms();
  }

  async function deleteTerm(id: number) {
    const confirmed = window.confirm(
      "Bu emlak terimini silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return;

    const client = supabase();

    const { error } = await client
      .from("real_estate_terms")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Terim silinemedi:", error);
      alert("Terim silinirken hata oluştu.");
      return;
    }

    await loadTerms();
  }

  async function toggleActive(item: RealEstateTerm) {
    const client = supabase();

    const { error } = await client
      .from("real_estate_terms")
      .update({
        is_active: !(item.is_active ?? true),
      })
      .eq("id", item.id);

    if (error) {
      console.error("Durum değiştirilemedi:", error);
      alert("Terimin durumu değiştirilirken hata oluştu.");
      return;
    }

    await loadTerms();
  }

  return (
    <AdminShell>
      <header className="admin-topbar">
        <div>
          <p className="admin-kicker">V3 YAYIN SÜRÜMÜ</p>
          <h1>Emlak Terimleri</h1>
          <p>
            Emlak sektöründe kullanılan terimleri ekleyin, düzenleyin ve yönetin.
          </p>
        </div>
      </header>

      <section className="admin-panel">
        <div className="head">
          <h2>Kayıtlı Emlak Terimleri</h2>

          <button type="button" onClick={openNewForm}>
            + Yeni Terim Ekle
          </button>
        </div>

        {showForm && (
          <div
            style={{
              marginTop: "24px",
              padding: "24px",
              border: "1px solid #29405f",
              borderRadius: "16px",
            }}
          >
            <h3>{formTitle}</h3>

            <div
              style={{
                display: "grid",
                gap: "14px",
                marginTop: "18px",
              }}
            >
              <input
                type="text"
                placeholder="Terim adı"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                }}
              />

              <textarea
                placeholder="Açıklama"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                }}
              />

              <input
                type="text"
                placeholder="Kategori"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                }}
              />

              <input
                type="number"
                placeholder="Sıra No"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                }}
              />

              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />{" "}
                Aktif
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={saveTerm}
                  disabled={saving}
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="message">
            Emlak terimleri yükleniyor...
          </div>
        )}

        {!loading && errorMessage && (
          <div className="message error">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && terms.length === 0 && (
          <div className="message">
            Henüz emlak terimi eklenmedi.
          </div>
        )}

        {!loading && !errorMessage && terms.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "14px",
              marginTop: "24px",
            }}
          >
            {terms.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "18px",
                  border: "1px solid #29405f",
                  borderRadius: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {item.term}
                    </h3>

                    {item.category && (
                      <p>
                        Kategori: <strong>{item.category}</strong>
                      </p>
                    )}

                    {item.description && (
                      <p>{item.description}</p>
                    )}

                    <small>
                      Sıra: {item.sort_order ?? 0} ·{" "}
                      {item.is_active ? "Aktif" : "Pasif"}
                    </small>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                    >
                      Düzenle
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleActive(item)}
                    >
                      {item.is_active ? "Pasif Yap" : "Aktif Yap"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTerm(item.id)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}