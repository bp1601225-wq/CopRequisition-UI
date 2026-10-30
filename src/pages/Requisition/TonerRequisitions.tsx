
import { useState } from "react";
import {
  type RequisitionFormData,
  type RequisitionItemForm,
} from "../../GlobalTypes";
import { Button } from "@mui/material";
import {
  Plus,
  Trash2,
  Printer,
  Send,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useRequisitionStore } from "../../components/ZustandShare/RequisitionZuts";





function TonerRequisitions() {
  const [Request, setRequest] = useState<RequisitionItemForm[]>([]);
  const [Reason, setReason] = useState("");
  const [Description, setDescription] = useState("");
  const [Quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const {TonerRequisitions} = useRequisitionStore()


  function CreateRequest() {
    if (!Description.trim()) {
      toast.error("Enter a toner description");
      return;
    }

    if (!Number.isInteger(Quantity) || Quantity < 1) {
      toast.error("Enter a valid quantity");
      return;
    }

    setRequest((previous) => [
      ...previous,
      {
        description: Description.trim(),
        quantityRequested: Quantity,
      },
    ]);

    setDescription("");
    setQuantity(1);
    toast.success("Toner added");
  }

  function RemoveRequest(index: number) {
    setRequest((previous) => previous.filter((_, i) => i !== index));
  }

  function ClearRequest() {
    setRequest([]);
    setReason("");
    setDescription("");
    setQuantity(1);
  }

  async function SubmitRequest() {

    try {

      setIsLoading(true)

    if (!Request.length) {
      toast.error("Add at least one toner");
      return;
    }

    if (!Reason.trim()) {
      toast.error("Enter a reason");
      return;
    }

    
    const payload: RequisitionFormData = {
      reason: Reason.trim(),
      items: Request,
      requisitionType:"TONER"
    };


    await TonerRequisitions(payload)

    console.log("Complete Toner Requisition:", payload);
    // toast.success("Requisition logged to console");

  } catch (error){
      //  store handles error
    } finally {
setIsLoading(false)
    }

  }

  const TotalQuantity = Request.reduce(
    (total, item) => total + item.quantityRequested,
    0
  );

  const inputClass =
    "h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-blue-500";

  return (
    <div className="bg-slate-50 p-2 text-xs text-slate-700">
  <div className="mx-auto max-w-6xl space-y-2 ">

        {/* Header */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Printer size={19} className="text-blue-600" />

          <h1 className="text-base font-semibold text-slate-800">
            Toner Requisition
          </h1>

          <span className="ml-auto text-xs text-slate-500">
            {Request.length} items · {TotalQuantity} units
          </span>
        </div>

        {/* Add Item */}
        <section className="rounded border border-slate-200 bg-white">
          <h2 className="border-b border-slate-100 px-2 py-1.5 font-semibold text-slate-800">
            Add Toner
          </h2>

          <div className="grid grid-cols-1 items-end gap-2 p-2 sm:grid-cols-[minmax(0,1fr)_100px_auto]">
            <div>
              <label className="mb-1 block text-xs text-slate-600">
                Description
              </label>

              <input
                className={inputClass}
                placeholder="e.g. HP 107A"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    CreateRequest();
                  }
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-600">
                Quantity
              </label>

              <input
                className={inputClass}
                type="number"
                min={1}
                step={1}
                value={Quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
              />
            </div>

            <Button
              variant="contained"
              size="small"
              startIcon={<Plus size={14} />}
              onClick={CreateRequest}
              sx={{
                height: 32,
                minWidth: 0,
                px: 1.5,
                borderRadius: "4px",
                boxShadow: "none",
                textTransform: "none",
                fontSize: "12px",
                bgcolor: "#fd7e02",
                "&:hover": {
                  bgcolor: "#e96f00",
                  boxShadow: "none",
                },
              }}
            >
              Add
            </Button>
          </div>
        </section>

        {/* Items */}
        <section className="overflow-hidden rounded border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-2 py-1.5">
            <h2 className="font-semibold text-slate-800">
              Requested Toners
            </h2>
            <span className="text-xs text-slate-500">
              {Request.length} items
            </span>
          </div>

          {Request.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-slate-400">
              No items added.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="w-10 px-2 py-1.5 font-medium">#</th>
                    <th className="px-2 py-1.5 font-medium">Description</th>
                    <th className="w-28 px-2 py-1.5 font-medium">Quantity</th>
                    <th className="w-16 px-2 py-1.5 text-center font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Request.map((item, index) => (
                    <tr
                      key={`${item.description}-${index}`}
                      className="border-t border-slate-100"
                    >
                      <td className="px-2 py-2 text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-2 py-2 font-medium text-slate-800">
                        {item.description}
                      </td>

                      <td className="px-2 py-2">
                        {item.quantityRequested}
                      </td>

                      <td className="px-2 py-1 text-center">
                        <Button
                          variant="text"
                          size="small"
                          aria-label={`Remove ${item.description}`}
                          onClick={() => RemoveRequest(index)}
                          sx={{
                            minWidth: 28,
                            width: 28,
                            height: 28,
                            p: 0,
                            color: "#64748b",
                            "&:hover": {
                              bgcolor: "#fef2f2",
                              color: "#dc2626",
                            },
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Reason */}
        <section className="rounded border border-slate-200 bg-white p-2">
          <label className="mb-1 block font-semibold text-slate-700">
            Reason for Requisition
          </label>

          <textarea
            rows={2}
            maxLength={500}
            value={Reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full resize-y rounded border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-blue-500 h-40"
          />

          <p className="mt-0.5 text-right text-[10px] text-slate-400">
            {Reason.length}/500
          </p>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<RotateCcw size={13} />}
            onClick={ClearRequest}
            disabled={
              Request.length === 0 &&
              !Reason &&
              !Description &&
              Quantity === 1
            }
            sx={{
              height: 30,
              minWidth: 0,
              px: 1.25,
              borderRadius: "4px",
              borderColor: "#cbd5e1",
              color: "#475569",
              textTransform: "none",
              fontSize: "12px",
            }}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<Send size={13} />}
            onClick={SubmitRequest}
            disabled={Request.length === 0 || !Reason.trim()}
            sx={{
              height: 30,
              minWidth: 0,
              px: 1.5,
              borderRadius: "4px",
              boxShadow: "none",
              bgcolor: "#fd7e02",
              textTransform: "none",
              fontSize: "12px",
              "&:hover": {
                bgcolor: "#e96f00",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: "#e2e8f0",
                color: "#94a3b8",
              },
            }}
          >
            {isLoading ? "Submitting ..." : "Submit Requisition"}
          </Button>
        </div>

      </div>
    </div>
  );
}

export default TonerRequisitions;
