import { create } from "zustand";
import type { ICompany } from "../interfaces/ICompany";
import { CompanyService } from "../services/company.service";
import { getCompanySlugFromLocation } from "../lib/company-host";

type CompanyStore = {
  companySlug: string;
  company: ICompany | null;
  isCompanySlugLoading: boolean;
  isCompanySlugInvalid: boolean;
  getCompanySlug: () => Promise<void>;
};

export const useCompany = create<CompanyStore>((set) => ({
  companySlug: "",
  company: null,
  isCompanySlugLoading: true,
  isCompanySlugInvalid: false,
  getCompanySlug: async () => {
    set({ isCompanySlugLoading: true, isCompanySlugInvalid: false });

    const companySlug = getCompanySlugFromLocation(window.location);

    if (!companySlug) {
      set({
        companySlug: "",
        company: null,
        isCompanySlugLoading: false,
        isCompanySlugInvalid: false,
      });
      return;
    }

    try {
      const company = await CompanyService.getCompanyBySlug(companySlug);
      set({
        companySlug,
        company,
        isCompanySlugLoading: false,
        isCompanySlugInvalid: false,
      });
    } catch {
      set({
        companySlug,
        company: null,
        isCompanySlugLoading: false,
        isCompanySlugInvalid: true,
      });
    }
  },
}));
