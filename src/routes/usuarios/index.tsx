import {
  Navigate,
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useAuth } from "../../store/auth.store";
import CreateCompanyUserDialog from "../../components/dialogs/company-users/CreateCompanyUserDialog";
import { useQuery } from "@tanstack/react-query";
import { CompanyUserService } from "@/services/company-user.service";
import { useCompany } from "@/store/company.store";
import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useForm } from "react-hook-form";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TPaginationEntry = number | "ellipsis-left" | "ellipsis-right";

function getPaginationEntries(
  currentPage: number,
  totalPages: number,
): TPaginationEntry[] {
  if (totalPages <= 1) return [1];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const entries: TPaginationEntry[] = [1];
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  if (startPage > 2) {
    entries.push("ellipsis-left");
  }

  for (let page = startPage; page <= endPage; page += 1) {
    entries.push(page);
  }

  if (endPage < totalPages - 1) {
    entries.push("ellipsis-right");
  }

  entries.push(totalPages);

  return entries;
}

export const Route = createFileRoute("/usuarios/")({
  component: UsuariosPage,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    perPage: Number(search.perPage ?? 10),
    search: String(search.search ?? ""),
    sort: String(search.sort ?? "createdAt"),
    order: String(search.order ?? "desc"),
  }),
});

function UsuariosPage() {
  const { isAuthenticated } = useAuth();
  const { companySlug } = useCompany();
  const navigate = useNavigate({ from: "/usuarios/" });

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const params = useSearch({ from: "/usuarios/" });

  const { data } = useQuery({
    queryKey: ["companyUsers", companySlug, params],
    queryFn: () => CompanyUserService.getCompanyUsers(companySlug, params),
  });

  const { register, watch } = useForm({
    defaultValues: {
      search: params.search,
    },
  });

  const searchValue = watch("search");
  const debouncedSearch = useDebounce(searchValue);

  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: debouncedSearch || "",
        page: 1,
      }),
      replace: true, // evita poluir histórico
    });
  }, [debouncedSearch, navigate]);

  const currentPage = data?.currentPage ?? params.page;
  const totalPages = data?.totalPages ?? 1;
  const paginationEntries = getPaginationEntries(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    });
  };

  return (
    <div className="space-y-6 pb-8 sm:space-y-8 sm:pb-10">
      <section className="landing-surface reveal-up rounded-3xl border border-cyan-100/80 p-6 shadow-xl shadow-cyan-100/40 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
              gerenciamento de usuarios
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Equipe da empresa
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Centralize os acessos da operacao em formato de tabela para
              acompanhar perfis, contatos e funcoes da equipe em um unico lugar.
            </p>
            <p className="text-sm leading-relaxed text-emerald-700 sm:text-base">
              Usuario novo cadastrado na empresa ja entra com acesso liberado,
              sem etapa de convite pendente.
            </p>
          </div>

          <CreateCompanyUserDialog />
        </div>
      </section>

      <section className="reveal-up reveal-delay-1 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm shadow-slate-900/5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Usuarios cadastrados
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Todos os usuarios listados abaixo ja podem operar no sistema.
            </p>
          </div>

          <div className="flex grow flex-col gap-2">
            <span className="rounded-full w-fit ml-auto bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
              Total: {data?.totalItems ?? 0}
            </span>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="block w-full p-2 rounded-full border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                {...register("search")}
                placeholder="Pesquise por nome, email ou empresa"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-190 w-full border-collapse">
            <thead className="bg-slate-50/90">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Contato
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Empresa
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((member) => (
                <tr key={member.id} className="border-t border-slate-200/90">
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm font-semibold text-slate-900">
                      {member.user.name}
                    </p>
                    <p className="text-xs text-slate-500">ID: {member.id}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm text-slate-700">
                      {member.user.email}
                    </p>
                    <p className="text-xs text-slate-500">
                      {member.user.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm text-slate-700">
                      {member.company?.name ?? "Empresa vinculada"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {member.company?.slug ?? "slug-nao-disponivel"}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex w-full flex-col items-center gap-3 p-3 sm:flex-row sm:justify-between">
            <span className="text-sm text-slate-500">
              Página {currentPage} de {totalPages}
            </span>

            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      text="Anterior"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {paginationEntries.map((entry, index) => (
                    <PaginationItem key={`${entry}-${index}`}>
                      {typeof entry === "number" ? (
                        <PaginationLink
                          href="#"
                          isActive={entry === currentPage}
                          onClick={(event) => {
                            event.preventDefault();
                            handlePageChange(entry);
                          }}
                        >
                          {entry}
                        </PaginationLink>
                      ) : (
                        <PaginationEllipsis />
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      text="Próxima"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
