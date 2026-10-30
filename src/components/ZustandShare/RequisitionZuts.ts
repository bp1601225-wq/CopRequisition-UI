import { create } from "zustand";
import { toast } from "sonner";
import API, { handleAxiosError } from "../configuration/API";
import type { RequisitionFormData } from "../../GlobalTypes";

type RequisitionStoreTypes = {
Requisitions: any[];

GetRequisitions: (
search?: string,
dateRange?: string,
status?: string[] | string,
thisWeek?: boolean,

) => Promise<void>;

AddRequisition: (
requisition: RequisitionFormData
) => Promise<void>;

UpdateRequisitions: (
requisition: RequisitionFormData
) => Promise<void>;



TonerRequisitions: (
requisition: RequisitionFormData
) => Promise<void>;


IT_Verification: (
requisition: any
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
create<RequisitionStoreTypes>((set, get) => ({
Requisitions: [],

// GET REQUISITIONS
GetRequisitions: async (
  search?: string,
  dateRange?: string,
  status?: string[] | string
) => {
  try {
    const response = await API.get("/requisitions", {
      params: {
        ...(search && { search }),
        ...(dateRange && { dateRange }),
        ...(status && {
          status: Array.isArray(status)
            ? status.join(",")
            : status,
        }),
      },
    });

    set({
      Requisitions: response.data.data,
    });
  } catch (error) {
    handleAxiosError(error);
  }
},
// UPDATE REQUISITION NOTES
UpdateRequisitions: async (
requisition: RequisitionFormData
) => {
try {
const response = await API.put(
"/requisitions-update",
requisition
);

// Get the correct requisition ID from your payload.
const requisitionId =
(requisition as any).RequisitionId ??
(requisition as any).id;

// Get the updated data returned by the backend.
const updatedData = response.data.data;

// Update ONLY the matching requisition.
set((state) => ({
Requisitions: state.Requisitions.map((updated: any) => {
  if (updated.id === requisitionId) {
    return {
      ...updated,
      ...updatedData,

      // Keep the submitted note if the response
      // does not include the updated notes field.
      notes:
        updatedData?.notes ??
        (requisition as any).notes ??
        updated.notes,
    };
  }

  // All other requisitions remain unchanged.
  return updated;
}),
}));

toast.success(
response.data.message ||
  "Requisition updated successfully"
);

return response.data;
} catch (error) {
handleAxiosError(error);
throw error;
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





// CREATE REQUISITION
TonerRequisitions: async (
requisition: RequisitionFormData
) => {
try {
  const response = await API.post(
    "/toner-requisitions",
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



// IT_Verification
IT_Verification: async (data: any) => {
try {
const response = await API.post(
"/it-verification-requisitions",
data
);

set((state) => ({
Requisitions: state.Requisitions.map((items: any) =>
  items.id === data.requisitionId
    ? {
        ...items,
        status: "IT_VERIFIED",
      }
    : items
),
}));

toast.success(
response.data.message ||
  "Requisition verified successfully"
);
} catch (error) {
handleAxiosError(error);
}
},


// APPROVE REQUISITION
ApproveRequisitions: async (requisitionId: string) => {
try {
  const response = await API.post(
    `/requisitions-approval/${requisitionId}`
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

    set((state) => ({
      Requisitions: state.Requisitions.filter(
        (requisition) =>
          requisition.id !== data.RequisitionId
      ),
    }));

    toast.success(
      response.data.message ||
        "Stores operation completed successfully"
    );
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
},
// Audit Certification
AuditVerification: async (data: any) => {
try {
  const response = await API.post(
    "/audit-requisitions",
    data
  );

//  await get().GetRequisitions("STORES_COSTED")

set((state)=>({
  Requisitions: state.Requisitions.filter((requisition)=>(
    requisition.id !== data.RequisitionId
  ))
}))


  toast.success(
    response.data.message ||
      "Audit certification completed successfully"
  );





} catch (error) {
  handleAxiosError(error);
}
},


  // Finance Approval Certification
FinanceApproval: async (data: any) => {
  try {
    const response = await API.post("/finance-approval", data);

    // Remove the approved requisition from the Finance review list
    set((state) => ({
      Requisitions: state.Requisitions.filter(
        (req: any) => req.id !== data.requisitionId
      ),
    }));

    toast.success(
      response.data.message ||
        "Finance certification completed successfully"
    );
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
},


RecordIssuiance: async (id: string) => {
  try {
    const response = await API.post(
      `/issuiance-requisitions/${id}`
    );

    set((state: any) => ({
      Requisitions: state.Requisitions.filter(
        (req: any) => req.id !== id
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