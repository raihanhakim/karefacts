export type ReferenceItem = {
  title: string;
  type: "regulation" | "guideline" | "journal_topic";
  sourceName: string;
  year?: string;
  url?: string;
  note: string;
};

export const references: ReferenceItem[] = [
  { title: "Informasi Nilai Gizi pada Label Pangan Olahan", type: "regulation", sourceName: "BPOM No. 26 Tahun 2021", year: "2021", url: "https://jdih.pom.go.id/", note: "Acuan umum pembacaan informasi nilai gizi pada label pangan olahan." },
  { title: "Pengawasan Klaim pada Label dan Iklan Pangan Olahan", type: "regulation", sourceName: "BPOM No. 1 Tahun 2022", year: "2022", url: "https://jdih.pom.go.id/", note: "Acuan edukatif untuk membaca klaim pangan secara hati-hati." },
  { title: "Edukasi Gula, Garam, Lemak", type: "guideline", sourceName: "Kemenkes", url: "https://ayosehat.kemkes.go.id/", note: "Acuan edukatif GGL: gula 50 g/hari, natrium 2000 mg/hari, lemak 67 g/hari." },
  { title: "Nutrition label literacy and consumer understanding", type: "journal_topic", sourceName: "Literatur ilmiah", note: "Topik untuk memahami bagaimana konsumen membaca dan menafsirkan label gizi." },
  { title: "Educational interventions for food label literacy", type: "journal_topic", sourceName: "Literatur ilmiah", note: "Topik edukasi untuk meningkatkan literasi label pangan." },
  { title: "Front-of-package nutrition label effectiveness", type: "journal_topic", sourceName: "Literatur ilmiah", note: "Topik efektivitas desain label gizi di bagian depan kemasan." },
  { title: "Sugar, sodium, and fat in cardiometabolic risk", type: "journal_topic", sourceName: "Literatur ilmiah", note: "Topik hubungan asupan gula, natrium, lemak dengan risiko metabolik secara populasi." },
  { title: "Total sugar vs sucrose and lactose", type: "journal_topic", sourceName: "Literatur ilmiah", note: "Topik perbedaan gula total dengan jenis gula seperti sukrosa dan laktosa." },
  { title: "Food additives and consumer risk communication", type: "journal_topic", sourceName: "Literatur ilmiah", note: "Topik komunikasi risiko bahan tambahan pangan yang tidak menakut-nakuti." },
];
