import { Link, Navigate, createFileRoute } from "@tanstack/react-router";
import DashboardCard from "../../components/DashboardCard";
import { useAuth } from "../../store/auth.store";

type MetricCard = {
  label: string;
  value: string;
  helper: string;
  badge: string;
  tone: "cyan" | "emerald" | "amber" | "rose";
};

const metricCards: MetricCard[] = [
  {
    label: "Solicitacoes abertas",
    value: "42",
    helper: "Pedidos ativos aguardando tratativa da operacao.",
    badge: "+8 hoje",
    tone: "cyan",
  },
  {
    label: "Tempo medio de separacao",
    value: "1h 26m",
    helper: "Media das solicitacoes concluindo nas ultimas 24h.",
    badge: "-12 min",
    tone: "emerald",
  },
  {
    label: "Coletas pendentes",
    value: "11",
    helper: "Solicitacoes aguardando retirada fisica dos ativos.",
    badge: "3 urgentes",
    tone: "amber",
  },
  {
    label: "Taxa de cancelamento",
    value: "4.2%",
    helper: "Volume de pedidos cancelados no ciclo atual.",
    badge: "estavel",
    tone: "rose",
  },
];

const quickAccessCards = [
  {
    title: "Ativos",
    tone: "cyan",
    helper: "Acompanhe a separacao de material em um quadro kanban por status.",
    actionLabel: "Abrir quadro",
    to: "/ativos",
  },
  {
    title: "Usuarios",
    tone: "rose",
    helper: "Gerencie perfis da empresa, permissoes e status de acesso.",
    actionLabel: "Gerenciar usuarios",
    to: "/usuarios",
  },
] as const;

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 pb-8 sm:space-y-8 sm:pb-10">
      <section className="landing-surface reveal-up rounded-3xl border border-cyan-100/80 p-6 shadow-xl shadow-cyan-100/40 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
              dashboard operacional
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Central de solicitacoes de ativos
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Acompanhe os principais indicadores do seu processo e acesse
              rapidamente as areas de operacao do sistema.
            </p>
          </div>

          <Link
            to="/ativos"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800"
          >
            Abrir quadro de ativos
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <DashboardCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            subtitle={metric.helper}
            badge={metric.badge}
            tone={metric.tone}
            className="reveal-up"
          />
        ))}
      </section>

      <section className="space-y-4">
        <div className="reveal-up reveal-delay-1">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Acessos rapidos da operacao
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Navegue para o quadro kanban de separacao de material e para o
            gerenciamento de usuarios da empresa.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {quickAccessCards.map((item) => (
            <DashboardCard
              key={item.title}
              title={item.title}
              subtitle={item.helper}
              tone={item.tone}
              className="reveal-up"
            >
              <div className="pt-1">
                <Link
                  to={item.to}
                  className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
                >
                  {item.actionLabel}
                </Link>
              </div>
            </DashboardCard>
          ))}
        </div>
      </section>

      <section className="reveal-up reveal-delay-2 rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm shadow-slate-900/5">
        <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
          Responsavel conectado
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Sessao ativa para {user?.name ?? "Usuario autenticado"}.{" "}
          {user?.company?.name
            ? `Empresa: ${user.company.name}.`
            : "Gerencie os recursos da operacao com seguranca."}
        </p>
      </section>
    </div>
  );
}
