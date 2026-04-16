import { create } from "zustand";
import { CompanyService } from "../services/company.service";
import { getCompanySlugFromLocation } from "../libs/company-host";

type CompanyStore = {
  companySlug: string;
  isCompanySlugLoading: boolean;
  isCompanySlugInvalid: boolean;
  getCompanySlug: () => Promise<void>;
};

export const useCompany = create<CompanyStore>((set) => ({
  companySlug: "",
  isCompanySlugLoading: true,
  isCompanySlugInvalid: false,
  getCompanySlug: async () => {
    set({ isCompanySlugLoading: true, isCompanySlugInvalid: false });

    const companySlug = getCompanySlugFromLocation(window.location);

    if (!companySlug) {
      set({
        companySlug: "",
        isCompanySlugLoading: false,
        isCompanySlugInvalid: false,
      });
      return;
    }

    try {
      await CompanyService.getCompanyBySlug(companySlug);
      set({
        companySlug,
        isCompanySlugLoading: false,
        isCompanySlugInvalid: false,
      });
    } catch {
      set({
        companySlug,
        isCompanySlugLoading: false,
        isCompanySlugInvalid: true,
      });
    }
  },
}));
