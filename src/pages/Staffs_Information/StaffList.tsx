
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
} from "lucide-react";

import * as XLSX from "xlsx";

import IsLoadingShow, { Filters } from "../../utils/utils";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

function StaffList() {
  const { GetStaff, Staff } = useStaffStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [excelRows, setExcelRows] = useState<any[][]>([]);
  const [isReading, setIsReading] = useState<boolean>(false);

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

  // READ EXCEL FILE AND GET ACTUAL COLUMNS
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

      // Read the selected file
      const buffer = await selectedFile.arrayBuffer();

      // Open the Excel workbook
      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        alert("This Excel file contains no worksheets.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];

      if (!worksheet) {
        alert("Could not read the worksheet.");
        return;
      }

      // Convert worksheet into an array of rows
      const allRows: any[][] = XLSX.utils.sheet_to_json(
        worksheet,
        {
          header: 1,
          defval: "",
          raw: false,
        }
      );

      if (allRows.length === 0) {
        alert("The worksheet is empty.");
        return;
      }

      // First row contains the actual Excel headings
      const headings = allRows[0].map((column: any) =>
        String(column).trim()
      );

      // Remaining rows contain the data
      const dataRows = allRows.slice(1).filter((row) =>
        row.some(
          (cell: any) => String(cell).trim() !== ""
        )
      );

      setFile(selectedFile);
      setExcelColumns(headings);
      setExcelRows(dataRows);

      console.log("Excel worksheet:", firstSheetName);
      console.log("Actual Excel columns:", headings);
      console.log("Excel data rows:", dataRows);
    } catch (error) {
      console.error("Excel reading error:", error);
      alert("Could not read this Excel file.");
    } finally {
      setIsReading(false);
    }
  }

  // CLOSE DIALOG AND CLEAR SELECTION
  function HandleCloseImport() {
    setOpenImport(false);
    setFile(null);
    setExcelColumns([]);
    setExcelRows([]);
  }

  // PREPARE FILE FOR BACKEND UPLOAD LATER
  function HandleUpload() {
    if (!file) {
      alert("Please select an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    console.log("Selected file:", file.name);
    console.log("Excel columns:", excelColumns);
    console.log("Excel rows:", excelRows);
    console.log("FormData prepared:", formData);

    // Backend API connection comes next.
  }

  if (isLoading) {
    return <IsLoadingShow text="users" />;
  }

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
            onClick={() => setOpenImport(true)}
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

      {/* SEARCH AND FILTERS */}
      <div>
        <Filters legendLabel="Filter by phone, username, email, or status" />
      </div>

      {/* STAFF TABLE */}
      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
      />

      {/* IMPORT DIALOG */}
      <Dialog
        open={openImport}
        onClose={HandleCloseImport}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontSize: 15, py: 1.5 }}>
          Import Users
        </DialogTitle>

        <DialogContent dividers>
          <p className="mb-3 text-xs text-gray-500">
            Select an Excel file to view its actual column headings
            and data before importing.
          </p>

          <div className="rounded-md border border-dashed border-gray-300 p-3">
            <div className="mb-2 flex items-center gap-2">
              <FileSpreadsheet
                size={20}
                className="text-green-600"
              />

              <span className="text-xs font-medium">
                Excel file
              </span>
            </div>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={HandleFileChange}
              className="block w-full text-xs"
            />

            <p className="mt-2 text-xs text-gray-500">
              .xlsx or .xls · Maximum 5 MB
            </p>
          </div>

          {file && (
            <p className="mt-3 break-all text-xs text-gray-600">
              Selected: {file.name}
            </p>
          )}

          {isReading && (
            <p className="mt-3 text-xs text-blue-600">
              Reading Excel columns and rows...
            </p>
          )}

          {/* EXCEL PREVIEW */}
          {excelColumns.length > 0 && !isReading && (
            <div className="mt-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold">
                  Excel Preview
                </p>

                <p className="text-xs text-gray-500">
                  {excelColumns.length} columns · {excelRows.length} rows
                </p>
              </div>

              <div className="max-h-72 overflow-auto rounded border border-gray-200">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr>
                      {excelColumns.map((column, index) => (
                        <th
                          key={index}
                          className="whitespace-nowrap border-b border-r border-gray-200 px-3 py-2 text-left font-semibold"
                        >
                          {column || `Column ${index + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {excelRows.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {excelColumns.map((_, columnIndex) => (
                          <td
                            key={columnIndex}
                            className="whitespace-nowrap border-b border-r border-gray-100 px-3 py-2"
                          >
                            {String(row[columnIndex] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {excelRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={Math.max(excelColumns.length, 1)}
                          className="px-3 py-4 text-center text-gray-500"
                        >
                          No data rows found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {excelRows.length > 5 && (
                <p className="mt-2 text-xs text-gray-500">
                  Showing the first 5 of {excelRows.length} rows.
                </p>
              )}
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button
            size="small"
            color="inherit"
            onClick={HandleCloseImport}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            size="small"
            variant="contained"
            color="warning"
            disableElevation
            disabled={!file || isReading}
            onClick={HandleUpload}
            sx={{ textTransform: "none" }}
          >
            Upload Excel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StaffList;
