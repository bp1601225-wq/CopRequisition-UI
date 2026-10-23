
import { useEffect, useMemo, useState } from "react";
import {
ClipboardCheck,
Search,
ChevronRight,
Loader2,
} from "lucide-react";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";
import { Button } from "@mui/material";
import ModalOpen from "../../components/Modal/Modal";
import AuditRequisitionDetails from "./AuditsDetails";

function AuditComponent() {
const [loading, setLoading] = useState<boolean>(false);
const [SelectedPhone, setSelectedPhone] = useState<string>("");

const [openModal, setOpenModal] = useState<boolean>(false)

const [selectedRequisition, setSelectedRequisition] = useState<any>()

const [comments, setComment] = useState<string>("")

const { GetRequisitions, Requisitions, AuditVerification } = useRequisitionStore();


const LoadAllRequisitions = async () => {
try {
setLoading(true);
await GetRequisitions(undefined, undefined, "STORES_COSTED");
} catch (error) {
// Store handles the error
} finally {
setLoading(false);
}
};

useEffect(() => {
LoadAllRequisitions();
}, []);



useEffect(()=>{
console.log(`selected req is`, selectedRequisition)
},[selectedRequisition])


// Group requisitions by requester phone
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

const Values = Object.entries(GroupedRequisitions) as [string, any][];

// Select the first requester when data loads
useEffect(() => {
if (Values.length > 0 && !GroupedRequisitions[SelectedPhone]) {
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
<Loader2 size={25} className="animate-spin text-orange-500" />
</div>
);
}

return (
<div className="space-y-3 p-2">
{/* Page header */}
<div className="flex items-center justify-between gap-2">
<div>
<div className="flex items-center gap-1.5">
<ClipboardCheck size={19} className="text-orange-500" />
<h1 className="text-lg font-semibold text-slate-800">
Internal Audit
</h1>
</div>

<p className="mt-0.5 text-xs text-slate-500">
Review requisitions and verify Stores costing.
</p>
</div>

<div className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
<p className="text-[11px] text-slate-500">Total requests</p>
<p className="text-base font-semibold text-slate-800">
{Requisitions.length}
</p>
</div>
</div>

{/* Two-panel layout */}
<div className="grid h-[520px] min-h-0 grid-cols-1 gap-2 lg:grid-cols-[250px_minmax(0,1fr)]">
{/* Left panel: Requesters */}
<div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
<div className="shrink-0 border-b border-slate-200 p-2.5">
<h2 className="text-sm font-semibold text-slate-800">
Requesters
</h2>

<p className="mt-0.5 text-[11px] text-slate-500">
Select a requester to view requisitions.
</p>

{/* Search UI only: no filtering logic */}
<div className="relative mt-2">
<Search
size={14}
className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
/>

<input
type="text"
placeholder="Search requester..."
className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-2 text-xs outline-none focus:border-orange-400"
/>
</div>
</div>

<div className="min-h-0 flex-1 overflow-y-auto">
{Values.map(([phone, user]) => {
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
? "border-l-orange-500 bg-orange-50"
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
IsSelected ? "text-orange-500" : "text-slate-400"
}`}
/>
</button>
);
})}

{Values.length === 0 && (
<p className="px-2 py-5 text-center text-xs text-slate-500">
No requesters found.
</p>
)}
</div>
</div>



<AuditRequisitionDetails
  SelectedUser={SelectedUser}
  FormatDate={FormatDate}
  setOpenModal={setOpenModal}
  setSelectedRequisition={setSelectedRequisition}
/>

</div>


<ModalOpen
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
  title="Audit Certification"
>
  <div className="space-y-4 p-3">
    {/* Header */}
    <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
      <div className="rounded-md bg-white p-2 text-blue-600">
        <ClipboardCheck size={20} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">
          Review Requisition
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Verify the costing details before certifying this requisition.
        </p>
      </div>
    </div>

    {/* Requisition details */}
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-3">
      <div>
        <p className="text-xs text-slate-500">Requisition Number</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {selectedRequisition?.requisitionNo ?? "N/A"}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">Current Status</p>
        <p className="mt-1 text-sm font-medium text-slate-700">
          {selectedRequisition?.status ?? "N/A"}
        </p>
      </div>

      <div className="col-span-2">
        <p className="text-xs text-slate-500">Reason for Request</p>
        <p className="mt-1 text-sm text-slate-700">
          {selectedRequisition?.reason || "No reason provided"}
        </p>
      </div>
    </div>

    {/* Audit comments */}
    <div>
      <label
        htmlFor="auditComment"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Audit Comments
      </label>

      <textarea
        id="auditComment"
        onChange={(e)=>setComment(e.target.value)}
        rows={3}
        placeholder="Enter your audit observations..."
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <p className="mt-1 text-xs text-slate-500">
        Confirm that the quantities and costing details have been verified.
      </p>
    </div>

  {/* Footer actions */}
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
  color="primary"
  disabled={loading || !selectedRequisition?.id}
  onClick={async () => {
    try {
      if (!selectedRequisition?.id) {
        console.error("No requisition selected");
        return;
      }

      setLoading(true);

      const data = {
        RequisitionId: selectedRequisition.id,
        comment: comments,
      };

      console.log("Audit data being sent:", data);

      await AuditVerification(data);

      setOpenModal(false);
      setComment("");
    } catch (error) {
      console.error("Audit certification failed:", error);
    } finally {
      setLoading(false);
    }
  }}
  startIcon={<ClipboardCheck size={15} />}
  sx={{
    textTransform: "none",
    fontSize: 12,
    px: 2,
    py: 0.75,
    boxShadow: "none",
  }}
>
  Certify Audit
</Button>


</div>
  </div>
</ModalOpen>

</div>
);
}

export default AuditComponent;
