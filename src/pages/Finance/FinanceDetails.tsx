import {
Wallet,
CheckCircle2,
FileText,
} from "lucide-react";
import Button from "@mui/material/Button";

function FinanceRequisitionDetails({
SelectedUser,
FormatDate,
setOpenModal,
setSelectedRequisition,
}: any) {
return (
<div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
{SelectedUser ? (
<>
{/* Requester Header */}
<div className="flex shrink-0 flex-col gap-1.5 border-b border-slate-200 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
<div className="min-w-0">
<h2 className="truncate text-sm font-semibold text-slate-800">
{SelectedUser.firstname}{" "}
{SelectedUser.middlename}{" "}
{SelectedUser.lastname}
</h2>

<p className="mt-0.5 truncate text-[11px] text-slate-500">
{SelectedUser.email} · {SelectedUser.phone}
</p>
</div>

<span className="w-fit shrink-0 rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
{SelectedUser.requisitions.length} requisition(s)
</span>
</div>

{/* Scrollable Requisitions */}
<div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-2">
{SelectedUser.requisitions.map(
(requisition: any) => {
const TotalCost = requisition.items?.reduce(
(sum: number, item: any) =>
  sum + Number(item.totalCost ?? 0),
0
) ?? 0;

return (
<div
  key={requisition.id}
  className="overflow-hidden rounded-md border border-slate-200"
>
  {/* Requisition Header */}
  <div className="flex flex-col gap-1.5 border-b border-slate-200 bg-slate-50 px-2.5 py-2 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <FileText
          size={14}
          className="shrink-0 text-amber-600 "
        />

        <p className="text-xs font-semibold text-amber-800">
          {requisition.requisitionNo}
        </p>
      </div>

      <p className="mt-1 text-[11px] text-slate-500">
        {FormatDate(requisition.date)}
      </p>

      <p className="mt-1 break-words text-xs text-slate-600">
        <span className="font-medium">
          Reason:
        </span>{" "}
        {requisition.reason || "Not provided"}
      </p>
    </div>

    <span className="w-fit shrink-0 rounded border border-amber-100 bg-white px-2 py-0.5 text-[10px] font-medium text-amber-700">
      {requisition.status?.replaceAll("_", " ") ??
        "Unknown"}

        
    </span>
  </div>

  {/* Costing Table */}
  <div className="w-full overflow-x-auto">
    <table className="w-full min-w-[560px] text-left text-xs">
      <thead className="border-b border-slate-200 bg-white text-[10px] uppercase tracking-wide text-slate-500">
        <tr>
          <th className="px-2.5 py-2 font-medium">
            Item
          </th>

          <th className="px-2 py-2 text-right font-medium">
            Requested
          </th>

          <th className="px-2 py-2 text-right font-medium">
            Issued
          </th>

          <th className="px-2 py-2 text-right font-medium">
            Unit Cost
          </th>

          <th className="px-2.5 py-2 text-right font-medium">
            Total Cost
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {requisition.items?.length ? (
          requisition.items.map((item: any) => (
            <tr
              key={item.id}
              className="transition hover:bg-blue-50/40"
            >
              <td className="max-w-[200px] break-words px-2.5 py-2 font-medium text-slate-700">
                {item.description}
              </td>

              <td className="whitespace-nowrap px-2 py-2 text-right text-slate-600">
                {item.quantityRequested ?? "—"}
              </td>

              <td className="whitespace-nowrap px-2 py-2 text-right text-slate-600">
                {item.quantityIssued ?? "—"}
              </td>

              <td className="whitespace-nowrap px-2 py-2 text-right text-slate-600">
                {item.unitCost != null
                  ? Number(item.unitCost).toFixed(2)
                  : "—"}
              </td>

              <td className="whitespace-nowrap px-2.5 py-2 text-right font-semibold text-slate-800">
                {item.totalCost != null
                  ? Number(item.totalCost).toFixed(2)
                  : "—"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={5}
              className="px-2.5 py-4 text-center text-xs text-slate-500"
            >
              No items found.
            </td>
          </tr>
        )}
      </tbody>

      {/* Requisition Total */}
      {requisition.items?.length > 0 && (
        <tfoot>
          <tr className="border-t border-blue-100 bg-blue-50/60">
            <td
              colSpan={4}
              className="px-2.5 py-2 text-right font-semibold text-slate-700"
            >
              Total Requisition Cost
            </td>

            <td className="whitespace-nowrap px-2.5 py-2 text-right font-semibold text-blue-800">
              {TotalCost.toLocaleString("en-GH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  </div>

  {/* Finance Action */}
  <div className="flex items-center justify-between gap-2 border-t border-slate-100 p-2">
    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
      <Wallet size={14} className="text-blue-600" />
      Financial review
    </div>



    <Button
      onClick={() => {
        setSelectedRequisition(requisition);
        setOpenModal(true);
      }}
      variant="contained"
      startIcon={<CheckCircle2 size={14} />}
      sx={{
        textTransform: "none",
        fontSize: 12,
        px: 1.5,
        py: 0.5,
        minWidth: "auto",
        bgcolor: "#1d4ed8",
        boxShadow: "none",
        "&:hover": {
          bgcolor: "#1e40af",
          boxShadow: "none",
        },
      }}
    >
      Review Finance
    </Button>
  </div>
</div>
);
}
)}

{SelectedUser.requisitions.length === 0 && (
<div className="py-6 text-center text-xs text-slate-500">
This requester has no requisitions.
</div>
)}
</div>
</>
) : (
<div className="flex min-h-[250px] flex-col items-center justify-center p-3 text-center">
<Wallet size={28} className="mb-2 text-blue-200" />

<p className="text-sm font-medium text-slate-700">
No requester selected
</p>

<p className="mt-0.5 text-xs text-slate-500">
Select a requester from the left panel.
</p>
</div>
)}
</div>
);
}

export default FinanceRequisitionDetails;