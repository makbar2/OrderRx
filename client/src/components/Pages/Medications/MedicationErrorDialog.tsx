import Medication from "@/Interfaces/Medication";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MedicationErrorDialog({ medication} : 
    { medication: Medication}
)
{
    return(
        <>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={
                    ()=>{
                      
                    }
                    }>Delete Medication</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>View Order</DialogTitle>
                <DialogDescription>
                    You can't remove this medication as its in use, please go to the patient(s) record and remove it
                </DialogDescription>
                </DialogHeader>
                    {

                    }
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}

