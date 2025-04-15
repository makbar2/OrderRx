import { useState, useEffect } from "react";
import Patient from "@/Interfaces/Patient";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Medication from "@/Interfaces/Medication";
import PatientMedication from "./PatientMedication";
import { formatPatient } from "@/Services/formatData";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/DatePicker";
import GpPractice from "@/Interfaces/GpPractice";
import GpSearch from "./GpSearch";
import GpSurgeries from "../GpSurgeries";

export default function PatientForm({setTitle}: {setTitle : React.Dispatch<React.SetStateAction<string>>})
{ 
    
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient>({
        id: 0,
        firstName: null,
        surname: "",
        dob: "",
        email: "",
        phoneNumber: "",
        address: "",
        postcode: "",
        notes: null,
        gp: undefined,
        patientMedication: null,
        collectionDate: null,
        orderDate: null,
        orderFrequency: null,
        active: null,
    });
    const[medicationList, setMedicationList] = useState<Medication[]>([]);
    const[gpList, setGpList] = useState<GpPractice[]>([]);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [responseMessage, setResponseMessage] = useState({
        type: "",
        message: ""
    }); 
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) 
    {
        e.preventDefault();
        try
        {
            if(patient !== undefined)
            {
                if(isNew)
                {
                    
                    await createPatient(patient)
                }else{
                    await savePatientData(patient)
                }
            }
        }catch(error)
        {
            console.log("An error has occurred when trying to submit the form: " + error);
            setResponseMessage({
                message: `An error has occurred when trying to submit the form: ${error}`,
                type: "failure"
            });
        }
    }

    useEffect(()=>{
        setTitle("Patient Info");
        fetchLists(setGpList,setMedicationList);
        if(id) 
        {
            fetchPatientDetails(id, setPatient);
            setIsNew(false);
        }
    },[])
    return(
        <>
            <form onSubmit={handleSubmit}>
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
                          <GpSearch gpList={gpList} patient={patient} />
                        </div>
                    </div>
                    {
                        
                        <PatientMedication patient={patient} setPatient={setPatient} medicationList={medicationList} setMedicationList={setMedicationList}/> 
                    }
                    <Button>Save</Button>
                </div>
            </form>
        </>
    );
}


async function fetchLists(setGpList:React.Dispatch<React.SetStateAction<GpPractice[]>>,setMedicationList:React.Dispatch<React.SetStateAction<Medication[]>>) 
{
    const responseGp = await fetch(`https://localhost:7295/gpSurgeries`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const responseMedication = await fetch(`https://localhost:7295/medications`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (responseGp.status !== 200) {
        throw new Error(`Failed to fetch GP Surgeries: ${responseGp.statusText}`);
    }
    if (responseMedication.status !== 200) {
        throw new Error(`Failed to fetch Medications: ${responseMedication.statusText}`);
    }
    const gpData = await responseGp.json();
    const medData = await responseMedication.json();
    setGpList(gpData);
    setMedicationList(medData);
}


async function fetchPatientDetails(id:string ,setPatient:React.Dispatch<React.SetStateAction<Patient>>)
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




async function savePatientData(patient:Patient)
{
    // try{
    //     const response = await fetch(`https://localhost:7295/patient/${patientId}/medications`,{
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         method: "PATCH",
    //         body: JSON.stringify({
                
    //         })
    //     });
    // }catch{

    // }
}

async function createPatient(patient:Patient)
{
   
    const response = await fetch(`https://localhost:7295/patient/`,{
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            patient: patient,
        })
    });
    if(response.status !== 201)
    {
        throw new Error(response.statusText)
    }
}


