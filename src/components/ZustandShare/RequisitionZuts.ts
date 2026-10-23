import { create } from "zustand";
import { toast } from "sonner";
import API, { handleAxiosError } from "../configuration/API";
import type { RequisitionFormData } from "../../GlobalTypes";

type RequisitionStoreTypes = {
  Requisitions: any[];

  GetRequisitions: (
    search?: string,
    thisWeek?: boolean,
    status?: string[] | string
  ) => Promise<void>;

  AddRequisition: (
    requisition: RequisitionFormData
  ) => Promise<void>;

  ApproveRequisitions: (
    requisitionId: string
  ) => Promise<void>;

  StoresOperation: (data: any) => Promise<void>;

  AuditVerification: (data: any) => Promise<void>;

  FinanceApproval: (data: any) => Promise<void>;

  RecordIssuiance: (id: string) => Promise<void>;



};

export const useRequisitionStore =
  create<RequisitionStoreTypes>((set) => ({
    Requisitions: [],

    // GET REQUISITIONS
    GetRequisitions: async (
      search?: string,
      thisWeek?: boolean,
      status?: string[] | string
    ) => {
      try {
        const response = await API.get("/requisitions", {
         params: {
  ...(search && { search }),
  ...(thisWeek && { thisWeek }),
  ...(status && {
    status: Array.isArray(status)
      ? status.join(",")
      : status,
  }),
},
        });






console.log("Status received:", status);
console.log("Is array:", Array.isArray(status));




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

    // APPROVE REQUISITION
    ApproveRequisitions: async (requisitionId: string) => {
      try {
        const response = await API.post(
          `/requisitions/${requisitionId}`
        );

        toast.success(
          response.data.message ||
            "Requisition approved successfully"
        );

        // Refresh requisitions to get the updated status
        const updatedResponse = await API.get("/requisitions");

        set({
          Requisitions: updatedResponse.data.data,
        });


      } catch (error) {
        handleAxiosError(error);
      }
    },

    // STORES OPERATION
    StoresOperation: async (data: any) => {
      try {
        const response = await API.post(
          "/stores-requisitions",
          data
        );

        toast.success(
          response.data.message ||
            "Stores operation completed successfully"
        );

        // Refresh requisitions to get the updated data
        const updatedResponse = await API.get("/requisitions");

        set({
          Requisitions: updatedResponse.data.data,
        });



      } catch (error) {
        handleAxiosError(error);
      }
    },


   
    // Audit Certification
    AuditVerification: async (data: any) => {
      try {
        const response = await API.post(
          "/audit-requisitions",
          data
        );

        toast.success(
          response.data.message ||
            "Audit certification completed successfully"
        );

        // Refresh requisitions to get the updated data
        const updatedResponse = await API.get("/requisitions");

        set({
          Requisitions: updatedResponse.data.data,
        });



      } catch (error) {
        handleAxiosError(error);
      }
    },


        // Finance Approval Certification
    FinanceApproval: async (data: any) => {
      try {
        const response = await API.post(
          "/finance-requisitions",
          data
        );

        toast.success(
          response.data.message ||
            "Audit certification completed successfully"
        );

        // Refresh requisitions to get the updated data
        // const updatedResponse = await API.get("/requisitions");

        // set({
        //   Requisitions: updatedResponse.data.data,
        // });



      } catch (error) {
        handleAxiosError(error);
      }
    },

 RecordIssuiance: async (id: string) => {
  try {
    const response = await API.post(
      `/issuiance-requisitions/${id}`
    );

    set((state: any) => ({
      Requisitions: state.Requisitions.map((req: any) =>
        req.id === id
          ? { ...req, status: "COMPLETED" }
          : req
      ),
    }));

    toast.success(
      response.data.message || "Items issued out successfully"
    );
  } catch (error) {
    handleAxiosError(error);
  }
},
  }));