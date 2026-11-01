import { useMemo, useState } from "react";
import {
  Search,
  History,
  User,
  CalendarDays,
  FileText,
  CheckCircle2,
  Clock3,
  XCircle,
  Package,
  Wallet,
  ShieldCheck,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Inbox,
  Loader2,
} from "lucide-react";
import { Button, TextField } from "@mui/material";

import API from "../../components/configuration/API";
type TrackingAction = {
  title: string;
  action: string;
  person: string;
  role: string;
  date: string;
  status: "completed" | "pending" | "rejected";
  comment?: string;
  category: "workflow" | "evidence";
};

const getFullName = (user: any) => {
  if (!user) return "Unknown";

  return [
    user.firstname,
    user.middlename,
    user.lastname,
  ]
    .filter(Boolean)
    .join(" ");
};

const formatDate = (date?: string | Date | null) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDecisionStatus = (decision: string) =>
  decision === "REJECTED" ? "rejected" : "completed";

const getActionTitle = (action: string) => {
  const titles: Record<string, string> = {
    CREATED: "Requisition Created",
    SUBMITTED: "Requisition Submitted",
    HOD_APPROVED: "HOD Approval",
    HOD_REJECTED: "HOD Rejection",
    AUDIT_CERTIFIED: "Internal Audit",
    AUDIT_REJECTED: "Audit Rejection",
    FINANCE_APPROVED: "Finance Approval",
    FINANCE_REJECTED: "Finance Rejection",
    STORES_COSTED: "Stores Costing",
    ISSUED: "Stores Issuance",
    RECEIVED: "Recipient Acknowledgement",
    COMPLETED: "Requisition Completed",
    REJECTED: "Requisition Rejected",
    EVIDENCE_REQUESTED: "Evidence Requested",
    EVIDENCE_SUBMITTED: "Evidence Submitted",
    EVIDENCE_RECEIVED: "Evidence Received",
    EVIDENCE_ACCEPTED: "Evidence Accepted",
    EVIDENCE_REJECTED: "Evidence Rejected",
    IT_VERIFIED: "IT Verification",
  };

  return (
    titles[action] ||
    action.replaceAll("_", " ").toLowerCase()
  );
};

function RequisitionTracking() {
  const [search, setSearch] = useState("");
  const [requisition, setRequisition] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "all" | "workflow" | "evidence"
  >("all");

  const [expanded, setExpanded] = useState<number | null>(0);

  // ==========================================
  // SEARCH REQUISITION
  // ==========================================

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Enter a requisition number.");
      setRequisition(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRequisition(null);

      const response = await API.get(
        `/track/${encodeURIComponent(search.trim())}`
      );

      const result =
        response.data?.data ??
        response.data?.Data ??
        response.data?.result ??
        response.data;

      setRequisition(result);

      setActiveTab("all");
      setExpanded(0);
    } catch (error: any) {
      console.error("Tracking error:", error);

      setError(
        error.response?.data?.message ||
          "Requisition not found or you do not have permission to track it."
      );

      setRequisition(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BUILD WORKFLOW TIMELINE
  // ==========================================

  const workflow = useMemo<TrackingAction[]>(() => {
    if (!requisition) return [];

    const activities: TrackingAction[] = [];

    // Requisition creation
    activities.push({
      title: "Requisition Created",
      action: "CREATED",
      person: getFullName(requisition.createdBy),
      role: requisition.createdBy?.role || "STAFF",
      date: requisition.createdAt,
      status: "completed",
      comment: requisition.reason,
      category: "workflow",
    });

    // Requisition history
    (requisition.history || []).forEach((item: any) => {
      activities.push({
        title: getActionTitle(item.action),
        action: item.action,
        person: getFullName(item.performedBy),
        role: item.performedBy?.role || "UNKNOWN",
        date: item.createdAt,
        status: item.action.includes("REJECTED")
          ? "rejected"
          : "completed",
        comment: item.comment,
        category: item.action.startsWith("EVIDENCE_")
          ? "evidence"
          : "workflow",
      });
    });

    // HOD approval
    if (requisition.approval) {
      const item = requisition.approval;

      activities.push({
        title:
          item.decision === "APPROVED"
            ? "HOD Approval"
            : "HOD Rejection",
        action:
          item.decision === "APPROVED"
            ? "HOD_APPROVED"
            : "HOD_REJECTED",
        person: getFullName(item.approvedBy),
        role: "HOD",
        date: item.approvedAt,
        status: getDecisionStatus(item.decision),
        comment: item.comment,
        category: "workflow",
      });
    }

    // Internal Audit
    (requisition.audit || []).forEach((item: any) => {
      activities.push({
        title:
          item.decision === "CERTIFIED"
            ? "Internal Audit Certification"
            : "Audit Rejection",
        action:
          item.decision === "CERTIFIED"
            ? "AUDIT_CERTIFIED"
            : "AUDIT_REJECTED",
        person: getFullName(item.auditor),
        role: "AUDIT",
        date: item.verifiedAt,
        status: getDecisionStatus(item.decision),
        comment: item.comment,
        category: "workflow",
      });
    });

    // IT Verification
    (requisition.IT || []).forEach((item: any) => {
      activities.push({
        title: "IT Verification",
        action: "IT_VERIFIED",
        person: getFullName(item.IT),
        role: "IT_ADMIN",
        date: item.verifiedAt,
        status: getDecisionStatus(item.decision),
        comment: item.comment,
        category: "workflow",
      });
    });

    // Finance
    (requisition.finance || []).forEach((item: any) => {
      activities.push({
        title:
          item.decision === "APPROVED"
            ? "Finance Approval"
            : "Finance Rejection",
        action:
          item.decision === "APPROVED"
            ? "FINANCE_APPROVED"
            : "FINANCE_REJECTED",
        person: getFullName(item.approvedBy),
        role: "FINANCE",
        date: item.approvedAt,
        status: getDecisionStatus(item.decision),
        comment: item.comment,
        category: "workflow",
      });
    });

    // Stores issuance
    if (requisition.issuance) {
      const item = requisition.issuance;

      activities.push({
        title: "Stores Issuance",
        action: "ISSUED",
        person: getFullName(item.suppliedBy),
        role: "STORES",
        date: item.issuedAt,
        status: "completed",
        comment: "Items physically issued by Stores.",
        category: "workflow",
      });
    }

    // Recipient receipt
    if (requisition.receipt) {
      const item = requisition.receipt;

      activities.push({
        title: "Recipient Acknowledgement",
        action: "RECEIVED",
        person: getFullName(item.recipient),
        role: item.recipient?.role || "STAFF",
        date: item.receivedAt,
        status: "completed",
        comment: "Recipient acknowledged receipt.",
        category: "workflow",
      });
    }

    return activities.sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
  }, [requisition]);

  // ==========================================
  // BUILD EVIDENCE TIMELINE
  // ==========================================

  const evidence = useMemo<TrackingAction[]>(() => {
    if (!requisition) return [];

    const activities: TrackingAction[] = [];

    (requisition.evidenceRequests || []).forEach(
      (item: any) => {
        activities.push({
          title: "Evidence Requested",
          action: "EVIDENCE_REQUESTED",
          person: getFullName(item.requestedBy),
          role: item.requestedBy?.role || "UNKNOWN",
          date: item.requestedAt,
          status: "completed",
          comment: item.message,
          category: "evidence",
        });

        if (item.submittedAt) {
          activities.push({
            title: "Evidence Submitted",
            action: "EVIDENCE_SUBMITTED",
            person: getFullName(item.submittedBy),
            role: item.submittedBy?.role || "STAFF",
            date: item.submittedAt,
            status: "completed",
            comment: item.submissionNote,
            category: "evidence",
          });
        }

        if (item.receivedAt) {
          activities.push({
            title: "Evidence Received",
            action: "EVIDENCE_RECEIVED",
            person: getFullName(item.receivedBy),
            role: item.receivedBy?.role || "ADMIN",
            date: item.receivedAt,
            status: "completed",
            comment: "Physical evidence received.",
            category: "evidence",
          });
        }

        if (item.reviewedAt) {
          activities.push({
            title:
              item.status === "ACCEPTED"
                ? "Evidence Accepted"
                : item.status === "REJECTED"
                ? "Evidence Rejected"
                : "Evidence Reviewed",
            action:
              item.status === "ACCEPTED"
                ? "EVIDENCE_ACCEPTED"
                : item.status === "REJECTED"
                ? "EVIDENCE_REJECTED"
                : "EVIDENCE_REVIEWED",
            person: getFullName(item.reviewedBy),
            role: item.reviewedBy?.role || "ADMIN",
            date: item.reviewedAt,
            status:
              item.status === "REJECTED"
                ? "rejected"
                : "completed",
            comment: item.reviewNote,
            category: "evidence",
          });
        }
      }
    );

    return activities.sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
  }, [requisition]);

  // ==========================================
  // COMBINE ACTIVITIES
  // ==========================================

  const allActivities = useMemo(() => {
    return [...workflow, ...evidence].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
  }, [workflow, evidence]);

  const activities =
    activeTab === "workflow"
      ? workflow
      : activeTab === "evidence"
      ? evidence
      : allActivities;

  // ==========================================
  // PROGRESS
  // ==========================================

  const completedCount = workflow.filter(
    (item) => item.status === "completed"
  ).length;

  const workflowStages = [
    "CREATED",
    "HOD_APPROVED",
    "AUDIT_CERTIFIED",
    "FINANCE_APPROVED",
    "STORES_COSTED",
    "ISSUED",
    "RECEIVED",
    "COMPLETED",
  ];

  const completedStages = workflowStages.filter((stage) =>
    workflow.some((item) => item.action === stage)
  ).length;

  const progress = Math.round(
    (completedStages / workflowStages.length) * 100
  );

  // ==========================================
  // ICONS
  // ==========================================

  const getIcon = (title: string) => {
    if (title.includes("Created")) return FileText;
    if (title.includes("HOD")) return User;
    if (title.includes("Audit")) return ClipboardCheck;
    if (title.includes("Finance")) return Wallet;
    if (title.includes("Stores")) return Package;
    if (title.includes("IT") || title.includes("Evidence"))
      return ShieldCheck;
    if (title.includes("Received")) return CheckCircle2;

    return Activity;
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") {
      return (
        <CheckCircle2
          size={17}
          className="text-emerald-600"
        />
      );
    }

    if (status === "rejected") {
      return (
        <XCircle size={17} className="text-red-500" />
      );
    }

    return (
      <Clock3 size={17} className="text-amber-500" />
    );
  };

  // ==========================================
  // TOTAL COST
  // ==========================================

  const totalCost = (requisition?.items || []).reduce(
    (total: number, item: any) =>
      total + Number(item.totalCost || 0),
    0
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto max-w-6xl space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-[#fd7e02]" />

            <h2 className="text-base font-bold text-slate-800">
              Requisition Tracking
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Track requisition activities and accountability.
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[#fd7e02]">
          <History size={19} />
        </div>
      </div>

      {/* SEARCH */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <label className="mb-2 block text-xs font-semibold text-slate-700">
          Requisition Number
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Enter requisition number..."
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: 2,
                fontSize: 12,
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            startIcon={
              loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Search size={15} />
              )
            }
            sx={{
              height: 40,
              px: 2.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: 12,
              fontWeight: 600,
              bgcolor: "#fd7e02",
              boxShadow: "none",
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "#e87500",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Searching..." : "Track Requisition"}
          </Button>
        </div>

        {error && (
          <p className="mt-2 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* EMPTY STATE */}
      {!requisition && !loading && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <Inbox size={23} />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-slate-700">
            No requisition selected
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Search using a requisition number to view its history.
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
          <Loader2
            size={25}
            className="mx-auto animate-spin text-[#fd7e02]"
          />

          <p className="mt-3 text-xs text-slate-500">
            Retrieving requisition tracking details...
          </p>
        </div>
      )}

      {/* TRACKING DETAILS */}
      {requisition && !loading && (
        <>
          {/* OVERVIEW */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Requisition reference
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-800">
                  {requisition.requisitionNo}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {requisition.reason}
                </p>
              </div>

              <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-semibold text-[#fd7e02]">
                {requisition.status?.replaceAll("_", " ")}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
              <div>
                <p className="text-[10px] text-slate-400">
                  Requester
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {getFullName(requisition.createdBy)}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">
                  Department
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {requisition.createdBy?.department?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">
                  Date created
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {formatDate(requisition.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">
                  Stores costing
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  GH₵{" "}
                  {totalCost.toLocaleString("en-GH", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-xs font-bold text-slate-800">
              Requested Items
            </h3>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-center">Requested</th>
                    <th className="py-2 text-center">Issued</th>
                    <th className="py-2 text-right">Total Cost</th>
                  </tr>
                </thead>

                <tbody>
                  {(requisition.items || []).map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-3 font-medium text-slate-700">
                        {item.description}
                      </td>

                      <td className="py-3 text-center text-slate-600">
                        {item.quantityRequested}
                      </td>

                      <td className="py-3 text-center text-slate-600">
                        {item.quantityIssued ?? "—"}
                      </td>

                      <td className="py-3 text-right text-slate-700">
                        {item.totalCost != null
                          ? `GH₵ ${Number(item.totalCost).toLocaleString("en-GH", {
                              minimumFractionDigits: 2,
                            })}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800">
                  Workflow Progress
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Requisition processing journey
                </p>
              </div>

              <span className="text-sm font-bold text-[#fd7e02]">
                {progress}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#fd7e02] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>{completedStages} stages completed</span>
              <span>{workflowStages.length} workflow stages</span>
            </div>
          </div>

          {/* ACTIVITY HISTORY */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Activity History
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Officers, decisions and recorded activities
                </p>
              </div>

              <div className="flex rounded-lg bg-slate-100 p-1">
                {(
                  [
                    ["all", "All"],
                    ["workflow", "Workflow"],
                    ["evidence", "Evidence"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setActiveTab(value);
                      setExpanded(0);
                    }}
                    className={`rounded-md px-3 py-1.5 text-[10px] font-semibold transition ${
                      activeTab === value
                        ? "bg-white text-[#fd7e02] shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="p-4">
              {activities.length === 0 ? (
                <div className="py-10 text-center">
                  <Inbox
                    size={23}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    No activities recorded yet.
                  </p>
                </div>
              ) : (
                activities.map((item, index) => {
                  const Icon = getIcon(item.title);
                  const isExpanded = expanded === index;

                  return (
                    <div
                      key={`${item.category}-${item.action}-${index}`}
                      className="relative"
                    >
                      <div className="flex gap-3 pb-5">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              item.status === "completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : item.status === "rejected"
                                ? "bg-red-50 text-red-500"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            <Icon size={16} />
                          </div>

                          {index !== activities.length - 1 && (
                            <div className="absolute top-9 h-full w-px bg-slate-200" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 rounded-lg border border-slate-100 bg-white">
                          <button
                            onClick={() =>
                              setExpanded(isExpanded ? null : index)
                            }
                            className="flex w-full items-center justify-between gap-3 p-3 text-left"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-bold text-slate-800">
                                  {item.title}
                                </p>

                                {getStatusIcon(item.status)}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-medium text-slate-600">
                                  {item.person}
                                </span>

                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                                  {item.role}
                                </span>
                              </div>

                              <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                <CalendarDays size={11} />
                                {formatDate(item.date)}
                              </p>
                            </div>

                            {isExpanded ? (
                              <ChevronUp
                                size={16}
                                className="shrink-0 text-slate-400"
                              />
                            ) : (
                              <ChevronDown
                                size={16}
                                className="shrink-0 text-slate-400"
                              />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="border-t border-slate-100 bg-slate-50/70 px-3 py-3">
                              <p className="text-[10px] font-semibold uppercase text-slate-400">
                                Activity details
                              </p>

                              <p className="mt-1 text-xs leading-5 text-slate-600">
                                {item.comment ||
                                  "No additional comment recorded."}
                              </p>

                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400">
                                  Action: {item.action}
                                </span>

                                <span
                                  className={`text-[10px] font-semibold ${
                                    item.status === "rejected"
                                      ? "text-red-600"
                                      : "text-emerald-600"
                                  }`}
                                >
                                  {item.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RequisitionTracking;