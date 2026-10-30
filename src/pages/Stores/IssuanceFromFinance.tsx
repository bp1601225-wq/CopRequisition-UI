
import { Button } from "@mui/material";
import { CheckCircle2, Package, ReceiptText } from "lucide-react";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";
import { useState } from "react";
import { toast } from "sonner";

type FinanceApprovedIssuanceProps = {
  requisition: any;
};

export default function FinanceApprovedIssuance({
  requisition,
}: FinanceApprovedIssuanceProps) {

  const items = requisition.items ?? [];



  const totalCost = items.reduce((total: number, item: any) => {
    return (
      total +
      Number(item.quantityIssued ?? 0) *
        Number(item.unitCost ?? 0)
    );
  }, 0);


  return (
    <div className="mx-3 mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ReceiptText size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-800">
              {requisition.requisitionNo}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Requisition details
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
          <CheckCircle2 size={13} />
          Finance approved
        </span>
      </div>

      {/* Approval Notice */}
      <div className="flex items-start gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <CheckCircle2
          size={16}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <p className="text-xs font-medium text-slate-700">
            Approved for Stores issuance
          </p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            Financial review is complete. The items below are available
            for reference while Stores prepares the issuance.
          </p>
        </div>
      </div>

      {/* Requisition Information */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-b border-slate-100 px-4 py-4 sm:grid-cols-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Requester
          </p>
          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {[
              requisition.createdBy?.firstname,
              requisition.createdBy?.middlename,
              requisition.createdBy?.lastname,
            ]
              .filter(Boolean)
              .join(" ") || "—"}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Request date
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {requisition.date
              ? new Date(requisition.date).toLocaleDateString()
              : "—"}
          </p>
        </div>

        <div className="col-span-2 min-w-0 sm:col-span-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Items requested
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="col-span-2 min-w-0 sm:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Reason for request
          </p>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-slate-700">
            {requisition.reason || "No reason provided"}
          </p>
        </div>
      </div>

      {/* Items Section */}
      <div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-slate-500" />
            <h4 className="text-sm font-semibold text-slate-800">
              Approved items
            </h4>
          </div>

          <span className="text-xs text-slate-500">
            {items.length} records
          </span>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-slate-500">
            This requisition has no items.
          </div>
        ) : (
          <div className="overflow-x-auto border-y border-slate-100">
            <table className="w-full min-w-[600px] border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    Item description
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Requested
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Qty issued
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Unit cost
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Total cost
                  </th>
                </tr>
              </thead>


              <tbody className="divide-y divide-slate-100">
                {items.map((item: any, index: number) => {
                  const quantityIssued = Number(item.quantityIssued ?? 0);
                  const unitCost = Number(item.unitCost ?? 0);
                  const itemTotal = quantityIssued * unitCost;

                  return (
                    <tr
                      key={item.id ?? index}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="max-w-[260px] px-4 py-3">
                        <p className="break-words font-medium text-slate-800">
                          {item.description}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                        {item.quantityRequested}
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                        {item.quantityIssued ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                        {item.unitCost != null
                          ? unitCost.toFixed(2)
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-800">
                        {item.quantityIssued != null &&
                        item.unitCost != null
                          ? itemTotal.toFixed(2)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between gap-4 bg-slate-50 px-4 py-4">
          <div>
            <p className="text-xs font-medium text-slate-600">
              Total requisition cost
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Based on the saved item quantities and unit costs
            </p>
          </div>

          <p className="shrink-0 text-lg font-semibold tabular-nums text-slate-900">
            {totalCost.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
        <p className="text-[11px] text-slate-400">
          Read-only view
        </p>

        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Awaiting physical issuance
        </span>
      </div>
    </div>
  );
}


// Requisitions footer buttons for finance approved

export function ButtonCodes({ selectedRequisitions,
setSelectedRequisition

 }: any) {
const [loading, setLoading] = useState(false);

  const { RecordIssuiance } = useRequisitionStore();


  const isCompleted = selectedRequisitions.status === "COMPLETED"

  return (
    <Button
      type="button"
      variant="contained"
      disabled={loading}

 onClick={async () => {
  if (!selectedRequisitions?.id) {
    toast.error("Please select a requisition");
    return;
  }

  try {
    setLoading(true);

    const currentId = selectedRequisitions.id;
    const currentPhone = selectedRequisitions.createdBy?.phone;

    await RecordIssuiance(currentId);

    // Get the updated list after issuance
    const remaining = useRequisitionStore.getState().Requisitions;

    // Select the next requisition belonging to the same user
    const nextRequisition = remaining.find(
      (req: any) => req.createdBy?.phone === currentPhone
    );

    setSelectedRequisition(nextRequisition ?? null);
  } finally {
    setLoading(false);
  }
}}
      sx={{
        textTransform: "none",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: "#fd7e02",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#e66f00",
          boxShadow: "none",
        },
      }}
    >
       {loading
        ? "Recording..."
        : isCompleted
          ? "Issuance Completed"
          : "Record Issuance"}
    </Button>
  );
}