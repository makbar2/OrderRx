import Patient from "@/Interfaces/Patient";
import Medication from "@/Interfaces/Medication";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";  

export default  function PatientMedication({patient,setPatient} : {patient : Patient,setPatient:React.Dispatch<React.SetStateAction<Patient>>})
{   
    return (
        <>
            <div>
                <h2>Patient Medication</h2>
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Medication</TableHead>
                            <TableHead className="min-w-60px"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        
                    </TableBody>
                </Table>
            </div>
        </>
    );
}