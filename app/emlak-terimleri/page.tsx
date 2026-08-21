"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  useEffect(() => {
    async function loadTerms() {
      const client = supabase();

      const { data, error } = await client
        .from("real_estate_terms")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("term", { ascending: true });

      if (error) {
        console.error("Emlak terimleri yüklenemedi:", error);
        setTerms([]);
      } else {
        setTerms(data ?? []);
      }

      setLoading(false);
    }

    loadTerms();
  }, []);

  const categories = useMemo(() => {
    return [
      "Tümü",
      ...Array.from(
        new Set(
          terms
            .map((item) => item.category)
            .filter((value): value is string => Boolean(value))
        )
      ),
    ];
  }, [terms]);

  const filteredTerms = useMemo(() => {
    const search = searchTerm.toLocaleLowerCase("tr-TR").trim();

    return terms.filter((item) => {
      const matchesSearch =
        !search ||
        (item.term ?? "").toLocaleLowerCase("tr-TR").includes(search) ||
        (item.description ?? "")
          .toLocaleLowerCase("tr-TR")
          .includes(search);

      const matchesCategory =
        selectedCategory === "Tümü" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [terms, searchTerm, selectedCategory]);

  return (
    <main className="terms-public-page">
      <section className="terms-public-hero">
        <div className="terms-public-container">
          <p className="terms-public-kicker">EMLAK BİLGİ REHBERİ</p>
          <h1>Emlak Terimleri</h1>
          <p>
            Gayrimenkul, tapu, imar, arsa ve yatırım süreçlerinde sık kullanılan
            terimlerin açıklamalarını inceleyin.
          </p>
        </div>
      </section>

      <section className="terms-public-section">
        <div className="terms-public-container">
          <div className="terms-public-tools">
            <input
              type="search"
              placeholder="Terim ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="terms-public-message">Terimler yükleniyor...</p>
          ) : filteredTerms.length === 0 ? (
            <p className="terms-public-message">
              Aramanıza uygun emlak terimi bulunamadı.
            </p>
          ) : (
            <div className="terms-public-grid">
              {filteredTerms.map((item) => (
                <article key={item.id} className="terms-public-card">
                  {item.category && (
                    <span className="terms-public-category">
                      {item.category}
                    </span>
                  )}

                  <h2>{item.term}</h2>

                  {item.description && <p>{item.description}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}