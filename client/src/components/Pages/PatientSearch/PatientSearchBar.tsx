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
    let query = "";
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    if(dateRegex.test(searchTerm) === true)
    {
        const stringArray = searchTerm.split("/");
        searchTerm = "";
        let count = stringArray.length-1;
        while(count >= 0)
        {
           searchTerm = `${searchTerm}${stringArray[count]}%2F`;
           count = count -1;
        }
        searchTerm = searchTerm.slice(0,-3); 

        query = `?dob=${searchTerm}`;
    }else{
        query = `?surname=${searchTerm}`;
    }
    const response = await fetch(`https://localhost:7295/patients/search${query}`,{
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
