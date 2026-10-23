
import { useEffect, useMemo, useState } from "react";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";
import { ClipboardCheck, ClipboardList, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@mui/material";
import FinanceApprovedIssuance, { ButtonCodes } from "./IssuanceFromFinance";

function StoresCosting() {

type isAllowedStatus = "HOD_APPROVED" | "FINANCE_APPROVED"|"AUDIT_CERTIFIED"




const { Requisitions, GetRequisitions } = useRequisitionStore();

const [selectedUser, setSelectedUser] = useState<any>(null);
const [selectedRequisition, setSelectedRequisition] = useState<any>(null);
const [storesCost, setStoresCost] = useState<any[]>([]);

const [loading, setLoading] = useState<boolean>(false)


const allowed: isAllowedStatus[] = [
  "HOD_APPROVED",
  "FINANCE_APPROVED",
  // "AUDIT_CERTIFIED",
];

useEffect(() => {

GetRequisitions(undefined, undefined, allowed);
}, [GetRequisitions]);


const {StoresOperation} = useRequisitionStore()

// Group requesters, but keep their requisitions separate
const groupedRequisitions = useMemo(() => {
return Requisitions.reduce((acc: any, curr: any) => {
const phone = curr.createdBy?.phone;

if (!phone) return acc;

if (!acc[phone]) {
acc[phone] = {
firstname: curr.createdBy.firstname ?? "",
lastname: curr.createdBy.lastname ?? "",
middlename: curr.createdBy.middlename ?? "",
email: curr.createdBy.email ?? "",
phone,
requisitions: [],
};
}

// Keep the complete requisition, including its own ID and items
acc[phone].requisitions.push(curr);

return acc;
}, {});
}, [Requisitions]);

const Values = Object.entries(groupedRequisitions);



// console.log(`All rreq is`, Requisitions)




// Handle input changes
function HandleStoresCalculation(
id: string,
field: string,
value: string,
quantityRequested: number
) {


setStoresCost((previous: any[]) => {

const existingItem = previous.find((item: any) => item.id === id);

if (existingItem) {
return previous.map((item: any) =>
item.id === id
? { ...item, [field]: value }
: item
);
}

return [
...previous,
{ id, quantityRequested, [field]: value },
];
});
}

// Validate the items in the selected requisition only
function Proceed() {
if (!selectedRequisition) {
toast.warning("Please select a requisition");
return;
}

if (selectedRequisition.items.length === 0) {
toast.warning("This requisition has no items");
return;
}

const HasEveryValue = selectedRequisition.items.every((item: any) => {
const costItem = storesCost.find(
(cost: any) => cost.id === item.id
);

if (!costItem) return false;

const quantityIssued = Number(costItem.quantityIssued);
const unitCost = Number(costItem.unitCost);

return (
costItem.quantityIssued !== undefined &&

costItem.quantityIssued !== "" &&

Number.isInteger(quantityIssued) &&

quantityIssued >= 0 &&

quantityIssued <= item.quantityRequested &&

costItem.unitCost !== undefined &&

costItem.unitCost !== "" &&

Number.isFinite(unitCost) &&

unitCost >= 0
);
});

if (!HasEveryValue) {
toast.warning("Please complete the costing for every item");
return;
}

SendPayload();
}

// Prepare costing for the selected requisition only
function SendPayload() {
if (!selectedRequisition) return;

try {
setLoading(true)


const Payload = {
RequisitionId: selectedRequisition.id,

items: selectedRequisition.items.map((item: any) => {
const costItem = storesCost.find(
(cost: any) => cost.id === item.id
);

const quantityIssued = Number(costItem.quantityIssued);
const unitCost = Number(costItem.unitCost);

return {
id: item.id,
quantityRequested: item.quantityRequested,
quantityIssued,
unitCost,
totalCost: quantityIssued * unitCost,
};
}),
};


console.log("Data ready for backend:", Payload);
StoresOperation(Payload)

} catch (error) {
// store handles errors

} finally {
setLoading(false)
}

}

// Calculate estimated total for the selected requisition
const estimatedTotal = selectedRequisition
? selectedRequisition.items.reduce((total: number, item: any) => {
const costItem = storesCost.find(
(cost: any) => cost.id === item.id
);

return (
total +
Number(costItem?.quantityIssued || 0) *
Number(costItem?.unitCost || 0)
);
}, 0)
: 0;

return (
<div className="flex h-full min-h-0 flex-col overflow-hidden text-sm text-gray-800">
<div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[250px_minmax(0,1fr)]">

{/* LEFT PANEL */}
<aside className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
<div className="shrink-0 border-b border-gray-200 px-3 py-3">
<div className="flex items-center justify-between">
<div>


<div className="space-y-2 flex items-end gap-2">
    <Search size={16} className="text-gray-400" />

  <input
    type="text"
    placeholder="Search by name or phone..."
    className="text-xs w-full rounded-md border border-emerald-700 px-2 py-1 text-sm outline-none focus:border-emerald-900"
  />
</div>




</div>

<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
{Values.length}
</span>
</div>
</div>

<div className="shrink-0 border-b border-gray-100 px-3 py-2">
<p className="text-xs text-gray-500">
Select a requisition under a requester
</p>
</div>

<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
{Values.map(([phone, requester]: [string, any]) => (
<div key={phone} className="border-b border-gray-100">

{/* Requester heading */}
<button
type="button"
onClick={() => {
setSelectedUser(requester);
setSelectedRequisition(null);
}}
className={`w-full border-l-2 px-3 py-3 text-left hover:bg-orange-50/60 ${
selectedUser?.phone === phone
? "border-l-orange-500 bg-orange-50"
: "border-l-transparent"
}`}
>
<p className="truncate font-medium text-gray-800">
{requester.firstname} {requester.lastname}
</p>

<p className="mt-0.5 truncate text-xs text-gray-500">
{requester.email || phone}
</p>

<div className="mt-2 flex items-center justify-between gap-2">
<span className="text-xs text-gray-500">
{requester.requisitions.length} requisitions
</span>

<span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
{phone}
</span>
</div>
</button>

{/* Individual requisitions */}

{selectedUser?.phone === phone && (
<div className="h-35 border-t border-slate-200 bg-slate-50/70 p-2">
<div className="mb-2 px-2">
<p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
Requisitions
</p>
</div>

<div className="space-y-1.5">
{requester.requisitions.map((req: any) => (
<button
key={req.id}
type="button"
onClick={() => setSelectedRequisition(req)}
className={`group w-full rounded-md border px-3 py-2.5 text-left transition-colors ${
selectedRequisition?.id === req.id
  ? "border-blue-200 bg-white shadow-sm ring-1 ring-blue-100"
  : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white"
}`}
>
<div className="flex items-center justify-between gap-3">
<div className="flex min-w-0 items-center gap-2">
  <div
    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${
      selectedRequisition?.id === req.id
        ? "bg-blue-50 text-blue-700"
        : "bg-white text-slate-500 group-hover:bg-slate-100"
    }`}
  >
    <ClipboardCheck size={15} />
  </div>

  <div className="min-w-0">
    <p
      className={`truncate text-xs font-semibold ${
        selectedRequisition?.id === req.id
          ? "text-blue-800"
          : "text-slate-700"
      }`}
    >
      {req.requisitionNo}
    </p>

    <p className="mt-0.5 text-[11px] text-slate-500">
      {req.items?.length ?? 0}{" "}
      {(req.items?.length ?? 0) === 1 ? "item" : "items"}
    </p>
  </div>
</div>

<div className="flex shrink-0 items-center gap-2">
  <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
    {req.status?.replaceAll("_", " ") ?? "Unknown"}
  </span>

  {selectedRequisition?.id === req.id && (
    <span className="h-2 w-2 rounded-full bg-blue-600" />
  )}
</div>
</div>
</button>
))}
</div>
</div>
)}

</div>
))}

{Values.length === 0 && (
<p className="px-3 py-6 text-center text-xs text-gray-500">
No requisitions found.
</p>
)}
</div>

<div className="shrink-0 border-t border-gray-200 bg-gray-50 px-3 py-2">
<p className="text-xs text-gray-500">
{Values.length} unique requesters
</p>
</div>
</aside>

{/* RIGHT PANEL */}
<section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">

{/* HEADER */}
<div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
<div className="min-w-0">
<h2 className="font-semibold">Stores Costing</h2>

{selectedRequisition && (
<span className="mt-2 inline-block rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
{selectedRequisition.status}
</span>
)}

<p className="mt-1 truncate text-xs text-gray-500">
{selectedRequisition
? `${selectedUser.firstname} ${selectedUser.lastname} · ${selectedRequisition.requisitionNo}`
: "Select a requisition from the left panel"}
</p>
</div>
</div>

{/* SUMMARY */}
<div className="grid shrink-0 grid-cols-2 gap-2 border-b border-gray-100 bg-gray-50/60 px-3 py-3 sm:grid-cols-3">
<div className="rounded-md bg-white px-3 py-2">
<p className="text-xs text-gray-500">Total items</p>

<p className="mt-1 flex items-center gap-3 text-base font-semibold">
<ClipboardList size={18} />
{selectedRequisition?.items.length ?? 0}
</p>
</div>


{/* <div className="col-span-2 rounded-md bg-white px-3 py-2 sm:col-span-1">
<p className="text-xs text-gray-500">Estimated total</p>

<p className="mt-1 text-base font-semibold text-orange-600">
GH₵ {estimatedTotal.toFixed(2)}
</p>
</div>
 */}







</div>

{/* CONTENT */}
<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
<div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
<div>
<h3 className="font-medium">Requisition items</h3>
<p className="mt-0.5 text-xs text-gray-500">
Review quantities and enter costing details
</p>
</div>
</div>




{!selectedRequisition ? (
  <div className="mx-4 mb-4 flex min-h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 px-4 text-center">
    <p className="text-sm font-medium text-gray-600">
      No requisition selected
    </p>

    <p className="mt-1 text-xs text-gray-500">
      Select a requisition under a requester to view its items.
    </p>
  </div>
) : selectedRequisition.items.length === 0 ? (
  <div className="px-4 py-10 text-center text-xs text-gray-500">
    This requisition has no items.
  </div>
) : selectedRequisition.status === "FINANCE_APPROVED" ? (
  /* Finance Approval Issuance */
  <FinanceApprovedIssuance
    requisition={selectedRequisition}
  />
) : (
  /* Costing Table */
  <div className="h-[400px] overflow-auto border-y border-gray-200">
    <table className="w-full min-w-[720px] border-collapse text-left text-xs">
      <thead className="sticky top-0 z-10 bg-gray-50 text-gray-600">
        <tr>
          <th className="px-3 py-2.5 font-medium">
            Item description
          </th>

          <th className="px-3 py-2.5 text-right font-medium">
            Qty requested
          </th>

          <th className="w-28 px-3 py-2.5 font-medium">
            Qty issued
          </th>

          <th className="w-32 px-3 py-2.5 font-medium">
            Unit cost
          </th>

          <th className="w-32 px-3 py-2.5 text-right font-medium">
            Total cost
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {selectedRequisition.items.map(
          (item: any, index: number) => {
            const costItem = storesCost.find(
              (cost: any) => cost.id === item.id
            );

            const quantityIssued = Number(
              costItem?.quantityIssued || 0
            );

            const unitCost = Number(
              costItem?.unitCost || 0
            );

            const totalCost = quantityIssued * unitCost;

            return (
              <tr
                key={item.id ?? index}
                className="hover:bg-gray-50/70"
              >
                <td className="px-3 py-3">
                  <p className="font-medium text-gray-800">
                    {item.description}
                  </p>
                </td>

                <td className="px-3 py-3 text-right tabular-nums">
                  {item.quantityRequested}
                </td>

                <td className="px-3 py-3">
                  <input
                    type="number"
                    min="0"
                    max={item.quantityRequested}
                    step="1"
                    placeholder="0"
                    value={costItem?.quantityIssued ?? ""}
                    onChange={(e) =>
                      HandleStoresCalculation(
                        item.id,
                        "quantityIssued",
                        e.target.value,
                        item.quantityRequested
                      )
                    }
                    className="w-full rounded border border-gray-200 px-2 py-1.5 outline-none focus:border-orange-400"
                  />
                </td>

                <td className="px-3 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={costItem?.unitCost ?? ""}
                    onChange={(e) =>
                      HandleStoresCalculation(
                        item.id,
                        "unitCost",
                        e.target.value,
                        item.quantityRequested
                      )
                    }
                    className="w-full rounded border border-gray-200 px-2 py-1.5 outline-none focus:border-orange-400"
                  />
                </td>

                <td className="px-3 py-3 text-right font-medium tabular-nums">
                  {totalCost.toFixed(2)}
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  </div>
)}




</div>

{/* FOOTER */}
<div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-3">
<p className="text-xs text-gray-500">
{selectedRequisition
? `${selectedRequisition.items.length} items in this requisition`
: "Select a requisition to begin"}
</p>

{selectedRequisition?.status === "FINANCE_APPROVED" ? 

<>

<ButtonCodes 
selectedRequisitions = {selectedRequisition}
/>
</>


:


<>

<div className="flex items-center gap-2">
<Button
type="button"
variant="outlined"
sx={{
textTransform: "none",
fontSize: "12px",
}}
onClick={() => toast.info("Save draft is not connected yet")}
>
Save draft
</Button>

<Button
onClick={Proceed}
color="success"
variant="outlined"
sx={{
textTransform: "none",
fontSize: "12px",
}}
>
{loading ? "operating ..." : " continue"}
</Button>

</div>

</>

}





</div>


</section>
</div>
</div>
);
}

export default StoresCosting;
