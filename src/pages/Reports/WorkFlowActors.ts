export const getWorkflowActors = (item: any) => {
const actors: any[] = [];

if (item.approval) {

actors.push({
action: "HOD Approval",
person: item.approval.approvedBy,
date: item.approval.approvedAt,
decision: item.approval.decision,
});
}

item.audit?.forEach((record: any) => {
actors.push({
action: "Internal Audit",
person: record.auditor,
date: record.verifiedAt,
decision: record.decision,
});
});

item.IT?.forEach((record: any) => {
actors.push({
action: "IT Verification",
person: record.IT,
date: record.verifiedAt,
decision: record.decision,
});
});

item.finance?.forEach((record: any) => {
actors.push({
action: "Finance Approval",
person: record.approvedBy,
date: record.approvedAt,
decision: record.decision,
});
});

if (item.issuance) {
actors.push({
action: "Stores Issuance",
person: item.issuance.suppliedBy,
date: item.issuance.issuedAt,
decision: "ISSUED",
});
}

if (item.receipt) {
actors.push({
action: "Recipient Acknowledgement",
person: item.receipt.recipient,
date: item.receipt.receivedAt,
decision: "RECEIVED",
});
}

return actors;
};


// Convert HTML date to DD-MM-YYYY
export const formatDate = (date: string) => {
if (!date) return "";

const [year, month, day] = date.split("-");
return `${day}-${month}-${year}`;
};


export const formatCurrency = (value: number) =>
new Intl.NumberFormat("en-GH", {
style: "currency",
currency: "GHS",
maximumFractionDigits: 2,
}).format(Number(value || 0));

export const formatPerson = (person: any) => {
if (!person) return "Not recorded";

return [
person.firstname,
person.middlename,
person.lastname,
]
.filter(Boolean)
.join(" ");
};