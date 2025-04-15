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
import { Textarea } from "@/components/ui/textarea"

import GpSurgeries from "../GpSurgeries";
import OrderToday from "@/components/OrderToday";

export default function PatientForm({setTitle}: {setTitle : React.Dispatch<React.SetStateAction<string>>})
{ 
    
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient>({
        id: 0,
        firstName: "",
        surname: "",
        dob: "",
        email: "",
        phoneNumber: "",
        address: "",
        postcode: "",
        notes: "",
        gp: undefined,
        patientMedication: [],
        collectionDate: null,
        orderDate: "",
        orderFrequency: 0,
        active: false,
    });
    const[medicationList, setMedicationList] = useState<Medication[]>([]);
    const[gpList, setGpList] = useState<GpPractice[]>([]);
    const [forecastedDates,setForecastedDates] = useState<string[]>([]);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [responseMessage, setResponseMessage] = useState({
        type: "",
        message: ""
    }); 


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) 
    {
        const { name, value } = e.target;
        setPatient((prev) => ({
          ...prev,
          [name]: value,
        }));
    }

    function handleDateChange(name: string, date: string) {//ai gen mostliekyl slop cba 
        // Create a new Date object from the ISO string
        const formattedDate = formatToYYYYMMDD(date);
        // Update the patient's date field
        setPatient((prev) => ({
            ...prev,
            [name]: formattedDate
        }));
    }
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) 
    {
        e.preventDefault();
        console.log(patient);

    }

    

    useEffect(()=>{
        setTitle("Patient Info");
        fetchLists(setGpList,setMedicationList);
        if(id) 
        {
            fetchPatientDetails(id, setPatient);
            setIsNew(false);
            if(patient.collectionDate)
            {

                const dates = generateDates(patient.collectionDate,patient.orderFrequency)
            }
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
                                <Input name="firstName" type="text" value={patient.firstName } onChange={handleInputChange}></Input>
                            </div>
                            <div>
                                <label htmlFor="surname">Surname</label>
                                <Input type="text" name="surname" value={patient.surname } onChange={handleInputChange}></Input>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label > Date of Birth </label>
                            <DatePicker value={patient.dob} onChange={handleDateChange} name="dob"/>
                        </div>
                        <div className="flex">
                            <div className="pr-5">
                                <label htmlFor="address">Address</label>
                                <Input className="w-60" name="address" type="text" value={patient.address } onChange={handleInputChange}></Input>
                            </div>
                            <div>
                                <label >Post Code</label>
                                <Input className="w-20"  name="postcode" type="text" value={patient.postcode }  onChange={handleInputChange}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>GP Details</h2>
                        <div className="flex">
                          <GpSearch gpList={gpList} patient={patient}  setPatient={setPatient}/>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label > Order date </label>
                        <DatePicker value={patient?.dob}/>
                        <label > Order frequency in days  </label>
                        <Input type="number" className="w-25"></Input>
                        <label>Collection Date</label>
                        <DatePicker value={patient?.dob} setPatient={patient}/>
                        <div>
                            <h3>Forecasted Dates</h3>

                        </div>
                    </div>
                    <div>
                    {
                        
                        <PatientMedication patient={patient} setPatient={setPatient} medicationList={medicationList} setMedicationList={setMedicationList}/> 
                    }
   
                        <h2> Patient Notes</h2>
                        <Textarea  rows={3} value={patient.notes} onChange={handleInputChange}/>

                    </div>

                    <Button className="mt-4">Save</Button>
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


function generateDates(startDate:string, frequency:number) : string[]
{
    const dates = [];
    const date = new Date(startDate);
    for (let i = 0; i < 5; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(date.getDate() + i * frequency);
        dates.push(newDate.toDateString());
      }
    return dates;
}

function formatToYYYYMMDD(isoDateString) {
    const date = new Date(isoDateString);  // Convert the string to a Date object
    const year = date.getUTCFullYear();    // Get the full year
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get the month (pad single digits)
    const day = String(date.getUTCDate()).padStart(2, '0');         // Get the day (pad single digits)
    return `${year}-${month}-${day}`;      // Format it to 'yyyy-mm-dd'
}