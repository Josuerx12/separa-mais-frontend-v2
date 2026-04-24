import type { IUser } from "@/store/auth.store";
import type { ICompany } from "./ICompany";

export interface IMaterialRequest {
  id: string;
  companyId: string;
  requesterId: string;
  exitId: string;
  additionalContact?: string;
  description?: string;
  collectForecast: Date;
  enableNotifications: boolean;
  timeline: any;
  requester: IUser;
  company: ICompany;
  createdAt: Date;
  updatedAt: Date;
}
