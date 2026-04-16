import { api } from "../libs/api";
import type { SignupFormValues } from "../routes/cadastro";

export const CompanyService = {
  create: async (data: SignupFormValues): Promise<void> => {
    await api.post("/companies", data);
  },
  getCompanyBySlug: async (slug: string) => {
    const response = await api.get(`/companies/get`, {
      headers: {
        "x-company-slug": slug,
      },
    });

    return response.data;
  },
};
