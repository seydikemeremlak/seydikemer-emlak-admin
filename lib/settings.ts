export type SettingsRow = {
  id: number;
  company_name: string | null;
  company_slogan: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  home_title: string | null;
  home_description: string | null;
  about_title: string | null;
  about_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  updated_at: string | null;
};

export const emptySettings: SettingsRow = {
  id: 0,
  company_name: "Seydikemer Emlak",
  company_slogan: "Bölgenin güvenilir emlak rehberi",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  instagram: "",
  facebook: "",
  youtube: "",
  home_title: "Seydikemer Emlak",
  home_description: "Seydikemer ve çevresindeki emlak fırsatları, bölge bilgileri ve güncel analizler.",
  about_title: "Hakkımızda",
  about_description: "Seydikemer bölgesinde güvenilir, şeffaf ve bilgi odaklı emlak hizmetleri sunuyoruz.",
  seo_title: "Seydikemer Emlak",
  seo_description: "Seydikemer bölgesi emlak, yatırım ve mahalle rehberi.",
  seo_keywords: "seydikemer emlak, arsa, tarla, yatırım",
  updated_at: null,
};
