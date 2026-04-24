export interface ICompanyUser {
  id: string;
  companyId: string;
  company: {
    id: string;
    name: string;
    slug: string;
    cpfCnpj: string;
    createdAt: string;
    updatedAt: string;
    trandingName?: string | undefined;
    phone?: string | undefined;
    deletedAt?: string | undefined;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  };
  permissions: [
    {
      id: string;
      isOwner: boolean;
      isAdmin: boolean;
      isAlmoxarife: boolean;
      isRequester: boolean;
    },
  ];
  createdAt: string;
  updatedAt: string;
  userId?: string | undefined;
  deletedAt?: string | undefined;
}
