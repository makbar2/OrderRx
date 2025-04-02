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
        <div>
            <h2>Patient Medication</h2>
            <Table className="table-fixed">
                <TableHeader>
                    <TableRow>
                        <TableHead>Medication Name</TableHead>
                        <TableHead className="min-w-60px">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(patient?.patientMedication || []).map((medication: Medication) => (
                        <TableRow key={medication.id}>
                            <TableCell>{medication.name}</TableCell>
                            <TableCell>
                                <button className="cursor-pointer text-red-500 ">Remove</button>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell>
                            
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
    
}