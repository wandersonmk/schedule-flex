import { useState } from "react";
import { FilterSection } from "@/components/admin/FilterSection";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateAppointmentDialog } from "@/components/admin/CreateAppointmentDialog";

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

const AdminCalendar = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState(mockAppointments);

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    setProfessionalFilter("");
  };

  const handleSaveAppointment = (appointment: {
    professional: string;
    client: string;
    date: string;
    time: string;
    status: string;
    whatsapp?: string;
    sendNotification?: boolean;
  }) => {
    const newAppointment = {
      id: `APT${(appointments.length + 1).toString().padStart(3, '0')}`,
      ...appointment
    };
    
    setAppointments([...appointments, newAppointment]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Agendamento criado",
      description: `Agendamento para ${appointment.client} criado com sucesso.`,
    });
  };

  const filteredAppointments = appointments.filter((appointment) => {
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
              <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 animate-fade-in"
              >
                <Plus className="h-5 w-5" />
                Novo Agendamento
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

            <AppointmentsTable 
              appointments={filteredAppointments}
              onEdit={(id) => {
                toast({
                  title: "Editar agendamento",
                  description: `Editando agendamento ${id}`,
                });
              }}
              onDelete={(id) => {
                toast({
                  title: "Excluir agendamento",
                  description: `Excluindo agendamento ${id}`,
                });
              }}
            />
          </div>
        </main>
      </div>
      <CreateAppointmentDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveAppointment}
      />
    </SidebarProvider>
  );
};

export default AdminCalendar;