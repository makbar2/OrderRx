import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BrowserRouter, Route, Routes } from "react-router";
import OrderToday from "../OrderToday";
import PatientSearch from "./PatientSearch/PatientSearch";
import GpSurgeries from "./GpSurgeries";
import PatientForm from "./PatientForm/PatientForm";
import { useState } from "react";
export default function Dashboard()
{
    const [title,setTitle] = useState("Today's Orders");
    return (
        <BrowserRouter>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <div className="flex items-center">
                        <SidebarTrigger />
                        <h1 className="ml-4">{title}</h1>
                    </div>
                    <Routes>
                        <Route path="/" element={<OrderToday />}/>
                        <Route path="/patients" element={<PatientSearch setTitle={setTitle} />}/>
                        <Route path="/patients/new" element={<PatientForm setTitle={setTitle} />}/>
                        <Route path="/gp" element={<GpSurgeries />}/>
                        <Route path="/patients/:id" element={<PatientForm setTitle={setTitle}/>} />
                    </Routes>
                </main>
            </SidebarProvider>
        </BrowserRouter>
    );
}