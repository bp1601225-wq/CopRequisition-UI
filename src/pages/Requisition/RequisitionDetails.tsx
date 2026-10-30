import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Package,
  UserRound,
  Wallet,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import RequisitionNoticeStatus from "./RequisitionNotice";
import { useAuthStore } from "../../components/ZustandShare/AuthZuts";
import NotesEvidence from "./IT_and_HOD_approved_role";
import { RoleBasedRequisitionAcess } from "./IT_and_HOD_approved_role";

function RequisitionDetails({
  selectedRequisition,
  selectedStatus,
  setSelectedRequisition,
  setIsOpenRightPanel
}: any) {
  if (!selectedRequisition) return null;


  const {currentUser} = useAuthStore()


// const {ApproveRequisitions, UpdateRequisitions} = useRequisitionStore()


const [loading, setLoading] = useState<boolean>(false)

const [isNotes, setIsNotes] = useState<boolean>(false)

const [Notes, setNotes] = useState<string>("")


  const requisition = selectedRequisition;
  const items = requisition.items ?? [];

  // Stores can only begin costing after HOD approval.
const awaitingITVerification =
  requisition.status === "AWAITING_IT_VERIFICATION";

const itVerified = requisition.status === "IT_VERIFIED";

const hodApproved = [
  "HOD_APPROVED",
  "AUDIT_CERTIFIED",
  "FINANCE_APPROVED",
  "ISSUED",
  "COMPLETED",
].includes(requisition.status);

  const completed = requisition.status === "COMPLETED";
  const rejected = requisition.status === "REJECTED";

  const requesterName = [
    requisition.createdBy?.firstname,
    requisition.createdBy?.middlename,
    requisition.createdBy?.lastname,
  ]
    .filter(Boolean)
    .join(" ") || "Not available";

  const formatDate = (value: any) => {
    if (!value) return "Not available";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? String(value)
      : new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date);
  };

  const formatMoney = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) return null;

    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const costingAvailable =
    hodApproved &&
    items.some(
      (item: any) =>
        item.unitCost != null && item.totalCost != null
    );

  const totalCost = items.reduce(
    (total: number, item: any) =>
      total +
      (item.totalCost != null &&
      item.totalCost !== "" &&
      Number.isFinite(Number(item.totalCost))
        ? Number(item.totalCost)
        : 0),
    0
  );


const notice = RequisitionNoticeStatus({
  requisition,
  completed,
  rejected,
  hodApproved,
  awaitingITVerification,
  itVerified,
});



  const NoticeIcon = notice.icon;



//  Get NOTES
const hasNotesEvidence = selectedRequisition?.notes





  return (
    <div className="mx-auto max-w-5xl space-y-7 text-slate-800">

      {/* HEADER */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <ClipboardList size={15} className="text-blue-700" />
            Requisition management
            <span className="text-slate-300">/</span>
            Record details
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {requisition.requisitionNo}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-blue-600" />
              Created {formatDate(requisition.createdAt)}
            </span>

            <span className="flex items-center gap-1.5">
              <Package size={14} className="text-amber-600" />
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {selectedStatus && (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${selectedStatus.className}`}
          >
            {selectedStatus.icon &&
              (() => {
                const Icon = selectedStatus.icon;
                return <Icon size={15} />;
              })()}
            {selectedStatus.label}
          </span>
        )}
      </header>

      {/* WORKFLOW NOTICE */}
      <section
        className={`flex items-start gap-3 rounded-xl p-4 ${notice.style}`}
      >
        <NoticeIcon size={20} className="mt-0.5 shrink-0" />

        <div>
          <h3 className="text-sm font-semibold">{notice.title}</h3>
          <p className="mt-1 text-sm leading-6 opacity-90">
            {notice.message}
          </p>
        </div>
      </section>

      {/* REQUESTER INFORMATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
            <UserRound size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Requester information
            </h3>
            <p className="text-xs text-slate-500">
              Details of the person who created the request.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-5 pl-1 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Full name</p>
            <p className="mt-1.5 text-sm font-medium text-slate-800">
              {requesterName}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Email address</p>
            <p className="mt-1.5 break-all text-sm text-slate-700">
              {requisition.createdBy?.email ?? "Not available"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Phone number</p>
            <p className="mt-1.5 text-sm text-slate-700">
              {requisition.createdBy?.phone ?? "Not available"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Request date</p>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-700">
              <CalendarDays size={15} className="text-blue-600" />
              {formatDate(requisition.date)}
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-slate-100" />

      {/* REQUEST INFORMATION */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
            <FileText size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Request information
            </h3>
            <p className="text-xs text-slate-500">
              Reason for requesting these items.
            </p>
          </div>
        </div>

        <p className="whitespace-pre-wrap pl-1 text-sm leading-6 text-slate-600">
          {requisition.reason || "No reason was provided for this request."}
        </p>
      </section>

      <div className="h-px bg-slate-100" />

      {/* REQUESTED ITEMS */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
              <Package size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Requested items
              </h3>
              <p className="text-xs text-slate-500">
                Requested quantities and Stores costing details.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>


{/* Role based access control for  */}

{/* .................................................. */}



{/* IT subjects gives notes to provide evidence  */}

{hasNotesEvidence && 
<NotesEvidence hasNotesEvidence={hasNotesEvidence}
selectedRequisition={selectedRequisition}
currentUser={currentUser}
/>
}


<RoleBasedRequisitionAcess 
  currentUser = {currentUser}
  selectedRequisition = {selectedRequisition}
  hasNotesEvidence = {hasNotesEvidence}
  setIsNotes = {setIsNotes}
  loading = {loading}
  isNotes  = {isNotes}
  setLoading = {setLoading}
  Notes = {Notes}
  setNotes = {setNotes}
  setSelectedRequisition = {setSelectedRequisition}
  setIsOpenRightPanel={setIsOpenRightPanel}

/>








        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4 font-medium">#</th>
                <th className="py-3 pr-4 font-medium">Description</th>
                <th className="px-3 py-3 text-right font-medium">
                  Requested
                </th>
                <th className="px-3 py-3 text-right font-medium">
                  Issued
                </th>
                <th className="px-3 py-3 text-right font-medium">
                  Unit cost
                </th>
                <th className="py-3 pl-3 text-right font-medium">
                  Total cost
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.length > 0 ? (
                items.map((item: any, index: number) => (
                  <tr
                    key={item.id ?? `${item.description}-${index}`}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="py-3.5 pr-4 text-xs text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="py-3.5 pr-4 text-sm font-medium text-slate-800">
                      {item.description || "Unnamed item"}
                    </td>

                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-700">
                      {item.quantityRequested ?? "—"}
                    </td>

                    <td className="px-3 py-3.5 text-right text-sm tabular-nums text-slate-700">
                      {item.quantityIssued ?? "—"}
                    </td>

                    <td className="px-3 py-3.5 text-right text-xs tabular-nums text-slate-600">
                      {hodApproved
                        ? formatMoney(item.unitCost) ?? "Pending"
                        : "Awaiting approval"}
                    </td>

                    <td className="py-3.5 pl-3 text-right text-sm font-medium tabular-nums text-slate-800">
                      {hodApproved
                        ? formatMoney(item.totalCost) ?? "Pending"
                        : "Awaiting approval"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Package
                      size={24}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 text-sm font-medium text-slate-600">
                      No items available
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      No items were returned for this requisition.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COST SUMMARY */}
        {items.length > 0 && (
          <div className="flex flex-col justify-between gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Wallet size={18} className="mt-0.5 text-emerald-600" />

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Total requisition cost
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {!hodApproved
                    ? "Available after HOD approval and Stores costing."
                    : costingAvailable
                    ? "Based on the item totals currently returned by Stores."
                    : "Stores has not supplied costing details yet."}
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-lg font-semibold tabular-nums text-slate-900">
                {hodApproved && costingAvailable
                  ? formatMoney(totalCost)
                  : "Not calculated"}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                {hodApproved && costingAvailable
                  ? "Ghana cedis (GHS)"
                  : "Pending Stores costing"}
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="h-px bg-slate-100" />

      {/* WORKFLOW STATUS */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Workflow status
            </h3>
            <p className="text-xs text-slate-500">
              Current processing stage returned by the requisition API.
            </p>
          </div>
        </div>

        <div className="pl-1">
          {selectedStatus ? (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${selectedStatus.className}`}
            >
              {selectedStatus.icon &&
                (() => {
                  const Icon = selectedStatus.icon;
                  return <Icon size={14} />;
                })()}
              {selectedStatus.label}
            </span>
          ) : (
            <p className="text-sm text-slate-500">
              Status information is unavailable.
            </p>
          )}
        </div>

        <p className="pl-1 text-xs leading-5 text-slate-500">
          The requisition follows the approval workflow: HOD approval,
          Stores costing, Audit verification, Finance approval, Stores
          issuance and recipient acknowledgement. Finance approval alone
          does not mean the requisition is completed.
        </p>
      </section>
    </div>
  );
}

export default RequisitionDetails;