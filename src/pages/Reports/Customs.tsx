import { useState } from "react";
import { Button } from "@mui/material";
import {
FileText,
CalendarDays,
Search,
SlidersHorizontal,
RotateCcw,
Loader2,
Files,
Wallet,
BarChart3,
CheckCircle2,
Clock,
User,
History,
} from "lucide-react";

import API, { handleAxiosError } from "../../components/configuration/API";
import { formatCurrency, formatDate, formatPerson, getWorkflowActors } from "./WorkFlowActors";

function CustomReports() {
const [reportType, setReportType] = useState("ALL");
const [status, setStatus] = useState("ALL");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [requisitionNo, setRequisitionNo] = useState("");

const [report, setReport] = useState<any>(null);
const [loading, setLoading] = useState(false);


// Yearly Reports
const [isHalfYear, setIsHalfYear] = useState(false);
const [isFullYear, setIsFullYear] = useState(false);

const GenerateReport = async () => {
  if (!startDate || !endDate) {
    alert("Please select a start date and end date.");
    return;
  }

  setIsHalfYear(false);
  setIsFullYear(false);

  try {
    setLoading(true);
    setReport(null);

    const response = await API.get("/custom-reports", {
      params: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        status,
        requisitionType: reportType,
        requisitionNo: requisitionNo.trim(),
        isHalfYear: false,
        isFullYear: false,
      },
    });

    setReport(response.data.data);

  } catch (error) {
    handleAxiosError(error);
  } finally {
    setLoading(false);
  }
};


const YearlyReports = async (
  halfYear: boolean,
  fullYear: boolean
) => {
  try {
    setLoading(true);
    setReport(null);

    setIsHalfYear(halfYear);
    setIsFullYear(fullYear);

    const response = await API.get("/custom-reports", {
      params: {
        isHalfYear: halfYear,
        isFullYear: fullYear,
        status,
        requisitionType: reportType,
        requisitionNo: requisitionNo.trim(),
      },
    });

    setReport(response.data.data);

  } catch (error) {
    handleAxiosError(error);
  } finally {
    setLoading(false);
  }
};



const clearFilters = () => {
  setStartDate("");
  setEndDate("");
  setStatus("ALL");
  setReportType("ALL");
  setRequisitionNo("");
  setIsHalfYear(false);
  setIsFullYear(false);
  setReport(null);
};

const inputClass =
"h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100";

// Updated KPI fields to match backend response
const kpis = [
{
title: "Total Requisitions",
value: report?.TotalRequisition ?? 0,
icon: Files,
iconColor: "text-blue-600",
iconBg: "bg-blue-50",
},
{
title: "Total Issued Value",
value: formatCurrency(report?.TotalIssuedValues),
icon: Wallet,
iconColor: "text-teal-600",
iconBg: "bg-teal-50",
},
{
title: "Total Approved Value",
value: formatCurrency(report?.TotalApprovedValues),
icon: CheckCircle2,
iconColor: "text-violet-600",
iconBg: "bg-violet-50",
},
{
title: "Approved But Not Issued",
value: formatCurrency(report?.ApprovedButNotIssued),
icon: Clock,
iconColor: "text-amber-600",
iconBg: "bg-amber-50",
},
{
title: "Workflow Statuses",
value: report?.GroupedByStatus?.length ?? 0,
icon: BarChart3,
iconColor: "text-rose-600",
iconBg: "bg-rose-50",
},
];


// Get the people responsible for each workflow action.


return (
<div className="mx-auto max-w-6xl space-y-5">

{/* HEADER */}
<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
<div>
<div className="flex items-center gap-2">
<span className="h-5 w-1 rounded-full bg-amber-500" />

<h2 className="text-base font-semibold text-slate-800">
  Custom Reports
</h2>
</div>

<p className="mt-1 text-xs text-slate-500">
Generate and review requisition reports.
</p>
</div>

<span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold tracking-wide text-blue-700">
REPORT CENTRE
</span>
</div>

{/* FILTERS */}
<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

<div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
<SlidersHorizontal size={16} className="text-amber-600" />
</div>

<div>
<h3 className="text-sm font-semibold text-slate-800">
  Report Filters
</h3>

<p className="text-[11px] text-slate-500">
  Select your reporting criteria.
</p>
</div>
</div>

<div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">

{/* REQUISITION TYPE */}
<div>
<label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
  Requisition Type
</label>

<select
  value={reportType}
  onChange={(e) => setReportType(e.target.value)}
  className={inputClass}
>
  <option value="ALL">All Types</option>
  <option value="GENERAL">General</option>
  <option value="TONER">Toner</option>
</select>
</div>

{/* STATUS */}
<div>
<label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
  Requisition Status
</label>

<select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className={inputClass}
>
  <option value="ALL">All Statuses</option>
  <option value="SUBMITTED">Submitted</option>
  <option value="HOD_APPROVED">HOD Approved</option>
  <option value="AUDIT_CERTIFIED">Audit Certified</option>
  <option value="FINANCE_APPROVED">Finance Approved</option>
  <option value="STORES_COSTED">Stores Costed</option>
  <option value="ISSUED">Issued</option>
  <option value="COMPLETED">Completed</option>
  <option value="REJECTED">Rejected</option>
  <option value="AWAITING_IT_VERIFICATION">
    Awaiting IT Verification
  </option>
  <option value="IT_VERIFIED">IT Verified</option>
</select>
</div>

{/* REQUISITION NUMBER */}
{/* <div>
<label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
  Requisition Number
</label>

<div className="relative">
  <ClipboardList
    size={15}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
  />

  <input
    type="text"
    value={requisitionNo}
    onChange={(e) => setRequisitionNo(e.target.value)}
    placeholder="Enter requisition number"
    className={`${inputClass} pl-9`}
  />
</div>
</div> */}

{/* START DATE */}
<div>
<label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
  Start Date
</label>

<div className="relative">
  <CalendarDays
    size={15}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
  />

  <input
    type="date"
    disabled={isHalfYear || isFullYear}
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className={`${inputClass} pl-9 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed`}
  />
</div>
</div>

{/* END DATE */}
<div>
<label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
  End Date
</label>

<div className="relative">
  <CalendarDays
    size={15}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
  />

  <input
    type="date"
    disabled={isHalfYear || isFullYear}
    min={startDate || undefined}
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
     className={`${inputClass} pl-9 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed`}
  />
</div>
</div>
</div>

{/* ACTIONS */}
<div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

<button
onClick={clearFilters}
className="flex w-fit items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-amber-600"
>
<RotateCcw size={13} />
Clear Filters
</button>

<div className="flex items-center gap-2">
{/* 
<Button
  variant="outlined"
  color="inherit"
  startIcon={<Printer size={14} />}
  onClick={() => window.print()}
  sx={{
    textTransform: "none",
    fontSize: 11,
    fontWeight: 600,
    borderColor: "#cbd5e1",
    color: "#475569",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#64748b",
      backgroundColor: "#f8fafc",
      boxShadow: "none",
    },
  }}
>
  Print
</Button> */}

<Button
  variant="contained"


  
  startIcon={
    loading ? (
      <Loader2 size={14} className="animate-spin" />
    ) : (
      <Search size={14} />
    )
  }
  disabled={loading}
  onClick={GenerateReport}
  sx={{
    textTransform: "none",
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: "#ebca25",
    boxShadow: "none",
    px: 2.5,
    "&:hover": {
      backgroundColor: "#c7b143",
      boxShadow: "none",
    },
    "&.Mui-disabled": {
      backgroundColor: "#93c5fd",
      color: "#ffffff",
    },
  }}
>
  {loading ? "Generating..." : "Generate Report"}
</Button>

<Button
  variant="contained"
  startIcon={<Search size={14} />}
  disabled={loading}
  onClick={() => YearlyReports(true, false)}
  sx={{
    textTransform: "none",
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: "#7c3aed",
    boxShadow: "none",
    px: 2.5,
    "&:hover": {
      backgroundColor: "#6d28d9",
      boxShadow: "none",
    },
  }}
>
  {loading ? "Generating..." : "Half-Year Report"}
</Button>

<Button
  variant="contained"
  startIcon={<Search size={14} />}
  disabled={loading}
  onClick={() => YearlyReports(false, true)}
  sx={{
    textTransform: "none",
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: "#0f766e",
    boxShadow: "none",
    px: 2.5,
    "&:hover": {
      backgroundColor: "#115e59",
      boxShadow: "none",
    },
  }}
>
  {loading ? "Generating..." : "Full Year Report"}
</Button>


</div>
</div>
</div>

{/* REPORT RESULTS */}
{report && (
<div className="space-y-4" id="custom-report-results">

{/* REPORT HEADER */}
<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
<div>
  <div className="flex items-center gap-2">
    <span className="h-5 w-1 rounded-full bg-blue-600" />

    <h3 className="text-sm font-semibold text-slate-800">
      Report Overview
    </h3>
  </div>

  <p className="mt-1 text-[11px] text-slate-500">
    {formatDate(startDate)} – {formatDate(endDate)}
  </p>
</div>

<span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
  {report.TotalRequisition ?? 0} RECORDS FOUND
</span>
</div>

{/* KPI CARDS */}
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
{kpis.map((kpi) => {
  const Icon = kpi.icon;

  return (
    <div
      key={kpi.title}
      className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          {kpi.title}
        </p>

        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.iconBg}`}>
          <Icon size={16} className={kpi.iconColor} />
        </div>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-slate-800">
        {kpi.value}
      </h3>
    </div>
  );
})}
</div>

{/* STATUS DISTRIBUTION */}
<div className="rounded-lg border border-slate-200 bg-white p-5">

<div className="mb-5 flex items-center gap-3">
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
    <BarChart3 size={16} className="text-violet-600" />
  </div>

  <div>
    <h3 className="text-sm font-semibold text-slate-800">
      Status Distribution
    </h3>

    <p className="text-[11px] text-slate-500">
      Requisitions grouped by workflow status.
    </p>
  </div>
</div>

<div className="space-y-4">
  {(report.GroupedByStatus ?? []).map(
    (item: any, index: number) => {
      const count = item._count?._all ?? 0;

      const percentage = report.TotalRequisition
        ? (count / report.TotalRequisition) * 100
        : 0;

      const barColors = [
        "bg-blue-500",
        "bg-amber-500",
        "bg-teal-500",
        "bg-violet-500",
        "bg-rose-500",
      ];

      return (
        <div key={item.status}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">
              {item.status.replaceAll("_", " ")}
            </span>

            <span className="text-xs font-semibold text-slate-700">
              {count} ({percentage.toFixed(1)}%)
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${barColors[index % barColors.length]}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    }
  )}

  {(!report.GroupedByStatus ||
    report.GroupedByStatus.length === 0) && (
    <p className="text-xs text-slate-400">
      No status records found.
    </p>
  )}
</div>
</div>

{/* REQUISITION RECORDS */}
<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

<div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
    <FileText size={16} className="text-amber-600" />
  </div>

  <div>
    <h3 className="text-sm font-semibold text-slate-800">
      Requisition Records
    </h3>

    <p className="text-[11px] text-slate-500">
      {report.AllRequisition?.length ?? 0} records
    </p>
  </div>
</div>

<div className="space-y-3 p-4">
  {(report.AllRequisition ?? []).map((item: any) => {
    const actors = getWorkflowActors(item);

    return (
      <div
        key={item.id}
        className="overflow-hidden rounded-lg border border-slate-200"
      >

        {/* REQUISITION DETAILS */}
        <div className="flex flex-col gap-3 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="space-y-1">
            <p className="text-xs font-semibold text-blue-700">
              {item.requisitionNo}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span>
                {new Date(item.date).toLocaleDateString("en-GB")}
              </span>

              <span>•</span>

              <span>
                {item.requisitionType ?? "Type not specified"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <User size={13} />

              {formatPerson(item.createdBy)}
            </div>

            {item.createdBy?.role && (
              <p className="text-[10px] text-slate-400">
                Requester: {item.createdBy.role}
              </p>
            )}
          </div>

          <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600">
            {item.status.replaceAll("_", " ")}
          </span>
        </div>

        {/* ITEMS */}
        <div className="border-t border-slate-100 p-4">
          <p className="mb-2 text-[11px] font-semibold text-slate-700">
            Requested Items
          </p>

          <div className="space-y-2">
            {(item.items ?? []).map((product: any) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-2 text-[11px]"
              >
                <span className="text-slate-600">
                  {product.description}
                </span>

                <span className="text-slate-500">
                  Requested: {product.quantityRequested}
                  {" | "}
                  Issued: {product.quantityIssued ?? 0}
                </span>

                <span className="font-semibold text-slate-700">
                  {formatCurrency(product.totalCost)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WORKFLOW ACTORS */}
        <div className="border-t border-slate-100 p-4">

          <div className="mb-3 flex items-center gap-2">
            <History size={14} className="text-blue-600" />

            <p className="text-[11px] font-semibold text-slate-700">
              Workflow Actions & Responsible Officers
            </p>
          </div>

          {actors.length > 0 ? (

            <div className="space-y-3">

              {actors.map((actor: any, index: number) => (
                <div
                  key={`${actor.action}-${index}`}
                  className="flex flex-col gap-1 border-l-2 border-blue-200 pl-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">
                      {actor.action}
                    </p>

                    <p className="text-xs text-slate-600">
                      {formatPerson(actor.person)}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {actor.person?.role ?? "Role unavailable"}
                      {actor.person?.EmployeeCode
                        ? ` • ${actor.person.EmployeeCode}`
                        : ""}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-semibold text-teal-600">
                      {actor.decision ?? ""}
                    </span>

                    {actor.date && (
                      <p className="text-[10px] text-slate-400">
                        {new Date(actor.date).toLocaleString("en-GB")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">
              No workflow action records available.
            </p>
          )}
        </div>

        {/* WORKFLOW HISTORY */}
        {item.history?.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-4">
            <p className="mb-3 text-[11px] font-semibold text-slate-700">
              Activity History
            </p>

            <div className="space-y-3">
              {item.history.map((record: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">
                      {record.action.replaceAll("_", " ")}
                    </p>

                    <p className="text-[11px] text-slate-600">
                      {formatPerson(record.performedBy)}
                    </p>

                    {record.comment && (
                      <p className="text-[10px] text-slate-400">
                        {record.comment}
                      </p>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400">
                    {new Date(record.createdAt).toLocaleString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  })}

  {(!report.AllRequisition ||
    report.AllRequisition.length === 0) && (
    <p className="py-8 text-center text-xs text-slate-400">
      No requisitions found.
    </p>
  )}
</div>
</div>
</div>
)}
</div>
);
}

export default CustomReports;