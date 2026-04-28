import DashboardCard from "@/components/DashboardCard";
import type { IMaterialRequest } from "@/interfaces/IMaterialRequest";
import {
  MaterialRequestService,
  type TimelineStatus,
} from "@/services/material-request.service";
import { useCompany } from "@/store/company.store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

type RequestedKanbanProps = {
  status: TimelineStatus;
  title: string;
  helper: string;
  tone: "cyan" | "amber" | "rose" | "emerald";
  perPage?: number;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDate(value: Date) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data indisponivel";
  }

  return dateFormatter.format(parsedDate);
}

function formatDateTime(value: Date) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data indisponivel";
  }

  return dateTimeFormatter.format(parsedDate);
}

const RequestedKanban = ({
  status,
  title,
  helper,
  tone,
  perPage = 10,
}: RequestedKanbanProps) => {
  const { companySlug, isCompanySlugLoading } = useCompany();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["material-requests-kanban", companySlug, status, perPage],
    enabled: Boolean(companySlug) && !isCompanySlugLoading,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      MaterialRequestService.getByStatus(status, companySlug, {
        page: pageParam,
        perPage,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }

      return undefined;
    },
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const totalItems = data?.pages[0]?.totalItems ?? 0;

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    const root = scrollContainerRef.current;

    if (!sentinel || !root || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        root,
        rootMargin: "120px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, items.length]);

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Nao foi possivel carregar as solicitacoes desta coluna.";

  return (
    <DashboardCard
      title={title}
      subtitle={helper}
      badge={`${items.length}/${totalItems || items.length} itens`}
      tone={tone}
      className="reveal-up"
    >
      <div
        ref={scrollContainerRef}
        className="max-h-[62vh] space-y-3 overflow-y-auto pr-1"
      >
        {isLoading ? (
          <div className="flex min-h-28 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-5 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            Carregando solicitacoes...
          </div>
        ) : null}

        {isCompanySlugLoading ? (
          <div className="flex min-h-28 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-5 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            Carregando contexto da empresa...
          </div>
        ) : null}

        {!isCompanySlugLoading && !companySlug ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-5 text-center text-sm text-slate-500">
            Empresa nao identificada para listar solicitacoes.
          </div>
        ) : null}

        {isError ? (
          <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p>{errorMessage}</p>
            <button
              type="button"
              className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-200"
              onClick={() => {
                void refetch();
              }}
            >
              Tentar novamente
            </button>
          </div>
        ) : null}

        {!isCompanySlugLoading &&
        !isLoading &&
        !isError &&
        items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-5 text-center text-sm text-slate-500">
            Nenhuma solicitacao neste status.
          </div>
        ) : null}

        {!isCompanySlugLoading && !isLoading && !isError
          ? items.map((request: IMaterialRequest) => (
              <DashboardCard
                key={request.id}
                title={request.exitId}
                subtitle={request.description || "Sem descricao"}
                tone="default"
                className="bg-white"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {request.requester?.name || "Solicitante indisponivel"}
                    </span>
                    <span>{formatDateTime(request.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>Coleta prevista</span>
                    <span className="font-semibold text-slate-700">
                      {formatDate(request.collectForecast)}
                    </span>
                  </div>

                  {request.additionalContact ? (
                    <p className="text-xs text-slate-500">
                      Contato extra: {request.additionalContact}
                    </p>
                  ) : null}
                </div>
              </DashboardCard>
            ))
          : null}

        {hasNextPage ? (
          <div
            ref={loadMoreRef}
            className="flex h-10 items-center justify-center text-xs text-slate-500"
          >
            {isFetchingNextPage ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                Carregando mais...
              </span>
            ) : (
              <span>Role para carregar mais</span>
            )}
          </div>
        ) : null}
      </div>
    </DashboardCard>
  );
};

export default RequestedKanban;
