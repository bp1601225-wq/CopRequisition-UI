
import { Button } from "@mui/material"
import { useState } from "react"
import RequisitionInformation from "./Requisition"
import TonerRequisitions from "./TonerRequisitions"

function RequsitionManagement() {
  const [selected, setSelected] = useState<"Toner" | "other">("other")

  return (
    <>
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gradient-to-r from-amber-50 via-white to-white p-2">

        <p className="mr-auto text-xs font-semibold tracking-wide">
          Click and submit preferred requisition
        </p>

        <Button
          onClick={() => setSelected("other")}
          variant={selected === "other" ? "contained" : "outlined"}
          color="success"
          sx={{
            textTransform: "none",
            fontSize: 10,
            px: 2,
            py: 0.75,
            boxShadow: "none",
          }}
        >
          Other Requisitions
        </Button>

        <Button
          onClick={() => setSelected("Toner")}
          variant={selected === "Toner" ? "contained" : "outlined"}
          color="warning"
          sx={{
            textTransform: "none",
            fontSize: 10,
            px: 2,
            py: 0.75,
            boxShadow: "none",
          }}
        >
          Toner Request
        </Button>

      </div>

      <hr className="border-amber-500" />

      {selected === "Toner" && <TonerRequisitions />}

      {selected === "other" && <RequisitionInformation />}
    </>
  )
}

export default RequsitionManagement
