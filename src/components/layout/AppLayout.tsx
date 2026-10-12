import { useState } from "react";
import { LogOut, Menu, TriangleAlert, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import SidebarComponent from "../SideBar/Sidebar";
import Pentecost from "../../assets/Pentecost.jpg"
import { Button } from "@mui/material";
import ModalOpen from "../Modal/Modal";
import { useNavigate } from "react-router-dom";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [IsLogout, setIsLogout] = useState<boolean>(false)


  const navigate = useNavigate()

function handleLogout(){
  localStorage.clear()
  navigate("/auth")
}



  return (
    <div className="min-h-screen ">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <SidebarComponent
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="min-h-screen md:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-30 h-14 border-b border-slate-200 bg-white">
          <div className="flex h-full items-center justify-between px-3 md:px-6">

            <div className="flex min-w-0 items-center gap-2">

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 md:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <h2 className="truncate text-xs font-semibold text-slate-900 md:text-sm flex items-center gap-2">
             <img src={Pentecost} width={30} />
                Church of Pentecost 
                {" "}
                <span className="text-blue-500">
                  Requisition System
                  </span>
              </h2>

            </div>



<Button
onClick={()=>{
  setIsLogout(true)
}}

className="flex items-center gap-2"
variant="outlined"
color="warning"
sx={{
  fontSize:"14px",
  textTransform:"none"
}}
>
  <LogOut size={18}/>
  Logout
</Button>
         
<ModalOpen
  isOpen={IsLogout}
  onClose={() => setIsLogout(false)}
  modalClassName="w-[480px] max-w-[95vw]"
>
  <div className="w-full rounded-xl bg-white p-3 sm:p-4">

    <div className="flex items-start gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
        <TriangleAlert size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold text-slate-900">
          Confirm Logout
        </h2>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          Are you sure you want to log out of your account?
          You will need to sign in again to access your dashboard.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsLogout(false)}
        className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close"
      >
        <X size={18} />
      </button>

    </div>

    <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">

      <button
        type="button"
        onClick={() => setIsLogout(false)}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() => {
          setIsLogout(false);
          handleLogout();

          
        }}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98]"
      >
        <LogOut size={16} />
        Yes, Logout
      </button>

    </div>

  </div>
</ModalOpen>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-2 md:p-3">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AppLayout;