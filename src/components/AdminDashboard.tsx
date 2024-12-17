import { DashboardMetrics } from "./admin/dashboard/DashboardMetrics";
import { AppointmentsChart } from "./admin/dashboard/AppointmentsChart";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <Button
          onClick={() => navigate("/admin/calendar")}
          className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Agendamento
        </Button>
      </div>

      <DashboardMetrics />
      <AppointmentsChart />
    </div>
  );
};