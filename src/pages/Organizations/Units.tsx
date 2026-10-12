import { useEffect, useState } from "react";
import {
  Building2,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@mui/material";
import { type GridColDef } from "@mui/x-data-grid";

import MotionSection from "../../utils/MotionSections";
import DataTable from "../../utils/DataGridTable";
import { useUnitStore } from "../../components/ZustandShare/UnitStore";
import { toast } from "sonner";

function Units() {
  const [name, setUnitName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const {
    Units,
    GetUnits,
    AddUnit,
  } = useUnitStore();

  useEffect(() => {
    GetUnits();
  }, [GetUnits]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "departmen",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      minWidth: 250,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-900"
          >
            <Pencil size={13} />
          </button>

          <button
            type="button"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

async function CreateUnits() {
  setError("");

  if (!name.trim()) {
    setError("Unit name is required");

    setTimeout(() => {
      setError("");
    }, 5000);

    return;
  }

  try {
    setLoading(true);

    const unitPayload = {
      name: name.trim(),
      description: description.trim(),
    };

    await AddUnit(unitPayload);

    setUnitName("");
    setDescription("");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

function ResetForm() {
  setUnitName("");
  setDescription("");
  setError("");
}

  return (
    <MotionSection>
      <div className="max-w-5xl space-y-3">

        {/* Header */}
        <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-r from-white via-white to-amber-50/60">

          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-100/40 blur-2xl" />

          <div className="pointer-events-none absolute bottom-0 right-32 h-20 w-20 rounded-full bg-blue-100/40 blur-2xl" />

          <div className="relative flex items-center gap-4 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-sm">
                <Building2 size={17} />
              </div>

              <div>
                <h1 className="text-sm font-semibold text-slate-900">
                  Organizational Units
                </h1>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Manage the units used across the deliverables
                  management system.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Add Unit Form */}
        <MotionSection delay={0.05}>
          <div className="overflow-hidden rounded-xl border border-amber-100 bg-white">

            {/* Form Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-50/70 via-white to-blue-50/50 px-4 py-3">

              <div className="flex items-center gap-2.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Building2 size={15} />
                </div>

                <div>
                  <h2 className="text-xs font-semibold text-slate-900">
                    Add New Unit
                  </h2>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Enter the organizational unit details below.
                  </p>
                </div>

              </div>

            </div>

            {/* Form Body */}
            <div className="px-4 py-3">

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                {/* Unit Name */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold text-slate-600">
                    Unit Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setUnitName(event.target.value)
                    }
                    placeholder="e.g. Application Development"
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold text-slate-600">
                    Description
                  </label>

                  <input
                    type="text"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Brief description of this unit"
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-50"
                  />
                </div>

              </div>

              {/* Error */}
              {error && (
                <p className="bg-red-500 mt-2 text-[10px] font-medium text-white p-2">
                  {error}
                </p>
              )}

              {/* Form Actions */}
              <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">

                <Button
                  onClick={ResetForm}
                  variant="contained"
                  sx={{
                    minHeight: "31px",
                    px: 1.8,
                    borderRadius: "7px",
                    textTransform: "none",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "#ff0202",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#cf1b1b",
                      boxShadow: "none",
                    },
                  }}
                >
                  Reset
                </Button>

                <Button
                  onClick={CreateUnits}
                  disabled={loading}
                  variant="contained"
                  sx={{
                    minHeight: "31px",
                    px: 1.8,
                    borderRadius: "7px",
                    textTransform: "none",
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "#172554",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#1e3a8a",
                      boxShadow: "none",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#94a3b8",
                      color: "#fff",
                    },
                  }}
                >
                  {loading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    "Save Unit"
                  )}
                </Button>

              </div>

            </div>
          </div>
        </MotionSection>

        {/* Units Table */}
        <MotionSection delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">

            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

              <div>
                <h2 className="text-xs font-semibold text-slate-900">
                  Existing Units
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  View and manage organizational units.
                </p>
              </div>

              <div className="flex h-7 items-center rounded-full bg-blue-50 px-2.5 text-[10px] font-medium text-blue-900">
                Units
              </div>

            </div>

            <DataTable
              rows={Units}
              columns={columns}
              loading={false}
            />

          </div>
        </MotionSection>

      </div>
    </MotionSection>
  );
}

export default Units;