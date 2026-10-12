export interface DeliverablesType {
    id?:string
    title:string,
    verificationMethod?:string
    dueDate?:string
}

export interface SubmissionForm {
  userId:string
  deliverables: DeliverablesType[];
  supportNeeded?: string;
}

export interface UnitType {
  id?: string;
  name: string;
  description?: string;

}

export interface PositionType {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData  {
  id?:string
  firstname: string;
  middlename?: string;
  lastname: string;
  phone: string;
  email:string
  // positionId: string;
  // unitId: string;
  role: "STAFF"|"HOD"|"STORES"|"AUDIT"|"FINANCE"|"ADMIN";
  password: string;
  confirmPassword?: string;
};


export interface  RequisitionItemForm  {
description: string;
quantityRequested: number;
};


export interface RequisitionFormData {
reason: string;
items: RequisitionItemForm[];
};

