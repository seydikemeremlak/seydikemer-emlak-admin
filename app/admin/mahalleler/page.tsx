"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
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
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

const emptyForm = {
  id: 0,
  name: "",
  slug: "",
  summary: "",
  description: "",
image_url: "",
map_url: "",
population: "",
altitude: "",
area_size: "",
transportation: "",
infrastructure: "",
zoning_note: "",
seo_title: "",
seo_description: "",
  is_active: true,
  sort_order: 0,
};

function createSlug(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MahallelerPage() {
  const [items, setItems] = useState<Neighborhood[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadNeighborhoods();
  }, []);

  async function loadNeighborhoods() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase()
      .from("neighborhoods")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      setErrorMessage(`Mahalleler alınamadı: ${error.message}`);
    } else {
      setItems((data ?? []) as Neighborhood[]);
    }

    setLoading(false);
  }

  function updateName(value: string) {
    setForm((previous) => ({
      ...previous,
      name: value,
      slug: previous.id ? previous.slug : createSlug(value),
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setMessage("");
    setErrorMessage("");
  }

  function editNeighborhood(item: Neighborhood) {
    setForm({
      id: item.id,
      name: item.name,
      slug: item.slug,
      summary: item.summary ?? "",
      description: item.description ?? "",
image_url: item.image_url ?? "",
map_url: item.map_url ?? "",
population: item.population ?? "",
altitude: item.altitude ?? "",
area_size: item.area_size ?? "",
transportation: item.transportation ?? "",
infrastructure: item.infrastructure ?? "",
zoning_note: item.zoning_note ?? "",
seo_title: item.seo_title ?? "",
seo_description: item.seo_description ?? "",
      is_active: item.is_active,
      sort_order: item.sort_order,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveNeighborhood(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setErrorMessage("Mahalle adı boş bırakılamaz.");
      return;
    }

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const payload = {
      name: form.name.trim(),
      slug: createSlug(form.slug || form.name),
      summary: form.summary.trim() || null,
      description: form.description.trim() || null,
image_url: form.image_url.trim() || null,
map_url: form.map_url.trim() || null,
population: form.population.trim() || null,
altitude: form.altitude.trim() || null,
area_size: form.area_size.trim() || null,
transportation: form.transportation.trim() || null,
infrastructure: form.infrastructure.trim() || null,
zoning_note: form.zoning_note.trim() || null,
seo_title: form.seo_title.trim() || null,
seo_description: form.seo_description.trim() || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };

    if (form.id) {
      const { error } = await supabase()
        .from("neighborhoods")
        .update(payload)
        .eq("id", form.id);

      if (error) {
        setErrorMessage(`Mahalle güncellenemedi: ${error.message}`);
        setSaving(false);
        return;
      }

      setMessage("Mahalle başarıyla güncellendi.");
    } else {
      const { error } = await supabase()
        .from("neighborhoods")
        .insert(payload);

      if (error) {
        setErrorMessage(`Mahalle eklenemedi: ${error.message}`);
        setSaving(false);
        return;
      }

      setMessage("Mahalle başarıyla eklendi.");
    }

    setForm(emptyForm);
    await loadNeighborhoods();
    setSaving(false);
  }

  async function deleteNeighborhood(item: Neighborhood) {
    const approved = window.confirm(
      `${item.name} mahallesini silmek istediğine emin misin?`
    );

    if (!approved) return;

    setMessage("");
    setErrorMessage("");

    const { error } = await supabase()
      .from("neighborhoods")
      .delete()
      .eq("id", item.id);

    if (error) {
      setErrorMessage(`Mahalle silinemedi: ${error.message}`);
      return;
    }

    if (form.id === item.id) {
      resetForm();
    }

    setMessage("Mahalle silindi.");
    await loadNeighborhoods();
  }

  async function toggleStatus(item: Neighborhood) {
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase()
      .from("neighborhoods")
      .update({
        is_active: !item.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      setErrorMessage(`Durum değiştirilemedi: ${error.message}`);
      return;
    }

    await loadNeighborhoods();
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");

    if (!query) return items;

    return items.filter((item) =>
      `${item.name} ${item.slug} ${item.summary ?? ""}`
        .toLocaleLowerCase("tr-TR")
        .includes(query)
    );
  }, [items, search]);

  return (
    <AdminShell>
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">V3 YAYIN SÜRÜMÜ</p>
          <h1>Mahalleler</h1>
          <p>Mahalle sayfalarını ekleyin, düzenleyin ve yayın durumunu yönetin.</p>
        </div>

        <span className="admin-status">
          {items.length} Mahalle
        </span>
      </header>

      {message && (
        <div className="admin-message success-message">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="admin-message error-message">
          {errorMessage}
        </div>
      )}

      <section className="admin-panel form-panel">
        <p className="admin-eyebrow">
          {form.id ? "MAHALLEYİ DÜZENLE" : "YENİ MAHALLE"}
        </p>

        <h2>
          {form.id ? `${form.name} mahallesini düzenle` : "Yeni mahalle ekle"}
        </h2>

        <form className="admin-form" onSubmit={saveNeighborhood}>
          <div className="admin-field-grid">
            <label>
              Mahalle Adı
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateName(event.target.value)}
                placeholder="Örneğin: Gerişburnu"
                required
              />
            </label>

            <label>
              Sayfa Adresi
              <input
                type="text"
                value={form.slug}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    slug: createSlug(event.target.value),
                  }))
                }
                placeholder="gerisburnu"
                required
              />
            </label>

            <label>
              Sıralama
              <input
                type="number"
                min="0"
                value={form.sort_order}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    sort_order: Number(event.target.value),
                  }))
                }
              />
            </label>

            <label>
              Yayın Durumu
              <select
                value={form.is_active ? "active" : "passive"}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    is_active: event.target.value === "active",
                  }))
                }
              >
                <option value="active">Yayında</option>
                <option value="passive">Yayın Dışı</option>
              </select>
            </label>

            <label className="admin-full">
              Kısa Tanıtım
              <textarea
                rows={5}
                value={form.summary}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    summary: event.target.value,
                  }))
                }
                placeholder="Mahalle hakkında kısa bir tanıtım yazısı..."
              />
            </label>
          </div>
          <label className="admin-full">
  Uzun Açıklama
  <textarea
    rows={8}
    value={form.description}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        description: event.target.value,
      }))
    }
    placeholder="Mahallenin ayrıntılı tanıtımı..."
  />
</label>

<label className="admin-full">
  Kapak Fotoğrafı URL
  <input
    type="text"
    value={form.image_url}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        image_url: event.target.value,
      }))
    }
  />
</label>

<label className="admin-full">
  Google Harita Embed
  <input
    type="text"
    value={form.map_url}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        map_url: event.target.value,
      }))
    }
  />
</label>

<label>
  Nüfus
  <input
    value={form.population}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        population: event.target.value,
      }))
    }
  />
</label>

<label>
  Rakım
  <input
    value={form.altitude}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        altitude: event.target.value,
      }))
    }
  />
</label>

<label>
  Yüzölçümü
  <input
    value={form.area_size}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        area_size: event.target.value,
      }))
    }
  />
</label>
<label className="admin-full">
  Ulaşım
  <textarea
    rows={3}
    value={form.transportation}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        transportation: event.target.value,
      }))
    }
  />
</label>

<label className="admin-full">
  Altyapı
  <textarea
    rows={3}
    value={form.infrastructure}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        infrastructure: event.target.value,
      }))
    }
  />
</label>

<label className="admin-full">
  İmar Bilgisi
  <textarea
    rows={3}
    value={form.zoning_note}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        zoning_note: event.target.value,
      }))
    }
  />
</label>

<label className="admin-full">
  SEO Başlığı
  <input
    value={form.seo_title}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        seo_title: event.target.value,
      }))
    }
  />
</label>

<label className="admin-full">
  SEO Açıklaması
  <textarea
    rows={3}
    value={form.seo_description}
    onChange={(event) =>
      setForm((previous) => ({
        ...previous,
        seo_description: event.target.value,
      }))
    }
  />
</label>

          <div className="form-buttons">
            {form.id !== 0 && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                İptal
              </button>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Kaydediliyor..."
                : form.id
                ? "Değişiklikleri Kaydet"
                : "Mahalle Ekle"}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-panel list-panel">
        <div className="list-header">
          <div>
            <p className="admin-eyebrow">MAHALLE LİSTESİ</p>
            <h2>Kayıtlı mahalleler</h2>
          </div>

          <input
            className="search-input"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Mahalle ara..."
          />
        </div>

        {loading ? (
          <p className="empty-text">Mahalleler yükleniyor...</p>
        ) : filteredItems.length === 0 ? (
          <p className="empty-text">
            Henüz kayıtlı mahalle bulunmuyor.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Mahalle</th>
                  <th>Sayfa Adresi</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.sort_order}</td>

                    <td>
                      <strong>{item.name}</strong>
                      {item.summary && <small>{item.summary}</small>}
                    </td>

                    <td>/{item.slug}</td>

                    <td>
                      <button
                        type="button"
                        className={
                          item.is_active
                            ? "status-button active-status"
                            : "status-button passive-status"
                        }
                        onClick={() => toggleStatus(item)}
                      >
                        {item.is_active ? "Yayında" : "Yayın Dışı"}
                      </button>
                    </td>

                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => editNeighborhood(item)}
                        >
                          Düzenle
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => deleteNeighborhood(item)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style jsx>{`
        .form-panel {
          margin-bottom: 18px;
        }

        .success-message {
          border-color: rgba(45, 212, 163, 0.35);
          background: rgba(45, 212, 163, 0.1);
          color: #70e5bd;
        }

        .error-message {
          border-color: rgba(248, 113, 113, 0.35);
          background: rgba(248, 113, 113, 0.1);
          color: #fca5a5;
        }

        select {
          width: 100%;
          padding: 14px 15px;
          border: 1px solid #2a3c59;
          border-radius: 11px;
          outline: none;
          background: #081221;
          color: #ffffff;
          font: inherit;
        }

        select:focus {
          border-color: #f47b20;
          box-shadow: 0 0 0 3px rgba(244, 123, 32, 0.13);
        }

        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .primary-button,
        .secondary-button {
          min-height: 46px;
          padding: 0 20px;
          border-radius: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .primary-button {
          border: 0;
          background: #f47b20;
          color: #ffffff;
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .secondary-button {
          border: 1px solid #2a3c59;
          background: transparent;
          color: #dbe7f7;
        }

        .list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .list-header h2 {
          margin-bottom: 0;
        }

        .search-input {
          width: min(320px, 100%);
          padding: 13px 15px;
          border: 1px solid #2a3c59;
          border-radius: 11px;
          outline: none;
          background: #081221;
          color: #ffffff;
        }

        .search-input:focus {
          border-color: #f47b20;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 15px 13px;
          border-bottom: 1px solid #20304a;
          text-align: left;
          vertical-align: middle;
        }

        th {
          color: #8795aa;
          font-size: 12px;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        td {
          color: #dce6f5;
          font-size: 14px;
        }

        td strong,
        td small {
          display: block;
        }

        td small {
          max-width: 420px;
          margin-top: 6px;
          overflow: hidden;
          color: #8795aa;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status-button {
          padding: 8px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .active-status {
          border: 1px solid rgba(45, 212, 163, 0.3);
          background: rgba(45, 212, 163, 0.1);
          color: #38dbac;
        }

        .passive-status {
          border: 1px solid rgba(248, 113, 113, 0.3);
          background: rgba(248, 113, 113, 0.1);
          color: #fca5a5;
        }

        .row-actions {
          display: flex;
          gap: 8px;
        }

        .edit-button,
        .delete-button {
          padding: 9px 12px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .edit-button {
          border: 1px solid #2a3c59;
          background: #111c2e;
          color: #dce6f5;
        }

        .delete-button {
          border: 1px solid rgba(248, 113, 113, 0.3);
          background: rgba(248, 113, 113, 0.08);
          color: #fca5a5;
        }

        .empty-text {
          padding: 30px 0;
          color: #8795aa;
          text-align: center;
        }

        @media (max-width: 700px) {
          .list-header,
          .form-buttons {
            align-items: stretch;
            flex-direction: column;
          }

          .search-input,
          .primary-button,
          .secondary-button {
            width: 100%;
          }
        }
      `}</style>
    </AdminShell>
  );
}