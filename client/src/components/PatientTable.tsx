import Patient from "../Interfaces/Patient";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";  
import { Button } from "./ui/button";
export default function PatientTable({patients,mode=0}: {patients:Patient[],mode:number})
{
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Date Of Birth</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Post Code</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.map((patient : Patient)=>(
                        <TableRow key={patient.id}>
                            <TableCell>{`${patient.firstName} ${patient.surname}`}</TableCell>
                            <TableCell>{patient.dob}</TableCell>
                            <TableCell>{patient.address}</TableCell>
                            <TableCell>{patient.postcode}</TableCell>
                            <TableCell>
                                <Button>Edit</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}