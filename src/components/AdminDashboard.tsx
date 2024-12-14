import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FilterSection } from "./admin/FilterSection";
import { AppointmentsTable } from "./admin/AppointmentsTable";
import { DeleteAppointmentDialog } from "./admin/DeleteAppointmentDialog";
import { EditAppointmentDialog } from "./admin/EditAppointmentDialog";
import { CreateAppointmentDialog } from "./admin/CreateAppointmentDialog";
import { useToast } from "@/components/ui/use-toast";
import { DashboardMetrics } from "./admin/dashboard/DashboardMetrics";
import { AppointmentsChart } from "./admin/dashboard/AppointmentsChart";
import { ExportButton } from "./admin/ExportButton";

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
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");
  const [appointments, setAppointments] = useState(mockAppointments);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof mockAppointments[0] | null>(null);

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    setProfessionalFilter("");
  };

  const handleCreateAppointment = (newAppointment: {
    professional: string;
    client: string;
    date: string;
    time: string;
    status: string;
  }) => {
    const newId = `APT${(appointments.length + 1).toString().padStart(3, '0')}`;
    const appointment = {
      id: newId,
      ...newAppointment,
    };
    
    setAppointments([...appointments, appointment]);
    setCreateDialogOpen(false);
    toast({
      title: "Agendamento criado",
      description: `O agendamento ${newId} foi criado com sucesso.`,
    });
  };

  const handleEditAppointment = (id: string) => {
    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setEditDialogOpen(true);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter(apt => apt.id !== selectedAppointment.id));
      toast({
        title: "Agendamento excluído",
        description: `O agendamento ${selectedAppointment.id} foi excluído com sucesso.`,
      });
      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleSaveEdit = (updatedAppointment: typeof mockAppointments[0]) => {
    setAppointments(appointments.map(apt => 
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    ));
    toast({
      title: "Agendamento atualizado",
      description: `O agendamento ${updatedAppointment.id} foi atualizado com sucesso.`,
    });
    setEditDialogOpen(false);
    setSelectedAppointment(null);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setCreateDialogOpen(true)} 
            className="flex items-center gap-2 bg-primary hover:bg-primary-600 active:bg-primary-700 transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
          <ExportButton data={filteredAppointments} />
        </div>
      </div>

      <DashboardMetrics />
      <AppointmentsChart />

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
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
      />

      <DeleteAppointmentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

      <EditAppointmentDialog
        appointment={selectedAppointment}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />

      <CreateAppointmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateAppointment}
      />
    </div>
  );
};
