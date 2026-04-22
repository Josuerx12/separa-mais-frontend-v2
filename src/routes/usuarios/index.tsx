import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../store/auth.store";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Administrador" | "Operador" | "Coleta";
  status: "Ativo";
};

const rolePillClass: Record<TeamMember["role"], string> = {
  Administrador: "bg-cyan-100 text-cyan-700",
  Operador: "bg-amber-100 text-amber-700",
  Coleta: "bg-emerald-100 text-emerald-700",
};

const statusPillClass = "bg-emerald-100 text-emerald-700";

export const Route = createFileRoute("/usuarios/")({
  component: UsuariosPage,
});

function UsuariosPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const teamMembers: TeamMember[] = [
    {
      id: user?.id ?? "USR-001",
      name: user?.name ?? "Responsavel principal",
      email: user?.email ?? "admin@empresa.com",
      phone: user?.phone ?? "(00) 90000-0000",
      role: "Administrador",
      status: "Ativo",
    },
    {
      id: "USR-102",
      name: "Rafaela Martins",
      email: "rafaela@empresa.com",
      phone: "(11) 98888-4321",
      role: "Operador",
      status: "Ativo",
    },
    {
      id: "USR-127",
      name: "Joao Henrique",
      email: "joao.henrique@empresa.com",
      phone: "(11) 97777-8899",
      role: "Coleta",
      status: "Ativo",
    },
  ];

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

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800"
          >
            Adicionar usuario
          </button>
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
              Total: {teamMembers.length}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Ativos: {teamMembers.length}
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
                  Perfil
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Empresa
                </th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-t border-slate-200/90">
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm font-semibold text-slate-900">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500">ID: {member.id}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm text-slate-700">{member.email}</p>
                    <p className="text-xs text-slate-500">{member.phone}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${rolePillClass[member.role]}`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusPillClass}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="text-sm text-slate-700">
                      {user?.company?.name ?? "Empresa vinculada"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.company?.slug ?? "slug-nao-disponivel"}
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
