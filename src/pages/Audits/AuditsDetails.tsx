
import { ClipboardCheck } from "lucide-react";
import Button from "@mui/material/Button";

function AuditRequisitionDetails({
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

<span className="w-fit shrink-0 rounded bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-700">
    {SelectedUser.requisitions.length} requisition(s)
</span>
</div>

{/* Scrollable Requisitions */}
<div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-2">
{SelectedUser.requisitions.map(
    (requisition: any) => (
    <div
        key={requisition.id}
        className="overflow-hidden rounded-md border border-slate-200"
    >
        {/* Requisition Header */}
        <div className="flex flex-col gap-1.5 bg-slate-50 px-2.5 py-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800">
            {requisition.requisitionNo}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
            {FormatDate(requisition.date)}
            </p>

            <p className="mt-0.5 break-words text-xs text-slate-600">
            <span className="font-medium">
                Reason:
            </span>{" "}
            {requisition.reason || "Not provided"}
            </p>
        </div>

        <span className="w-fit shrink-0 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600">
            {requisition.status?.replaceAll("_", " ") ??
            "Unknown"}
        </span>
        </div>

        {/* Requisition Items Table */}
        <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="border-y border-slate-200 bg-white text-[10px] uppercase tracking-wide text-slate-500">
            <tr>
                <th className="px-2.5 py-1.5 font-medium">
                Item
                </th>

                <th className="px-2 py-1.5 text-right font-medium">
                Requested
                </th>

                <th className="px-2 py-1.5 text-right font-medium">
                Issued
                </th>

                <th className="px-2 py-1.5 text-right font-medium">
                Unit Cost
                </th>

                <th className="px-2.5 py-1.5 text-right font-medium">
                Total Cost
                </th>
            </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
            {requisition.items?.length ? (
                requisition.items.map(
                (item: any) => (
                    <tr
                    key={item.id}
                    className="hover:bg-slate-50"
                    >
                    <td className="max-w-[200px] break-words px-2.5 py-1.5 font-medium text-slate-700">
                        {item.description}
                    </td>

                    <td className="whitespace-nowrap px-2 py-1.5 text-right text-slate-600">
                        {item.quantityRequested ?? "—"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-1.5 text-right text-slate-600">
                        {item.quantityIssued ?? "—"}
                    </td>

                    <td className="whitespace-nowrap px-2 py-1.5 text-right text-slate-600">
                        {item.unitCost != null
                        ? Number(item.unitCost).toFixed(2)
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-2.5 py-1.5 text-right font-medium text-slate-700">
                        {item.totalCost != null
                        ? Number(item.totalCost).toFixed(2)
                        : "—"}
                    </td>
                    </tr>
                )
                )
            ) : (
                <tr>
                <td
                    colSpan={5}
                    className="px-2.5 py-3 text-center text-xs text-slate-500"
                >
                    No items found.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>

        {/* Certify Audit Button */}
        <div className="m-2">
        <hr className="m-1 border-emerald-200" />

        <Button
            onClick={() => {
            setSelectedRequisition(requisition);
            setOpenModal(true);
            }}
            variant="contained"
            color="success"
            sx={{
            textTransform: "none",
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            minWidth: "auto",
            boxShadow: "none",
            }}
        >
            Certify Audit
        </Button>
        </div>
    </div>
    )
)}

{/* No Requisitions */}
{SelectedUser.requisitions.length === 0 && (
    <div className="py-6 text-center text-xs text-slate-500">
    This requester has no requisitions.
    </div>
)}
</div>
</>
) : (
/* No Requester Selected */
<div className="flex min-h-[250px] flex-col items-center justify-center p-3 text-center">
<ClipboardCheck
size={28}
className="mb-2 text-slate-300"
/>

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

export default AuditRequisitionDetails;
