import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Filter,
  Users,
  UserCircle,
  Bell,
  BarChart2,
  Settings,
  DollarSign,
  FileDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";

export const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useLogout();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Calendar, label: "Agenda", path: "/admin/calendar" },
    { icon: Filter, label: "Filtros", path: "/admin/filters" },
    { icon: Users, label: "Profissionais", path: "/admin/professionals" },
    { icon: UserCircle, label: "Clientes", path: "/admin/clients" },
    { icon: Bell, label: "Notificações", path: "/admin/notifications" },
    { icon: BarChart2, label: "Relatórios", path: "/admin/reports" },
    { icon: Settings, label: "Configurações", path: "/admin/settings" },
    { icon: DollarSign, label: "Financeiro", path: "/admin/financial" },
    { icon: FileDown, label: "Exportar", path: "/admin/export" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <div className="flex-1 py-6 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-6 py-2 text-gray-600 hover:bg-gray-50",
              isActive(item.path) && "bg-gray-50 text-primary font-medium"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="p-6 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-600"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};