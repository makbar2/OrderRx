import { useState, useEffect } from "react";
import Patient from "@/Interfaces/Patient";
import { useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { DatePicker } from "./DatePicker";
export default function PatientForm({setTitle})
{ 
    const id = useParams();
    const[patient,setPatient] = useState<Patient>();
    useEffect(()=>{
        const fetchDetails = async ()=>{
            try{
                const response = await fetch(`https://localhost:7295/patient/${id.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await  response.json();
                setPatient(data);
            }catch(error)
            {
                console.log(`unable to get the patient data because of this exception : ${error}`);
            }
        }
        fetchDetails();
    },[])
    return(
        <>
            <div className="pl-20 pr-10" >                
                <form>
                    <div className="flex" >
                        <div className="pr-10">
                            <label htmlFor="firstName">First Name</label>
                            <Input name="firstName" type="text" value={patient?.firstName ?? ""}></Input>
                        </div>
                        <div>
                            <label htmlFor="surname">Surname</label>
                            <Input type="text" name="surname" value={patient?.surname ?? ""}></Input>
                        </div>
                    </div>
                    <div>
                        <label> Date of Birth </label>
                        <DatePicker value={patient?.dob}/>
                    </div>

                    <div>
                        <label></label>
                    </div>
                </form>
            </div>
        </>
    );
}