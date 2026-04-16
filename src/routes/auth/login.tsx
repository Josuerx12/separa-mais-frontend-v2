import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { type LoginPayload } from "../../services/auth.service.ts";
import { useCompany } from "../../store/company.store.ts";
import { useAuth } from "../../store/auth.store.ts";

const loginSchema = z.object({
  email: z.string().trim().email("Informe um email valido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginFormValues = z.input<typeof loginSchema>;

const getLoginErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return "Ocorreu um erro ao realizar o login. Tente novamente.";
  }

  const responseData = error.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    const message = (responseData as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "Ocorreu um erro ao realizar o login. Tente novamente.";
};

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const { companySlug } = useCompany();

  if (!companySlug || isAuthenticated) {
    navigate({
      to: "/",
      replace: true,
    });
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, error, isPending } = useMutation<void, unknown, LoginPayload>(
    {
      mutationFn: signIn,
      mutationKey: ["login"],
      onSuccess: () => {
        toast.success("Login realizado com sucesso.");
        reset();
        navigate({
          to: "/",
        });
      },
    },
  );

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[0.82fr_1.18fr]">
      <section className="reveal-up reveal-delay-1 order-1 self-start overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-2xl shadow-cyan-100/40 lg:order-1">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="relative ml-auto flex w-full max-w-xl flex-col gap-5 bg-white/93 p-5 backdrop-blur md:p-7"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
              separa+ acesso
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold text-slate-900">
              Entrar na sua conta
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Entre com seu email e senha para acompanhar o processo de
              separacao, status operacionais e indicadores do painel.
            </p>
          </div>

          <div className="grid gap-3">
            <label htmlFor="email" className="space-y-1">
              <span className="text-sm font-semibold text-slate-700">
                Email
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                placeholder="Ex.: maria@empresa.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition ${errors.email ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"}`}
              />
              {errors.email ? (
                <span id="email-error" className="text-xs text-rose-600">
                  {errors.email.message}
                </span>
              ) : null}
            </label>

            <label htmlFor="password" className="space-y-1">
              <span className="text-sm font-semibold text-slate-700">
                Senha
              </span>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                placeholder="Digite sua senha"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition ${errors.password ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"}`}
              />
              {errors.password ? (
                <span id="password-error" className="text-xs text-rose-600">
                  {errors.password.message}
                </span>
              ) : null}
            </label>
          </div>

          {error ? (
            <div className="rounded-md bg-rose-50 p-3">
              <span className="text-sm font-bold text-rose-900">Erro:</span>
              <p className="text-sm text-rose-700">
                {getLoginErrorMessage(error)}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
            >
              {isPending ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </section>

      <aside className="reveal-up relative hidden lg:block order-2 min-h-136 overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur lg:order-2 lg:min-h-160 lg:p-8">
        <img
          src="/fundo.jpg"
          alt="Equipe acompanhando os indicadores em tempo real"
          className="absolute inset-0 h-full w-full rounded-3xl object-cover"
        />
      </aside>
    </div>
  );
}
