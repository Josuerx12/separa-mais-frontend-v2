import z from "zod";

export const requestNewMaterialRequestSchema = z.object({
  collectForecast: z
    .string({
      error:
        "Data de previsão de coleta é obrigatória e deve ser uma data válida",
    })
    .refine(
      (date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
      },
      {
        message: "Data de previsão de coleta deve ser uma data válida",
      },
    ),
  enableNotifications: z.boolean({
    error: "Habilitar/desabilitar notificações é obrigatório.",
  }),
  exitId: z.string({
    error: "ID da saída é obrigatório e deve ser um valor válido.",
  }),
  additionalContact: z
    .string({
      error: "Contato adicional deve ser um valor valido.",
    })
    .min(11, "Contato adicional deve ser um numero valido com ddd.")
    .max(11, "Contato adicional deve ser um numero valido com ddd.")
    .optional(),
  description: z
    .string({
      error: "Descrição deve ser um valor válido.",
    })
    .min(10, "Descrição deve conter no mínimo 10 caracteres.")
    .optional(),
});

export type TRequestNewMaterialRequest = z.infer<
  typeof requestNewMaterialRequestSchema
>;
