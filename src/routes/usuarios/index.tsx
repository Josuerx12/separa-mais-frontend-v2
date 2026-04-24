import { Navigate, createFileRoute, useSearch } from "@tanstack/react-router";
import { useAuth } from "../../store/auth.store";
import CreateCompanyUserDialog from "../../components/dialogs/company-users/CreateCompanyUserDialog";
import { useQuery } from "@tanstack/react-query";
import { CompanyUserService } from "@/services/company-user.service";
import { useCompany } from "@/store/company.store";

export const Route = createFileRoute("/usuarios/")({
  component: UsuariosPage,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    perPage: Number(search.perPage ?? 10),
    search: search.search ?? "",
    sort: search.sort ?? "createdAt",
    order: search.order ?? "desc",
  }),
});

function UsuariosPage() {
  const { isAuthenticated } = useAuth();
  const { companySlug } = useCompany();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const params = useSearch({ from: "/usuarios/" });

  const { data } = useQuery({
    queryKey: ["companyUsers"],
    queryFn: () => CompanyUserService.getCompanyUsers(companySlug, params),
  });

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

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
              Total: {data?.totalItems ?? 0}
            </span>
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
        </div>
      </section>
    </div>
  );
}
