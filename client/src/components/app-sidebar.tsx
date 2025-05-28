import { Calendar, Home, Hospital, Inbox, Pill, Search, Settings, User } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Search,
  },
  {
    title: "Gp Surgeries",
    url: "/gp",
    icon: Hospital,
  },
  {
    title: "Add a  Patient",
    url: "/patients/new",
    icon: User,
  },
  {
    title: "Medications",
    url: "/medications",
    icon: Pill,
  }

]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <div  className="p-8 ">
        <Button  onClick={() => { logout() }}>
          Logout
        </Button>
      </div>
    </Sidebar>
  )
}


async function logout() {
  try{
    const response = await fetch("https://localhost:7295/logout", {
      method: "POST", 
      credentials: 'include',
    });
    if(response.status === 200)
    {
      console.log("user logged out")
    }else{
      const data = await response.json();
      console.log(data);
    }
  }catch(error)
  {
    console.log(error);
  }
}