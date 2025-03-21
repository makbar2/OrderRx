import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
export default function Dashboard()
{
    return (

        <SidebarProvider>
        <AppSidebar />
        <main>
        <SidebarTrigger />
    
        </main>
    </SidebarProvider>
    );
}