import {
  CheckCircle2,
  Clock3,
  FileText,
  Package,
  ClipboardList,
} from "lucide-react";

function RequisitionNoticeStatus({
  requisition,
  completed,
  rejected,
  hodApproved,
  awaitingITVerification,
  itVerified,
}: {
  requisition: any;
  completed: boolean;
  rejected: boolean;
  hodApproved: boolean;
  awaitingITVerification: boolean;
  itVerified: boolean;
}) {
  const notice = completed
    ? {
        title: "Requisition completed",
        message:
          "Items have been issued and the recipient has acknowledged receipt.",
        icon: CheckCircle2,
        style: "bg-emerald-50 text-emerald-800",
      }
    : rejected
      ? {
          title: "Requisition rejected",
          message:
            "This requisition has been rejected. Refer to the relevant review record for details.",
          icon: FileText,
          style: "bg-rose-50 text-rose-800",
        }
      : awaitingITVerification
        ? {
            title: "Awaiting IT verification",
            message:
              "This requisition is waiting for the IT team to verify it before proceeding to the next stage.",
            icon: Clock3,
            style: "bg-indigo-50 text-indigo-800",
          }
        : itVerified
          ? {
              title: "IT verification completed",
              message:
                "IT has verified this requisition. It can proceed to the next stage of the workflow.",
              icon: CheckCircle2,
              style: "bg-teal-50 text-teal-800",
            }
          : requisition.status === "SUBMITTED"
            ? {
                title: "Awaiting HOD approval",
                message:
                  "The Head of Department must approve this requisition before it proceeds to the next stage.",
                icon: Clock3,
                style: "bg-amber-50 text-amber-800",
              }
            : requisition.status === "FINANCE_APPROVED"
              ? {
                  title: "Awaiting Stores issuance",
                  message:
                    "Finance has approved this requisition. Stores must issue the items, and the recipient must acknowledge receipt before completion.",
                  icon: Package,
                  style: "bg-blue-50 text-blue-800",
                }
              : requisition.status === "ISSUED"
                ? {
                    title: "Awaiting recipient acknowledgement",
                    message:
                      "Items have been issued. The recipient must acknowledge receipt before the requisition can be completed.",
                    icon: Clock3,
                    style: "bg-blue-50 text-blue-800",
                  }
                : !hodApproved
                  ? {
                      title: "Awaiting HOD approval",
                      message:
                        "The Head of Department must approve this requisition before it proceeds to the next stage.",
                      icon: Clock3,
                      style: "bg-amber-50 text-amber-800",
                    }
                  : {
                      title: "Requisition in progress",
                      message:
                        "This requisition is being processed through the approval workflow.",
                      icon: ClipboardList,
                      style: "bg-slate-50 text-slate-700",
                    };

  return notice;
}

export default RequisitionNoticeStatus;