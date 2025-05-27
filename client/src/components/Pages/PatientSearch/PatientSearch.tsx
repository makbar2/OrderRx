import Patient from "../../../Interfaces/Patient";
import { useState ,useEffect } from "react";
import PatientSearchBar from "./PatientSearchBar";
import PatientTable from "../../PatientTable";
import { useTitle } from "@/contexts/DashboardTitleContext";

export default function PatientSearch() {
    const [searchQuery,setSearchQuery] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    const setTitle = useTitle();
    useEffect(() => {
        setTitle("Patient Search");
    }, [setTitle]);
    return (
        <>
            <div className="pl-50 pr-50">
                <div className="">
                    <PatientSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPatients={setPatients} />
                </div>
                <div>
                    <PatientTable patients={patients} mode={0} />
                </div>
        
            </div>
        </>
    );
}