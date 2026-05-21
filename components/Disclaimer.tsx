import { MAIN_DISCLAIMER } from "@/lib/constants";

export default function Disclaimer() {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950 shadow-sm">
      <p className="font-bold">Disclaimer edukatif</p>
      <p className="mt-2">{MAIN_DISCLAIMER}</p>
    </section>
  );
}
