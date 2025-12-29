import api from "@/utils/axiosConfig";

export const getPayments = (params: any) => {
  return api.get("/api/admin/payments", { params });
};
