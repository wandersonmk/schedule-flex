import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Calendar, Download, Filter, List } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = [
    {
      title: "Agendamentos",
      icon: List,
      url: "/admin",
      tooltip: "Ver todos os agendamentos",
    },
    {
      title: "Calendário",
      icon: Calendar,
      url: "/admin/calendar",
      tooltip: "Visualizar calendário",
    },
    {
      title: "Filtros Avançados",
      icon: Filter,
      url: "/admin/filters",
      tooltip: "Aplicar filtros avançados",
    },
    {
      title: "Exportar Dados",
      icon: Download,
      url: "/admin/export",
      tooltip: "Exportar dados do sistema",
    },
  ];

  return (
    <Sidebar
      className="shadow-lg transition-all duration-300 ease-in-out"
      variant="floating"
    >
      <SidebarContent className="bg-gradient-to-b from-primary-100 to-primary-200">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-800 font-semibold px-4 py-2">
            Administração
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="px-2">
                  <SidebarMenuButton
                    asChild
                    tooltip={isCollapsed ? item.tooltip : undefined}
                    className="group transition-all duration-200 hover:bg-white/20 active:scale-95 rounded-lg"
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 p-3 text-primary-800 hover:text-primary-900"
                    >
                      <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <span className="font-medium transition-opacity duration-200">
                        {item.title}
                      </span>
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