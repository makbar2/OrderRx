import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BrowserRouter, Route, Routes } from "react-router";
export default function Dashboard()
{
    const [title,setTitle] = useState("");
    return (
        <BrowserRouter>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <div className="flex items-center">
                        <SidebarTrigger />
                        <h1 className="ml-4">{title}</h1>
                    </div>
                </main>
            </SidebarProvider>
        </BrowserRouter>
    );
}