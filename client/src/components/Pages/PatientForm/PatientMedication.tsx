import Patient from "@/Interfaces/Patient";
import Medication from "@/Interfaces/Medication";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";  
import { MedicationSearch } from "./MedicationSearch";
import { useState } from "react";


export default  function PatientMedication(
    {patient,setPatient,medicationList,setMedicationList} : 
    {
        patient : Patient,
        setPatient:React.Dispatch<React.SetStateAction<Patient>>,
        medicationList : Medication[],
        setMedicationList: React.Dispatch<React.SetStateAction<Medication[]>>;

    })
{   

    async function deleteMedication(patientId:number, medication : Medication)
    {
        try{
            if(medication)
            {
   
                const newMedList = patient.patientMedication?.filter((i:Medication) => i.id !== medication.id);
                updatePatientMedication(patient,newMedList);
            }
        }catch(error)
        {
            console.log(error);
        }
    }


    async function addMedication(patientId:number,medication : Medication | undefined)
    {       
        try{
            if(medication)
            {
                updatePatientMedication(patient,medication);
            }else{
                throw ("unable to add a non-medication object to patient" );
            }
        }catch(error)
        {
            console.log(error);
        }
    }    

    async function updatePatientMedication(patient : Patient, medication : Medication[] |  Medication) 
    {
        let updatedPatient : Patient;
        if(Array.isArray(medication))
        {
            updatedPatient = {
                ...patient,
                patientMedication: medication
            }
        }else{

            updatedPatient = {
                ...patient,
                patientMedication: [
                    ...((patient.patientMedication || []) as Medication[]),
                    medication as Medication
                ]
            };
        }
        setPatient(updatedPatient);
    }

    const [newMedication,setNewMedication] = useState<Medication>();//new medication that is being added to the patient object 
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
                                    <button type="button" className="cursor-pointer text-red-500 " onClick={()=> deleteMedication(patient.id,medication)}>Remove</button>
                                </TableCell>
                            </TableRow>
                        ))
                        //typescript error here becasue i have two types in one field, one can be Medication and the other can be Medication wrapper, medication is being used here
                        }
                        <TableRow className="">
                            <TableCell className="">
                                <MedicationSearch setNewMedication={setNewMedication} medicationList={medicationList} setMedicationList={setMedicationList} />
                            </TableCell>
                            <TableCell>
                                <button type="button" className="cursor-pointer text-green-500 " onClick={() => addMedication(patient.id,newMedication)}>Add</button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>
    );
    
}





