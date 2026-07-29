export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm shadow-slate-50 ${className}`}
    >
      {children}
    </div>
  );
}
