import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BrowserRouter, Route, Routes } from "react-router";
import OrderToday from "./OrderToday";
import PatientSearch from "./PatientSearch";
import GpSurgeries from "./GpSurgeries";
export default function Dashboard()
{
    return (
        <BrowserRouter>
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <div className="flex items-center">
                        <SidebarTrigger />
                    </div>
                    <Routes>
                        <Route path="/" element={<OrderToday />}/>
                        <Route path="/patients" element={<PatientSearch />}/>
                        <Route path="/gp" element={<GpSurgeries />}/>
                    </Routes>
                </main>
            </SidebarProvider>
        </BrowserRouter>
    );
}