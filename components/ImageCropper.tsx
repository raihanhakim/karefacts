"use client";

import { useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedImg } from "@/lib/cropImage";

export default function ImageCropper({ imageSrc, onCropReady, onChangeImage }: { imageSrc: string; onCropReady: (blob: Blob) => void; onChangeImage: () => void }) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [error, setError] = useState("");

  const applyCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      setError("");
      onCropReady(await getCroppedImg(imageSrc, croppedAreaPixels, rotation));
    } catch {
      setError("Crop belum berhasil dibuat. Kamu tetap bisa baca label dari gambar asli.");
    }
  };

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <section className="space-y-4 rounded-2xl bg-white p-3 ring-1 ring-emerald-100">
      <div>
        <p className="font-black text-slate-950">Crop tabel gizinya dulu</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">Geser dan zoom gambar sampai bagian Informasi Nilai Gizi terlihat jelas.</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">Tips: usahakan tabel memenuhi area crop, teks tidak miring, dan tidak blur.</p>
      </div>
      <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-slate-900 sm:h-[340px] md:h-[420px]">
        <Cropper image={imageSrc} crop={crop} zoom={zoom} rotation={rotation} aspect={4 / 3} onCropChange={setCrop} onZoomChange={setZoom} onRotationChange={setRotation} onCropComplete={(_, area) => setCroppedAreaPixels(area)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-black uppercase tracking-wide text-slate-700">Zoom<input type="range" min={1} max={4} step={0.05} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full accent-emerald-600" /></label>
        <label className="text-xs font-black uppercase tracking-wide text-slate-700">Putar<input type="range" min={0} max={360} step={1} value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="mt-2 w-full accent-emerald-600" /></label>
      </div>
      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={applyCrop} className="rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white">Gunakan Crop Ini</button>
        <button type="button" onClick={reset} className="rounded-2xl bg-yellow-300 px-4 py-3 font-black text-slate-950">Reset Crop</button>
        <button type="button" onClick={onChangeImage} className="rounded-2xl bg-slate-100 px-4 py-3 font-black text-slate-800">Ganti Gambar</button>
      </div>
    </section>
  );
}
