"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function Admin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { error } = await supabase().auth.signInWithPassword({ email, password });
      if (error) { setError("E-posta veya şifre hatalı."); return; }
      router.push("/admin/dashboard");
    } catch { setError("Supabase bağlantısı kurulamadı."); }
    finally { setLoading(false); }
  }
  return <main className="login"><section className="loginBox">
    <div className="brand"><img src="/logo.png" alt=""/><div><strong>SEYDİKEMER EMLAK</strong><span>Yönetim Paneli</span></div></div>
    <p className="eyebrow">GÜVENLİ GİRİŞ</p><h1>Tekrar hoş geldiniz.</h1>
    <form onSubmit={submit}>
      <label>E-posta<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label>Şifre<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
      {error && <div className="error">{error}</div>}
      <button disabled={loading}>{loading ? "Giriş yapılıyor..." : "Giriş Yap"}</button>
    </form>
    <small>Yönetici hesabı Supabase Authentication bölümünden oluşturulur.</small>
  </section><aside className="hero"><p className="eyebrow">MODERN • GÜVENLİ • SADE</p><h2>Sitenizi kod yazmadan yönetin.</h2><ul><li>Sayfaları düzenleyin</li><li>Mahalle içeriklerini yönetin</li><li>Reklam alanlarını kontrol edin</li><li>İlanları daha sonra etkinleştirin</li></ul></aside></main>;
}
