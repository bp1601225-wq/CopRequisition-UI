import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  AlertTriangle,
  CalendarClock,
  Activity,
  ClipboardList,
  ListTodo,
  Loader2,
} from "lucide-react";
import MotionSection from "../../utils/MotionSections";
import { DashboardKPI } from "./DashboardKPICards";
import { DashboardWorkSection } from "./DashboardMainContent";
import { DashboardBottomSection } from "./BottomSection";
import { useEffect,  useState } from "react";
import API, { handleAxiosError } from "../../components/configuration/API";
import { LinearProgress } from "@mui/material";

type DashboardData = {
  totalDeliverables: number;
  reviewedDeliverables: number;
  completionRate: number;
  haveReachedDueDate: number;
  havePassedDueDate: number;
  pendingReviews: number;
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
      // console.error("Failed to load dashboard", error);
      handleAxiosError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  useEffect(()=>{
console.log(dashboard)
  },[dashboard])

if (loading) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex items-center gap-2 text-slate-400">
        <Loader2
          size={16}
          className="animate-spin text-blue-700"
        />

        <span className="text-[11px]">
          Loading dashboard...
        </span>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-full p-3 md:p-4">

  {/* Page Header */}
<MotionSection>
  <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

    {/* Header Content */}
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">
          Overview
        </p>
      </div>

      <h1 className="text-[28px] font-bold tracking-[-0.02em] text-slate-950">
  Dash<span className="text-amber-500">board</span>
</h1>
      <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500">
        Monitor your deliverables, reviews, deadlines, and recent activity
        from one place.
      </p>
    </div>

    {/* Live Status */}
    <div className="flex items-center self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 sm:self-auto">
      <span className="relative mr-2.5 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
      </span>

      <div>
        <p className="text-[10px] font-semibold leading-none text-slate-800">
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
  <DashboardKPI D = {dashboard} />
      </MotionSection>

<div className="mt-4 w-full rounded-xl border border-slate-100 bg-white p-4">
  <div className="mb-3 flex items-end justify-between gap-4">
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">
        Deliverable Completion
      </p>

      <p className="mt-1 text-[10px] leading-4 text-slate-400">
        Percentage of deliverables reviewed and completed
      </p>
    </div>

    <div className="shrink-0 text-right">
      <p className="text-[20px] font-bold leading-none text-slate-900">
        {dashboard?.completionRate ?? 0}%
      </p>

      <p className="mt-1 text-[9px] text-slate-400">
        Overall progress
      </p>
    </div>
  </div>

  <LinearProgress
    variant="determinate"
    value={Math.min(
      100,
      Math.max(0, dashboard?.completionRate ?? 0)
    )}
    sx={{
      height: 6,
      borderRadius: 999,
      backgroundColor: "#f1f5f9",

      "& .MuiLinearProgress-bar": {
        borderRadius: 999,
        backgroundColor: "#00ae43",
      },
    }}
  />

  <div className="mt-2 flex items-center justify-between">
    
    <span className="text-[9px] text-slate-400">
      {dashboard?.totalDeliverables ?? 0} total deliverables
    </span>
  </div>
</div>

      {/* Main Content */}
      {/* <MotionSection delay={0.1}>
      <DashboardWorkSection />
      </MotionSection> */}

      {/* Bottom Section */}
      {/* <MotionSection delay={0.15}>
     <DashboardBottomSection />
      </MotionSection> */}
    </div>
  );
}

export default DashboardSummary;