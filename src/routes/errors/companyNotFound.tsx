import { createFileRoute } from "@tanstack/react-router";
import { useCompany } from "../../store/company.store";
import { useMemo } from "react";

const getRootHostname = (hostname: string): string => {
  const normalizedHostname = hostname.toLowerCase();
  const hostnameParts = normalizedHostname.split(".");
  const separaMaisIndex = hostnameParts.indexOf("separamais");

  if (separaMaisIndex <= 0) {
    return normalizedHostname;
  }

  return hostnameParts.slice(separaMaisIndex).join(".");
};

const verificationChecklist = [
  {
    title: "Revise o subdominio",
    description:
      "Confirme se o endereco foi digitado corretamente, sem espacos extras.",
  },
  {
    title: "Valide o cadastro",
    description:
      "Se a empresa ainda nao foi criada, conclua o cadastro para liberar acesso.",
  },
  {
    title: "Fale com o suporte interno",
    description:
      "Em caso de duvida, acione o time responsavel pela gestao do separa+.",
  },
] as const;

export const Route = createFileRoute("/errors/companyNotFound")({
  component: RouteComponent,
});

function RouteComponent() {
  const { companySlug } = useCompany();

  const rootHomeUrl = useMemo(() => {
    const currentUrl = new URL(window.location.href);
    currentUrl.hostname = getRootHostname(currentUrl.hostname);
    currentUrl.pathname = "/";
    currentUrl.search = "";
    currentUrl.hash = "";
    return currentUrl.toString();
  }, []);

  const rootCadastroUrl = useMemo(() => {
    const currentUrl = new URL(window.location.href);
    currentUrl.hostname = getRootHostname(currentUrl.hostname);
    currentUrl.pathname = "/cadastro";
    currentUrl.search = "";
    currentUrl.hash = "";
    return currentUrl.toString();
  }, []);

  return (
    <section className="landing-surface relative overflow-hidden rounded-3xl border border-rose-100/80 p-6 shadow-xl shadow-rose-100/40 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-rose-200/40 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="reveal-up space-y-5">
          <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-rose-700">
            Erro de identificacao
          </span>

          <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Empresa{" "}
            <span className="uppercase text-red-900">{companySlug}</span> nao
            identificada
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Nao encontramos uma empresa vinculada ao endereco informado. Isso
            pode acontecer quando o subdominio esta incorreto ou quando a
            empresa ainda nao concluiu o cadastro na plataforma.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={rootHomeUrl}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Voltar para o inicio
            </a>

            <a
              href={rootCadastroUrl}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold tracking-wide text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
            >
              Cadastrar empresa
            </a>
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            Se voce ja possui cadastro, revise o link e tente novamente.
          </p>
        </div>

        <aside className="reveal-up reveal-delay-1 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-slate-900/5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M12 8v5m0 3h.01M4.93 19h14.14a2 2 0 0 0 1.73-3L13.73 3.5a2 2 0 0 0-3.46 0L3.2 16a2 2 0 0 0 1.73 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <h2 className="mt-4 font-display text-xl font-bold text-slate-900">
            Checklist rapido
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Antes de tentar novamente, valide estes pontos para evitar erro de
            acesso.
          </p>

          <ul className="mt-4 space-y-3">
            {verificationChecklist.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-slate-200 bg-slate-50/90 p-3"
              >
                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
