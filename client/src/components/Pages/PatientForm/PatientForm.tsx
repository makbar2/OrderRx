import { useState, useEffect } from "react";
import Patient from "@/Interfaces/Patient";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Medication from "@/Interfaces/Medication";
import PatientMedication from "./PatientMedication";
import { formatPatient } from "@/Services/formatData";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/DatePicker";

export default function PatientForm({setTitle}: {setTitle : React.Dispatch<React.SetStateAction<string>>})
{ 
    
    const { id } = useParams<{ id: string }>();
    const[patient,setPatient] = useState<Patient>();
    const[medicationList, setMedicationList] = useState<Medication[]>([]);
    const [responseMessage, setResponseMessage] = useState({
        type: "",
        message: ""
    }); 
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) 
    {
        e.preventDefault();
        try
        {
            console.log(gp); // Logging the form data for debugging
            const response = await fetch("https://localhost:7295/gpSurgeries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Name: gp.name,
                    Address: gp.address,
                    Email: gp.email,
                    PhoneNumber: gp.phoneNumber
                })
            });
            if(response.ok) 
            {
                setResponseMessage({
                    message: "GP surgery successfully added",
                    type: "success"
                });
                setGp({
                    name: "",
                    address: "",
                    email: "",
                    phoneNumber: ""
                });
            } else {
                throw new Error(`Response returned ${response.status} ${response.statusText}`);
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
        fetchMedicationList(setMedicationList);
        if(id) 
        {
            fetchPatientDetails(id, setPatient);
            
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
                    {
                        //to get rid of that annoying error
                        patient ? <PatientMedication patient={patient} setPatient={setPatient} medicationList={medicationList} setMedicationList={setMedicationList}/> : ""
                    }
                    <Button>Save</Button>
                </div>
            </form>
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