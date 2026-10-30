import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  Phone,
  ShieldCheck,
  X,
  Save,
  UserCog,
  ContactRound,
} from "lucide-react";
import RightPanel from "../../components/Panel/RightPanel";
import { Button } from "@mui/material";
import { useStaffStore } from "../../components/ZustandShare/StaffZuts";

function UserRightPanel({ open, onClose, user }: any) {
  const { register, handleSubmit, reset, formState:{
    isSubmitting
  } } = useForm();


const {UpdateStaff} = useStaffStore()


  useEffect(() => {
    if (user) {
      reset({
        id:user.id || "",
        firstname: user.firstname || "",
        middlename: user.middlename || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "STAFF",
      });
    }
  }, [user, reset]);

  const onSubmit = async  (data: any) => {

    console.log(data);


await UpdateStaff(data)
  };

  const inputStyle =
    "w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  const labelStyle =
    "mb-1.5 block text-xs font-medium text-slate-600";

  const sectionTitle =
    "flex items-center gap-2 text-sm font-semibold text-slate-800";

  return (
    <RightPanel open={open} onClose={onClose} title="Edit User">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <UserCog size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Edit User Profile
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Update personal details and access role.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close panel"
          >
            <X size={17} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col"
        >
          <div className="flex-1 space-y-5">
            {/* Personal details */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <ContactRound size={16} className="text-orange-500" />
                <h3 className={sectionTitle}>Personal Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                <div>
                  <label className={labelStyle}>First Name</label>
                  <input
                    {...register("firstname")}
                    placeholder="First name"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Middle Name</label>
                  <input
                    {...register("middlename")}
                    placeholder="Middle name"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Last Name</label>
                  <input
                    {...register("lastname")}
                    placeholder="Last name"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Phone Number</label>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      {...register("phone")}
                      placeholder="Phone number"
                      className={`${inputStyle} pl-8`}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={labelStyle}>Email Address</label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="name@example.com"
                      className={`${inputStyle} pl-8`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Access settings */}
            <section className="border-t border-slate-100 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-orange-500" />
                <h3 className={sectionTitle}>Access & Permissions</h3>
              </div>

              <label className={labelStyle}>User Role</label>
              <select
                {...register("role")}
                className={inputStyle}
              >
                <option value="STAFF">Staff</option>
                <option value="HOD">Head of Department</option>
                <option value="STORES">Stores</option>
                <option value="AUDIT">Internal Audit</option>
                <option value="FINANCE">Finance</option>
                <option value="ADMIN">Administrator</option>
              </select>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                The assigned role determines which system features and
                operations this user can access.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-400">
              User management
            </span>

            <div className="flex gap-2">
             
              <Button
                onClick={onClose}
              className="flex gap-2"
              variant="contained"
              color="warning"
                type="submit"
                sx={{
                  fontSize:"10px",
                  textTransform:"none"
                }}
              >
                <Save size={14} />
                Cancel
              </Button>

              <Button

              className="flex gap-2"
              variant="contained"
              color="success"
                type="submit"
                sx={{
                  fontSize:"10px",
                  textTransform:"none"
                }}
              >
                <Save size={14} />
                {isSubmitting ? "Saving ..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </RightPanel>
  );
}

export default UserRightPanel;