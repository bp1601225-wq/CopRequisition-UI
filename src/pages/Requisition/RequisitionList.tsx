import { type GridColDef } from "@mui/x-data-grid";
import DataTable from "../../utils/DataGridTable";
import RightPanel from "../../components/Panel/RightPanel";

import {
  FileEdit,
  Send,
  CircleCheck,
  Clock,
  PackageCheck,
  XCircle,
  ClipboardList,
  Search,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";
import RequisitionDetails from "./RequisitionDetails";

function RequisitionList() {
  const [isLoading, setIsLoading] = useState(false);

  const [isOpenRightPanel, setIsOpenRightPanel] = useState(false);

  const [selectedRequisition, setSelectedRequisition] =
    useState<any | null>(null);

  const { Requisitions, GetRequisitions } = useRequisitionStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState("");

  // Initial fetch + search and filter debounce.
  // The inputs remain mounted while this request is running.
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);

      try {
        await GetRequisitions(searchTerm, dateRange, status);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dateRange, status, GetRequisitions]);

  // Status badge configuration.
  const statusConfig: Record<
    string,
    {
      label: string;
      icon: typeof CircleCheck;
      className: string;
    }
  > = {
    DRAFT: {
      label: "Draft",
      icon: FileEdit,
      className: "bg-gray-100 text-gray-700 border-gray-300",
    },

    SUBMITTED: {
      label: "Submitted",
      icon: Send,
      className: "bg-blue-100 text-blue-800 border-blue-300",
    },

    HOD_APPROVED: {
      label: "HOD Approved",
      icon: CircleCheck,
      className: "bg-lime-100 text-lime-800 border-lime-300",
    },

    STORES_COSTED: {
      label: "Stores Costed",
      icon: PackageCheck,
      className: "bg-sky-100 text-sky-800 border-sky-300",
    },

    AUDIT_CERTIFIED: {
      label: "Audit Certified",
      icon: ShieldCheck,
      className: "bg-purple-100 text-purple-800 border-purple-300",
    },

    FINANCE_APPROVED: {
      label: "Finance Approved",
      icon: CircleCheck,
      className: "bg-orange-100 text-orange-800 border-orange-300",
    },

    ISSUED: {
      label: "Issued",
      icon: PackageCheck,
      className: "bg-cyan-100 text-cyan-800 border-cyan-300",
    },

    COMPLETED: {
      label: "Completed",
      icon: CircleCheck,
      className: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },

    REJECTED: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-rose-100 text-rose-800 border-rose-300",
    },

    AWAITING_IT_VERIFICATION: {
      label: "Awaiting IT Verification",
      icon: ShieldCheck,
      className: "bg-amber-100 text-amber-800 border-amber-300",
    },

    IT_VERIFIED: {
      label: "IT Verified",
      icon: ShieldCheck,
      className: "bg-teal-100 text-teal-800 border-teal-300",
    },
  };

  // Format dates for the table.
  const formatDate = (value?: string) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Table columns.
  const columns: GridColDef[] = [
    {
      field: "requisitionNo",
      headerName: "Requisition No.",
      flex: 1,
      minWidth: 175,
    },
    {
      field: "createdBy",
      headerName: "Requested By",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "requisitionType",
      headerName: "Type",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "date",
      headerName: "Date Requested",
      flex: 0.8,
      minWidth: 125,
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 1.2,
      minWidth: 180,
    },
    {
      field: "itemCount",
      headerName: "Items",
      flex: 0.5,
      minWidth: 75,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 190,
      renderCell: (params) => {
        const config = statusConfig[params.value] ?? {
          label: params.value || "Unknown",
          icon: Clock,
          className: "bg-gray-100 text-gray-600 border-gray-200",
        };

        const Icon = config.icon;

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.className}`}
          >
            <Icon size={13} />
            {config.label}
          </span>
        );
      },
    },
  ];

  // Convert API requisitions into table rows.
  const rows = (Requisitions ?? []).map((requisition: any) => ({
    id: requisition.id ?? requisition.requisitionNo,

    requisitionNo: requisition.requisitionNo ?? "N/A",

    requisitionType: requisition.requisitionType == "TONER" ? "TONER" : "GENERAL",

    notes: requisition.notes ?? "N/A",

    createdBy: requisition.createdBy
      ? [
          requisition.createdBy.firstname,
          requisition.createdBy.lastname,
        ]
          .filter(Boolean)
          .join(" ") || "N/A"
      : "N/A",

    date: formatDate(requisition.date),

    reason: requisition.reason ?? "No reason provided",

    itemCount: requisition.items?.length ?? 0,

    status: requisition.status ?? "UNKNOWN",

    // Keep the complete record for the details panel.
    requisition,
  }));

  // Open requisition details when a table row is clicked.
  const openRequisitionDetails = (requisition: any) => {
    setSelectedRequisition(requisition);
    setIsOpenRightPanel(true);
  };

  // Selected requisition status for the details panel.
  const selectedStatus = selectedRequisition
    ? statusConfig[selectedRequisition.status] ?? {
        label: selectedRequisition.status || "Unknown",
        icon: Clock,
        className: "bg-gray-100 text-gray-600 border-gray-200",
      }
    : null;

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
            <ClipboardList size={18} />
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-900">
              Requisitions
            </h2>

            <p className="text-[11px] text-slate-500">
              Track requisitions and their approval status.
            </p>
          </div>

          <div className="ml-auto text-[11px] text-slate-500">
            {rows.length} records
          </div>
        </div>

        <div className="p-3">
          {/* Search and filters stay mounted during loading */}
          <fieldset className="rounded-md border border-gray-200 bg-white px-3 pb-3 pt-1">
            <legend className="px-1 text-[11px] font-medium text-gray-600">
              Filter by requisition number, requester, status or date
            </legend>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Search */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search requisition number or requester name"
                  className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              {/* Status and date filters */}
              <div className="flex gap-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-9 min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                >
                  <option value="">All Statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="HOD_APPROVED">HOD Approved</option>
                  <option value="STORES_COSTED">Stores Costed</option>
                  <option value="AUDIT_CERTIFIED">Audit Certified</option>
                  <option value="FINANCE_APPROVED">Finance Approved</option>
                  <option value="ISSUED">Issued</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="AWAITING_IT_VERIFICATION">
                    Awaiting IT Verification
                  </option>
                  <option value="IT_VERIFIED">IT Verified</option>
                </select>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="h-9 min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                >
                  <option value="">Date Range</option>
                  <option value="TODAY">Today</option>
                  <option value="YESTERDAY">Yesterday</option>
                  <option value="LAST_7_DAYS">Last 7 Days</option>
                  <option value="LAST_30_DAYS">Last 30 Days</option>
                  <option value="THIS_WEEK">This Week</option>
                  <option value="LAST_WEEK">Last Week</option>
                  <option value="THIS_MONTH">This Month</option>
                  <option value="LAST_MONTH">Last Month</option>
                  <option value="THIS_YEAR">This Year</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Loading message appears without removing the filters */}
          {isLoading && (
            <p className="py-2 text-xs text-slate-500">
              Loading requisitions...
            </p>
          )}

          {/* Table */}
          <DataTable
            rows={rows}
            loading={isLoading}
            columns={columns}
            onRowClick={(params: any) => {
              openRequisitionDetails(params.row.requisition);
            }}
          />
        </div>
      </div>

      {/* Requisition details panel */}
      <RightPanel
        open={isOpenRightPanel}
        title={
          selectedRequisition
            ? `Requisition ${selectedRequisition.requisitionNo}`
            : "Requisition Details"
        }
        onClose={() => setIsOpenRightPanel(false)}
      >
        <RequisitionDetails
        setIsOpenRightPanel = {setIsOpenRightPanel}
          selectedRequisition={selectedRequisition}
          selectedStatus={selectedStatus}
          setSelectedRequisition={setSelectedRequisition}
        />
      </RightPanel>
    </>
  );
}

export default RequisitionList;