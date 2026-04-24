import z from "zod";

export const AddCompanyUserSchema = z.object({
  email: z.email("E-mail inválido"),
  name: z.string().optional(),
  phone: z.string().optional(),
  isAdmin: z.boolean().default(false),
  isAlmoxarife: z.boolean().default(false),
  isRequester: z.boolean().default(true),
});

export type TAddCompanyUser = z.infer<typeof AddCompanyUserSchema>;
