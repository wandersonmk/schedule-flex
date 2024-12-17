import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { FinancialMetrics } from "@/components/admin/financial/FinancialMetrics";
import { RevenueChart } from "@/components/admin/financial/RevenueChart";
import { FilterSection } from "@/components/admin/FilterSection";
import { ExportButton } from "@/components/admin/ExportButton";
import { useState } from "react";

const AdminFinancial = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm] = useState("");
  const [professionalFilter] = useState("");

  // Mock data for export - this would be replaced with real data from your API
  const mockData = [
    {
      id: "TRX001",
      professional: "Dr. Silva",
      client: "João Santos",
      date: "2024-03-20",
      time: "09:00",
      status: "Pago",
    },
    {
      id: "TRX002",
      professional: "Dra. Costa",
      client: "Maria Oliveira",
      date: "2024-03-20",
      time: "10:00",
      status: "Pendente",
    },
  ];

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
              <ExportButton data={mockData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <FilterSection
                startDate={startDate}
                endDate={endDate}
                searchTerm={searchTerm}
                professionalFilter={professionalFilter}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onSearchTermChange={() => {}}
                onProfessionalFilterChange={() => {}}
                onResetFilters={handleResetFilters}
              />
            </div>

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