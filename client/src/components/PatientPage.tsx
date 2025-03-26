import Patient from "../Interfaces/Patient";
import { useState } from "react";
import PatientSearch from "./PatientSearch";
import PatientTable from "./PatientTable";
export default function PatientPage({ setTitle } : { setTitle: React.Dispatch<React.SetStateAction<string>> })
{
    setTitle("Patient Search");
    const [searchQuery,setSearchQuery] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    return (
        <>
        <div>
            <PatientSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPatients={setPatients} />
        </div>
        <div>
            <PatientTable patients={patients} />
        </div>
        </>
    );
}