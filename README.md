# KareFacts

KareFacts adalah Food Label Analyzer edukatif untuk membantu pengguna memahami fakta pada label pangan olahan: informasi nilai gizi, komposisi, potensi alergen, bahan tambahan pangan, klaim produk, dan hal yang perlu diperhatikan jika produk dikonsumsi.

Tagline: "Baca fakta di balik label pangan."

Author: raihanhakim

Copyright: Copyright by kareayamq

## Fitur

- Landing page modern dan mobile-first.
- Form input label pangan manual.
- Upload/crop gambar label dan ekstraksi tabel gizi dengan Gemini Vision melalui API route server-side.
- Analisis GGL edukatif client-side.
- Deteksi kata kunci potensi alergen.
- Deteksi istilah bahan tambahan pangan.
- Catatan klaim produk.
- KareFacts Score yang bukan skor sehat/tidak sehat.
- Tombol Isi Contoh Produk dan Reset Form.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React
- Tanpa database
- Gemini Vision API melalui `GEMINI_API_KEY`
- API route Next.js untuk menjaga API key tetap di server
- Input manual tetap tersedia jika Gemini sedang ramai atau gambar sulit dibaca

## Konfigurasi Gemini OCR

1. Buat Gemini API key dari Google AI Studio.
2. Buat file `.env.local` di root project.
3. Isi environment variable:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Untuk deploy ke Vercel, tambahkan `GEMINI_API_KEY` di Project Settings -> Environment Variables.

Catatan OCR: Hasil AI bisa salah membaca angka. Selalu cocokkan ulang dengan label asli sebelum analisis.

## Cara Install

```bash
npm install
```

## Menjalankan Lokal

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy ke Vercel

1. Push ke GitHub.
2. Import project di Vercel.
3. Klik Deploy.

## Catatan

KareFacts bersifat edukatif, bukan diagnosis kesehatan dan bukan pengganti regulasi resmi.

## Scientific Background

Jurnal digunakan untuk memperkuat edukasi dan copywriting, sedangkan rules angka utama tetap memakai acuan resmi BPOM/Kemenkes.

Keyword pencarian jurnal yang relevan:

- nutrition label literacy systematic review
- consumer understanding nutrition labels systematic review
- food label literacy adolescents education intervention
- nutrition label use healthy food choices review
- front of package nutrition label consumer understanding systematic review
- front-of-pack nutrition labels young consumers review
- nutrition facts label design consumer behavior
- Nutri-Score nutrition literacy systematic review
- sodium intake blood pressure systematic review
- added sugar intake metabolic risk review
- saturated fat cardiovascular disease systematic review
- sodium sugar saturated fat cardiometabolic risk umbrella review
- total sugars sucrose lactose nutrition label interpretation
- lactose milk sugar nutrition label
- sugar types sucrose lactose glucose fructose food label
- intrinsic sugar lactose milk review
- sodium content processed foods nutrition label
- sodium intake processed foods blood pressure review
- dietary sodium packaged foods review
- salt intake processed food public health review
- food additives consumer perception review
- food additives safety risk communication review
- food additives labeling consumer understanding
