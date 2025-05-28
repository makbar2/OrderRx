import { useState ,useEffect } from "react";
import MedicationTable from "./MedicationTable";
import Medication from "@/Interfaces/Medication";
import { Input } from "@/components/ui/input";
export default function MedicationsPage() {
    const [searchQuery,setSearchQuery] = useState("");
    const [medications, setMedications] = useState<Medication[]>([]);
    useEffect(() => {
        const fetchResults = async() =>{
            if (searchQuery.length >= 3) {
                const searchResults = await getResults(searchQuery);
                if(searchResults.length === 0 )
                {
                    setMedications([]);
                }else{
                    setMedications(searchResults);
                }
                console.log(searchResults);
            }else{
                setMedications([]);
            }
        }
        fetchResults();

    }, [searchQuery, setMedications]);

    return (
        <>
            <div className="pl-50 pr-50">
                <div className="">
                    <Input type="text" placeholder="type a medication name"  onChange={(e)=>{setSearchQuery(e.target.value)}}/>
                </div>
                <div>
                    <MedicationTable medications={medications}  setMedications={setMedications}/>
                </div>
        
            </div>
        </>
    );
}

async function getResults(searchTerm:string):Promise<Medication[]>
{
    const result: Medication[] = [];
    const response = await fetch(`https://localhost:7295/medications/search?query=${searchTerm}`,{
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
            const newMedication : Medication= {
                id : i.id,
                name : i.name
            }
            result.push(newMedication);
        });
    }
    return result;
}