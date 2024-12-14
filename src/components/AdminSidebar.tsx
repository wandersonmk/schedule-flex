import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Calendar, Download, Filter, List, LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
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

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logout clicked");
  };

  return (
    <Sidebar
      className="shadow-lg transition-all duration-300 ease-in-out"
      variant="floating"
    >
      <SidebarContent className="bg-gray-50 flex flex-col justify-between h-full">
        <div>
          <SidebarTrigger 
            className="fixed z-50 bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-white hover:shadow-lg"
            style={{
              left: isCollapsed ? '1rem' : '14rem',
              top: '1rem',
            }}
          >
            {isCollapsed ? <PanelLeft className="h-5 w-5 text-primary-800" /> : <PanelLeftClose className="h-5 w-5 text-primary-800" />}
          </SidebarTrigger>

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
                      className="group transition-all duration-200 hover:bg-white active:scale-95 rounded-lg hover:shadow-md"
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 p-3 text-primary-800 hover:text-primary-900"
                      >
                        <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="font-medium transition-opacity duration-200 whitespace-nowrap">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Logout Button */}
        <div className="mt-auto px-2 pb-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={isCollapsed ? "Sair do sistema" : undefined}
              className="group transition-all duration-200 hover:bg-red-50 active:scale-95 rounded-lg w-full"
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 text-red-600 hover:text-red-700 w-full"
              >
                <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium transition-opacity duration-200 whitespace-nowrap">
                  Sair
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};