import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAppointments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      // First get the user's organization
      const { data: orgMembers, error: orgError } = await supabase
        .from('membros_organizacao')
        .select('organization_id')
        .limit(1);

      if (orgError) throw orgError;
      if (!orgMembers || orgMembers.length === 0) {
        throw new Error("No organization found for user");
      }

      const organizationId = orgMembers[0].organization_id;

      // Then get appointments for that organization
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          professional:profissionais(name, specialty),
          client:clientes(name, email, phone)
        `)
        .eq('organization_id', organizationId)
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
      // Get organization_id first
      const { data: orgMembers, error: orgError } = await supabase
        .from('membros_organizacao')
        .select('organization_id')
        .limit(1);

      if (orgError) throw orgError;
      if (!orgMembers || orgMembers.length === 0) {
        throw new Error("No organization found for user");
      }

      const { data, error } = await supabase
        .from('agendamentos')
        .insert([
          {
            ...appointmentData,
            organization_id: orgMembers[0].organization_id,
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
    onError: (error: Error) => {
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
        .from('agendamentos')
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
    onError: (error: Error) => {
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
        .from('agendamentos')
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
    onError: (error: Error) => {
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