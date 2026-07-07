import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  badge?: { label: string; color: "amber" | "green" };
  href?: string;
  ctaLabel?: string;
}

const BADGE_COLORS: Record<"amber" | "green", string> = {
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
};

export function SectionHeading({
  title,
  eyebrow,
  badge,
  href,
  ctaLabel = "すべて見る",
}: SectionHeadingProps) {
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <div className="flex items-center gap-3">
          <h2 className="section-title mb-0">{title}</h2>
          {badge && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${BADGE_COLORS[badge.color]}`}
            >
              {badge.label}
            </span>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1 shrink-0"
        >
          {ctaLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
