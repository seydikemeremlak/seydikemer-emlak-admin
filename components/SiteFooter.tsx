"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { emptySettings, type SettingsRow } from "@/lib/settings";

function normalizeTurkeyPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("90")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `90${digits.slice(1)}`;
  }

  return `90${digits}`;
}

export default function SiteFooter() {
  const [settings, setSettings] = useState<SettingsRow>(emptySettings);

  useEffect(() => {
    async function loadSettings() {
      const client = supabase();

      const { data, error } = await client
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setSettings(data);
      }
    }

    loadSettings();
  }, []);

  const phoneRaw = settings.phone || "";
  const whatsappRaw = settings.whatsapp || settings.phone || "";

  const phoneLink = phoneRaw ? normalizeTurkeyPhone(phoneRaw) : "";
  const whatsappLink = whatsappRaw
    ? normalizeTurkeyPhone(whatsappRaw)
    : "";

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <img
            src="/logo.png"
            alt={settings.company_name || "Seydikemer Emlak"}
            className="footer-logo"
          />

          <h3>{settings.company_name || "Seydikemer Emlak"}</h3>

          <p>
            {settings.company_slogan ||
              "Seydikemer ve çevresinde emlak, yatırım fırsatları ve mahalle rehberi."}
          </p>
        </div>

        <div className="footer-column">
          <h4>Hızlı Menü</h4>

          <Link href="/">Ana Sayfa</Link>
          <Link href="/#mahalleler">Mahalleler</Link>
          <Link href="/analizler">Analizler</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/iletisim">İletişim</Link>
        </div>

        <div className="footer-column">
          <h4>İletişim</h4>

          {phoneRaw && (
            <a href={`tel:+${phoneLink}`}>
              📞 {phoneRaw.replace(/^0?(\d{3})(\d{3})(\d{2})(\d{2})$/, "0$1 $2 $3 $4")}
            </a>
          )}

          {whatsappRaw && (
            <a
              href={`https://wa.me/${whatsappLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp
            </a>
          )}

          {settings.email && (
            <a href={`mailto:${settings.email}`}>
              ✉️ {settings.email}
            </a>
          )}

          {settings.address && (
            <p>📍 {settings.address}</p>
          )}

          {settings.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          )}

          {settings.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          )}

          {settings.youtube && (
            <a
              href={settings.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          )}

          <a
            href="https://seydikemeremlak.com.tr"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 seydikemeremlak.com.tr
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()}{" "}
        {settings.company_name || "Seydikemer Emlak"}
        <br />
        Tüm hakları saklıdır.
      </div>
    </footer>
  );
}