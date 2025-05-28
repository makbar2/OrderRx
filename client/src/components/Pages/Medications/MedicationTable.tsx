import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";  
import Medication from "@/Interfaces/Medication";
import { Button } from "@/components/ui/button";
export default function MedicationTable({medications, setMedications} : {medications: Medication[], setMedications : React.Dispatch<React.SetStateAction<Medication[]>>})
{
    return(
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-240px">Medication Id</TableHead>
                        <TableHead className="min-w-240px">Medication Name</TableHead>
                        <TableHead className="min-w-240px"></TableHead>
                        <TableHead className="min-w-240px"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {medications.map((medication : Medication)=>(
                        <TableRow key={medication.id}>
                            <TableCell>{medication.id}</TableCell>
                            <TableCell>{medication.name}</TableCell>
                            <TableCell><Button type="button">Delete</Button></TableCell>
                            <TableCell><Button type="button">Edit</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}


async function DeleteMedication(medicationId: number, setMedications: React.Dispatch<React.SetStateAction<Medication[]>> ,medications: medications[]) {
    /**
     * need to tell the user which patients have that medication in their records, ask them if thye want to remove it or not
     */
}

async function editMedication(medicationId: number) {
    
}