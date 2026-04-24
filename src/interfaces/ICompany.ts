export interface ICompany {
  id: string;
  name: string;
  slug: string;
  cpfCnpj: string;
  createdAt: Date;
  updatedAt: Date;
  trandingName?: string | undefined;
  phone?: string | undefined;
  deletedAt?: Date | null | undefined;
}
