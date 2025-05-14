import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Patient from "@/Interfaces/Patient";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Medication from "@/Interfaces/Medication";
import PatientMedication from "./PatientMedication";
import { formatPatient } from "@/Services/formatData";
import { Button } from "@/components/ui/button";

import GpPractice from "@/Interfaces/GpPractice";
import GpSearch from "./GpSearch";
import { Textarea } from "@/components/ui/textarea";
import FormAlert from "@/components/FormAlert";
import formatDate from "@/utils/formatDate";



export default function PatientForm({setTitle}: {setTitle : React.Dispatch<React.SetStateAction<string>>})
{ 
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient>({
        id: 0,
        firstName: "",
        surname: "",
        dob: "",
        address: "",
        postcode: "",
        notes: "",
        gp: undefined,
        patientMedication: [],
        collectionDate: "",
        orderDate: "",
        orderFrequency: 0,
        active: false,
    });
    const[medicationList, setMedicationList] = useState<Medication[]>([]);
    const[gpList, setGpList] = useState<GpPractice[]>([]);
    const [forecastedDates,setForecastedDates] = useState<string[]>([]);
    const [isNew, setIsNew] = useState<boolean>(true);
    const location = useLocation();
    const stateMessage = location.state?.message;
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


    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newPatient = wrapMedication(patient);
        console.log(newPatient);
        try 
        {
            if(isNew) 
            {
                const data = await createPatient(newPatient);
                setResponseMessage({ type: "success", message: "Patient created successfully." });
                navigate(`/patients/${data.id}`,{
                    state : {message : "Patient created successfully."}
                });
            }else{
                await updatePatient(newPatient);
                setResponseMessage({ type: "success", message: "Patient updated successfully." });
            }
        } catch (error: any) 
        {
            console.error("Submission error:", error);
            setResponseMessage({ type: "error", message: error.message });
        }
    }
    
    useEffect(()=>{
        setTitle("Patient Info");
        fetchLists(setGpList,setMedicationList);
        if(id) 
        {
            fetchPatientDetails(id, setPatient);
            setIsNew(false);
            if(stateMessage) 
            {
                setResponseMessage({ type: "success" , message: "Patient Successfully Created" });
            }
            if(patient.collectionDate)
            {

                const dates = generateDates(patient.collectionDate,patient.orderFrequency);
                setForecastedDates(dates);
            }
        }
    },[])

    useEffect(()=>{
        if(patient.collectionDate)
        {
            const dates = generateDates(patient.collectionDate,patient.orderFrequency);
            console.log(dates);
            setForecastedDates(dates);
            
        }

    },[patient.collectionDate,patient.orderFrequency,patient.orderDate])
    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className="pl-20 pr-10">
                    {responseMessage.type !== "" && <FormAlert type={responseMessage.type} message={responseMessage.message} />}
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
                            <Input type="date" value={patient.dob} onChange={handleInputChange} name="dob" className="w-45"/>
                         
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
                        <Input type="date" value={formatDate(patient.orderDate)} onChange={handleInputChange} name="orderDate" />
                       
                        <label > Order frequency in days  </label>
                        <Input type="number" className="w-25" onChange={handleInputChange} name="orderFrequency" value={patient.orderFrequency}></Input>
                        <label>Collection Date</label>
                        <Input type="date" value={formatDate(patient.collectionDate)} onChange={handleInputChange} name="collectionDate"/>
                        <div>
                            <h3>Forecasted Dates</h3>
                            {
                                forecastedDates.map(date =>(
                                    <p>{date}</p>
                                ))
                            }
                        </div>
                    </div>
                    <div>
                    {
                        
                        <PatientMedication patient={patient} setPatient={setPatient} medicationList={medicationList} setMedicationList={setMedicationList}/> 
                    }
   
                        <h2> Patient Notes</h2>
                        <Textarea  rows={3} value={patient.notes} onChange={handleInputChange} name="notes"/>

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



async function createPatient(patient: Patient) {
    const response = await fetch(`https://localhost:7295/patient/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
    });
    if (response.status !== 201) {
        throw new Error(`Create failed: ${response.statusText}`);
    }

    return await response.json();
}

async function updatePatient(patient: Patient) {
    const response = await fetch(`https://localhost:7295/patient/${patient.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
    });
    console.log(response);

    if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`);
    }

    return await response.json();
}

function wrapMedication(ogPatient:Patient) : Patient
{
    const medicationList = ogPatient.patientMedication?.map((medication : Medication) =>( 
         ({Medication: medication})
        )) ??[];
    const patient : Patient = {
        ...ogPatient,
        patientMedication: medicationList
    }
    return patient;
}


function generateDates(startDate:string, frequency:number) : string[]
{
    const startDateObject = new Date(startDate);
    const dates = [];
    for(let i = 1;i<=5; i++)
    {
        const newDate = new Date(startDateObject);
        newDate.setDate(newDate.getDate() + frequency * i);
        console.log(frequency);
        dates.push(newDate.toDateString());
    }
    return dates;
}

