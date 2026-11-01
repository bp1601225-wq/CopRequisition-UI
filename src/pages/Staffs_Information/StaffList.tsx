
import DataTable from "../../utils/DataGridTable";
import { type GridColDef } from "@mui/x-data-grid";
import { useStaffStore } from "../../components/ZustandShare/StaffZuts";
import { useEffect, useState } from "react";

import {
  UserRound,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  Import,
  FileSpreadsheet,
  Search,
} from "lucide-react";

import * as XLSX from "xlsx";
import IsLoadingShow, { Filters } from "../../utils/utils";

import { Button } from "@mui/material";
import ModalOpen from "../../components/Modal/Modal";
import { isCookie } from "react-router-dom";
import UserRightPanel from "./StaffRightPanel";

function StaffList() {
  const { GetStaff, Staff, UploadStaff } = useStaffStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

const [selectedUser, setSelectedUser] = useState<any>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);




  // STAFF TABLE ROWS
  const rows = Staff.map((staff: any) => ({
    id: staff?.id,
    firstname: staff?.firstname,
    middlename: staff?.middlename,
    lastname: staff?.lastname,
    email: staff?.email ?? "N/A",
    phone: staff?.phone,
    role: staff?.role,
  }));

  // STAFF TABLE COLUMNS
  const columns: GridColDef[] = [
    {
      field: "firstname",
      headerName: "First Name",
      flex: 1,
      renderHeader: () => (
        <span className="flex items-center gap-2">
          <UserRound size={16} className="text-white" />
          First Name
        </span>
      ),
    },
    {
      field: "middlename",
      headerName: "Middle Name",
      flex: 1.5,
      renderHeader: () => (
        <span className="flex items-center gap-2">
          <Users size={16} className="text-white" />
          Middle Name
        </span>
      ),
    },
    {
      field: "lastname",
      headerName: "Last Name",
      flex: 1.5,
      renderHeader: () => (
        <span className="flex items-center gap-2">
          <UserRound size={16} className="text-white" />
          Last Name
        </span>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1.5,
      renderHeader: () => (
        <span className="flex items-center gap-2">
          <Phone size={16} className="text-white" />
          Phone
        </span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      renderHeader: () => (
        <span className="flex items-center gap-2">
          <Mail size={16} className="text-white" />
          Email
        </span>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderHeader: () => (
        <span className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-white" />
          Role
        </span>
      ),
    },
  ];

  // LOAD STAFF
  useEffect(() => {
    async function LoadUsers() {
      try {
        setIsLoading(true);
        await GetStaff();
      } catch (error) {
        console.error("Failed to load staff:", error);
      } finally {
        setIsLoading(false);
      }
    }

    LoadUsers();
  }, []);

  // READ EXCEL AND CONVERT TO ARRAY OF OBJECTS
  async function HandleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const extension = selectedFile.name
      .slice(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (![".xlsx", ".xls"].includes(extension)) {
      alert("Please select an Excel file (.xlsx or .xls).");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    try {
      setIsReading(true);

      const workbook = XLSX.read(
        await selectedFile.arrayBuffer()
      );

      const worksheet =
        workbook.Sheets[workbook.SheetNames[0]];

      if (!worksheet) {
        alert("Could not read the Excel worksheet.");
        return;
      }

      const data = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      if (data.length === 0) {
        alert("The Excel file contains no data.");
        return;
      }

      setFile(selectedFile);
      setPreview(data);

      console.log("Excel data:", data);


    } catch (error) {
      console.error("Excel reading error:", error);
      alert("Could not read this Excel file.");
    } finally {
      setIsReading(false);
    }
  }

  // CLOSE MODAL AND CLEAR DATA
  function HandleCloseImport() {
    setOpenImport(false);
    setFile(null);
    setPreview([]);
  }

async function HandleUpload() {
  if (preview.length === 0) {
    alert("Please select an Excel file.");
    return;
  } 

  try {
    setLoading(true);
    await UploadStaff(preview);

console.log(preview)

  } catch (error) {
    console.error("Failed to import staff:", error);
  } finally {
    setLoading(false);
  }
}

  if (isLoading) {
    return <IsLoadingShow text="users" />;
  }

  // EXCEL PREVIEW COLUMNS
  const previewColumns = Object.keys(preview[0] || {});

  return (
    <div className="space-y-5 bg-white">

      {/* PAGE HEADER */}
      <div>
        <p className="flex flex-wrap items-center justify-between gap-3 bg-green-50 p-2 text-xs text-green-600">
          <span>
            View, search and manage all users in the system.
          </span>

          <Button
            variant="outlined"
            color="success"
            size="small"
            startIcon={<Import size={15} />}
            onClick={() => 
            
              {
              setOpenImport(true)

              }

            }
            sx={{
              textTransform: "none",
              fontSize: "10px",
              flexShrink: 0,
            }}
          >
            Import users
          </Button>
        </p>
      </div>
<div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
  <fieldset>
    <legend className="px-2 text-sm font-semibold text-slate-700">
      Search & Filter Staff
    </legend>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">

      {/* Search by surname */}
      <div className="sm:col-span-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Enter surname..."
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Account Status */}
      <div className="sm:col-span-1">
        <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500">
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Role */}
      <div className="sm:col-span-1">
        <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500">
          <option value="ALL">All Roles</option>
          <option value="STAFF">Staff</option>
          <option value="HOD">HOD</option>
          <option value="STORES">Stores</option>
          <option value="AUDIT">Audit</option>
          <option value="FINANCE">Finance</option>
          <option value="ADMIN">Admin</option>
          <option value="IT_ADMIN">IT Admin</option>
        </select>
      </div>

    </div>
  </fieldset>
</div>

      {/* STAFF TABLE */}
      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}


    onRowClick={(params: any) => {
  setSelectedUser(params.row);
  setIsOpen(true);
}}
      />

      {/* IMPORT MODAL */}
      <ModalOpen
        isOpen={openImport}
        onClose={HandleCloseImport}
        title="Import staff"
        showHeader={true}
        modalClassName="w-[650px] max-w-[95vw]"
      >
        <div className="space-y-3">

          <p className="text-xs text-gray-500">
            Select an Excel file to preview staff records before importing.
          </p>

          {/* FILE SELECTION */}
          <label
            htmlFor="staff-excel"
            className="flex cursor-pointer flex-col items-center rounded-md border border-dashed border-gray-300 px-3 py-5 text-center transition hover:border-green-600 hover:bg-green-50/30"
          >
            <FileSpreadsheet
              size={25}
              className="mb-2 text-green-600"
            />

            <span className="text-sm font-medium text-gray-800">
              Choose Excel file
            </span>

            <span className="mt-1 text-xs text-gray-500">
              XLSX or XLS · Maximum 5 MB
            </span>

            <span className="mt-3 rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-700">
              Browse files
            </span>

            <input
              id="staff-excel"
              type="file"
              accept=".xlsx,.xls"
              onChange={HandleFileChange}
              className="hidden"
            />
          </label>

          {/* SELECTED FILE */}
          {file && (
            <div className="flex items-center gap-2 rounded border border-gray-200 p-2">
              <FileSpreadsheet
                size={18}
                className="shrink-0 text-green-600"
              />

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-gray-800">
                  {file.name}
                </p>

                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          )}

          {isReading && (
            <p className="text-xs text-gray-500">
              Reading Excel file...
            </p>
          )}

          {/* PREVIEW TABLE */}
          {preview.length > 0 && !isReading && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-800">
                  Data preview
                </p>

                <p className="text-xs text-gray-500">
                  {preview.length} records
                </p>
              </div>

              <div className="max-h-60 overflow-auto rounded border border-gray-200">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      {previewColumns.map((column) => (
                        <th
                          key={column}
                          className="whitespace-nowrap border-b border-r border-gray-200 px-3 py-2 text-left font-medium text-gray-600"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {preview.slice(0, 5).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {previewColumns.map((column) => (
                          <td
                            key={column}
                            className="whitespace-nowrap border-b border-r border-gray-100 px-3 py-2 text-gray-700"
                          >
                            {String(row[column] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {preview.length > 5 && (
                <p className="mt-1 text-xs text-gray-500">
                  Showing 5 of {preview.length} records.
                </p>
              )}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2 border-t border-gray-200 pt-3">
            <Button
              size="small"
              color="inherit"
              onClick={HandleCloseImport}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              Cancel
            </Button>
<Button
  size="small"
  variant="contained"
  onClick={HandleUpload}
  color="warning"
  disableElevation
  disabled={!preview.length || isReading || loading}
  sx={{ textTransform: "none", fontSize: 12 }}
>
  {loading ? "Importing..." : "Import Users"}
</Button>
          </div>

        </div>
      </ModalOpen>



   {/* User Right Panel */}
{selectedUser && (
  <UserRightPanel
    open={isOpen}
    onClose={() => setIsOpen(false)}
    user={selectedUser}
  />
)}
    </div>
  );
}

export default StaffList;
