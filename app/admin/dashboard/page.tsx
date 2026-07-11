"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function Dashboard() {
  const router = useRouter();
  async function logout(){ await supabase().auth.signOut(); router.push("/admin"); }
  const items=["Genel Bakış","Sayfalar","Mahalleler","Emlak Bilgileri","Analizler","Reklam Alanları","İlanlar","Site Ayarları"];
  return <main className="shell"><aside className="side"><div className="brand"><img src="/logo.png" alt=""/><div><strong>SEYDİKEMER</strong><span>Yönetim Paneli</span></div></div><nav>{items.map((x,i)=><a className={i===0?"active":""} href="#" key={x}><b>{String(i+1).padStart(2,"0")}</b>{x}</a>)}</nav><button className="logout" onClick={logout}>Çıkış Yap</button></aside><section className="main"><header><div><p className="eyebrow">SEYDİKEMER EMLAK</p><h1>Kontrol Paneli</h1></div><span className="status">Sistem Aktif</span></header><div className="stats">{[["3","Veritabanı tablosu"],["3","Mahalle sayfası"],["0","Yayındaki ilan"],["1","Aktif yönetici"]].map(([a,b])=><article key={b}><strong>{a}</strong><span>{b}</span></article>)}</div><div className="panels"><article><p className="eyebrow">V1 DURUMU</p><h2>Admin giriş ve panel iskeleti hazır.</h2><ul><li>Supabase e-posta/şifre girişi</li><li>Koyu temalı panel</li><li>Çıkış işlemi</li><li>Vercel ortam değişkenleri</li></ul></article><article><p className="eyebrow">SONRAKİ ADIM</p><h2>Site ayarlarını panelden değiştirme</h2><p className="muted">Telefon, WhatsApp, Instagram ve adres alanları settings tablosuna bağlanacak.</p></article></div></section></main>;
}
