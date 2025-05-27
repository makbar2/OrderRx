import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { DashboardTitleContext } from "@/contexts/DashboardTitleContext";
export default function Dashboard()
{
    const [title, setTitle] = useState("");
    return (
       <DashboardTitleContext.Provider value={setTitle}>
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="flex items-center">
                    <SidebarTrigger />
                    <h1 className="ml-4">{title}</h1>
                </div>
                <Outlet />
            </main>
        </SidebarProvider>
       </DashboardTitleContext.Provider>
       
    );
}