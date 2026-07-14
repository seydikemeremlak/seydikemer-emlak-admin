"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { number: "01", label: "Genel Bakış", href: "/admin/dashboard" },
  { number: "02", label: "Sayfalar", href: "/admin/sayfalar" },
  { number: "03", label: "Mahalleler", href: "/admin/mahalleler" },
  { number: "04", label: "Emlak Bilgileri", href: "/admin/emlak-bilgileri" },
  { number: "05", label: "Analizler", href: "/admin/analizler" },
  { number: "06", label: "Reklam Alanları", href: "/admin/reklam-alanlari" },
  { number: "07", label: "İlanlar", href: "/admin/ilanlar" },
  { number: "08", label: "Site Ayarları", href: "/admin/site-ayarlari" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    supabase().auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) router.replace("/admin");
      else setChecking(false);
    });
    return () => { active = false; };
  }, [router]);

  async function logout() {
    await supabase().auth.signOut();
    router.replace("/admin");
    router.refresh();
  }

  if (checking) {
    return <main className="admin-loading">Oturum kontrol ediliyor…</main>;
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt="Seydikemer Emlak" />
          <div><strong>SEYDİKEMER</strong><span>Yönetim Paneli · V3</span></div>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              <b>{item.number}</b><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button className="admin-logout" onClick={logout}>Çıkış Yap</button>
      </aside>
      <section className="admin-content">{children}</section>
    </main>
  );
}
