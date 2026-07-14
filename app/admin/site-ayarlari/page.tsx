"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { supabase } from "@/lib/supabase";
import { emptySettings, SettingsRow } from "@/lib/settings";

const fields: Array<{ key: keyof SettingsRow; label: string; type?: string }> = [
  { key: "company_name", label: "Firma Adı" }, { key: "company_slogan", label: "Slogan" }, { key: "phone", label: "Telefon" }, { key: "whatsapp", label: "WhatsApp" }, { key: "email", label: "E-posta", type: "email" }, { key: "address", label: "Adres" }, { key: "instagram", label: "Instagram" }, { key: "facebook", label: "Facebook" }, { key: "youtube", label: "YouTube" }, { key: "seo_title", label: "SEO Başlığı" }, { key: "seo_keywords", label: "SEO Anahtar Kelimeleri" },
];

export default function SiteAyarlariPage() {
  const [form, setForm] = useState<SettingsRow>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { supabase().from("settings").select("*").order("id", { ascending: true }).limit(1).maybeSingle().then(({ data, error }) => { if (error) setMessage(error.message); if (data) setForm(data as SettingsRow); setLoading(false); }); }, []);
  function update(field: keyof SettingsRow, value: string) { setForm((old) => ({ ...old, [field]: value })); }
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    const payload = { company_name: form.company_name, company_slogan: form.company_slogan, phone: form.phone, whatsapp: form.whatsapp, email: form.email, address: form.address, instagram: form.instagram, facebook: form.facebook, youtube: form.youtube, seo_title: form.seo_title, seo_description: form.seo_description, seo_keywords: form.seo_keywords, updated_at: new Date().toISOString() };
    const query = form.id ? supabase().from("settings").update(payload).eq("id", form.id).select().single() : supabase().from("settings").insert(payload).select().single();
    const { data, error } = await query;
    if (error) setMessage(`Kaydedilemedi: ${error.message}`); else { setForm(data as SettingsRow); setMessage("Site ayarları Supabase'e kaydedildi."); }
    setSaving(false);
  }
  return <AdminShell><header className="admin-topbar"><div><p className="admin-eyebrow">GENEL AYARLAR</p><h1>Site Ayarları</h1><p>İletişim, sosyal medya ve SEO bilgilerini yönetin.</p></div><span className="admin-status">Düzenleme Aktif</span></header>{message && <div className="admin-message">{message}</div>}{loading ? <div className="admin-panel">Yükleniyor…</div> : <form onSubmit={save} className="admin-form"><section className="admin-panel admin-field-grid">{fields.map((field) => <label key={String(field.key)}>{field.label}<input type={field.type ?? "text"} value={String(form[field.key] ?? "")} onChange={(e) => update(field.key, e.target.value)} /></label>)}<label className="admin-full">SEO Açıklaması<textarea rows={5} value={form.seo_description ?? ""} onChange={(e) => update("seo_description", e.target.value)} /></label></section><div className="admin-form-actions"><button disabled={saving}>{saving ? "Kaydediliyor…" : "Ayarları Kaydet"}</button></div></form>}</AdminShell>;
}
