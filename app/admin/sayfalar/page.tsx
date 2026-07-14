"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { supabase } from "@/lib/supabase";
import { emptySettings, SettingsRow } from "@/lib/settings";

export default function SayfalarPage() {
  const [form, setForm] = useState<SettingsRow>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase().from("settings").select("*").order("id", { ascending: true }).limit(1).maybeSingle().then(({ data, error }) => {
      if (error) setMessage(`Veriler okunamadı: ${error.message}`);
      if (data) setForm(data as SettingsRow);
      setLoading(false);
    });
  }, []);

  function update(field: keyof SettingsRow, value: string) { setForm((old) => ({ ...old, [field]: value })); }

  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    const payload = { home_title: form.home_title, home_description: form.home_description, about_title: form.about_title, about_description: form.about_description, updated_at: new Date().toISOString() };
    const query = form.id ? supabase().from("settings").update(payload).eq("id", form.id).select().single() : supabase().from("settings").insert(payload).select().single();
    const { data, error } = await query;
    if (error) setMessage(`Kaydedilemedi: ${error.message}`); else { setForm(data as SettingsRow); setMessage("Sayfa içerikleri Supabase'e kaydedildi."); }
    setSaving(false);
  }

  return <AdminShell>
    <header className="admin-topbar"><div><p className="admin-eyebrow">İÇERİK YÖNETİMİ</p><h1>Sayfalar</h1><p>Ana sayfa ve hakkımızda içeriklerini düzenleyin.</p></div><span className="admin-status">Supabase Bağlı</span></header>
    {message && <div className="admin-message">{message}</div>}
    {loading ? <div className="admin-panel">Veriler yükleniyor…</div> : <form onSubmit={save} className="admin-form">
      <section className="admin-panel"><p className="admin-eyebrow">01 · ANA SAYFA</p><label>Başlık<input value={form.home_title ?? ""} onChange={(e) => update("home_title", e.target.value)} required /></label><label>Açıklama<textarea rows={6} value={form.home_description ?? ""} onChange={(e) => update("home_description", e.target.value)} required /></label></section>
      <section className="admin-panel"><p className="admin-eyebrow">02 · HAKKIMIZDA</p><label>Başlık<input value={form.about_title ?? ""} onChange={(e) => update("about_title", e.target.value)} required /></label><label>Açıklama<textarea rows={8} value={form.about_description ?? ""} onChange={(e) => update("about_description", e.target.value)} required /></label></section>
      <div className="admin-form-actions"><button disabled={saving}>{saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}</button></div>
    </form>}
  </AdminShell>;
}
