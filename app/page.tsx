"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Neighborhood = {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  image_url: string | null;
  is_active: boolean;
};

export default function HomePage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
  void loadNeighborhoods();
  void loadListings();
}, []);
async function loadListings() {
  const client = supabase();

  const { data, error } = await client
    .from("listings")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("İlanlar yüklenemedi:", error);
    setListings([]);
    return;
  }

  setListings(data ?? []);
}

  async function loadNeighborhoods() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase()
      .from("neighborhoods")
      .select("id,name,slug,summary,image_url,is_active")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setNeighborhoods([]);
    } else {
      setNeighborhoods((data ?? []) as Neighborhood[]);
    }

    setLoading(false);
  }

  const filteredNeighborhoods = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");

    if (!query) return neighborhoods;

    return neighborhoods.filter((item) =>
      `${item.name} ${item.summary ?? ""}`
        .toLocaleLowerCase("tr-TR")
        .includes(query),
    );
  }, [neighborhoods, search]);

  return (
    <main>
    

      <section className="hero">
        <div className="heroContent">
          <p className="eyebrow">SEYDİKEMER EMLAK VE YATIRIM REHBERİ</p>
          <h1>Doğru bilgiyle, güvenli yatırım.</h1>
          <p className="heroText">
            Seydikemer mahalleleri, bölge bilgileri ve emlak rehberleri tek noktada.
          </p>

          <div className="heroButtons">
            <a href="#mahalleler" className="primaryButton">Mahalleleri keşfet</a>
            <a href="https://wa.me/905322448448" target="_blank" rel="noopener noreferrer" className="secondaryButton">
              WhatsApp
            </a>
          </div>
        </div>
      </section>

{listings.length > 0 && (
  <section className="neighborhoodSection" id="ilanlar">
    <div className="sectionHeader">
      <div>
        <p className="eyebrow">GÜNCEL İLANLAR</p>
        <h2>Öne Çıkan İlanlar</h2>
        <p>Güncel satılık ve kiralık fırsatları inceleyin.</p>
      </div>

      <span className="count">{listings.length} İlan</span>
    </div>

    <div className="grid">
      {listings.map((item) => (
        <article className="card" key={item.id}>
          {item.image_url && (
  <img
    className="cardImg"
    src={item.image_url}
    alt={item.title || "Seydikemer Emlak İlanı"}
    onClick={() => setSelectedImage(item.image_url)}
    style={{ cursor: "zoom-in" }}
  />
)}

          <div className="cardBody">
            <h3>{item.title}</h3>

            {item.external_url && (
              <a
                href={item.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="primaryButton"
              >
                İlanı İncele
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  </section>
)}
      <section className="neighborhoodSection" id="mahalleler">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">BÖLGE REHBERİ</p>
            <h2>Seydikemer Mahalleleri</h2>
            <p>Yönetim panelinden eklenen ve yayına alınan mahalleleri inceleyin.</p>
          </div>

          <span className="count">{neighborhoods.length} Mahalle</span>
        </div>

        <div className="searchBox">
          <span>⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Mahalle ara..."
            aria-label="Mahalle ara"
          />
        </div>

        {loading ? (
          <div className="message">Mahalleler yükleniyor...</div>
        ) : errorMessage ? (
          <div className="message error">Mahalleler alınamadı: {errorMessage}</div>
        ) : filteredNeighborhoods.length === 0 ? (
          <div className="message">Aramanıza uygun mahalle bulunamadı.</div>
        ) : (
          <div className="grid">
            {filteredNeighborhoods.map((item) => (
              <Link href={`/mahalle/${item.slug}`} className="card" key={item.id}>
                <div
                  className="cardImage"
                  style={item.image_url ? { backgroundImage: `url("${item.image_url}")` } : undefined}
                >
                  <span>SEYDİKEMER</span>
                </div>

                <div className="cardBody">
                  <h3>{item.name} Mahallesi</h3>
                  <p>{item.summary || `${item.name} Mahallesi hakkında bölge ve yatırım bilgileri.`}</p>
                  <strong>Mahalle rehberini aç →</strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      

      <style jsx>{`
        main{min-height:100vh;background:#f5f7fa;color:#0b1b38}
        .header{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px clamp(20px,6vw,100px);border-bottom:1px solid #e4e8ef;background:rgba(255,255,255,.96);backdrop-filter:blur(12px)}
        .brand{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none}
        .brand img,.footerBrand img{width:58px;height:58px;object-fit:contain}
        .brand strong,.brand span,.footerBrand strong,.footerBrand span{display:block}
        .brand strong{font-size:20px}
        .brand span,.footerBrand span{margin-top:3px;color:#8793a6;font-size:13px}
        .cardImg{
  width:100%;
  height:260px;
  object-fit:cover;
  display:block;
}
        nav{display:flex;align-items:center;gap:24px}
        nav a{color:#0b1b38;text-decoration:none;font-weight:800}
        .hero{min-height:620px;display:flex;align-items:center;padding:70px clamp(20px,8vw,130px);color:white;background:radial-gradient(circle at 85% 30%,rgba(244,123,32,.38),transparent 24%),linear-gradient(125deg,#071226,#17365f 70%,#245f65)}
        .heroContent{max-width:860px}
        .eyebrow{margin:0;color:#f47b20;font-size:12px;font-weight:900;letter-spacing:2px}
        .hero h1{max-width:850px;margin:18px 0;font-size:clamp(54px,7vw,94px);line-height:.98}
        .heroText{max-width:720px;color:#d6e0eb;font-size:21px;line-height:1.65}
        .heroButtons{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
        .primaryButton,.secondaryButton{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 24px;border-radius:12px;color:white;text-decoration:none;font-weight:900}
        .primaryButton{background:#f47b20}
        .secondaryButton{border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.04)}
        .neighborhoodSection{max-width:1220px;margin:0 auto;padding:85px 20px}
        .sectionHeader{display:flex;align-items:flex-end;justify-content:space-between;gap:30px}
        .sectionHeader h2{margin:10px 0;font-size:clamp(42px,6vw,70px)}
        .sectionHeader p:not(.eyebrow){color:#718096;font-size:18px}
        .count{padding:12px 18px;border-radius:999px;background:#fff0e4;color:#9d4300;font-weight:900;white-space:nowrap}
        .searchBox{display:flex;align-items:center;gap:12px;margin:34px 0;padding:0 20px;border:1px solid #dce2eb;border-radius:16px;background:white}
        .searchBox span{font-size:26px}
        .searchBox input{width:100%;min-height:62px;border:0;outline:0;background:transparent;color:#0b1b38;font-size:17px}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,360px));gap:22px;align-items:start}
        .card{overflow:hidden;border:1px solid #dfe5ed;border-radius:20px;background:white;color:inherit;text-decoration:none;box-shadow:0 16px 45px rgba(20,40,70,.06);transition:transform .2s ease,box-shadow:0 22px 55px rgba(20,40,70,.12);align-self:start}
        .card:hover{transform:translateY(-5px);box-shadow:0 22px 55px rgba(20,40,70,.12)}
        .cardImage{min-height:220px;display:flex;align-items:flex-end;padding:18px;background:linear-gradient(180deg,rgba(7,18,38,.05),rgba(7,18,38,.78)),linear-gradient(125deg,#17365f,#3b7b78);background-size:cover;background-position:center}
        .cardImage span{color:white;font-size:11px;font-weight:900;letter-spacing:2px}
        .cardBody{padding:14px 24px 10px}
        .cardBody h3{margin:0;font-size:26px}
        .cardBody{min-height:0;color:#718096;line-height:1.65}
        .cardBody strong{color:#f47b20}
        .message{padding:26px;border:1px solid #dfe5ed;border-radius:16px;background:white;text-align:center}
        .message.error{color:#b42318}
        footer{display:flex;align-items:center;justify-content:space-between;gap:25px;padding:30px clamp(20px,7vw,115px);background:#071226;color:#aebacc}
        .footerBrand{display:flex;align-items:center;gap:12px}
        .footerBrand strong{color:white}
        @media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:650px){.header{position:static}.brand span{display:none}nav a:first-child{display:none}.hero{min-height:540px}.sectionHeader,footer{align-items:flex-start;flex-direction:column}.grid{grid-template-columns:1fr}}
      `}</style>
      {selectedImage && (
  <div
    onClick={() => setSelectedImage(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.88)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "30px",
      cursor: "zoom-out",
    }}
  >
    <button
      onClick={() => setSelectedImage(null)}
      style={{
        position: "absolute",
        top: "20px",
        right: "25px",
        background: "white",
        border: "none",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        fontSize: "28px",
        cursor: "pointer",
      }}
    >
      ×
    </button>

    <img
      src={selectedImage}
      alt="İlan görseli"
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "95vw",
        maxHeight: "90vh",
        objectFit: "contain",
        borderRadius: "12px",
        cursor: "default",
      }}
    />
  </div>
)}
    </main>
  );
}
