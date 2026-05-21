import type { ProductType } from "@/types/label";

export const DAILY_REFERENCES = {
  sugar: 50,
  sodium: 2000,
  totalFat: 67,
};

export const MAIN_DISCLAIMER =
  "Analisis KareFacts bersifat edukatif dan tidak menggantikan saran ahli gizi, tenaga kesehatan, atau acuan regulasi resmi. Untuk klaim pangan dan keputusan kesehatan, selalu rujuk pada ahli dan peraturan yang berlaku.";

export const PRODUCT_TYPES: Array<{ value: ProductType; label: string }> = [
  { value: "snack", label: "Snack" },
  { value: "minuman", label: "Minuman" },
  { value: "susu", label: "Susu" },
  { value: "roti_bakery", label: "Roti/Bakery" },
  { value: "frozen_food", label: "Frozen Food" },
  { value: "saus_sambal", label: "Saus/Sambal" },
  { value: "makanan_instan", label: "Makanan instan" },
  { value: "sereal", label: "Sereal" },
  { value: "biskuit", label: "Biskuit" },
  { value: "permen_cokelat", label: "Permen/Cokelat" },
  { value: "produk_susu", label: "Produk susu" },
  { value: "lainnya", label: "Lainnya" },
];

export const REFERENCES = [
  "BPOM - Label Pangan Olahan",
  "BPOM - Informasi Nilai Gizi",
  "BPOM - Klaim pada Label dan Iklan Pangan Olahan",
  "BPOM - Pelabelan Alergen",
  "Kemenkes - Edukasi Gula, Garam, Lemak",
];
