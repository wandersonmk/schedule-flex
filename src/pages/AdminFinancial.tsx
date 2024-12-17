import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { FinancialMetrics } from "@/components/admin/financial/FinancialMetrics";
import { RevenueChart } from "@/components/admin/financial/RevenueChart";

const AdminFinancial = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
            <FinancialMetrics />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <RevenueChart />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminFinancial;