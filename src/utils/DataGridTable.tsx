import { DataGrid, type GridColDef } from "@mui/x-data-grid";

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  onRowClick?:any
}

function DataTable({
  rows,
  columns,
  loading = false,
  onRowClick,

}: DataTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg bg-white">
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        onRowClick={onRowClick}
        disableRowSelectionOnClick
        disableColumnMenu={false}
        rowHeight={42}
        columnHeaderHeight={40}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }}
        sx={{
          border: "none",

          fontSize: "12px",
          color: "#334155",

          /* =========================
             HEADER
          ========================= */
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#0a0ac6",
            borderBottom: "1px solid #e2e8f0",
          },

          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#0706077b",
            color: "#f8fafd",
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "0.025em",
            textTransform: "uppercase",
            outline: "none !important",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
          },

          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },

          /* =========================
             SORT ICON
          ========================= */
          "& .MuiDataGrid-sortIcon": {
            color: "#94a3b8",
            fontSize: "16px",
          },

          "& .MuiDataGrid-iconButtonContainer": {
            opacity: 0.6,
          },

          /* =========================
             ROWS
          ========================= */
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid #f1f5f9",
            transition:
              "background-color 0.15s ease, box-shadow 0.15s ease",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f8fafc",
          },

          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#eff6ff",
          },

          "& .MuiDataGrid-row.Mui-selected:hover": {
            backgroundColor: "#eff6ff",
          },

          /* =========================
             CELLS
          ========================= */
          "& .MuiDataGrid-cell": {
            fontSize: "12px",
            color: "#334155",
            borderBottom: "none",
            outline: "none !important",
            whiteSpace: "nowrap",
          },

          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within":
            {
              outline: "none",
            },

          /* =========================
             FOOTER
          ========================= */
          "& .MuiDataGrid-footerContainer": {
            minHeight: "44px",
            maxHeight: "44px",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
          },

          "& .MuiTablePagination-root": {
            fontSize: "11px",
            color: "#64748b",
          },

          "& .MuiTablePagination-toolbar": {
            minHeight: "44px",
          },

          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: "11px",
              color: "#64748b",
            },

          "& .MuiTablePagination-select": {
            fontSize: "11px",
          },

          /* =========================
             PAGINATION BUTTONS
          ========================= */
          "& .MuiTablePagination-actions button": {
            color: "#64748b",
            transition: "all 0.15s ease",
          },

          "& .MuiTablePagination-actions button:hover": {
            backgroundColor: "#f1f5f9",
            color: "#0f172a",
          },

          "& .MuiTablePagination-actions button.Mui-disabled": {
            color: "#cbd5e1",
          },

          /* =========================
             CHECKBOX
          ========================= */
          "& .MuiCheckbox-root": {
            color: "#cbd5e1",
            padding: "5px",
          },

          "& .MuiCheckbox-root:hover": {
            backgroundColor: "#f1f5f9",
          },

          "& .MuiCheckbox-root.Mui-checked": {
            color: "#1d4ed8",
          },

          /* =========================
             EMPTY STATE
          ========================= */
          "& .MuiDataGrid-overlay": {
            backgroundColor: "#ffffff",
            color: "#64748b",
            fontSize: "12px",
          },

          /* =========================
             LOADING
          ========================= */
          "& .MuiDataGrid-loadingOverlay": {
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },

          /* =========================
             SCROLLBAR
          ========================= */
          "& .MuiDataGrid-virtualScroller": {
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          },

          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },

          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "10px",
          },

          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },

          /* =========================
             COLUMN SEPARATOR
          ========================= */
          "& .MuiDataGrid-columnSeparator": {
            color: "#e2e8f0",
            opacity: 0.5,
          },

          /* =========================
             MENU
          ========================= */
          "& .MuiDataGrid-menuIconButton": {
            color: "#94a3b8",
          },

          "& .MuiDataGrid-menuIconButton:hover": {
            color: "#334155",
            backgroundColor: "#f1f5f9",
          },
        }}
      />
    </div>
  );
}

export default DataTable;