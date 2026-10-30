import { CheckCircle2, FileText, Send } from "lucide-react";
import { Button, CircularProgress } from "@mui/material";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";
import { useEffect, useState } from "react";
import ModalOpen from "../../components/Modal/Modal";
import API, { handleAxiosError } from "../../components/configuration/API";
import { toast } from "sonner";

// Role-based access control functions
export function RoleBasedRequisitionAcess({
currentUser,
selectedRequisition,
hasNotesEvidence,
setIsNotes,
loading,
isNotes,
setLoading,
Notes,
setNotes,
setSelectedRequisition,
setIsOpenRightPanel
}: any) {
const [evidenceNote, setEvidenceNote] = useState(
hasNotesEvidence ?? null
);

const [isLoading, setIslLoading] = useState<boolean>(false);

// IT verification comment state
const [verificationComment, setVerificationComment] = useState("");
const [showVerificationComment, setShowVerificationComment] =
useState(false);

// Reset local state when switching requisitions.
useEffect(() => {
setEvidenceNote(hasNotesEvidence ?? null);
setIsNotes(false);
setNotes("");
setVerificationComment("");
setShowVerificationComment(false);
}, [selectedRequisition?.id]);

const {
UpdateRequisitions,
ApproveRequisitions,
IT_Verification,
} = useRequisitionStore();

const isITAdmin =
currentUser?.role === "ADMIN" ||
currentUser?.role === "IT_ADMIN";

const isHOD = currentUser?.role === "HOD";

const isAwaitingITVerification =
selectedRequisition?.status === "AWAITING_IT_VERIFICATION";

const isSubmitted = selectedRequisition?.status === "SUBMITTED"



// Check whether an evidence request exists for this requisition.
// An empty array [] has a length of 0, so it will not show Verify.


const isEvidenceNotIncluded =

(selectedRequisition?.evidenceRequests?.length ?? 0) > 0 
;





// Confirm IT verification
const handleConfirmVerification = async () => {
if (!selectedRequisition?.id) return;

if (!verificationComment.trim()) {
toast.warning("Please enter an IT verification comment.");
return;
}

try {
setIslLoading(true);

const payload = {
requisitionId: selectedRequisition.id,
comment: verificationComment.trim(),
status: "STAFF_SUBMITTED",
};

console.log("IT Verification Payload:", payload);

await IT_Verification(payload);

// Update the selected requisition immediately.
setSelectedRequisition((prev: any) =>
prev?.id === selectedRequisition.id
? { ...prev, status: "IT_VERIFIED" }
: prev
);

setVerificationComment("");
setShowVerificationComment(false);
} catch (error) {
// Zustand handles the error.
} finally {
setIslLoading(false);
}
};

return (
<>
{/* ADMIN / IT_ADMIN: IT verification and supporting evidence */}
{isITAdmin && isAwaitingITVerification && (
<>
<div className="flex flex-wrap items-center gap-2">
{/* Request Supporting Evidence
Keep this button visible until an evidence request is created. */}
{evidenceNote == null && (
<Button
onClick={() => setIsNotes((prev: any) => !prev)}
variant="outlined"
disabled={loading}
startIcon={<FileText size={16} />}
sx={{
mt: 1,
textTransform: "none",
fontSize: "12px",
fontWeight: 600,
borderRadius: 2,
px: 2,
py: 0.75,
borderColor: "#2563eb",
color: "#2563eb",
"&:hover": {
backgroundColor: "#eff6ff",
borderColor: "#1d4ed8",
},
}}
>
{isNotes
? "Cancel Evidence Request"
: "Request Supporting Evidence"}
</Button>
)}

{/* Verify IT Requisition
Show only when an evidence request exists. */}
{isEvidenceNotIncluded && (
<Button
onClick={() => {
if (!showVerificationComment) {
setShowVerificationComment(true);
return;
}

handleConfirmVerification();
}}
variant="outlined"
color="warning"
disabled={isLoading || !selectedRequisition?.id}
startIcon={
isLoading ? (
<CircularProgress size={14} color="inherit" />
) : (
<CheckCircle2 size={16} />
)
}
sx={{
mt: 1,
textTransform: "none",
fontSize: "12px",
fontWeight: 600,
borderRadius: 2,
px: 2,
py: 0.75,
borderColor: "#fd7e02",
color: "#fd7e02",
"&:hover": {
backgroundColor: "#fff7ed",
borderColor: "#ea7000",
},
}}
>
{showVerificationComment
? "Confirm Verification"
: "Verify IT Requisition"}
</Button>
)}
</div>

{/* IT Verification Comment Form */}
{isEvidenceNotIncluded && showVerificationComment && (
<div className="mt-3 space-y-3 rounded-lg border border-orange-200 bg-orange-50/50 p-3">
<div>
<p className="text-sm font-semibold text-slate-800">
IT Verification Comment
</p>

<p className="mt-1 text-xs leading-5 text-slate-600">
Add your observations or comments before verifying
this requisition.
</p>
</div>

<textarea
value={verificationComment}
onChange={(e) =>
setVerificationComment(e.target.value)
}
rows={4}
placeholder="Enter your verification comment..."
className="w-full resize-y rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
/>

<div className="flex flex-wrap gap-2">
<Button
variant="contained"
disabled={
isLoading || !verificationComment.trim()
}
onClick={handleConfirmVerification}
startIcon={
isLoading ? (
<CircularProgress size={14} color="inherit" />
) : (
<CheckCircle2 size={16} />
)
}
sx={{
textTransform: "none",
fontSize: "12px",
fontWeight: 600,
backgroundColor: "#fd7e02",
"&:hover": {
backgroundColor: "#ea7000",
},
}}
>
{isLoading ? "Verifying..." : "Confirm Verification"}
</Button>

<Button
variant="outlined"
disabled={isLoading}
onClick={() => {
setShowVerificationComment(false);
setVerificationComment("");
}}
sx={{
textTransform: "none",
fontSize: "12px",
borderColor: "#cbd5e1",
color: "#475569",
}}
>
Cancel
</Button>
</div>
</div>
)}

{/* Supporting Evidence Request Form */}
{evidenceNote == null && isNotes && (
<div className="mt-3 space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
<div>
<p className="text-sm font-semibold text-blue-900">
Request Supporting Evidence
</p>

<p className="mt-1 text-xs leading-5 text-blue-700">
Explain what the requester needs to provide before
IT can verify this requisition.
</p>
</div>

<textarea
onChange={(e) => setNotes(e.target.value)}
value={Notes}
name="notes"
id="notes"
rows={4}
placeholder="E.g. Please provide the toner cartridge model number or a picture of the existing cartridge to confirm compatibility."
className="w-full resize-y rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
/>

<Button
variant="contained"
disabled={loading || !Notes?.trim()}
onClick={async () => {
try {
setLoading(true);

const payload: any = {
RequisitionId: selectedRequisition?.id,
notes: Notes.trim(),
};

await UpdateRequisitions(payload);

// Hide the request button after success.
setEvidenceNote(Notes.trim());

setNotes("");
setIsNotes(false);
} catch (error: any) {
// Zustand handles the error.
} finally {
setLoading(false);
}
}}
sx={{
textTransform: "none",
fontSize: "12px",
fontWeight: 600,
backgroundColor: "#2563eb",
"&:hover": {
backgroundColor: "#1d4ed8",
},
}}
>
{loading ? "Sending..." : "Send Evidence Request"}
</Button>
</div>
)}
</>
)}





{/* HOD / IT ADMIN: Approve Requisition */}

  {/* {(isHOD || isITAdmin) && isEvidenceNotIncluded && ( */}

  {(isHOD || isITAdmin) && isEvidenceNotIncluded || isSubmitted && (
  <Button
onClick={async () => {
try {
setLoading(true);

await ApproveRequisitions(selectedRequisition?.id);



} catch (error) {
// Zustand handles the error.
} finally {
setLoading(false);
setIsOpenRightPanel(false)

}
}}
variant="outlined"
color="warning"
disabled={loading || !selectedRequisition?.id}
startIcon={
loading ? (
<CircularProgress size={14} color="inherit" />
) : (
<CheckCircle2 size={16} />
)
}
sx={{
mt: 1,
textTransform: "none",
fontSize: "12px",
fontWeight: 600,
borderRadius: 2,
px: 2,
py: 0.75,
borderColor: "#fd7e02",
color: "#fd7e02",
"&:hover": {
backgroundColor: "#fff7ed",
borderColor: "#ea7000",
},
}}
>
{loading ? "Approving..." : "Approve Requisition"}
</Button>
)}
</>
);
}

// Evidence Submitted UI

interface NotesEvidenceProps {
hasNotesEvidence: string | null | undefined;
selectedRequisition: any;
currentUser: any;
}

function NotesEvidence({
hasNotesEvidence,
selectedRequisition,
currentUser,
}: NotesEvidenceProps) {
const [isModalOpen, setIsModalOpen] = useState(false);
const [submissionNote, setSubmissionNote] = useState("");
const [loading, setLoading] = useState(false);
const [showEvidenceDetails, setShowEvidenceDetails] = useState(false);

// Keep the submitted reply locally so it appears immediately.
const [submittedMessage, setSubmittedMessage] = useState<string | null>(
null
);

// Reset local display when another requisition is selected.
useEffect(() => {
setSubmittedMessage(null);
setShowEvidenceDetails(false);
setSubmissionNote("");
}, [selectedRequisition?.id]);

if (!hasNotesEvidence) return null;

const IsAdmin = currentUser?.role === "ADMIN";
const is_IT_Admin = currentUser?.role === "IT_ADMIN";
const isAdminUser = IsAdmin || is_IT_Admin;

// Find an evidence request where staff has submitted a reply.
const submittedEvidence = selectedRequisition?.evidenceRequests?.find(
(evidence: any) => evidence.status === "STAFF_SUBMITTED"
);

// Determine whether evidence has already been submitted.
const hasSubmittedEvidence = Boolean(
submittedEvidence || submittedMessage
);

// Get the staff's submission reply.
const staffSubmissionMessage =
submittedMessage || submittedEvidence?.submissionNote || null;

// Submit evidence confirmation.
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

if (!submissionNote.trim() || loading) return;

try {
setLoading(true);

const payload = {
requisitionId: selectedRequisition.id,
submissionNote: submissionNote.trim(),
status: "STAFF_SUBMITTED",
};

const response = await API.post("/evidence-submission", payload);

toast.success(
response.data.message ||
"Evidence submission recorded successfully."
);

// Display the submitted message immediately.
setSubmittedMessage(submissionNote.trim());

setIsModalOpen(false);
setSubmissionNote("");
} catch (error) {
handleAxiosError(error);
} finally {
setLoading(false);
}
};

return (
<>
<div className="mt-3 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
<FileText size={18} />
</div>

<div className="min-w-0 flex-1">
{/* Header */}
<div className="flex flex-wrap items-center justify-between gap-2">
<p className="text-sm font-semibold text-blue-900">
Supporting Evidence Requested
</p>

<span
className={`rounded-full border px-2 py-1 text-[11px] font-medium ${
hasSubmittedEvidence
? "border-green-200 bg-green-50 text-green-700"
: "border-blue-200 bg-white text-blue-700"
}`}
>
{hasSubmittedEvidence ? "Submitted" : "Action Required"}
</span>
</div>

<p className="mt-1 text-xs leading-5 text-blue-700">
The IT team has requested additional supporting evidence for
this requisition. Please provide the evidence physically and
record your submission below.
</p>

{/* Original IT request message */}
<div className="mt-3 rounded-md border border-blue-100 bg-white p-3">
<p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
IT Request Note
</p>

<p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
{hasNotesEvidence}
</p>
</div>

{/* Admin / IT Admin view */}
{isAdminUser ? (
<>
<Button
variant="outlined"
color="success"
size="small"
startIcon={<Send size={15} />}
onClick={() => {
setShowEvidenceDetails((prev) => !prev);
console.log("Selected requisition:", selectedRequisition);
}}
sx={{
mt: 2,
textTransform: "none",
boxShadow: "none",
fontSize: "12px",
}}
>
{showEvidenceDetails
? "Hide Evidence Details"
: "View Evidence Sent"}
</Button>

{/* Evidence details */}
{showEvidenceDetails && (
<div className="mt-3 space-y-3">
{selectedRequisition?.evidenceRequests?.length > 0 ? (
selectedRequisition.evidenceRequests.map(
(evidence: any, index: number) => (
<div
key={evidence.id ?? index}
className="rounded-lg border border-slate-200 bg-white p-3"
>
{/* Original IT request */}
<div>
<p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
IT Request Note
</p>

<p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
{evidence.message ||
"No IT request message recorded."}
</p>
</div>

{/* Staff reply */}
<div className="mt-3 border-t border-slate-100 pt-3">
<p className="text-[11px] font-semibold uppercase tracking-wide text-green-700">
Staff Submission Reply
</p>

<p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
{evidence.submissionNote ||
(evidence.status === "STAFF_SUBMITTED"
? "The reply has not been returned by the server."
: "Staff has not submitted a reply yet.")}
</p>
</div>

{/* Status */}
<div className="mt-3">
<span
className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
evidence.status === "STAFF_SUBMITTED"
? "bg-amber-50 text-amber-700"
: evidence.status === "RECEIVED"
? "bg-blue-50 text-blue-700"
: evidence.status === "ACCEPTED"
? "bg-green-50 text-green-700"
: evidence.status === "REJECTED"
? "bg-red-50 text-red-700"
: "bg-slate-100 text-slate-600"
}`}
>
{evidence.status?.replaceAll("_", " ") ??
"UNKNOWN"}
</span>
</div>

{/* Submission date */}
{evidence.submittedAt && (
<p className="mt-2 text-xs text-slate-500">
Submitted:{" "}
{new Date(
evidence.submittedAt
).toLocaleString()}
</p>
)}

{/* Review note */}
{evidence.reviewNote && (
<div className="mt-3 border-t border-slate-100 pt-3">
<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
IT Review Note
</p>

<p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">
{evidence.reviewNote}
</p>
</div>
)}
</div>
)
)
) : (
<p className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-500">
No evidence request records were found for this
requisition.
</p>
)}
</div>
)}
</>
) : (
<>
{/* Staff: show button only if evidence has not been submitted */}
{!hasSubmittedEvidence && (
<Button
variant="contained"
size="small"
startIcon={<Send size={15} />}
onClick={() => setIsModalOpen(true)}
sx={{
mt: 2,
textTransform: "none",
bgcolor: "#fd7e02",
"&:hover": { bgcolor: "#e66f00" },
boxShadow: "none",
fontSize: "12px",
}}
>
Mark as Evidence Submitted
</Button>
)}

{/* Show staff submission reply */}
{hasSubmittedEvidence && (
<div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
<p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-green-800">
<Send size={14} />
Your Evidence Submission
</p>

<p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-green-900">
{staffSubmissionMessage ||
"Evidence submission has been recorded."}
</p>
</div>
)}
</>
)}
</div>
</div>

{/* Evidence submission modal */}
<ModalOpen
isOpen={isModalOpen}
onClose={() => setIsModalOpen(false)}
title="Confirm Evidence Submission"
showHeader
modalClassName="w-[520px] max-w-[95vw]"
>
<form onSubmit={handleSubmit} className="space-y-4">
<div>
<p className="text-sm leading-6 text-slate-600">
Confirm that you have physically handed over the requested
evidence to the IT team. Explain what you submitted.
</p>
</div>

<div>
<label className="mb-2 block text-sm font-semibold text-slate-800">
Evidence Submission Details
</label>

<textarea
value={submissionNote}
onChange={(e) => setSubmissionNote(e.target.value)}
placeholder="E.g. I have physically submitted the signed approval letter and supporting invoices to the IT office."
rows={5}
required
className="w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
/>

<p className="mt-1 text-xs text-slate-500">
Describe the documents or physical evidence handed over.
</p>
</div>

<div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
<Button
type="button"
variant="outlined"
onClick={() => setIsModalOpen(false)}
sx={{
textTransform: "none",
borderColor: "#cbd5e1",
color: "#475569",
}}
>
Cancel
</Button>

<Button
type="submit"
variant="contained"
disabled={!submissionNote.trim() || loading}
startIcon={<Send size={15} />}
sx={{
textTransform: "none",
bgcolor: "#451fcd",
"&:hover": { bgcolor: "#4a35b5" },
boxShadow: "none",
}}
>
{loading ? "Submitting..." : "Confirm Submission"}
</Button>
</div>
</form>
</ModalOpen>
</>
);
}

export default NotesEvidence;