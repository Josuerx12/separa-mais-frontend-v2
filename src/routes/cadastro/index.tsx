import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CompanyService } from "../../services/company.service";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth.store";
import { useCompany } from "../../store/company.store";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const signupSchema = z.object({
  company: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Informe o nome da empresa com pelo menos 3 caracteres."),
    trandingName: z
      .string()
      .trim()
      .min(3, "Informe o nome fantasia com pelo menos 3 caracteres."),
    slug: z
      .string()
      .trim()
      .min(3, "O subdominio precisa ter ao menos 3 caracteres.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use apenas letras minusculas, numeros e hifen no subdominio.",
      ),
    cpfCnpj: z
      .string()
      .trim()
      .refine((value) => {
        const digits = onlyDigits(value);
        return digits.length === 11 || digits.length === 14;
      }, "Informe um CPF ou CNPJ valido."),
    phone: z
      .string()
      .trim()
      .refine((value) => onlyDigits(value).length >= 10, "Telefone invalido."),
  }),
  user: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Informe o nome completo do usuario responsavel."),
    email: z.string().trim().email("Informe um email valido."),
    phone: z
      .string()
      .trim()
      .refine((value) => onlyDigits(value).length >= 10, "Telefone invalido."),
    password: z
      .string()
      .min(8, "A senha precisa ter no minimo 8 caracteres.")
      .regex(/[A-Z]/, "A senha precisa de ao menos uma letra maiuscula.")
      .regex(/[0-9]/, "A senha precisa de ao menos um numero."),
  }),
});

export type SignupFormValues = z.input<typeof signupSchema>;
export type SignupPayload = z.output<typeof signupSchema>;

const companyFields = [
  {
    key: "name",
    label: "Nome da empresa",
    placeholder: "Ex.: Separa Mais Tecnologia",
    autoComplete: "organization",
  },
  {
    key: "trandingName",
    label: "Nome fantasia",
    placeholder: "Ex.: separa+",
    autoComplete: "organization-title",
  },
  {
    key: "slug",
    label: "Subdominio",
    placeholder: "Ex.: separa-mais",
    autoComplete: "off",
  },
  {
    key: "cpfCnpj",
    label: "CPF/CNPJ",
    placeholder: "Ex.: 12.345.678/0001-99",
    autoComplete: "off",
  },
  {
    key: "phone",
    label: "Telefone da empresa",
    placeholder: "Ex.: (11) 90000-0000",
    autoComplete: "tel",
  },
] as const;

const userFields = [
  {
    key: "name",
    label: "Nome do dono",
    placeholder: "Ex.: Maria Santos",
    autoComplete: "name",
    type: "text",
  },
  {
    key: "email",
    label: "Email do dono",
    placeholder: "Ex.: maria@empresa.com",
    autoComplete: "email",
    type: "email",
  },
  {
    key: "phone",
    label: "Telefone do dono",
    placeholder: "Ex.: (11) 98888-7777",
    autoComplete: "tel",
    type: "text",
  },
  {
    key: "password",
    label: "Senha",
    placeholder: "Crie uma senha forte",
    autoComplete: "new-password",
    type: "password",
  },
] as const;

export const Route = createFileRoute("/cadastro/")({
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { companySlug } = useCompany();

  if (companySlug || isAuthenticated) {
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
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const { mutate, error } = useMutation({
    mutationFn: CompanyService.create,
    mutationKey: ["create-company"],
    onSuccess: () => {
      toast.success(
        "Empresa criada com sucesso! Agora você pode acessar o sistema. Verifique seu endereço de email para obter as instruções de login.",
      );
      reset();
      navigate({
        to: "/",
      });
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    mutate(data);
  };

  return (
    <div className="grid min-h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[1.10fr_0.90fr]">
      <aside className="reveal-up hidden lg:block order-2 rounded-3xl border border-white/70 bg-white/70 p-6 backdrop-blur lg:order-1 lg:p-8">
        <img
          src="/fundo.jpg"
          alt="Equipe acompanhando o fluxo de separacao"
          className="absolute inset-0 h-full w-full object-cover rounded-3xl"
        />
      </aside>

      <section className="reveal-up reveal-delay-1 order-1 overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-2xl shadow-cyan-100/40 lg:order-2">
        <div className="relative h-full min-h-180">
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="relative ml-auto flex h-full w-full max-w-xl flex-col gap-5 bg-white/93 p-5 backdrop-blur md:p-7"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                separa+ onboarding
              </p>
              <h2 className="font-display mt-2 text-2xl font-bold text-slate-900">
                Empresa
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Complete os campos para iniciar o cadastro da sua empresa e do
                usuario responsável. Todo o processo de separação será
                monitorado a partir dessas informações.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {companyFields.map((field) => {
                return (
                  <label
                    key={field.key}
                    htmlFor={field.key}
                    className="space-y-1"
                  >
                    <span className="text-sm font-semibold text-slate-700">
                      {field.label}
                    </span>
                    <input
                      {...register(`company.${field.key}`)}
                      id={field.key}
                      type="text"
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition ${errors.company?.[field.key] ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"}`}
                    />

                    {errors.company?.[field.key] ? (
                      <span className="text-xs text-rose-600">
                        {errors.company[field.key]?.message}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>

            <div className="h-px bg-slate-200" />

            <div className="grid gap-3 sm:grid-cols-2">
              {userFields.map((field) => {
                const fieldId = `user-${field.key}`;

                return (
                  <label
                    key={field.key}
                    htmlFor={fieldId}
                    className="space-y-1"
                  >
                    <span className="text-sm font-semibold text-slate-700">
                      {field.label}
                    </span>
                    <input
                      id={fieldId}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      {...register(`user.${field.key}`)}
                      placeholder={field.placeholder}
                      aria-invalid={Boolean(errors.user?.[field.key])}
                      aria-describedby={
                        errors.user?.[field.key]
                          ? `${fieldId}-error`
                          : undefined
                      }
                      className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition ${errors.user?.[field.key] ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"}`}
                    />
                    {errors.user?.[field.key] ? (
                      <span
                        id={`${fieldId}-error`}
                        className="text-xs text-rose-600"
                      >
                        {errors.user[field.key]?.message}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>

            {error ? (
              <div className="rounded-md bg-rose-50 p-3">
                <span className="font-bold text-sm text-rose-900">Error:</span>
                <p className="text-sm text-rose-700">
                  {(error as any)?.response?.data ||
                    "Ocorreu um erro ao criar a empresa. Tente novamente."}
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800"
            >
              Criar empresa
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
