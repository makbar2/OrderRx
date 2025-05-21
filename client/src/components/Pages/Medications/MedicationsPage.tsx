import Patient from "../../../Interfaces/Patient";
import { useState ,useEffect } from "react";
import PatientSearchBar from "./PatientSearchBar";
import PatientTable from "../../PatientTable";

export default function MedicationsPage({ setTitle }: { setTitle: React.Dispatch<React.SetStateAction<string>> }) {
    useEffect(() => {
        setTitle("Patient Search");
    }, []);
    const [searchQuery,setSearchQuery] = useState("");
    const [medications, setMedications] = useState<Medication[]>([]);
    return (
        <>
            <div className="pl-50 pr-50">
                <div className="">
                    <Me searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPatients={setPatients} />
                </div>
                <div>
                    <PatientTable patients={patients} mode={0} />
                </div>
        
            </div>
        </>
    );
}

async function getMedications()
{
    const response = await fetch(`https://localhost:7295/medications/search${query}`,{
        method : "GET",
        headers:{
            "Content-Type": "application/json"
        },
    });
}