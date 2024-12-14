import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAppointments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          professional:professionals(name, specialty),
          client:clients(name, email, phone)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const createAppointment = useMutation({
    mutationFn: async (appointmentData: {
      professional_id: string;
      client_id: string;
      start_time: string;
      end_time: string;
      notes?: string;
    }) => {
      const { data: orgData, error: orgError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .single();

      if (orgError) throw orgError;

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            ...appointmentData,
            organization_id: orgData.organization_id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateAppointment = useMutation({
    mutationFn: async (data: {
      id: string;
      professional_id: string;
      client_id: string;
      start_time: string;
      end_time: string;
      status: string;
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar agendamento",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir agendamento",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    appointments,
    isLoading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
};