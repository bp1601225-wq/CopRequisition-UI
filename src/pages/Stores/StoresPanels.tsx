
import { Button } from "@mui/material";
import { Mail, Package } from "lucide-react";

function IndependentPanels({
Values,
ActiveEmail,
setSelectedEmail,
SelectedUser,
CostingValues,
setCostingValues
}: any) {





function StoresEntriesCalulcations(
  index: number,
  field: string,
  value: any
) {

const newArray = [...CostingValues];

if (!newArray[index]) {
  newArray[index] = {};
}

newArray[index][field] = value;


  setCostingValues(newArray);

  console.log("New costing values:", newArray)


}



return (
<div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[270px_minmax(0,1fr)]">
{/* LEFT PANEL: REQUESTERS */}
<aside className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white">
<div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
<h2 className="text-sm font-semibold text-slate-800">
Requesters
</h2>

<span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
{Values.length}
</span>
</div>

<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

{/*  [ [],[],[] ] Destructuring*/}

{Values.map(([email, user]: any) => {
const isSelected = ActiveEmail === email;

return (
<button
key={email}
type="button"
onClick={() => setSelectedEmail(email)}
className={`w-full border-b border-slate-100 border-l-[3px] px-4 py-3 text-left transition ${
    isSelected
    ? "border-l-orange-500 bg-orange-50/60"
    : "border-l-transparent hover:bg-slate-50"
}`}
>
<div className="flex items-start gap-3">
    <div
    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        isSelected
        ? "bg-orange-100 text-orange-700"
        : "bg-slate-100 text-slate-600"
    }`}
    >
    {user.firstname?.[0]}
    {user.lastname?.[0]}
    </div>

    <div className="min-w-0 flex-1">
    <p className="truncate text-sm font-medium text-slate-800">
        {user.firstname} {user.lastname}
    </p>

    <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
        <Mail size={12} className="shrink-0" />
        {email}
    </p>

    <p className="mt-2 text-xs text-slate-500">
        {user.items.length} items
    </p>
    </div>
</div>
</button>
);
})}

{Values.length === 0 && (
<p className="p-5 text-center text-sm text-slate-500">
No requisitions available.
</p>
)}
</div>
</aside>

{/* RIGHT PANEL: STORES COSTING */}
<section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white">
{SelectedUser ? (
<>
{/* REQUESTER HEADER */}
<div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
<div className="min-w-0">
<h2 className="text-base font-semibold text-slate-800">
    {SelectedUser.firstname} {SelectedUser.lastname}
</h2>

<p className="mt-1 truncate text-xs text-slate-500">
    {ActiveEmail}
</p>
</div>

<div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
<Package size={15} />
{SelectedUser.items.length} items
</div>
</div>

{/* ITEMS TABLE */}
<div className="min-h-0 flex-1 overflow-auto overscroll-contain">
<table className="w-full min-w-[850px] border-collapse text-sm">
<thead className="sticky top-0 z-10 bg-slate-50">
    <tr className="text-left text-xs text-slate-500">
    <th className="px-4 py-3 font-medium">Item</th>
    <th className="px-3 py-3 font-medium">
        Requisition
    </th>
    <th className="px-3 py-3 font-medium">
        Requested
    </th>
    <th className="px-3 py-3 font-medium">
        Issue Qty
    </th>
    <th className="px-3 py-3 font-medium">
        Unit Cost
    </th>
    <th className="px-4 py-3 font-medium">
        Total Cost
    </th>
    </tr>
</thead>

<tbody>
  {SelectedUser.items.map((item: any, index: number) => {
   
   const itemKey = `${ActiveEmail}-${item.requisitionNo}-${index}`;

    const values = CostingValues[index] ?? {};

    return (
      <tr
        key={itemKey}
        className="border-t border-slate-100 align-middle hover:bg-slate-50/60"
      >
        {/* DESCRIPTION */}
        <td className="max-w-[220px] px-4 py-3">
          <p className="font-medium text-slate-800">
            {item.description}
          </p>
        </td>

        {/* REQUISITION NUMBER */}
        <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
          {item.requisitionNo}
        </td>

        {/* QUANTITY REQUESTED */}
        <td className="px-3 py-3 text-slate-600">
          {item.quantityRequested}
        </td>

        {/* QUANTITY ISSUED */}
        <td className="px-3 py-3">
          <input
            type="number"
            min="0"
            max={item.quantityRequested}
            step="1"
            value={
              values.quantityIssued ??
              item.quantityIssued ??
              ""
            }
        onChange={(e) =>
  StoresEntriesCalulcations(
    index,
    "quantityIssued",
    e.target.value
  )
}
            placeholder="0"
            className="w-20 rounded-md border border-slate-200 px-2 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </td>

        {/* UNIT COST */}
        <td className="px-3 py-3">
          <input
            type="number"
            min="0"
            step="0.01"
            value={
              values.unitCost ??
              item.unitCost ??
              ""
            }
         onChange={(e) =>
  StoresEntriesCalulcations(
    index,
    "unitCost",
    e.target.value
  )
}
            placeholder="0.00"
            className="w-24 rounded-md border border-slate-200 px-2 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </td>

        {/* TOTAL COST: API VALUE ONLY */}
        <td className="whitespace-nowrap px-4 py-3 text-left font-medium tabular-nums text-slate-800">
          {item.totalCost == null
            ? "—"
            : Number(item.totalCost).toLocaleString("en-GH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </td>
      </tr>
    );
  })}

  {/* NO ITEMS */}
  {SelectedUser.items.length === 0 && (
    <tr>
      <td
        colSpan={6}
        className="px-4 py-12 text-center text-sm text-slate-500"
      >
        No items found for this requester.
      </td>
    </tr>
  )}
</tbody>
</table>
</div>

{/* FOOTER */}
<div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-4">
<p className="text-sm text-slate-500">
Stores costing entries
</p>

<Button
onClick={() => {
  const Payload = SelectedUser.items.map(
    (item: any, index: number) => ({
      RequisitionId: item.requisitionId,
      items: [
        {
          id: item.id,
          quantityIssued: Number(
            CostingValues[index]?.quantityIssued ?? 0
          ),
          unitCost: Number(
            CostingValues[index]?.unitCost ?? 0
          ),
        },
      ],
    })
  );

  console.log("Costing Payload:", Payload);
}}
variant="contained"
sx={{
    backgroundColor: "#fd7e02",
    color: "#fff",
    textTransform: "none",
    fontWeight: 600,
    fontSize: 12,
    boxShadow: "none",
    "&:hover": {
    backgroundColor: "#e56f00",
    boxShadow: "none",
    },
}}
>
Save Costing
</Button>
</div>
</>
) : (
<div className="flex min-h-0 flex-1 flex-col items-center justify-center p-8 text-center">
<Package size={28} className="text-slate-300" />

<p className="mt-3 text-sm font-medium text-slate-700">
No requisitions available
</p>

<p className="mt-1 text-xs text-slate-500">
Requesters will appear here when requisitions are loaded.
</p>
</div>
)}
</section>
</div>
);
}

export default IndependentPanels;
