
function StatusStyle(status: string) {
  switch (status) {
    case "HOD_APPROVED":
      return "text-blue-700 bg-blue-50";

    case "AUDIT_CERTIFIED":
      return "text-indigo-700 bg-indigo-50";

    case "FINANCE_APPROVED":
      return "text-emerald-700 bg-emerald-50";

    case "ISSUED":
    case "COMPLETED":
      return "text-green-700 bg-green-50";

    case "REJECTED":
      return "text-red-700 bg-red-50";

    default:
      return "text-gray-600 bg-gray-100";
  }
}

function StatusLabel(status: string) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}


function FormatDate(date: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function RequesterName(requisition: any) {
  return (
    requisition?.createdBy?.name ||
    requisition?.createdBy?.fullName ||
    requisition?.createdBy?.email ||
    "Unknown requester"
  );
}


function DepartmentName(requisition: any) {
  return (
    requisition?.createdBy?.department?.name ||
    requisition?.department?.name ||
    "Department not specified"
  );
}




export {StatusLabel, StatusStyle, FormatDate, RequesterName, DepartmentName}



