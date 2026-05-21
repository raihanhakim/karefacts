import BarcodeAccent from "@/components/BarcodeAccent";

export default function PackagingShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`package-card relative overflow-hidden rounded-[2rem] border-2 border-emerald-900 bg-[#FFF8E7] p-4 shadow-xl shadow-emerald-900/10 ${className}`}>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lime-300/70 blur-sm" />
      <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-yellow-300/60 blur-sm" />
      <div className="relative z-10">{children}</div>
      <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t-2 border-dashed border-emerald-900/30 pt-3 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-900">
        <span>SCAN - CHECK - LEARN</span>
        <BarcodeAccent />
      </div>
    </section>
  );
}
