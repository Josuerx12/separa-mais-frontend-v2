import type { ICompanyUser } from "@/interfaces/ICompanyUser";
import type { IPagination } from "@/interfaces/IPagination";
import { api } from "@/lib/api";
import type { TAddCompanyUser } from "@/zod/shemas/add-company-user.schema";

export const CompanyUserService = {
  getCompanyUsers: async (slug: string, params: any) => {
    const response = await api.get<IPagination<ICompanyUser>>(
      `/company-users`,
      {
        headers: {
          "x-company-slug": slug,
        },
        params,
      },
    );

    return response.data;
  },
  createCompanyUser: async (slug: string, data: TAddCompanyUser) => {
    await api.post(`/company-users`, data, {
      headers: {
        "x-company-slug": slug,
      },
    });
  },
};
