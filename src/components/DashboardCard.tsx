import type { ReactNode } from "react";

type DashboardCardTone = "default" | "cyan" | "emerald" | "rose" | "amber";

type DashboardCardProps = {
  title?: string;
  subtitle?: string;
  value?: string;
  badge?: string;
  tone?: DashboardCardTone;
  className?: string;
  children?: ReactNode;
};

const toneClasses: Record<DashboardCardTone, string> = {
  default: "border-slate-200 bg-white/90",
  cyan: "border-cyan-100 bg-cyan-50/60",
  emerald: "border-emerald-100 bg-emerald-50/60",
  rose: "border-rose-100 bg-rose-50/60",
  amber: "border-amber-100 bg-amber-50/65",
};

const DashboardCard = ({
  title,
  subtitle,
  value,
  badge,
  tone = "default",
  className,
  children,
}: DashboardCardProps) => {
  const hasHeader = title || subtitle || value || badge;

  return (
    <article
      className={`rounded-2xl border p-4 shadow-sm shadow-slate-900/5 ${toneClasses[tone]} ${className ?? ""}`}
    >
      {hasHeader ? (
        <header className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            {title ? (
              <h3 className="text-sm font-semibold tracking-wide text-slate-800">
                {title}
              </h3>
            ) : null}
            {badge ? (
              <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {badge}
              </span>
            ) : null}
          </div>

          {value ? (
            <p className="font-display text-3xl font-extrabold leading-none text-slate-900">
              {value}
            </p>
          ) : null}

          {subtitle ? (
            <p className="text-sm text-slate-600">{subtitle}</p>
          ) : null}
        </header>
      ) : null}

      {children ? (
        <div className={hasHeader ? "mt-3" : ""}>{children}</div>
      ) : null}
    </article>
  );
};

export default DashboardCard;
