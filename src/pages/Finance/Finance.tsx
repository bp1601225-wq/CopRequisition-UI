import { useEffect, useMemo, useState } from "react";
import {
Wallet,
Search,
ChevronRight,
Loader2,
CheckCircle2,
} from "lucide-react";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";
import { Button } from "@mui/material";
import ModalOpen from "../../components/Modal/Modal";
import FinanceRequisitionDetails from "./FinanceDetails";

function Finance() {
const [loading, setLoading] = useState(false);
const [SelectedPhone, setSelectedPhone] = useState("");
const [openModal, setOpenModal] = useState(false);
const [selectedRequisition, setSelectedRequisition] = useState<any>();
const [comment, setComment] = useState("");
const [search, setSearch] = useState("");

const {
GetRequisitions,
Requisitions,
FinanceApproval,
} = useRequisitionStore();





const LoadAllRequisitions = async () => {
try {
setLoading(true);

// Finance reviews requisitions certified by Internal Audit.
await GetRequisitions(undefined, undefined, "AUDIT_CERTIFIED");
} catch (error) {
console.error("Failed to load requisitions:", error);
} finally {
setLoading(false);
}
};

useEffect(() => {
LoadAllRequisitions();
}, []);

// Group requisitions by requester phone.
const GroupedRequisitions = useMemo(() => {
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

acc[phone].requisitions.push(curr);

return acc;
}, {});
}, [Requisitions]);

const Values = Object.entries(GroupedRequisitions) as [
string,
any,
][];

const FilteredValues = Values.filter(([phone, user]) => {
const name =
`${user.firstname} ${user.middlename} ${user.lastname}`;

return `${name} ${user.email} ${phone}`
.toLowerCase()
.includes(search.toLowerCase());
});

useEffect(() => {
if (
Values.length > 0 &&
!GroupedRequisitions[SelectedPhone]
) {
setSelectedPhone(Values[0][0]);
}

if (Values.length === 0) {
setSelectedPhone("");
}
}, [Requisitions]);

const SelectedUser = GroupedRequisitions[SelectedPhone];

const FormatDate = (date: string) =>
new Date(date).toLocaleDateString("en-GB", {
day: "2-digit",
month: "short",
year: "numeric",
});

if (loading) {
return (
<div className="flex min-h-[50vh] items-center justify-center">
<Loader2
size={25}
className="animate-spin text-blue-600"
/>
</div>
);
}

return (
<div className="space-y-3 p-2">
{/* Page header */}
<div className="flex items-center justify-between gap-2">
<div>
<div className="flex items-center gap-1.5">
<Wallet size={19} className="text-blue-600" />

<h1 className="text-lg font-semibold text-slate-800">
Finance Review
</h1>
</div>

<p className="mt-0.5 text-xs text-slate-500">
Review audited costing and approve requisitions for
Stores issuance.
</p>
</div>

<div className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1.5">
<p className="text-[11px] text-blue-700">
Pending review
</p>

<p className="text-base font-semibold text-blue-900">
{Requisitions.length}
</p>
</div>
</div>

{/* Two-panel layout */}
<div className="grid h-[520px] min-h-0 grid-cols-1 gap-2 lg:grid-cols-[250px_minmax(0,1fr)]">
{/* Left panel */}
<div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
<div className="shrink-0 border-b border-slate-200 p-2.5">
<h2 className="text-sm font-semibold text-slate-800">
Requesters
</h2>

<p className="mt-0.5 text-[11px] text-slate-500">
Select a requester to review their requisitions.
</p>

<div className="relative mt-2">
<Search
size={14}
className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
/>

<input
type="text"
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search requester..."
className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-2 text-xs outline-none focus:border-blue-500"
/>
</div>
</div>

<div className="min-h-0 flex-1 overflow-y-auto">
{FilteredValues.map(([phone, user]) => {
const IsSelected = SelectedPhone === phone;

const FullName =
`${user.firstname} ${user.middlename} ${user.lastname}`
    .replace(/\s+/g, " ")
    .trim();

return (
<button
    key={phone}
    type="button"
    onClick={() => setSelectedPhone(phone)}
    className={`flex w-full items-center justify-between gap-2 border-b border-slate-100 border-l-[3px] px-2.5 py-2 text-left transition ${
    IsSelected
        ? "border-l-blue-600 bg-blue-50"
        : "border-l-transparent hover:bg-slate-50"
    }`}
>
    <div className="min-w-0">
    <p className="truncate text-xs font-medium text-slate-800">
        {FullName || "Unknown requester"}
    </p>

    <p className="mt-0.5 truncate text-[11px] text-slate-500">
        {user.email}
    </p>

    <p className="mt-0.5 text-[11px] text-slate-500">
        {user.requisitions.length} requisition(s)
    </p>
    </div>

    <ChevronRight
    size={15}
    className={`shrink-0 ${
        IsSelected
        ? "text-blue-600"
        : "text-slate-400"
    }`}
    />
</button>
);
})}

{FilteredValues.length === 0 && (
<p className="px-2 py-5 text-center text-xs text-slate-500">
No requesters found.
</p>
)}
</div>
</div>

{/* Right panel */}
<FinanceRequisitionDetails
SelectedUser={SelectedUser}
FormatDate={FormatDate}
setOpenModal={setOpenModal}
setSelectedRequisition={setSelectedRequisition}
/>
</div>

{/* Finance Approval Modal */}
<ModalOpen
isOpen={openModal}
onClose={() => setOpenModal(false)}
title="Finance Approval"
>
<div className="space-y-4 p-3">
<div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
<div className="rounded-md bg-white p-2 text-blue-600">
<Wallet size={20} />
</div>

<div>
<h3 className="text-sm font-semibold text-slate-800">
Financial Review
</h3>

<p className="mt-1 text-xs text-slate-500">
Confirm the audited quantities, unit costs and
total amounts before approving expenditure.
</p>
</div>
</div>

<div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-3">
<div>
<p className="text-xs text-slate-500">
Requisition Number
</p>

<p className="mt-1 text-sm font-semibold text-slate-800">
{selectedRequisition?.requisitionNo ?? "N/A"}
</p>
</div>

<div>
<p className="text-xs text-slate-500">
Current Status
</p>

<p className="mt-1 text-sm font-medium text-slate-700">
{selectedRequisition?.status?.replaceAll("_", " ") ?? "N/A"}
</p>
</div>

<div className="col-span-2">
<p className="text-xs text-slate-500">
Reason for Request
</p>

<p className="mt-1 text-sm text-slate-700">
{selectedRequisition?.reason || "No reason provided"}
</p>
</div>
<div className="col-span-2 border-t border-slate-100 pt-2">
<p className="text-xs text-slate-500">
Total Requisition Cost
</p>

<p className="mt-1 text-lg font-semibold text-blue-800">
{selectedRequisition?.items?.reduce(
    (sum: number, item: any) =>
    sum + Number(item.totalCost ?? 0),
    0
).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}) ?? "0.00"}
</p>
</div>
</div>

<div>
<label
htmlFor="financeComment"
className="mb-1.5 block text-sm font-medium text-slate-700"
>
Finance Comments
</label>

<textarea
id="financeComment"
value={comment}
onChange={(e) => setComment(e.target.value)}
rows={3}
placeholder="Enter financial observations or approval remarks..."
className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
/>

<p className="mt-1 text-xs text-slate-500">
Record any relevant financial observations before
making your decision.
</p>
</div>

<div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
<Button
variant="outlined"
onClick={() => setOpenModal(false)}
sx={{
textTransform: "none",
fontSize: 12,
px: 2,
py: 0.75,
borderColor: "#cbd5e1",
color: "#475569",
boxShadow: "none",
}}
>
Cancel
</Button>

<Button
variant="contained"
disabled={loading || !selectedRequisition?.id}
onClick={async () => {
if (!selectedRequisition?.id) return;

try {
    setLoading(true);

  await FinanceApproval({
    requisitionId: selectedRequisition.id,
    comment: comment,
  });

    // console.log({
    // requisitionId: selectedRequisition.id,
    // comment: comment,
    // })

    setOpenModal(false);
    setComment("");

//   await LoadAllRequisitions();
} catch (error) {
    console.error(
    "Finance approval failed:",
    error
    );
} finally {
    setLoading(false);
}
}}
startIcon={<CheckCircle2 size={15} />}
sx={{
textTransform: "none",
fontSize: 12,
px: 2,
py: 0.75,
bgcolor: "#1d4ed8",
boxShadow: "none",
"&:hover": { bgcolor: "#1e40af", boxShadow: "none" },
}}
>
Approve Finance
</Button>
</div>
</div>
</ModalOpen>
</div>
);
}

export default Finance;