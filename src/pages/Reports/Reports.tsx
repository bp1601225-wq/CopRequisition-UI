import { useState } from "react";
import { Button } from "@mui/material";
import {
  FileText,
  SlidersHorizontal,
} from "lucide-react";

import ComprehensiveReports from "./Comprehensive";
import CustomReports from "./Customs";


function Reports() {
  const [selected, setSelected] = useState<
    "comprehensive" | "custom"
  >("comprehensive");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white text-sm text-slate-800">

      {/* HEADER */}
      <div className="shrink-0 border-b border-slate-100 bg-white">
        <div className="flex flex-wrap items-center gap-3 p-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[#fd7e02]">
            <FileText size={20} />
          </div>

          <div className="mr-auto">
            <h2 className="text-sm font-bold text-slate-800">
              Reports & Analytics
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Generate, query and review requisition reports.
            </p>
          </div>

          {/* REPORT SELECTION */}
          <div className="flex flex-wrap items-center gap-2">

            <Button
              onClick={() => setSelected("comprehensive")}
              variant={
                selected === "comprehensive"
                  ? "contained"
                  : "outlined"
              }
              color="warning"
              startIcon={<FileText size={15} />}
              sx={{
                textTransform: "none",
                fontSize: 11,
                px: 2,
                py: 0.9,
                boxShadow: "none",
                borderRadius: 1.5,
              }}
            >
              Comprehensive Report
            </Button>

            <Button
              onClick={() => setSelected("custom")}
              variant={
                selected === "custom"
                  ? "contained"
                  : "outlined"
              }
              color="warning"
              startIcon={<SlidersHorizontal size={15} />}
              sx={{
                textTransform: "none",
                fontSize: 11,
                px: 2,
                py: 0.9,
                boxShadow: "none",
                borderRadius: 1.5,
              }}
            >
              Custom Report
            </Button>

          </div>
        </div>
      </div>

      {/* SELECTED COMPONENT */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 p-4">

        {selected === "comprehensive" && (
<ComprehensiveReports />
)}

        {selected === "custom" && (
<CustomReports />
)}

      </div>
    </div>
  );
}

export default Reports;