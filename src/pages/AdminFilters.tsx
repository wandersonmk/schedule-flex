import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/components/admin/FilterSection";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const mockAppointments = [
  {
    id: "APT001",
    professional: "Dr. Silva",
    client: "João Santos",
    date: "2024-03-20",
    time: "09:00",
    status: "Confirmado",
  },
  {
    id: "APT002",
    professional: "Dra. Costa",
    client: "Maria Oliveira",
    date: "2024-03-20",
    time: "10:00",
    status: "Pendente",
  },
  {
    id: "APT003",
    professional: "Dr. Santos",
    client: "Pedro Lima",
    date: "2024-03-20",
    time: "11:00",
    status: "Cancelado",
  },
];

const AdminFilters = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    setProfessionalFilter("");
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram resetados.",
    });
  };

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const matchesId = appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProfessional = appointment.professional
      .toLowerCase()
      .includes(professionalFilter.toLowerCase());
    const matchesDateRange =
      (!startDate || appointmentDate >= startDate) &&
      (!endDate || appointmentDate <= endDate);

    return (
      (searchTerm === "" || matchesId) &&
      (professionalFilter === "" || matchesProfessional) &&
      matchesDateRange
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Filtros Avançados</h1>
            </div>

            <FilterSection
              startDate={startDate}
              endDate={endDate}
              searchTerm={searchTerm}
              professionalFilter={professionalFilter}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSearchTermChange={setSearchTerm}
              onProfessionalFilterChange={setProfessionalFilter}
              onResetFilters={handleResetFilters}
            />

            <AppointmentsTable 
              appointments={filteredAppointments}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminFilters;