import { useState } from "react";
import { FilterSection } from "@/components/admin/FilterSection";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateAppointmentDialog } from "@/components/admin/CreateAppointmentDialog";
import { EditAppointmentDialog } from "@/components/admin/EditAppointmentDialog";
import { DeleteAppointmentDialog } from "@/components/admin/DeleteAppointmentDialog";
import { useAppointments } from "@/hooks/useAppointments";

const AdminCalendar = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const {
    appointments,
    isLoading,
    createAppointment,
    updateAppointment,
    deleteAppointment
  } = useAppointments();

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    setProfessionalFilter("");
  };

  const handleSaveAppointment = async (appointmentData: any) => {
    await createAppointment.mutateAsync(appointmentData);
    setIsCreateDialogOpen(false);
  };

  const handleEditAppointment = async (appointmentData: any) => {
    await updateAppointment.mutateAsync(appointmentData);
    setIsEditDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = async () => {
    if (selectedAppointment) {
      await deleteAppointment.mutateAsync(selectedAppointment.id);
      setIsDeleteDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const filteredAppointments = appointments?.filter((appointment) => {
    const appointmentDate = new Date(appointment.start_time);
    const matchesId = appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProfessional = appointment.professional.name
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
              appointments={filteredAppointments || []}
              isLoading={isLoading}
              onEdit={(id) => {
                const appointment = appointments?.find(app => app.id === id);
                if (appointment) {
                  setSelectedAppointment(appointment);
                  setIsEditDialogOpen(true);
                }
              }}
              onDelete={(id) => {
                const appointment = appointments?.find(app => app.id === id);
                if (appointment) {
                  setSelectedAppointment(appointment);
                  setIsDeleteDialogOpen(true);
                }
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
      <EditAppointmentDialog
        appointment={selectedAppointment}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditAppointment}
      />
      <DeleteAppointmentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAppointment}
      />
    </SidebarProvider>
  );
};

export default AdminCalendar;