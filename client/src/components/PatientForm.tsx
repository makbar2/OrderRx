import { useState, useEffect } from "react";
import Patient from "@/Interfaces/Patient";
import { useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { DatePicker } from "./DatePicker";
import Medication from "@/Interfaces/Medication";
import PatientMedication from "./PatientMedication";
import { formatPatient } from "../Services/formatData";

export default function PatientForm({setTitle}: {setTitle : React.Dispatch<React.SetStateAction<string>>})
{ 
    
    const { id } = useParams<{ id: string }>();
    const[patient,setPatient] = useState<Patient>();
    const[medicationList, setMedicationList] = useState<Medication[]>([]);
    useEffect(()=>{
        if(id) 
        {
            setTitle("Patient Info");
            fetchPatientDetails(id, setPatient);
            fetchMedicationList(setMedicationList)
        }
    },[])
    return(
        <>
            <div>
                <div className="pl-20 pr-10">
                    <div>
                        <h2>Patient Details</h2>
                        <div className="flex">
                            <div className="pr-5">
                                <label htmlFor="firstName">First Name</label>
                                <Input name="firstName" type="text" value={patient?.firstName ?? ""}></Input>
                            </div>
                            <div>
                                <label htmlFor="surname">Surname</label>
                                <Input type="text" name="surname" value={patient?.surname ?? ""}></Input>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label > Date of Birth </label>
                            <DatePicker value={patient?.dob}/>
                        </div>
                        <div className="flex">
                            <div className="pr-5">
                                <label htmlFor="address">Address</label>
                                <Input className="w-60" name="address" type="text" value={patient?.address ?? ""}></Input>
                            </div>
                            <div>
                                <label >Post Code</label>
                                <Input className="w-20"  name="postcode" type="text" value={patient?.postcode ?? ""} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>GP Details</h2>
                        <div className="flex">
                            <div className="pr-4">
                                <label>GP Name</label>
                                <Input value={patient?.gp?.name} /> 
                            </div>
                            <div className="w-60">
                                <label>Address</label>
                                <Input value={patient?.gp?.address}/>
                            </div>
                        </div>
                    </div>
                    <PatientMedication patient={patient} setPatient={setPatient} medicationList={medicationList} setMedicationList={setMedicationList}/> 
                </div>
            </div>
        </>
    );
}


async function fetchPatientDetails(id:string ,setPatient:React.Dispatch<React.SetStateAction<Patient | undefined>>)
{
    try{
        const response = await fetch(`https://localhost:7295/patient/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setPatient(formatPatient(data));
    }catch(error)
    {
        console.log(`unable to get the patient data because of this exception : ${error}`);
    }
}

async function fetchMedicationList(setMedications:React.Dispatch<React.SetStateAction<Medication[]>>) {
    try{
        const response = await fetch(`https://localhost:7295/medications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        setMedications(data);
    }catch(error)
    {
        console.log(`unable to get list of medications due this error : ${error}`);
    }
}