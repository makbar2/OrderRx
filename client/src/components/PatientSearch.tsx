import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";  
import { useState } from "react";
export default function PatientSearch()
{
    const [query,setQuery] = useState("");
    const 
    return (
        <>
            <div>
                <label htmlFor="patientSearch">Search for a patient</label>
                <Input type="text" name="patientSearch" placeholder="patient name" />
            </div>
        </>
    );
}