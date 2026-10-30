
import {create} from "zustand"
import type { StaffFormData } from "../../GlobalTypes"
import API, { handleAxiosError } from "../configuration/API"
import { toast } from "sonner"


type StaffType = {

Staff: StaffFormData[],
GetStaff: () => Promise<void>
CreateStaff: (data:StaffFormData) => Promise<void> 
UploadStaff: (data:StaffFormData[]) => Promise<void>
UpdateStaff: (data:StaffFormData) => Promise<void> 
DeleteStaff: () => Promise<void>

}

export const useStaffStore = create<StaffType>((set)=>({

    Staff: [],

    GetStaff: async () => {

        try {

            const response = await API.get("/users")

set ({
    Staff:response.data.data
})
        } catch (error:any){
            handleAxiosError(error)
        }
    },


    CreateStaff: async (data:StaffFormData) => {
        try {

            const response = await API.post("/users", data)


            set ((state)=>({
                Staff: [
                    ...state.Staff, response.data.data
                ]
            }))

            toast.success(response.data.message)

        } catch (error:any){
            handleAxiosError(error)
        }
    },


    UploadStaff: async (data:StaffFormData[]) => {
        try {

            const response = await API.post("/users-upload", data)

            toast.success(response.data.message)

            await useStaffStore.getState().GetStaff()

        } catch (error:any){
            handleAxiosError(error)
        }
    },


    UpdateStaff:  async (staff:StaffFormData) => {
        
        try {

            const response = await API.put(`/update-users`, staff)

set((state)=>({
    Staff: state.Staff.map((updatedStaff:StaffFormData)=>{
        return (
            updatedStaff.id === staff.id ? {...updatedStaff, 
                ...response.data.data
            } : updatedStaff
        )
    })
}

))


toast.success (response.data.message)
        } catch (error:any){
            handleAxiosError(error)
        }
    },


    DeleteStaff: async () => {

    }

}))
