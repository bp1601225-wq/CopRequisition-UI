import DataTable from "../../utils/DataGridTable";
import { type GridColDef } from "@mui/x-data-grid";

import { useStaffStore } from "../../components/ZustandShare/StaffZuts";
import { useEffect, useState } from "react";

import { UserRound, Users, ShieldCheck, ChevronDown, Filter, Search, Import, Phone, Mail } from "lucide-react";
import IsLoadingShow, { Filters } from "../../utils/utils";
import { Button } from "@mui/material";

  
  function StaffList(){
  
    const {GetStaff, Staff} = useStaffStore()

    const [isLoading, setIsLoading] = useState<boolean>(false)
  



const rows = Staff.map((staff:any)=>{

  return {
        id:staff?.id,
        firstname: staff?.firstname,
        middlename: staff?.middlename,
        lastname: staff?.lastname,

        email:staff?.email ?? "N/A",
        phone:staff?.phone,
        role:staff?.role,
        // unit: staff?.unit?.name,
        // unit_description:staff?.unit?.description,
        // position:staff?.position?.name,
        // position_descripton:staff?.position?.description
    }

})

// import type { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "firstname",
    headerName: "First Name",
    flex: 1,
    renderHeader: () => (
      <span className="flex items-center gap-2">
        <UserRound size={16} className="text-white" />
        {"First Name"}
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
        {"Middle Name"}
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
        {"Last Name"}
      </span>
    ),
  },

    {
    field: "phone",
    headerName: "phone",
    flex: 1.5,
    renderHeader: () => (
      <span className="flex items-center gap-2">
        <Phone size={16} className="text-white" />
        {"phone"}
      </span>
    ),
  },

      {
    field: "email",
    headerName: "email",
    flex: 1.5,
    renderHeader: () => (
      <span className="flex items-centPSer gap-2">
        <Mail size={16} className="text-white" />
        {"email"}
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
        {"Role"}
      </span>
    ),
  },
];

// useEffect(()=>{
//    console.log(`Staff List`,rows) 
// },[rows])


useEffect(()=>{

 async  function LoadUsers(){
    try {
      setIsLoading(true)
await GetStaff()
    } catch (error){
      //  store handles error
    } finally {
      setIsLoading(false)
    }
  }

  LoadUsers()
},[])


if (isLoading){
  return (<>
  <IsLoadingShow text = {"users"}/>
  </>)
}

// Actual UI
  return (
  <div className="space-y-5 bg-white">

    {/* PAGE HEADER */}
    <div>
    
      <p className=" flex  gap-2 items-center
      text-xs text-green-500 bg-green-50 p-2">
        View, search and manage all users in the system.


      <Button
      variant="outlined"
      color="success"
      sx={{
        display:"flex",
        gap:"3px",
        textTransform:"none",
        fontSize:"10px",
        
      }}>
        <Import />
        Import users
      </Button>
      </p>


    </div>

    {/* SEARCH & FILTERS */}
   
        <div className=" ">
          

<Filters legendLabel="Filter by phone, username email, or status " />
              
                </div>


    {/* USERS TABLE */}
    <DataTable
      rows={rows}
      columns={columns}
      loading={isLoading}
    />

  </div>
);
  }



  export default StaffList
  