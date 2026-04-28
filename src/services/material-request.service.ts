import type { IMaterialRequest } from "@/interfaces/IMaterialRequest";
import type { IPagination } from "@/interfaces/IPagination";
import { api } from "@/lib/api";
import type { TRequestNewMaterialRequest } from "@/zod/shemas/request-new-material-request.schema";

export const TimelineStatus = {
  REQUESTED: "requested",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  COLLECTED: "collected",
  CANCELLED: "cancelled",
} as const;

export type TimelineStatus =
  (typeof TimelineStatus)[keyof typeof TimelineStatus];

type TGetMaterialRequestsByStatusParams = {
  page?: number;
  perPage?: number;
};

export const MaterialRequestService = {
  getByStatus: async (
    status: TimelineStatus,
    slug: string,
    params: TGetMaterialRequestsByStatusParams = {},
  ) => {
    const response = await api.get<IPagination<IMaterialRequest>>(
      "/material-requests/status",
      {
        params: {
          ...params,
          status,
        },
        headers: {
          "x-company-slug": slug,
        },
      },
    );

    return response.data;
  },
  create: async ({
    slug,
    data,
  }: {
    slug: string;
    data: TRequestNewMaterialRequest;
  }) => {
    await api.post("/material-requests", data, {
      headers: {
        "x-company-slug": slug,
      },
    });
  },
};
