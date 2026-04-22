import { Navigate, createFileRoute } from "@tanstack/react-router";
import DashboardCard from "../../components/DashboardCard";
import { useAuth } from "../../store/auth.store";

type AssetRequestCard = {
  requestId: string;
  requester: string;
  asset: string;
  quantity: number;
  openedAt: string;
  priority: "Alta" | "Media" | "Baixa";
};

type StatusColumn = {
  title: "Em separacao" | "Aguardando coleta" | "Canceladas" | "Concluidas";
  tone: "cyan" | "amber" | "rose" | "emerald";
  helper: string;
  items: AssetRequestCard[];
};

const statusColumns: StatusColumn[] = [
  {
    title: "Em separacao",
    tone: "cyan",
    helper: "Ativos em preparo pela equipe interna.",
    items: [
      {
        requestId: "REQ-1802",
        requester: "Maria Santos",
        asset: "Notebook Dell Latitude",
        quantity: 2,
        openedAt: "09:15",
        priority: "Alta",
      },
      {
        requestId: "REQ-1804",
        requester: "Pedro Carvalho",
        asset: "Monitor 24 polegadas",
        quantity: 4,
        openedAt: "10:08",
        priority: "Media",
      },
    ],
  },
  {
    title: "Aguardando coleta",
    tone: "amber",
    helper: "Solicitacoes prontas aguardando retirada.",
    items: [
      {
        requestId: "REQ-1793",
        requester: "Ana Beatriz",
        asset: "Smartphone corporativo",
        quantity: 1,
        openedAt: "08:47",
        priority: "Alta",
      },
      {
        requestId: "REQ-1798",
        requester: "Rafael Lima",
        asset: "Headset USB",
        quantity: 6,
        openedAt: "09:52",
        priority: "Baixa",
      },
    ],
  },
  {
    title: "Canceladas",
    tone: "rose",
    helper: "Pedidos cancelados por indisponibilidade ou ajuste.",
    items: [
      {
        requestId: "REQ-1788",
        requester: "Juliana Costa",
        asset: "Dock station",
        quantity: 3,
        openedAt: "07:30",
        priority: "Media",
      },
      {
        requestId: "REQ-1791",
        requester: "Thiago Alves",
        asset: "Teclado mecanico",
        quantity: 2,
        openedAt: "08:01",
        priority: "Baixa",
      },
    ],
  },
  {
    title: "Concluidas",
    tone: "emerald",
    helper: "Ativos separados e coletados com sucesso.",
    items: [
      {
        requestId: "REQ-1779",
        requester: "Carla Menezes",
        asset: "Mouse sem fio",
        quantity: 8,
        openedAt: "06:55",
        priority: "Baixa",
      },
      {
        requestId: "REQ-1782",
        requester: "Bruno Nascimento",
        asset: "Cadeira ergonomica",
        quantity: 1,
        openedAt: "07:22",
        priority: "Media",
      },
    ],
  },
];

const priorityPillClass: Record<AssetRequestCard["priority"], string> = {
  Alta: "bg-rose-100 text-rose-700",
  Media: "bg-amber-100 text-amber-700",
  Baixa: "bg-emerald-100 text-emerald-700",
};

export const Route = createFileRoute("/ativos/")({
  component: AtivosPage,
});

function AtivosPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 pb-8 sm:space-y-8 sm:pb-10">
      <section className="landing-surface reveal-up rounded-3xl border border-cyan-100/80 p-6 shadow-xl shadow-cyan-100/40 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
              separacao de material
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Quadro kanban de ativos
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Cada coluna representa um status operacional para facilitar a
              visualizacao, priorizacao e acompanhamento das solicitacoes.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800"
          >
            Nova solicitacao
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="reveal-up reveal-delay-1">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Fluxo por status
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Arraste e acompanhe os cards por etapa do processo de separacao de
            material.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statusColumns.map((column) => (
            <DashboardCard
              key={column.title}
              title={column.title}
              subtitle={column.helper}
              badge={`${column.items.length} itens`}
              tone={column.tone}
              className="reveal-up"
            >
              <div className="space-y-3">
                {column.items.map((item) => (
                  <DashboardCard
                    key={item.requestId}
                    title={item.requestId}
                    subtitle={`${item.asset} • ${item.quantity} un.`}
                    tone="default"
                    className="bg-white"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {item.requester}
                        </span>
                        <span>{item.openedAt}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityPillClass[item.priority]}`}
                        >
                          Prioridade {item.priority}
                        </span>
                        <button
                          type="button"
                          className="text-xs font-semibold text-cyan-700 transition hover:text-cyan-800"
                        >
                          Abrir
                        </button>
                      </div>
                    </div>
                  </DashboardCard>
                ))}
              </div>
            </DashboardCard>
          ))}
        </div>
      </section>
    </div>
  );
}
