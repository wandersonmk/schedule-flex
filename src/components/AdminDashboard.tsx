import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FilterSection } from "./admin/FilterSection";
import { AppointmentsTable } from "./admin/AppointmentsTable";

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

export const AdminDashboard = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Profissional,Cliente,Data,Horário,Status\n" +
      filteredAppointments.map(row => 
        `${row.id},${row.professional},${row.client},${row.date},${row.time},${row.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agendamentos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    setProfessionalFilter("");
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Dados
        </Button>
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

      <AppointmentsTable appointments={filteredAppointments} />
    </div>
  );
};