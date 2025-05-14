import { useEffect, useState} from "react";
import Patient from "../../../Interfaces/Patient";
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaintBucket } from "lucide-react";



export default function OrderDialog({ patient }: { patient: Patient })
{
    const [medications,setMedications] = useState<Medication[]>([]);
    const [responseMessage, setResponseMessage] = useState({
        type: "",
        message: ""
    }); 

    return(
        <>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={
                    ()=>{
                        getMedications(setMedications,setResponseMessage,patient.id);
                    }
                    }>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>View Order</DialogTitle>
                <DialogDescription>
                    Send an order for : {`${patient.firstName} ${patient.surname} : ${patient.dob}`}. 
                   
                </DialogDescription>
                </DialogHeader>
                    Their medications are: 
                    <Table className="pl-2 table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Medication Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {medications?.map((med : Medication) =>(
                            <TableRow key={med.id}>
                                <TableCell >{med.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}


async function getMedications(setMedications : React.Dispatch<React.SetStateAction<Medication[]>>, setResponseMessage: React.Dispatch<React.SetStateAction<{ type: string; message: string }>>,patientId : number) 
{
    const response = await fetch(`https://localhost:7295/patients/${patientId}/medications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(response.ok)
        {
            const data = await response.json();

            const meds : Medication[] = data.map(i=> ({
                id : i.medication.id,
                name : i.medication.name,
            }));
            /**
             * the endpoint is sending back
             * [
                {
                    "medication": {
                        "id": 10,
                        "name": "Cetirizine Hydrochloride"
                    }
                },
                {
                    "medication": {
                        "id": 7,
                        "name": "EPICOCCUM NIGRUM"
                    }
                }
                ]
            */
            console.log(meds);
            setMedications(meds);
        }else if(response.status === 404)
        {
            setResponseMessage({
                type:"error",
                message : "There are no medications for this user, you're not able to place an order"
            });
        }else{
            setResponseMessage({
                type:"error",
                message : "Unable to access the endpoint"
            })
        }
}