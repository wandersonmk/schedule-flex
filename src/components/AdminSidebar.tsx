import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Calendar, Download, Filter, List } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminSidebar = () => {
  const menuItems = [
    {
      title: "Agendamentos",
      icon: List,
      url: "/admin",
    },
    {
      title: "Calendário",
      icon: Calendar,
      url: "/admin/calendar",
    },
    {
      title: "Filtros Avançados",
      icon: Filter,
      url: "/admin/filters",
    },
    {
      title: "Exportar Dados",
      icon: Download,
      url: "/admin/export",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};