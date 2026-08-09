export default function PointerLabel({ label, side }) {
  return (
    <div
      className={`flex flex-col items-center shrink-0 ${side === "left" ? "mr-3" : "ml-3"}`}
    >
      <span className="text-[10px] text-accent tracking-widest uppercase">{label}</span>
      <span className="text-accent text-lg leading-none">↓</span>
    </div>
  );
}
