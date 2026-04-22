import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../store/auth.store";
import { useCompany } from "../store/company.store";

const workflowSteps = [
  {
    step: "01",
    title: "Cliente informa o ID",
    description:
      "Basta informar o ID de saida do sistema principal de gestao de ativos.",
  },
  {
    step: "02",
    title: "Rastreamento por etapas",
    description:
      "Cada solicitacao passa por fases claras para sua equipe acompanhar sem ruido.",
  },
  {
    step: "03",
    title: "Equipe atua com previsao",
    description:
      "Com status em tempo real, operacao e coleta se alinham com mais agilidade.",
  },
  {
    step: "04",
    title: "Gestao orientada a dados",
    description:
      "Relatorios mensais e dashboard mostram gargalos, volumes e desempenho.",
  },
] as const;

const trackedStatuses = [
  { label: "Em separacao", badgeClass: "bg-cyan-100 text-cyan-700" },
  {
    label: "Aguardando coleta",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    label: "Canceladas",
    badgeClass: "bg-rose-100 text-rose-700",
  },
  {
    label: "Concluidas",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  { label: "Outros status", badgeClass: "bg-slate-100 text-slate-700" },
] as const;

const metrics = [
  { label: "Chamados ativos", value: "248" },
  { label: "Tempo medio", value: "2h 14m" },
  { label: "Taxa de conclusao", value: "94%" },
] as const;

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { companySlug } = useCompany();
  const hasPartnerCompany = Boolean(companySlug);

  const primaryCta = {
    to: hasPartnerCompany ? "/auth/login" : "/cadastro",
    label: hasPartnerCompany
      ? "Entrar com minha conta"
      : "Cadastrar empresa e usuario",
  };

  const complementaryCta = {
    to: hasPartnerCompany ? "/auth/login" : "/cadastro",
    label: hasPartnerCompany
      ? "Acessar pagina de login"
      : "Quero iniciar meu cadastro",
  };

  if (isAuthenticated) {
    navigate({
      to: "/dashboard",
      replace: true,
    });
  }

  return (
    <div className="space-y-6 pb-8 sm:space-y-8 sm:pb-10">
      <section className="landing-surface grid overflow-hidden rounded-3xl border border-cyan-100/80 p-6 shadow-xl shadow-cyan-100/40 md:grid-cols-[1.1fr_0.9fr] md:gap-6 md:p-10">
        <div className="reveal-up space-y-5">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
            Gestao inteligente de separacao
          </span>

          <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Desenrole o processo de separacao de ativos do inicio ao fim.
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            O separa+ foi criado para organizar toda a jornada de separacao com
            rastreabilidade real. O cliente informa o ID de saida do sistema
            principal e, a partir disso, cada etapa passa a ser monitorada com
            visibilidade para operacao, coleta e gestao.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to={primaryCta.to}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              {primaryCta.label}
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold tracking-wide text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
            >
              Entender o fluxo
            </a>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {hasPartnerCompany
              ? "Empresa parceira identificada. Use o login para acessar seu painel de acompanhamento em tempo real."
              : "Usuario logado? Esta pagina inicial redireciona para o dashboard, onde toda a gestao acontece em tempo real."}
          </div>

          {hasPartnerCompany ? (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              <p className="font-semibold">Pontos importantes para o login:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Use o email corporativo cadastrado para sua equipe.</li>
                <li>Acesso liberado para acompanhar status e indicadores.</li>
              </ul>
            </div>
          ) : null}
        </div>

        <div className="reveal-up reveal-delay-1 relative mt-8 md:mt-0">
          <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-cyan-300/30 blur-2xl" />
          <div className="absolute -right-8 bottom-2 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl" />

          <div className="relative rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-900/5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Painel de rastreamento
              </p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Atualizado agora
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.15em] text-cyan-200">
                ID de saida
              </p>
              <p className="font-display mt-2 text-2xl font-bold">
                SAI-2026-0413
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Fluxo em andamento com monitoramento por etapa.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-800">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="space-y-4">
        <div className="reveal-up reveal-delay-1">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Como o separa+ funciona na pratica
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
            Da entrada do ID ate a conclusao, voce tem visao completa do
            processo e elimina o retrabalho de acompanhar separacoes
            manualmente.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-4">
          {workflowSteps.map((item, index) => (
            <article
              key={item.step}
              className="reveal-up rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm shadow-slate-900/5"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <span className="inline-flex rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold tracking-[0.12em] text-white">
                {item.step}
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="reveal-up reveal-delay-2 rounded-3xl border border-cyan-100 bg-cyan-50/70 p-6">
          <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Status monitorados para cada fase
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Acompanhe o que esta em separacao, aguardando coleta, cancelado,
            concluido e qualquer outro status operacional relevante.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {trackedStatuses.map((status) => (
              <span
                key={status.label}
                className={`${status.badgeClass} rounded-full px-3 py-1 text-xs font-semibold tracking-wide`}
              >
                {status.label}
              </span>
            ))}
          </div>
        </article>

        <article className="reveal-up reveal-delay-3 rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm shadow-slate-900/5">
          <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
            Relatorios e dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Gere relatorios mensais, visualize indicadores em dashboards e
            encontre gargalos antes que virem problema no processo.
          </p>

          <Link
            to={complementaryCta.to}
            className="mt-5 inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            {complementaryCta.label}
          </Link>
        </article>
      </section>
    </div>
  );
}
