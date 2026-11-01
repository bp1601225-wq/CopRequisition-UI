import { useEffect, useState } from "react";
import {
  Loader2,
  ClipboardList,
  CheckCircle2,
  Clock3,
  XCircle,
  FileText,
  Users,
} from "lucide-react";
import MotionSection from "../../utils/MotionSections";
import API, { handleAxiosError } from "../../components/configuration/API";

type DashboardData = {
  KPIs: {
    TotalRequisitions: number;
    Completed: number;
    Pending: number;
    Rejected: number;
  };

  RecentRequisitions: {
    id: string;
    requisitionNo: string;
    date: string;
    status: string;
    requisitionType: string | null;
    reason: string;
    createdBy: {
      id: string;
      firstname: string;
      lastname: string;
      department: {
        name: string;
      } | null;
    };
    _count: {
      items: number;
    };
  }[];

  TopRequesters: {
    id?: string;
    firstname?: string;
    lastname?: string;
    department?: {
      name: string;
    } | null;
    totalRequests: number;
  }[];
};

function DashboardSummary() {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const getDashboard = async () => {
    try {
      setLoading(true);

      const response = await API.get("/dashboard");

      setDashboard(response.data.data);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const kpis = [
    {
      title: "Total Requisitions",
      value: dashboard?.KPIs.TotalRequisitions ?? 0,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Completed",
      value: dashboard?.KPIs.Completed ?? 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Pending",
      value: dashboard?.KPIs.Pending ?? 0,
      icon: Clock3,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Rejected",
      value: dashboard?.KPIs.Rejected ?? 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const statusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700";

      case "REJECTED":
        return "bg-red-50 text-red-700";

      case "FINANCE_APPROVED":
      case "IT_VERIFIED":
      case "ISSUED":
        return "bg-blue-50 text-blue-700";

      case "HOD_APPROVED":
      case "AUDIT_CERTIFIED":
      case "STORES_COSTED":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 size={16} className="animate-spin text-blue-700" />
          <span className="text-[11px]">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-3 md:p-4">

      {/* Header */}
      <MotionSection>
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                Overview
              </p>
            </div>

            <h1 className="text-[28px] font-bold tracking-tight text-slate-950">
              Dash<span className="text-amber-500">board</span>
            </h1>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Monitor requisitions, approvals, issuance and employee activity.
            </p>
          </div>

          <div className="flex items-center self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 sm:self-auto">
            <span className="relative mr-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>

            <div>
              <p className="text-[10px] font-semibold text-slate-800">
                Active
              </p>
              <p className="mt-1 text-[9px] text-slate-400">
                Live overview
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* KPI Cards */}
      <MotionSection delay={0.05}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-100 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium text-slate-500">
                    {item.title}
                  </p>

                  <div className={`rounded-lg p-2 ${item.bg}`}>
                    <Icon size={16} className={item.color} />
                  </div>
                </div>

                <h2 className="mt-3 text-2xl font-bold text-slate-900">
                  {item.value.toLocaleString()}
                </h2>
              </div>
            );
          })}
        </div>
      </MotionSection>

      {/* Recent Requisitions */}
      <MotionSection delay={0.1}>
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <h2 className="text-xs font-semibold text-slate-800">
                Recent Requisitions
              </h2>
              <p className="mt-1 text-[10px] text-slate-400">
                Your latest 10 requisition activities
              </p>
            </div>

            <FileText size={17} className="text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {[
                    "Requisition",
                    "Requester",
                    "Department",
                    "Date",
                    "Items",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-[9px] font-semibold uppercase tracking-wide text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dashboard?.RecentRequisitions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">
                      {item.requisitionNo}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      {item.createdBy.firstname} {item.createdBy.lastname}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      {item.createdBy.department?.name ?? "N/A"}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      {new Date(item.date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-600">
                      {item._count.items}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyle(item.status)}`}
                      >
                        {item.status.replaceAll("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}

                {!dashboard?.RecentRequisitions.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-[11px] text-slate-400"
                    >
                      No requisitions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </MotionSection>

      {/* Top Requesters */}
      <MotionSection delay={0.15}>
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <h2 className="text-xs font-semibold text-slate-800">
                Top 10 Requesters
              </h2>
              <p className="mt-1 text-[10px] text-slate-400">
                Employees ranked by requisitions created
              </p>
            </div>

            <Users size={17} className="text-slate-400" />
          </div>

          <div className="divide-y divide-slate-50">
            {dashboard?.TopRequesters.map((item, index) => (
              <div
                key={item.id ?? index}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[10px] font-semibold text-slate-500">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-slate-800">
                      {item.firstname} {item.lastname}
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-slate-400">
                      {item.department?.name ?? "No department"}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                  {item.totalRequests} requests
                </span>
              </div>
            ))}

            {!dashboard?.TopRequesters.length && (
              <p className="px-4 py-8 text-center text-[11px] text-slate-400">
                No requester records found.
              </p>
            )}
          </div>
        </div>
      </MotionSection>

    </div>
  );
}

export default DashboardSummary;