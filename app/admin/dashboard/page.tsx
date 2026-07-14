"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [settingsReady, setSettingsReady] = useState(false);
  const [propertyCount, setPropertyCount] = useState(0);

  useEffect(() => {
    const client = supabase();
    Promise.all([
      client.from("settings").select("id", { count: "exact", head: true }),
      client.from("properties").select("id", { count: "exact", head: true }),
    ]).then(([settings, properties]) => {
      setSettingsReady((settings.count ?? 0) > 0);
      setPropertyCount(properties.count ?? 0);
    });
  }, []);

  const today = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const stats = [
    { value: String(propertyCount), label: "Toplam İlan", icon: "🏡" },
    { value: "3", label: "Mahalle Sayfası", icon: "📍" },
    { value: "2", label: "Düzenlenebilir Sayfa", icon: "📝" },
    { value: settingsReady ? "Hazır" : "Eksik", label: "Site Ayarları", icon: "⚙️" },
  ];

  return <AdminShell>
    <header className="admin-topbar"><div><p className="admin-eyebrow">SEYDİKEMER EMLAK</p><h1>Hoş geldin Coşkun 👋</h1><p>{today}</p></div><span className="admin-status">● Sistem Aktif</span></header>
    <section className="admin-stats">{stats.map((item) => <article key={item.label}><div>{item.icon}</div><strong>{item.value}</strong><span>{item.label}</span></article>)}</section>
    <section className="admin-grid">
      <article className="admin-panel"><p className="admin-eyebrow">HIZLI İŞLEMLER</p><h2>Bugün ne yapmak istersin?</h2><div className="admin-actions">
        <Link href="/admin/sayfalar">📝 Sayfaları Düzenle</Link><Link href="/admin/site-ayarlari">⚙️ Site Ayarları</Link><Link href="/admin/mahalleler">📍 Mahalle Yönetimi</Link><Link href="/admin/ilanlar">🏡 İlan Yönetimi</Link>
      </div></article>
      <article className="admin-panel"><p className="admin-eyebrow">YAYIN DURUMU</p><h2>V3 yayın sprinti</h2><ul className="admin-checks"><li>✓ Giriş sistemi</li><li>✓ Dashboard</li><li>✓ Sayfa içerikleri</li><li>✓ Site ayarları</li><li>→ Mahalleler sırada</li></ul></article>
    </section>
  </AdminShell>;
}
