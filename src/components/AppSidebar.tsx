import { Link } from "@tanstack/react-router";
import { useAuth } from "../store/auth.store";

const sidebarItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    helper: "Visao geral da operacao",
  },
  {
    to: "/ativos",
    label: "Ativos",
    helper: "Kanban de separacao de material",
  },
  {
    to: "/usuarios",
    label: "Usuarios",
    helper: "Gestao da equipe da empresa",
  },
] as const;

const desktopLinkClass =
  "group block rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3 transition hover:border-cyan-200 hover:bg-cyan-50/70 [&.active]:border-cyan-300 [&.active]:bg-cyan-50";

const AppSidebar = () => {
  const { user } = useAuth();

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-slate-900/5">
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              Area logada
            </p>
            <p className="mt-2 font-display text-lg font-bold text-slate-900">
              {user?.company?.name ?? "Empresa parceira"}
            </p>
            <p className="mt-1 text-xs text-slate-600">{user?.email}</p>
          </div>

          <nav className="mt-4 space-y-2" aria-label="Menu lateral">
            {sidebarItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "active" }}
                activeOptions={{ exact: true }}
                className={desktopLinkClass}
              >
                <p className="text-sm font-bold tracking-wide text-slate-900">
                  {item.label}
                </p>
                <p className="text-xs text-slate-600">{item.helper}</p>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <nav
        className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/85 p-2 shadow-sm shadow-slate-900/5 lg:hidden"
        aria-label="Menu rapido"
      >
        {sidebarItems.map((item) => (
          <Link
            key={`${item.to}-mobile`}
            to={item.to}
            activeProps={{ className: "active" }}
            activeOptions={{ exact: true }}
            className="inline-flex min-w-max items-center rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700 [&.active]:bg-cyan-100 [&.active]:text-cyan-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default AppSidebar;
