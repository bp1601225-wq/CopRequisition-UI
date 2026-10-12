import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
User,
Mail,
Phone,
BriefcaseBusiness,
Building2,
ShieldCheck,
LockKeyhole,
UserPlus,
CheckCircle2,
} from "lucide-react";

import { Button } from "@mui/material";
import MotionSection from "../../utils/MotionSections";

// import { useUnitStore } from "../../components/ZustandShare/UnitStore";
// import { usePositionStore } from "../../components/ZustandShare/PositionStore";
import type { StaffFormData } from "../../GlobalTypes";
import { useStaffStore } from "../../components/ZustandShare/StaffZuts";
import { useAuthStore } from "../../components/ZustandShare/AuthZuts";
useAuthStore

function StaffInformation() {
const {
register,
handleSubmit,
watch,
reset,
formState: { errors },
} = useForm<StaffFormData>();

// const { Units, GetUnits } = useUnitStore();
// const { Positions, GetPositions } = usePositionStore();
const {CreateStaff} = useStaffStore()

  const { currentUser} = useAuthStore()

console.log(`current user is`, currentUser)

// useEffect(() => {
// const LoadOrganizationData = async () => {
// await Promise.all([GetUnits(), GetPositions()]);
// };

// LoadOrganizationData();
// }, [GetUnits, GetPositions]);

const password = watch("password");
const ConfirmPassword = watch("confirmPassword");


// Finalize password

const SubmitStaff = (data: StaffFormData) => {



if (password == ConfirmPassword){

// Remove confirmPassworf
const {confirmPassword, ...rest} = data

// console.log("STAFF FORM DATA:", rest);

CreateStaff(rest)


// reset()

} else {
console.log("Password does not match")
}


// CreateStaff(data)
};

return (
<MotionSection>
<form onSubmit={handleSubmit(SubmitStaff)}>
<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

{/* =====================================================
  HEADER
====================================================== */}
<div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
<div className="flex items-center justify-between gap-4">

  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
      <UserPlus size={17} />
    </div>

    <div>
      <h2 className="text-sm font-semibold text-slate-900">
        Create Staff Account
      </h2>

      <p className="mt-0.5 text-[11px] text-slate-500">
        Add a staff member and configure their organizational
        access.
      </p>
    </div>
  </div>

  <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
    <CheckCircle2
      size={13}
      className="text-emerald-600"
    />

    <span className="text-[10px] font-medium text-emerald-700">
      New Staff
    </span>
  </div>
</div>
</div>

{/* =====================================================
  PERSONAL INFORMATION
====================================================== */}
<div className="border-b border-slate-200 px-5 py-4">

<div className="mb-4">
  <h3 className="text-xs font-semibold text-slate-900">
    Personal Information
  </h3>

  <p className="mt-0.5 text-[10px] text-slate-500">
    Basic contact information for the staff member.
  </p>
</div>

<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

  {/* First Name */}
  <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      First Name
    </label>

    <div className="relative">
      <User
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Enter full name"
        {...register("firstname", {
          required: "Full name is required",
        })}
        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 ${
          errors.firstname
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      />
    </div>

    {errors.firstname && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.firstname.message}
      </p>
    )}
  </div>



  <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      middlename
    </label>

    <div className="relative">
      <User
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Enter full name"
        {...register("middlename", {
          required: "Full name is required",
        })}
        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 ${
          errors.middlename
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      />
    </div>

    {errors.middlename && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.middlename.message}
      </p>
    )}
  </div>



    <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      Last Name
    </label>

    <div className="relative">
      <User
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Enter full name"
        {...register("lastname", {
          required: "Full name is required",
        })}
        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 ${
          errors.lastname
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      />
    </div>

    {errors.lastname && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.lastname.message}
      </p>
    )}
  </div>

  {/* Email */}
  <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      Email Address
    </label>

    <div className="relative">
      <Mail
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="email"
        placeholder="name@organization.com"
        {...register("email", {
          required: "Email is required",
        })}
        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 ${
          errors.email
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      />
    </div>

    {errors.email && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.email.message}
      </p>
    )}
  </div>

  {/* Phone */}
  <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      Phone Number
    </label>

    <div className="relative">
      <Phone
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="tel"
        placeholder="Enter phone number"
        {...register("phone",{
          required:"phone number is required"
        })}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
      />
    </div>

    {errors.phone && (
      <p className="mt-1 text-[10px] text-red-500 border-red-500">
        {errors.phone.message}
      </p>
    )}

  </div>
</div>
</div>

{/* =====================================================
  ORGANIZATION ACCESS
====================================================== */}
<div className="border-b border-slate-200 px-5 py-4">

<div className="mb-4">
  <h3 className="text-xs font-semibold text-slate-900">
    Organization & Access
  </h3>

  <p className="mt-0.5 text-[10px] text-slate-500">
    Assign the staff member to a position, unit and system role.
  </p>
</div>

<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

  {/* Position */}
  {/* <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      Position
    </label>

    <div className="relative">
      <BriefcaseBusiness
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <select
        {...register("positionId", {
          required: "Position is required",
        })}
        className={`h-10 w-full appearance-none rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition ${
          errors.positionId
            ? "border-red-300"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      >
        <option value="">Select position</option>

        {Positions.map((position) => (
          <option key={position.id} value={position.id}>
            {position.name}
          </option>
        ))}
      </select>
    </div>

    {errors.positionId && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.positionId.message}
      </p>
    )}
  </div> */}

  {/* Unit */}
  {/* <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      Unit
    </label>

    <div className="relative">
      <Building2
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <select
        {...register("unitId", {
          // required: "Unit is required",
        })}
        className={`h-10 w-full appearance-none rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition ${
          errors.unitId
            ? "border-red-300"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      >
        <option value="">Select unit</option>

        {Units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name}
          </option>
        ))}
      </select>
    </div>

    {errors.unitId && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.unitId.message}
      </p>
    )}
  </div> */}

  {/* Role */}
  <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      System Role
    </label>

    <div className="relative">
      <ShieldCheck
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <select
        {...register("role", {
          required: "System role is required",
        })}
        className={`h-10 w-full appearance-none rounded-lg border bg-white pl-7 pr-3 text-xs text-slate-700 outline-none transition ${
          errors.role
            ? "border-red-300"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      >
        <option value="">Select role</option>
        <option value="STAFF">Staff</option>
        <option value="HOD">Head of Department</option>
        <option value="STORES">Store Keeper</option>
        <option value="AUDIT">Auditer</option>
        <option value="FINANCE">Finance Service</option>

      </select>
    </div>

    {errors.role && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.role.message}
      </p>
    )}
  </div>
</div>
</div>

{/* =====================================================
  SECURITY
====================================================== */}
<div className="px-5 py-4">

<div className="mb-4 flex items-start justify-between gap-4">
  <div>
    <h3 className="text-xs font-semibold text-slate-900">
      Account Security
    </h3>

    <p className="mt-0.5 text-[10px] text-slate-500">
      Set the initial password for this staff account.
    </p>
  </div>

  <div className="hidden items-center gap-1.5 text-[10px] text-slate-400 sm:flex">
    <LockKeyhole size={12} />
    Secure credentials
  </div>
</div>

<div className="grid grid-cols-1 gap-4 md:grid-cols-2">

  {/* Password */}
  <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      Password
    </label>

    <div className="relative">
      <LockKeyhole
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="password"
        placeholder="Enter password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 ${
          errors.password
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      />
    </div>

    {errors.password && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.password.message}
      </p>
    )}
  </div>

  {/* Confirm Password */}
  <div>
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      Confirm Password
    </label>

    <div className="relative">
      <LockKeyhole
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="password"
        placeholder="Confirm password"
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
        className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 ${
          errors.confirmPassword
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
        }`}
      />
    </div>

    {errors.confirmPassword && (
      <p className="mt-1 text-[10px] text-red-500">
        {errors.confirmPassword.message}
      </p>
    )}
  </div>
</div>
</div>

{/* =====================================================
  ACTIONS
====================================================== */}
<div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">

<p className="text-[10px] text-slate-400">
  Staff credentials should be kept secure.
</p>

<div className="flex justify-end gap-2">
  <button
    type="button"
    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
  >
    Cancel
  </button>

  <Button
    type="submit"
    variant="contained"
    sx={{
      minHeight: "34px",
      px: 2,
      borderRadius: "7px",
      textTransform: "none",
      fontSize: "12px",
      fontWeight: 600,
      backgroundColor: "#020617",
      color: "#fff",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#111827",
        boxShadow: "none",
      },
    }}
  >
    Create Staff
  </Button>
</div>
</div>
</div>
</form>
</MotionSection>
);
}

export default StaffInformation;