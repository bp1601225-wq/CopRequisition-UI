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
  UserRound,
  CalendarDays,
  Package,
  FileText,
  CheckCircle,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";
import { Filters } from "../../utils/utils";
import RequisitionDetails from "./RequisitionDetails";
import { Button } from "@mui/material";

type Requisition = {
  id?: string;
  requisitionNo: string;
  date: string;
  createdAt?: string;
  status: string;
  reason: string;
  createdBy?: {
    firstname?: string;
    lastname?: string;
    middlename?: string;
    email?: string;
    phone?: string;
  };
  items?: {
    id?: string;
    description: string;
    quantityRequested: number;
    quantityIssued?: number | null;
    unitCost?: number | null;
    totalCost?: number | null;
  }[];
};

function RequisitionList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenRightPanel, setIsOpenRightPanel] = useState(false);
  const [selectedRequisition, setSelectedRequisition] =
    useState<Requisition | null>(null);

  const { Requisitions, GetRequisitions } = useRequisitionStore();

  useEffect(() => {
    async function LoadRequisitions() {
      setIsLoading(true);

      try {
        await GetRequisitions();
      } finally {
        setIsLoading(false);
      }
    }

    LoadRequisitions();
  }, [GetRequisitions]);

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
      className: "bg-gray-100 text-gray-600 border-gray-200",
    },
    SUBMITTED: {
      label: "Submitted",
      icon: Send,
      className: "bg-blue-50 text-blue-600 border-blue-200",
    },
    HOD_APPROVED: {
      label: "HOD Approved",
      icon: CircleCheck,
      className: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    AUDIT_CERTIFIED: {
      label: "Audit Certified",
      icon: CircleCheck,
      className: "bg-violet-50 text-violet-600 border-violet-200",
    },
    FINANCE_APPROVED: {
      label: "Finance Approved",
      icon: CircleCheck,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    ISSUED: {
      label: "Issued",
      icon: PackageCheck,
      className: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    COMPLETED: {
      label: "Completed",
      icon: CircleCheck,
      className: "bg-green-50 text-green-600 border-green-200",
    },
    REJECTED: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-red-50 text-red-600 border-red-200",
    },
  };

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

  const formatDateTime = (value?: string) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (value?: number | null) => {
    if (value === null || value === undefined) return "Not calculated";

    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

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
      minWidth: 160,
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

  const rows = (Requisitions ?? []).map(
    (requisition: Requisition) => ({
      id: requisition.id ?? requisition.requisitionNo,
      requisitionNo: requisition.requisitionNo ?? "N/A",

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

      // Status comes directly from the API.
      status: requisition.status ?? "UNKNOWN",

      // Preserve the complete API record for the details panel.
      requisition,
    })
  );

  const openRequisitionDetails = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
    setIsOpenRightPanel(true);
  };

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
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center text-xs text-slate-500">
              Loading requisitions...
            </div>
          ) : (

            <>
            
            
            {/* Search and Filters */}
            
             <fieldset className="rounded-md border border-gray-200 bg-white px-3 pb-3 pt-1">
      <legend className="px-1 text-[11px] font-medium text-gray-600">
        Filter by requisition number, status and date range requested
      </legend>

      {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 "> */}


<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">


        {/* Search */}
        <div className="space-y-1">
          {/* <label className="text-xs font-medium text-gray-600">
            asasd
          </label> */}

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder={""}
              className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1 flex gap-2">
          {/* <label className="text-xs font-medium text-gray-600">
            Filter
          </label> */}

          <select
            defaultValue=""
            className="h-9  rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">In Active</option>
          
          </select>


            <select
            defaultValue=""
            className="h-9  rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          >
            <option value="">Date Range</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">In Active</option>
          
          </select>
          


                        
          <Button
  variant="outlined"
  color="success"
  startIcon={<CheckCircle size={17} />}
  sx={{
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "none",
    // bgcolor: "#1eaf49",
    // color: "#ffffff",
    boxShadow: "none",
    "&:hover": {
      // bgcolor: "#1e8a3d",
      boxShadow: "none",
    },
  }}
>
  Approve All 
</Button>

        </div>


        

      </div>




                  
              
    </fieldset>
            
              {/* <Filters legendLabel=" /> */}

        


              <DataTable
                rows={rows}
                columns={columns}
                onRowClick={(params: any) => {
                  openRequisitionDetails(params.row.requisition);
                }}
              />
            </>
          )}
        </div>
      </div>

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
        selectedRequisition = {selectedRequisition}
        selectedStatus={selectedStatus}
        />
    
      </RightPanel>
    </>
  );
}

export default RequisitionList;