import { useState } from "react";
import { Button } from "@mui/material";

import {
  FileText,
  CalendarDays,
  Search,
  Printer,
  Info,
  ClipboardList,
  Workflow,
  Package,
  Wallet,
  Clock,
  XCircle,
  CheckCircle,
  ShieldCheck,
  History,
} from "lucide-react";

function ComprehensiveReports() {

  // ============================
  // STATES
  // ============================

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ============================
  // INPUT STYLING
  // ============================

  const inputClass =
    "h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  // ============================
  // REPORT SECTIONS
  // ============================

  const reportSections = [
    {
      title: "Requisition Register",
      description: "Requisition numbers, requesters, dates, reasons and statuses.",
      icon: ClipboardList,
    },
    {
      title: "Workflow Activities",
      description: "HOD, Audit and Finance decisions and approval records.",
      icon: Workflow,
    },
    {
      title: "Stores Operations",
      description: "Items costed, quantities issued and stores activities.",
      icon: Package,
    },
    {
      title: "Financial Information",
      description: "Recorded item costs, quantities and financial totals.",
      icon: Wallet,
    },
    {
      title: "Pending Requisitions",
      description: "Requisitions awaiting action at different workflow stages.",
      icon: Clock,
    },
    {
      title: "Rejected Requisitions",
      description: "Rejected requests, decisions and recorded reasons.",
      icon: XCircle,
    },
    {
      title: "Recipient Acknowledgements",
      description: "Issued items, receipt records and completion status.",
      icon: CheckCircle,
    },
    {
      title: "Evidence and IT Verification",
      description: "Evidence requests, submissions and IT verification decisions.",
      icon: ShieldCheck,
    },
    {
      title: "Audit Trail",
      description: "Recorded actions, users, timestamps and comments.",
      icon: History,
    },
  ];

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
              Comprehensive Report
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Query and review consolidated requisition, financial and workflow records.
          </p>
        </div>

        <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
          ALL-IN-ONE REPORT
        </span>
      </div>

      {/* REPORT INTRODUCTION */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#fd7e02]">
              <FileText size={21} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Requisition & Financial Overview
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                Generate a detailed report covering requisition records,
                approval decisions, workflow activities, stores operations,
                financial costing, recipient acknowledgements and audit trails.
              </p>
            </div>
          </div>

          <div className="hidden h-12 w-px bg-slate-100 sm:block" />

          <div className="shrink-0 sm:text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Report scope
            </p>

            <p className="mt-1 text-xs font-bold text-slate-700">
              Complete records
            </p>
          </div>
        </div>
      </div>

      {/* QUERY SECTION */}
      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Search size={17} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Configure Report
              </h3>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Select the period for the records you want to retrieve.
              </p>
            </div>
          </div>

          <span className="hidden text-[10px] font-medium text-slate-400 sm:block">
            QUERY FILTERS
          </span>
        </div>

        <div className="space-y-5 p-5">

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
                    className={`${inputClass} w-full pl-9`}
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
                    className={`${inputClass} w-full pl-9`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* DATE INFORMATION */}
          <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
            <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />

            <div>
              <p className="text-xs font-semibold text-blue-800">
                Report query information
              </p>

              <p className="mt-1 text-[11px] leading-5 text-blue-700">
                Leave both dates empty to retrieve all available requisitions.
                Activities and financial records associated with matching
                requisitions will also be included.
              </p>
            </div>
          </div>

          {/* REPORT COVERAGE */}
          <div>
            <div className="mb-3">
              <h4 className="text-xs font-bold text-slate-800">
                Information included in this report
              </h4>

              <p className="mt-1 text-[11px] text-slate-500">
                All sections are automatically included when the report is generated.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">

              {reportSections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:border-orange-200 hover:bg-orange-50/30"
                  >
                    <div className="mt-0.5 text-slate-500">
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-700">
                        {section.title}
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-slate-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Note:</span>{" "}
            Financial figures reflect recorded requisition costing and issuance data.
          </p>

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
                alert("Comprehensive report query will be connected later.")
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

export default ComprehensiveReports;