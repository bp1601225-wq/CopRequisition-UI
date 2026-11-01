import { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import {
  CalendarDays,
  Search,
  Printer,
  FileText,
  ClipboardList,
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  BarChart3,
} from "lucide-react";

import API, { handleAxiosError } from "../../components/configuration/API";

function ComprehensiveReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const GenerateReport = async () => {
    try {
      setLoading(true);

      const response = await API.get("/comprehensive-report", {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });

      setReport(response.data.data);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    COMPLETED: "bg-emerald-500",
    REJECTED: "bg-red-500",
    DRAFT: "bg-slate-400",
    SUBMITTED: "bg-blue-500",
    HOD_APPROVED: "bg-indigo-500",
    AUDIT_CERTIFIED: "bg-violet-500",
    FINANCE_APPROVED: "bg-teal-500",
    STORES_COSTED: "bg-orange-500",
    ISSUED: "bg-cyan-500",
    AWAITING_IT_VERIFICATION: "bg-amber-500",
    IT_VERIFIED: "bg-green-600",
  };

  const total = report?.Count ?? 0;

  const getPercentage = (count: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  const summaryCards = [
    {
      title: "Total Requisitions",
      value: total,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Stores Cost",
      value: `GH₵ ${Number(
        report?.StoresCalculation ?? 0
      ).toLocaleString("en-GH", {
        minimumFractionDigits: 2,
      })}`,
      icon: Wallet,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Records Retrieved",
      value: report?.AllRequisition?.length ?? 0,
      icon: FileText,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-[#fd7e02]" />
            <h2 className="text-base font-bold text-slate-800">
              Comprehensive Reports
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Requisition and financial overview
          </p>
        </div>

        <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[#fd7e02]">
          <BarChart3 size={19} />
        </div>
      </div>

      {/* FILTER */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <Search size={16} className="text-[#fd7e02]" />
          <h3 className="text-xs font-bold text-slate-800">
            Report Period
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
              From
            </label>

            <div className="relative">
              <CalendarDays
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setReport(null);

                  if (endDate && e.target.value > endDate) {
                    setEndDate("");
                  }
                }}
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
              To
            </label>

            <div className="relative">
              <CalendarDays
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                min={startDate || undefined}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setReport(null);
                }}
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-orange-400"
              />
            </div>
          </div>

          <Button
            variant="contained"
            color="success"
            disabled={
              loading ||
              !startDate ||
              !endDate ||
              endDate < startDate
            }
            startIcon={
              loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )
            }
            onClick={GenerateReport}
            sx={{
              height: 40,
              px: 2.5,
              textTransform: "none",
              fontSize: 12,
              fontWeight: 600,
              boxShadow: "none",
              whiteSpace: "nowrap",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-2">
          <p className="text-[11px] text-slate-500">
            Preparing report...
          </p>
          <LinearProgress color="warning" />
        </div>
      )}

      {/* RESULTS */}
      {report && !loading && (
        <div className="space-y-4">

          {/* REPORT HEADER */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={17} className="text-[#fd7e02]" />

                <h3 className="text-sm font-bold text-slate-800">
                  Report Summary
                </h3>
              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                {formatDate(startDate)} — {formatDate(endDate)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                <CheckCircle size={12} />
                Generated
              </span>

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
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {summaryCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-slate-500">
                      {item.title}
                    </p>

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg} ${item.color}`}
                    >
                      <Icon size={17} />
                    </div>
                  </div>

                  <h3 className="mt-3 break-words text-xl font-bold text-slate-800">
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* STATUS DISTRIBUTION */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800">
                  Status Distribution
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Requisitions by workflow stage
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BarChart3 size={17} />
              </div>
            </div>

            <div className="space-y-4">
              {report.GroupedByStatus?.length > 0 ? (
                report.GroupedByStatus.map((item: any) => {
                  const count = item._count._all;
                  const percentage = getPercentage(count);

                  return (
                    <div key={item.status}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              statusColors[item.status] ?? "bg-slate-400"
                            }`}
                          />

                          <span className="text-[11px] font-medium text-slate-600">
                            {item.status.replaceAll("_", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400">
                            {percentage.toFixed(1)}%
                          </span>

                          <span className="min-w-6 text-right text-xs font-bold text-slate-800">
                            {count}
                          </span>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            statusColors[item.status] ?? "bg-slate-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-5 text-center text-xs text-slate-400">
                  No status records available.
                </p>
              )}
            </div>
          </div>

          {/* RECORD SUMMARY */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />

              <span className="text-xs font-medium text-slate-600">
                Requisition records retrieved
              </span>
            </div>

            <span className="text-sm font-bold text-slate-800">
              {report.AllRequisition?.length ?? 0}
            </span>
          </div>

        </div>
      )}
    </div>
  );
}

export default ComprehensiveReports;