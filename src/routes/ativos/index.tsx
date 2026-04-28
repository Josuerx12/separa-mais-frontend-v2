import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../store/auth.store";
import RequestedKanban from "@/components/kanban/material-requests/RequestedKanban";
import {
  TimelineStatus,
  type TimelineStatus as TimelineStatusType,
} from "@/services/material-request.service";
import RequestNewMaterialRequestDialog from "@/components/dialogs/material-requests/RequestNewMaterialRequestDialog";

type StatusColumn = {
  status: TimelineStatusType;
  title: string;
  tone: "cyan" | "amber" | "rose" | "emerald";
  helper: string;
};

const statusColumns: StatusColumn[] = [
  {
    status: TimelineStatus.REQUESTED,
    title: "Solicitadas",
    tone: "amber",
    helper: "Pedidos recem criados aguardando triagem inicial.",
  },
  {
    status: TimelineStatus.IN_PROGRESS,
    title: "Em separacao",
    tone: "cyan",
    helper: "Ativos em preparo pela equipe interna.",
  },
  {
    status: TimelineStatus.COMPLETED,
    title: "Concluidas",
    tone: "emerald",
    helper: "Solicitacoes preparadas e prontas para retirada.",
  },
  {
    status: TimelineStatus.COLLECTED,
    title: "Coletadas",
    tone: "cyan",
    helper: "Materiais ja retirados pelo solicitante.",
  },
  {
    status: TimelineStatus.CANCELLED,
    title: "Canceladas",
    tone: "rose",
    helper: "Pedidos cancelados por indisponibilidade ou ajuste.",
  },
];

export const Route = createFileRoute("/ativos/")({
  component: AtivosPage,
});

function AtivosPage() {
  const { isAuthenticated, permissions } = useAuth();

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

          {permissions?.isRequester && <RequestNewMaterialRequestDialog />}
        </div>
      </section>

      <section className="space-y-4">
        <div className="reveal-up reveal-delay-1">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Fluxo por status
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Acompanhe as solicitacoes por status em tempo real com carregamento
            infinito por coluna.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statusColumns.map((column) => (
            <RequestedKanban
              key={column.status}
              status={column.status}
              title={column.title}
              helper={column.helper}
              tone={column.tone}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
