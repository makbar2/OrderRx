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
import { MedicationSearch } from "./MedicationSearch";

export default  function PatientMedication(
    {patient,setPatient,medicationList,setMedicationList} : 
    {
        patient : Patient | undefined,
        setPatient:React.Dispatch<React.SetStateAction<Patient | undefined>>,
        medicationList : Medication[] | undefined,
        setMedicationList: React.Dispatch<React.SetStateAction<Medication[]>>;

    })
{   
    return (
        <>
            <div>
                <h2>Patient Medication</h2>
                <Table className="pl-2 table-fixed">
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
                        <TableRow className="">
                            <TableCell className="">
                                <MedicationSearch medicationList={medicationList} setMedicationList={setMedicationList} />
                            </TableCell>
                            <TableCell>
                                <button className="cursor-pointer text-green-500 " onClick={() => addMedication}>Add</button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    );
    
}

function addMedication()
{
    try{
        const response = await fetch("");
    }catch(error)
    {
        console.log(error)
    }
}