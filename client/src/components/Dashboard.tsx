import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BrowserRouter, Route, Routes } from "react-router";
import OrderToday from "./OrderToday";
import PatientPage from "./PatientPage";
import GpSurgeries from "./GpSurgeries";
import { useState } from "react";

export default function Dashboard() {
    const [title, setTitle] = useState("Today's Orders");

    return (
        <BrowserRouter>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex justify-center"> {/* Center the content horizontally */}
                    <div className="w-full max-w-screen-lg"> {/* Limit the width of the content */}
                        <div className="flex items-center mb-4"> {/* Ensure the title and sidebar trigger are on one line */}
                            <SidebarTrigger />
                            <h1 className="ml-4">{title}</h1>
                        </div>
                        <Routes>
                            <Route path="/" element={
                                <div className="flex justify-center">
                                    <OrderToday />
                                </div>
                            } />
                            <Route path="/patients" element={
                                <div>
                                    <PatientPage setTitle={setTitle} />
                                </div>
                            } />
                            <Route path="/gp" element={<GpSurgeries />} />
                        </Routes>
                    </div>
                </main>
            </SidebarProvider>
        </BrowserRouter>
    );
}
