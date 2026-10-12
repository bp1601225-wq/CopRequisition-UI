import { Loader2,  } from "lucide-react";

function IsLoadingShow({text}:any){
return (
<div className="flex min-h-[240px] items-center justify-center">
<div className="flex flex-col items-center gap-2">
<div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
<Loader2
size={18}
className="animate-spin text-blue-900"
/>
</div>

<p className="text-[11px] font-medium text-slate-500">
{text} {""} Loading...
</p>
</div>
</div>
)
}

export default IsLoadingShow


import type { UseFormRegisterReturn } from "react-hook-form";

interface InputTextProps {
  register: UseFormRegisterReturn;
}

export function InputText({ register }: InputTextProps) {
  return (
    <input
      {...register}
      type="text"
      placeholder="Enter deliverable..."
      className="h-9 w-full rounded border-b  px-3 text-xs outline-none focus:border-blue-800 focus:ring-blue-100"
    />
  );
}


import { Search } from "lucide-react";

interface FiltersProps {
  searchLabel?: string;
  searchPlaceholder?: string;
  statusLabel?: string;
  fromDateLabel?: string;
  toDateLabel?: string;
        legendLabel?:string

}

export function Filters({
  searchLabel ,
  searchPlaceholder ,
  statusLabel ,
  fromDateLabel,
  toDateLabel,
        legendLabel

}: FiltersProps) {
  return (
    <fieldset className="rounded-md border border-gray-200 bg-white px-3 pb-3 pt-1">
      <legend className="px-1 text-[11px] font-medium text-gray-600">
        {legendLabel}
      </legend>

      {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 "> */}


<div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">


        {/* Search */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            {searchLabel}
          </label>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            {statusLabel}
          </label>

          <select
            defaultValue=""
            className="h-9  rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">In Active</option>
          
          </select>
        </div>

      </div>
    </fieldset>
  );
}





export function FiltersWithDate({
  searchLabel ,
  searchPlaceholder ,
  statusLabel ,
  fromDateLabel,
  toDateLabel 
}: FiltersProps) {
  return (
    <fieldset className="rounded-md border border-gray-200 bg-white px-3 pb-3 pt-1">
      <legend className="px-1 text-[11px] font-medium text-gray-600">
        Requisition Filters
      </legend>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            {searchLabel}
          </label>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            {statusLabel}
          </label>

          <select
            defaultValue=""
            className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="HOD_APPROVED">HOD Approved</option>
            <option value="AUDIT_CERTIFIED">Audit Certified</option>
            <option value="FINANCE_APPROVED">Finance Approved</option>
            <option value="ISSUED">Issued</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Date From */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            {fromDateLabel}
          </label>

          <input
            type="date"
            className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            {toDateLabel}
          </label>

          <input
            type="date"
            className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>
    </fieldset>
  );
}
