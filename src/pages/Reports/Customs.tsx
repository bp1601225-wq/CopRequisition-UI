import { useState } from "react";
import { Button } from "@mui/material";

import {
  FileText,
  CalendarDays,
  Search,
  Printer,
  Info,
  SlidersHorizontal,
  RotateCcw,
  ClipboardList,
} from "lucide-react";

function CustomReports() {
  // ============================
  // STATES
  // ============================

  const [reportType, setReportType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requisitionNo, setRequisitionNo] = useState("");

  // ============================
  // INPUT STYLING
  // ============================

  const inputClass =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  // ============================
  // CLEAR FILTERS
  // ============================

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatus("ALL");
    setReportType("ALL");
    setRequisitionNo("");
  };

  // ============================
  // COMPONENT UI
  // ============================

  return (
    <div className="mx-auto max-w-6xl space-y-5">

      {/* HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-[#fd7e02]" />

            <h2 className="text-base font-bold text-slate-800">
              Custom Reports
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Build specific requisition reports using your preferred filters.
          </p>
        </div>

        <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
          CUSTOM QUERY
        </span>
      </div>

      {/* INTRODUCTION */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#fd7e02]">
              <FileText size={21} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Custom Requisition Report
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                Generate targeted reports by selecting specific report
                categories, workflow statuses, reporting periods and
                requisition numbers.
              </p>
            </div>
          </div>

          <div className="hidden h-12 w-px bg-slate-100 sm:block" />

          <div className="shrink-0 sm:text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Query mode
            </p>

            <p className="mt-1 text-xs font-bold text-slate-700">
              Flexible filtering
            </p>
          </div>
        </div>
      </div>

      {/* FILTER CONFIGURATION */}
      <div className="rounded-xl border border-slate-200 bg-white">

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <SlidersHorizontal size={17} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Configure Report
              </h3>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Apply filters to define the records you want to retrieve.
              </p>
            </div>
          </div>

          <span className="hidden text-[10px] font-medium text-slate-400 sm:block">
            REPORT FILTERS
          </span>
        </div>

        <div className="space-y-5 p-5">

          {/* REPORT TYPE */}
          <div>
            <p className="mb-3 text-xs font-semibold text-slate-700">
              Report classification
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                  Report type
                </label>

                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className={inputClass}
                >
                  <option value="ALL">All requisitions</option>
                  <option value="REGISTER">Requisition register</option>
                  <option value="WORKFLOW">Approval and workflow</option>
                  <option value="ISSUANCE">Stores issuance</option>
                  <option value="FINANCIAL">Financial expenditure</option>
                  <option value="PENDING">Pending requisitions</option>
                  <option value="REJECTED">Rejected requisitions</option>
                  <option value="RECEIPT">Receipt and completion</option>
                  <option value="EVIDENCE">Evidence and IT verification</option>
                  <option value="HISTORY">History and audit trail</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                  Requisition status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="ALL">All statuses</option>
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
            </div>
          </div>

          {/* DATE FILTERS */}
          <div>
            <p className="mb-3 text-xs font-semibold text-slate-700">
              Reporting period
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                  Start date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                  End date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    min={startDate || undefined}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* REQUISITION NUMBER */}
          <div>
            <p className="mb-3 text-xs font-semibold text-slate-700">
              Specific requisition
            </p>

            <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
              Requisition number
            </label>

            <div className="relative">
              <ClipboardList
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={requisitionNo}
                onChange={(e) => setRequisitionNo(e.target.value)}
                placeholder="Search by requisition number..."
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {/* QUERY INFORMATION */}
          <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
            <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />

            <div>
              <p className="text-xs font-semibold text-blue-800">
                Query information
              </p>

              <p className="mt-1 text-[11px] leading-5 text-blue-700">
                Combine the filters to narrow your report. Leave a filter
                unchanged to include all records matching the other
                selected criteria.
              </p>
            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <button
            onClick={clearFilters}
            className="flex w-fit items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-red-600"
          >
            <RotateCcw size={13} />
            Clear filters
          </button>

          <div className="flex items-center gap-2">

            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Printer size={14} />}
              onClick={() => window.print()}
              sx={{
                textTransform: "none",
                fontSize: 11,
                borderColor: "#cbd5e1",
                color: "#475569",
                boxShadow: "none",
              }}
            >
              Print
            </Button>

            <Button
              variant="contained"
              color="warning"
              startIcon={<Search size={14} />}
              onClick={() =>
                alert("Custom report query will be connected later.")
              }
              sx={{
                textTransform: "none",
                fontSize: 11,
                fontWeight: 600,
                boxShadow: "none",
                px: 2.5,
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Generate Report
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomReports;