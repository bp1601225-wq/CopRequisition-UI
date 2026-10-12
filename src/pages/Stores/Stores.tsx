
import { useState } from "react";
import { Calculator, Package, Save } from "lucide-react";

type RequisitionItem = {
id: string;
description: string;
quantityRequested: number;
quantityAvailable: number | "";
unitCost: number | "";
};

function StoresCosting() {
// TODO: Replace this mock requisition with data from your API.
const [requisition] = useState({
id: "1",
requisitionNo: "REQ-20261011",
requestedBy: "John Mensah",
department: "Information Technology",
status: "HOD_APPROVED",
items: [
{
id: "1",
description: "A4 Paper",
quantityRequested: 10,
quantityAvailable: 10,
unitCost: 50,
},
{
id: "2",
description: "HP Toner Cartridge",
quantityRequested: 2,
quantityAvailable: 2,
unitCost: 350,
},
{
id: "3",
description: "USB Keyboard",
quantityRequested: 5,
quantityAvailable: 5,
unitCost: 80,
},
],
});

const [items, setItems] = useState<RequisitionItem[]>(
requisition.items
);

// Update the selected field of the selected item.
const updateItem = (
id: string,
field: "quantityAvailable" | "unitCost",
value: string
) => {
    
setItems((currentItems) =>
currentItems.map((item) => {
// If this is not the item we want, leave it unchanged.
if (item.id !== id) {
    return item;
}

// Update the unit cost.
if (field === "unitCost") {
    return {
    ...item,


    // s the value empty, if yes keep empty, if no convert value to that number
    unitCost: value === "" ? "" : Number(value),
    };
}

// Otherwise, update the available quantity.
return {
    ...item,
    quantityAvailable: value === "" ? "" : Number(value),
};
})
);
};

// Calculate the total cost of all items.
const totalCost = items.reduce(
(sum, item) =>
sum +
(Number(item.quantityAvailable) || 0) *
(Number(item.unitCost) || 0),
0
);

// Format amounts as Ghana cedis.
const formatCurrency = (amount: number) =>
new Intl.NumberFormat("en-GH", {
style: "currency",
currency: "GHS",
minimumFractionDigits: 2,
}).format(amount);

const handleSave = () => {
  // Check whether any item has invalid costing information.
  const invalidItems = items.some(
    (item) =>
      item.quantityAvailable === "" ||
      item.unitCost === "" ||
      !Number.isFinite(Number(item.quantityAvailable)) ||
      !Number.isFinite(Number(item.unitCost)) ||
      Number(item.quantityAvailable) < 0 ||
      Number(item.unitCost) < 0 ||
      !Number.isInteger(Number(item.quantityAvailable)) ||
      Number(item.quantityAvailable) > item.quantityRequested
  );

  if (invalidItems) {
    alert(
      "Please enter valid quantities and unit costs. Available quantity must be a whole number and cannot exceed the requested quantity."
    );
    return;
  }

  // Prepare the payload for the backend.
  const payload = {
    requisitionId: requisition.id,
    items: items.map((item) => ({
      id: item.id,
      quantityIssued: Number(item.quantityAvailable),
      unitCost: Number(item.unitCost),
      totalCost:
        Number(item.quantityAvailable) * Number(item.unitCost),
    })),
  };

  // Display the payload in the browser console.
  console.log("Stores Costing Payload:", payload);

  // Display the payload as formatted JSON.
  console.log(
    "JSON Payload:",
    JSON.stringify(payload, null, 2)
  );

  alert("Payload logged successfully. Check your browser console.");
};

return (
<div className="space-y-4 bg-white text-slate-800">
{/* HEADER */}
<div className="flex items-center justify-between border-b border-slate-200 pb-3">
<div className="flex items-center gap-2">
    <div className="rounded-md bg-blue-50 p-2 text-blue-900">
    <Calculator size={18} />
    </div>

    <div>
    <h2 className="text-sm font-semibold text-slate-900">
        Stores Costing
    </h2>
    <p className="text-[11px] text-slate-500">
        Confirm availability and calculate item costs.
    </p>
    </div>
</div>

<span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
    HOD Approved
</span>
</div>

{/* REQUISITION INFORMATION */}
<div className="grid grid-cols-2 gap-3">
<div className="rounded-md border border-slate-200 p-3">
    <p className="text-[10px] text-slate-500">
    Requisition Number
    </p>
    <p className="mt-1 text-xs font-semibold text-slate-900">
    {requisition.requisitionNo}
    </p>
</div>

<div className="rounded-md border border-slate-200 p-3">
    <p className="text-[10px] text-slate-500">Requested By</p>
    <p className="mt-1 text-xs font-medium text-slate-900">
    {requisition.requestedBy}
    </p>
</div>

<div className="col-span-2 rounded-md border border-slate-200 p-3">
    <p className="text-[10px] text-slate-500">Department</p>
    <p className="mt-1 text-xs font-medium text-slate-900">
    {requisition.department}
    </p>
</div>
</div>

{/* ITEM COSTING */}
<div className="overflow-hidden rounded-md border border-slate-200">
<div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
    <Package size={14} className="text-blue-900" />
    <h3 className="text-xs font-semibold text-slate-800">
    Item Costing
    </h3>
</div>

<div className="overflow-x-auto">
    <table className="w-full min-w-[600px] text-left">
    <thead className="border-b border-slate-200 bg-white">
        <tr className="text-[10px] text-slate-500">
        <th className="px-3 py-2 font-medium">Item</th>
        <th className="px-3 py-2 font-medium">
            Qty Requested
        </th>
        <th className="px-3 py-2 font-medium">
            Qty Available
        </th>
        <th className="px-3 py-2 font-medium">
            Unit Cost (GH₵)
        </th>
        <th className="px-3 py-2 text-right font-medium">
            Total (GH₵)
        </th>
        </tr>
    </thead>

    <tbody className="divide-y divide-slate-100">
        {items.map((item) => {
        const lineTotal =
            (Number(item.quantityAvailable) || 0) *
            (Number(item.unitCost) || 0);

        return (
            <tr
            key={item.id}
            className="hover:bg-slate-50/70"
            >
            <td className="px-3 py-3 text-xs font-medium text-slate-800">
                {item.description}
            </td>

            <td className="px-3 py-3 text-xs text-slate-600">
                {item.quantityRequested}
            </td>

            <td className="px-3 py-3">
                <input
                type="number"
                min="0"
                max={item.quantityRequested}
                step="1"
                value={item.quantityAvailable}
                onChange={(e) =>
                    updateItem(
                    item.id,
                    "quantityAvailable",
                    e.target.value
                    )
                }
                className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
            </td>

            <td className="px-3 py-3">
                <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitCost}
                onChange={(e) =>
                    updateItem(
                    item.id,
                    "unitCost",
                    e.target.value
                    )
                }
                className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                />
            </td>

            <td className="px-3 py-3 text-right text-xs font-semibold text-slate-900">
                {formatCurrency(lineTotal)}
            </td>
            </tr>
        );
        })}
    </tbody>
    </table>
</div>
</div>

{/* TOTAL COST */}
<div className="flex items-center justify-between rounded-md border border-amber-200 bg-amber-50/60 p-4">
<div>
    <p className="text-[11px] font-medium text-slate-600">
    Estimated Total Cost
    </p>
    <p className="mt-1 text-lg font-semibold text-slate-900">
    {formatCurrency(totalCost)}
    </p>
</div>

<div className="rounded-md bg-white p-2 text-amber-700">
    <Calculator size={20} />
</div>
</div>

{/* SAVE COSTING */}
<button
type="button"
onClick={handleSave}
className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800"
>
<Save size={15} />
Save Costing &amp; Send to Audit
</button>

<p className="text-[10px] leading-4 text-slate-500">
Check all quantities and unit costs before submitting. Internal
Audit will verify the calculations before Finance approval.
</p>
</div>
);
}

export default StoresCosting;
