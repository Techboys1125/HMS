const PP = "Poppins, sans-serif";
const RB = "Roboto, sans-serif";

export function SectionHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1
          className="text-lg font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          {title}
        </h1>
        {sub && (
          <p
            className="text-sm text-[#64748B] mt-0.5"
            style={{ fontFamily: RB }}
          >
            {sub}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
