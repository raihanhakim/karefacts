export default function BarcodeAccent() {
  return (
    <div aria-hidden="true" className="flex h-10 items-end gap-1 overflow-hidden rounded-xl bg-white/40 px-2 py-1">
      {[3, 1, 2, 4, 1, 5, 2, 1, 4, 2, 3, 1, 5, 2].map((width, index) => <span key={`${width}-${index}`} className="h-full rounded-full bg-slate-900/70" style={{ width }} />)}
    </div>
  );
}
