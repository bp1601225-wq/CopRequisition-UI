import {
Settings,
Building2,
BriefcaseBusiness,
Plus,
ChevronRight,
} from "lucide-react";
import { Button, dividerClasses } from "@mui/material";
import MotionSection from "../../utils/MotionSections";
import { useState } from "react";
import UnitsScreen from "../Organizations/Units";
import ModalOpen from "../../components/Modal/Modal";
import Positions from "../Organizations/Positions";

function SettingsScreen() {


  const [isOpenPanel, setIsOpenPanel] = useState<string>("")
  




return (
  <>
<MotionSection>
<div className="max-w-5xl space-y-3">
{/* Header */}
<div className="rounded-lg border border-slate-200 bg-white">
<div className="flex items-center gap-3 px-4 py-3">
<div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white">
<Settings size={16} />
</div>

<div>
<h1 className="text-sm font-semibold text-slate-900">
  Settings
</h1>

<p className="text-[11px] text-slate-500">
  Manage system configuration and organizational information.
</p>
</div>
</div>
</div>

{/* Organization */}
<MotionSection delay={0.05}>
<div className="rounded-lg border border-slate-200 bg-white">
<div className="border-b border-slate-200 px-4 py-3">
<h2 className="text-xs font-semibold text-slate-900">
  Organization
</h2>

<p className="mt-0.5 text-[10px] text-slate-500">
  Manage the units and positions used when creating staff.
</p>
</div>

<div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
{/* Units */}
<div className="rounded-md border border-slate-200 bg-white p-3 transition-colors hover:border-blue-200">
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-900">
        <Building2 size={16} />
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-900">
          Units
        </h3>

        <p className="text-[10px] text-slate-500">
          Manage department units.
        </p>
      </div>
    </div>

    <Button
    onClick={()=>setIsOpenPanel("departments")}
      variant="contained"
      startIcon={<Plus size={14} />}
      sx={{
        minHeight: "30px",
        px: 1.5,
        borderRadius: "6px",
        textTransform: "none",
        fontSize: "11px",
        backgroundColor: "#000",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#222",
          boxShadow: "none",
        },
      }}
    >
      Add Departments
    </Button>
  </div>

  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
    <span className="text-[10px] text-slate-500">
      Application Development, Infrastructure, IT Support...
    </span>

    <button className="flex items-center gap-1 text-[10px] font-medium text-blue-900 hover:text-blue-700">
      Manage
      <ChevronRight size={13} />
    </button>
  </div>
</div>

{/* Positions */}
<div className="rounded-md border border-slate-200 bg-white p-3 transition-colors hover:border-blue-200">
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-900">
        <BriefcaseBusiness size={16} />
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-900">
          Positions
        </h3>

        <p className="text-[10px] text-slate-500">
          Manage staff job positions.
        </p>
      </div>
    </div>

    <Button
    onClick={()=>setIsOpenPanel("Positions")}

      variant="contained"
      startIcon={<Plus size={14} />}
      sx={{
        minHeight: "30px",
        px: 1.5,
        borderRadius: "6px",
        textTransform: "none",
        fontSize: "11px",
        backgroundColor: "#000",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#222",
          boxShadow: "none",
        },
      }}
    >
      Add Position
    </Button>
  </div>

  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
    <span className="text-[10px] text-slate-500">
      Software Developer, IT Officer, Network Administrator...
    </span>

    <button className="flex items-center gap-1 text-[10px] font-medium text-blue-900 hover:text-blue-700">
      Manage
      <ChevronRight size={13} />
    </button>
  </div>
</div>
</div>
</div>
</MotionSection>

{/* System Information */}
<MotionSection delay={0.1}>
<div className="rounded-lg border border-slate-200 bg-white">
<div className="border-b border-slate-200 px-4 py-3">
<h2 className="text-xs font-semibold text-slate-900">
  System Information
</h2>

<p className="mt-0.5 text-[10px] text-slate-500">
  Basic information about the deliverables management system.
</p>
</div>

<div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-3">
<div className="rounded-md bg-slate-50 px-3 py-2">
  <p className="text-[10px] text-slate-500">
    Organization
  </p>
  <p className="mt-0.5 text-xs font-medium text-slate-900">
    The Church of Pentecost
  </p>
</div>

<div className="rounded-md bg-slate-50 px-3 py-2">
  <p className="text-[10px] text-slate-500">
    Department
  </p>
  <p className="mt-0.5 text-xs font-medium text-slate-900">
    IT Department
  </p>
</div>

<div className="rounded-md bg-slate-50 px-3 py-2">
  <p className="text-[10px] text-slate-500">
    Submission Limit
  </p>
  <p className="mt-0.5 text-xs font-medium text-slate-900">
    5 Deliverables / Week
  </p>
</div>
</div>
</div>
</MotionSection>

</div>
</MotionSection>

        {isOpenPanel === "departments" && <>
        <ModalOpen isOpen = {!!isOpenPanel} 
        onClose={()=>setIsOpenPanel("")}>
        <UnitsScreen />

        </ModalOpen>
        </>}


        
        {isOpenPanel === "Positions" && <>
        <ModalOpen isOpen = {!!isOpenPanel} 
        onClose={()=>setIsOpenPanel("")}>
<Positions />

        </ModalOpen>
        </>}
  </>

);
}

export default SettingsScreen;