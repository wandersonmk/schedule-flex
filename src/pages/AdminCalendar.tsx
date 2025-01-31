import { useState, useEffect } from "react";
import { FilterSection } from "@/components/admin/FilterSection";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateAppointmentDialog } from "@/components/admin/CreateAppointmentDialog";
import { EditAppointmentDialog } from "@/components/admin/EditAppointmentDialog";
import { DeleteAppointmentDialog } from "@/components/admin/DeleteAppointmentDialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface Appointment {
  id: string;
  professional: {
    name: string;
  };
  client: {
    name: string;
    phone: string | null;
  };
  start_time: string;
  status: string;
}

const fetchAppointments = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const { data: orgMember, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (orgError) throw orgError;

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id,
      start_time,
      status,
      professional:professionals(name),
      client:clients(name, phone)
    `)
    .eq('organization_id', orgMember.organization_id);

  if (error) throw error;
  return data;
};

const AdminCalendar = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const { data: appointments = [], refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
  });

  useEffect(() => {
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    setProfessionalFilter("");
  };

  const handleSaveAppointment = async (appointment: {
    professional: string;
    client: string;
    date: string;
    time: string;
    status: string;
    whatsapp?: string;
    sendNotification?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (!orgMember) throw new Error("Organização não encontrada");

      // Criar ou encontrar cliente
      let clientId;
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('organization_id', orgMember.organization_id)
        .eq('name', appointment.client)
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient } = await supabase
          .from('clients')
          .insert({
            organization_id: orgMember.organization_id,
            name: appointment.client,
            phone: appointment.whatsapp,
          })
          .select('id')
          .single();

        if (!newClient) throw new Error("Erro ao criar cliente");
        clientId = newClient.id;
      }

      const startTime = new Date(`${appointment.date}T${appointment.time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Adiciona 1 hora

      await supabase
        .from('appointments')
        .insert({
          organization_id: orgMember.organization_id,
          professional_id: appointment.professional,
          client_id: clientId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: appointment.status,
        });

      setIsCreateDialogOpen(false);
      toast({
        title: "Agendamento criado",
        description: `Agendamento para ${appointment.client} criado com sucesso.`,
      });
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar agendamento",
        variant: "destructive",
      });
    }
  };

  const handleEditAppointment = async (appointment: any) => {
    try {
      await supabase
        .from('appointments')
        .update({
          status: appointment.status,
          start_time: new Date(`${appointment.date}T${appointment.time}`).toISOString(),
        })
        .eq('id', appointment.id);

      setIsEditDialogOpen(false);
      toast({
        title: "Agendamento atualizado",
        description: `Agendamento atualizado com sucesso.`,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar agendamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar agendamento",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async () => {
    if (selectedAppointment) {
      try {
        await supabase
          .from('appointments')
          .delete()
          .eq('id', selectedAppointment.id);

        setIsDeleteDialogOpen(false);
        setSelectedAppointment(null);
        toast({
          title: "Agendamento excluído",
          description: "O agendamento foi excluído com sucesso.",
        });
      } catch (error: any) {
        console.error('Erro ao excluir agendamento:', error);
        toast({
          title: "Erro",
          description: error.message || "Erro ao excluir agendamento",
          variant: "destructive",
        });
      }
    }
  };

  const filteredAppointments = appointments.filter((appointment: Appointment) => {
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

  const formattedAppointments = filteredAppointments.map((appointment: Appointment) => ({
    id: appointment.id,
    professional: appointment.professional.name,
    client: appointment.client.name,
    date: format(new Date(appointment.start_time), "yyyy-MM-dd"),
    time: format(new Date(appointment.start_time), "HH:mm"),
    status: appointment.status,
    whatsapp: appointment.client.phone,
  }));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-background w-full overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 animate-fade-in"
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
              appointments={formattedAppointments}
              onEdit={(id) => {
                const appointment = appointments.find((app: any) => app.id === id);
                if (appointment) {
                  setSelectedAppointment({
                    ...appointment,
                    date: format(new Date(appointment.start_time), "yyyy-MM-dd"),
                    time: format(new Date(appointment.start_time), "HH:mm"),
                  });
                  setIsEditDialogOpen(true);
                }
              }}
              onDelete={(id) => {
                const appointment = appointments.find((app: any) => app.id === id);
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