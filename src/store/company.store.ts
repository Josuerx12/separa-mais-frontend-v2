import { create } from "zustand";
import { CompanyService } from "../services/company.service";

const getSlugFromHostname = (hostname: string): string => {
  const normalizedHostname = hostname.toLowerCase();

  const hostnameParts = normalizedHostname.split(".");
  const separaMaisIndex = hostnameParts.indexOf("separamais");

  if (separaMaisIndex <= 0) {
    return "";
  }

  const slug = hostnameParts.slice(0, separaMaisIndex).join(".").trim();

  if (!slug || slug === "www") {
    return "";
  }

  return slug;
};

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

    const companySlug = getSlugFromHostname(window.location.hostname);

    console.log(
      "Company slug extracted from hostname:",
      companySlug,
      window.location.hostname,
    );

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
