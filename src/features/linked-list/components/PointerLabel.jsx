export default function PointerLabel({ label }) {
  return (
    <div className="flex flex-col items-center mr-3 shrink-0">
      <span className="text-[10px] text-accent tracking-widest uppercase">
        {label}
      </span>
      <span className="text-accent text-lg leading-none">↓</span>
    </div>
  );
}
