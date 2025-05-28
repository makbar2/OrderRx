import { Input } from "@/components/ui/input";
import {useEffect } from "react";
import Patient from "../Interfaces/Patient";
export default function PatientSearch(
    {setPatients,setSearchQuery,searchQuery}
    :
    {setPatients:React.Dispatch<React.SetStateAction<Patient[]>>,setSearchQuery:React.Dispatch<React.SetStateAction<string>>,searchQuery:string}
)
{
    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length >= 3) {
                const searchResults = await getResults(searchQuery);
                if(searchResults.length === 0 )
                {
                    setPatients([]);
                }else{
                    setPatients(searchResults);
                }
                console.log(searchResults);
            }else{
                setPatients([]);
            }
        };
        fetchResults();

    },[searchQuery, setPatients]);
    return(
        <>
            <div>
                <label htmlFor="patientSearch">Search for a patient</label>
                <Input type="text" name="patientSearch" placeholder="patient name"  onChange={(e)=>{setSearchQuery(e.target.value)}}/>
            </div>
        </>
    );
}

async function getResults(searchTerm:string):Promise<Patient[]>
{
    const result: Patient[] = [];
    const response = await fetch(`https://localhost:7295/patients/search?query=${searchTerm}`,{
        method : "GET",
        credentials: "include",
        headers:{
            "Content-Type": "application/json"
        },
    });
    if(!response.ok )
    {
        console.log(response.status)
    }else{
        const data = await response.json();
        //because we dont need to only store identifiying infromation 
        data.forEach(i => {
            const newPatient : Patient= {
                id : i.id,
                firstName : i.firstName,
                surname: i.surname,
                email: i.email,
                phoneNumber : i.phoneNumber,
                address : i.address,
                postcode : i.postcode, 
                dob : i.dob
            }
            result.push(newPatient);
        });
    }
    return result;
}
