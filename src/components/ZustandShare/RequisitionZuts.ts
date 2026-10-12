import { create } from "zustand";
import { toast } from "sonner";
import API, { handleAxiosError } from "../configuration/API";
import type { RequisitionFormData } from "../../GlobalTypes";

type RequisitionStoreTypes = {
  Requisitions: any[];

  GetRequisitions: (
    search?: string,
    thisWeek?: boolean
  ) => Promise<void>;

  AddRequisition: (
    requisition: RequisitionFormData
  ) => Promise<void>;
};

export const useRequisitionStore =
  create<RequisitionStoreTypes>((set) => ({
    Requisitions: [],

    // GET REQUISITIONS
    GetRequisitions: async (
      search?: string,
      thisWeek?: boolean
    ) => {
      try {
        const response = await API.get(
          "/requisitions",
          {
            params: {
              ...(search && { search }),
              ...(thisWeek && { thisWeek }),
            },
          }
        );

        set({
          Requisitions: response.data.data,
        });
      } catch (error) {
        handleAxiosError(error);
      }
    },

    // CREATE REQUISITION
    AddRequisition: async (
      requisition: RequisitionFormData
    ) => {
      try {
        const response = await API.post(
          "/requisitions",
          requisition
        );

        set((state) => ({
          Requisitions: [
            ...state.Requisitions,
            response.data.data,
          ],
        }));

        toast.success(
          response.data.message ||
            "Requisition created successfully"
        );
      } catch (error) {
        handleAxiosError(error);
      }
    },
  }));
