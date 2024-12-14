import { DashboardMetrics } from "./admin/dashboard/DashboardMetrics";
import { AppointmentsChart } from "./admin/dashboard/AppointmentsChart";

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
      </div>

      <DashboardMetrics />
      <AppointmentsChart />
    </div>
  );
};