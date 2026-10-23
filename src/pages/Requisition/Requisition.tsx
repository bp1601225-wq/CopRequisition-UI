import { useFieldArray, useForm } from "react-hook-form";
import {
ClipboardList,
FileText,
Package,
Plus,
Trash2,
Send,
CheckCircle2,
} from "lucide-react";
import { Button } from "@mui/material";
import MotionSection from "../../utils/MotionSections";
import type { RequisitionFormData } from "../../GlobalTypes";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";


function RequisitionInformation() {
const {
register,
control,
handleSubmit,
formState: { errors },
} = useForm<RequisitionFormData>({
defaultValues: {
// date: new Date().toISOString().split("T")[0],
reason: "",
items: [{ description: "", quantityRequested: 1 }],
},
});

const { fields, append, remove } = useFieldArray({
control,
name: "items",
});



const {AddRequisition} = useRequisitionStore()


const SubmitRequisition = (data: RequisitionFormData) => {

const payload = {
// date: data.date,
reason: data.reason.trim(),

items: data.items.map((item) => ({
description: item.description.trim(),
quantityRequested: Number(item.quantityRequested),
})),




};

// Connect this to your requisition Zustand store/service.
console.log("REQUISITION DATA:", payload);


AddRequisition(payload)


};

return (
<MotionSection>
<form onSubmit={handleSubmit(SubmitRequisition)}>
<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

{/* HEADER */}
<div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
<div className="flex items-center justify-between gap-4">
<div className="flex items-center gap-3">
<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
    <ClipboardList size={17} />
</div>

<div>
    <h2 className="text-sm font-semibold text-slate-900">
    Create Requisition
    </h2>
    <p className="mt-0.5 text-[11px] text-slate-500">
    Request items and provide a reason for the request.
    </p>
</div>
</div>

<div className="hidden items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 sm:flex">
<CheckCircle2 size={13} className="text-amber-600" />
<span className="text-[10px] font-medium text-amber-700">
    New Request
</span>
</div>
</div>
</div>

{/* REQUISITION DETAILS */}
<div className="border-b border-slate-200 px-5 py-4">
<div className="mb-4">
<h3 className="text-xs font-semibold text-slate-900">
Requisition Details
</h3>
<p className="mt-0.5 text-[10px] text-slate-500">
Explain why these items are needed.
</p>
</div>

<div>
<label
htmlFor="reason"
className="mb-1.5 block text-[11px] font-medium text-slate-600"
>
Reason for Requisition
</label>

<div className="relative">
<FileText
size={14}
className="absolute left-3 top-3 text-slate-400"
/>

<textarea
id="reason"
rows={3}
placeholder="Explain why these items are required..."
{...register("reason", {
required: "Reason for requisition is required",
validate: (value) =>
value.trim().length > 0 ||
"Please provide a valid reason",
})}
className={`w-full resize-y rounded-lg border bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 ${
errors.reason
? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
: "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
}`}
/>
</div>

{errors.reason && (
<p className="mt-1 text-[10px] text-red-500">
{errors.reason.message}
</p>
)}
</div>
</div>

{/* REQUESTED ITEMS */}
<div className="border-b border-slate-200 px-5 py-4">
<div className="mb-4 flex items-center justify-between gap-3">
<div>
<h3 className="text-xs font-semibold text-slate-900">
    Requested Items
</h3>
<p className="mt-0.5 text-[10px] text-slate-500">
    Specify each item and the quantity required.
</p>
</div>

<span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-700">
{fields.length} {fields.length === 1 ? "Item" : "Items"}
</span>
</div>

{/* ITEM HEADER */}
<div className="mb-2 hidden grid-cols-12 gap-3 px-1 sm:grid">
<div className="col-span-8 text-[10px] font-medium text-slate-500">
Item Description
</div>
<div className="col-span-3 text-[10px] font-medium text-slate-500">
Quantity Requested
</div>
</div>

<div className="space-y-3">
{fields.map((field, index) => (
<div
    key={field.id}
    className="grid grid-cols-1 items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-12 sm:border-0 sm:bg-transparent sm:p-0"
>
    {/* DESCRIPTION */}
    <div className="sm:col-span-8">
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600 sm:hidden">
        Item Description
    </label>

    <div className="relative">
        <Package
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
        type="text"
        placeholder="e.g. A4 paper, printer toner..."
        {...register(`items.${index}.description`, {
            required: "Item description is required",
            validate: (value) =>
            value.trim().length > 0 ||
            "Enter a valid item description",
        })}
        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 ${
            errors.items?.[index]?.description
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
        />
    </div>

    {errors.items?.[index]?.description && (
        <p className="mt-1 text-[10px] text-red-500">
        {errors.items[index]?.description?.message}
        </p>
    )}
    </div>

    {/* QUANTITY */}
    <div className="sm:col-span-3">
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600 sm:hidden">
        Quantity Requested
    </label>

    <input
        type="number"
        min={1}
        step={1}
        {...register(`items.${index}.quantityRequested`, {
        required: "Quantity is required",
        valueAsNumber: true,
        min: {
            value: 1,
            message: "Quantity must be at least 1",
        },
        validate: (value) =>
            (Number.isInteger(value) && value > 0) ||
            "Enter a positive whole number",
        })}
        className={`h-10 w-full rounded-lg border bg-white px-3 text-xs text-slate-900 outline-none transition ${
        errors.items?.[index]?.quantityRequested
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
    />

    {errors.items?.[index]?.quantityRequested && (
        <p className="mt-1 text-[10px] text-red-500">
        {errors.items[index]?.quantityRequested?.message}
        </p>
    )}
    </div>

    {/* REMOVE ITEM */}
    <div className="flex justify-end sm:col-span-1 sm:pt-1">
    <button
        type="button"
        onClick={() => remove(index)}
        disabled={fields.length === 1}
        title="Remove item"
        className="flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 sm:w-8 sm:px-0"
    >
        <Trash2 size={14} />
        <span className="sm:hidden">Remove item</span>
    </button>
    </div>
</div>
))}
</div>

{errors.items?.root && (
<p className="mt-2 text-[10px] text-red-500">
{errors.items.root.message}
</p>
)}

<button
type="button"
onClick={() =>
append({ description: "", quantityRequested: 1 })
}
className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
>
<Plus size={14} />
Add another item
</button>
</div>

{/* ACTIONS */}
<div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
<p className="text-[10px] text-slate-400">
Check your item descriptions and quantities before submitting.
</p>

<div className="flex justify-end gap-2">
<button
type="button"
onClick={() => window.history.back()}
className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
>
Cancel
</button>

<Button
type="submit"
variant="outlined"
startIcon={<Send size={14} />}
disableElevation
sx={{
    minHeight: "34px",
    px: 2,
    borderRadius: "7px",
    textTransform: "none",
    fontSize: "12px",
    fontWeight: 600,
    backgroundColor: "#1e3a8a",
    color: "#fff",
    boxShadow: "none",
    "&:hover": {
    backgroundColor: "#1d4ed8",
    boxShadow: "none",
    },
}}
>
Create Requisition
</Button>
</div>
</div>
</div>
</form>
</MotionSection>
);
}

export default RequisitionInformation;