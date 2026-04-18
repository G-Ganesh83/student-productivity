function FeatureCard({ title, description, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-white/70 bg-white/70 p-4 shadow-lg shadow-slate-900/8 backdrop-blur-md ${className}`}
    >
      <p className="font-ui text-sm font-semibold tracking-[-0.02em] text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default FeatureCard;
