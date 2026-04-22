import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCompany } from "../store/company.store";
import { useAuth } from "../store/auth.store";

const navItems = [
  { to: "/", label: "Inicio", exact: true },
  { to: "/cadastro", label: "Cadastro", exact: true },
  { to: "/auth/login", label: "Autenticação", exact: false },
] as const;

const authCompanyFieldsEnabled = ["Inicio", "Cadastro"];

const baseLinkClass =
  "rounded-full px-3 py-2 text-sm font-semibold tracking-wide text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700 [&.active]:bg-cyan-100 [&.active]:text-cyan-800 [&.active]:font-bold";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { companySlug, isCompanySlugInvalid } = useCompany();
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-cyan-100/50 backdrop-blur supports-backdrop-filter:bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          activeProps={{ className: "active" }}
          activeOptions={{ exact: true }}
          onClick={() => setIsMenuOpen(false)}
          className="group inline-flex items-center gap-3"
        >
          <span className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-slate-900">
              Separa+
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {isCompanySlugInvalid || !companySlug
                ? "controle de ativos"
                : companySlug}
            </span>
          </span>
        </Link>

        {!isCompanySlugInvalid && (
          <button
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 md:hidden"
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        )}

        {!isCompanySlugInvalid && (
          <nav
            className="hidden items-center gap-2 md:flex"
            aria-label="Navegacao principal"
          >
            {navItems.map((item) => {
              if (isAuthenticated) {
                return;
              }

              if (
                companySlug &&
                authCompanyFieldsEnabled.includes(item.label)
              ) {
                return;
              }

              if (
                (!companySlug && item.label === "Autenticação") ||
                (isAuthenticated && item.label === "Cadastro") ||
                (isAuthenticated && item.label === "Autenticação")
              ) {
                return;
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{ className: "active" }}
                  activeOptions={{ exact: item.exact }}
                  className={baseLinkClass}
                >
                  {item.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <button
                className={`${baseLinkClass} w-full`}
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
              >
                Sair
              </button>
            )}
          </nav>
        )}
      </div>

      {!isCompanySlugInvalid && (
        <nav
          id="mobile-menu"
          aria-label="Navegacao movel"
          className={`${isMenuOpen ? "block" : "hidden"} border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_8px_24px_-16px_rgba(8,47,73,0.55)] md:hidden`}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
            {navItems.map((item) => {
              if (isAuthenticated) {
                return;
              }

              if (
                companySlug &&
                authCompanyFieldsEnabled.includes(item.label)
              ) {
                return;
              }

              if (
                (!companySlug && item.label === "Autenticação") ||
                (isAuthenticated && item.label === "Cadastro") ||
                (isAuthenticated && item.label === "Autenticação")
              ) {
                return;
              }

              return (
                <Link
                  key={`${item.to}-mobile`}
                  to={item.to}
                  activeProps={{ className: "active" }}
                  activeOptions={{ exact: item.exact }}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${baseLinkClass} w-full`}
                >
                  {item.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <button
                className={`${baseLinkClass} w-full`}
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
              >
                Sair
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
