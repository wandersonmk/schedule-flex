import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  title?: string;
  start_time: string;
  end_time: string;
  professional: {
    name: string;
  };
  client: {
    name: string;
  };
  status?: string;
}

export const useAppointments = (professionalId?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Primeiro, obtém o organization_id do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (!orgMember) {
        throw new Error('Organização não encontrada');
      }

      let query = supabase
        .from('appointments')
        .select(`
          id,
          start_time,
          end_time,
          status,
          professional:professionals(name),
          client:clients(name)
        `)
        .eq('organization_id', orgMember.organization_id);

      if (professionalId) {
        query = query.eq('professional_id', professionalId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw error;
      }

      setAppointments(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Inscrever-se para atualizações em tempo real
    const channel = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [professionalId]);

  return { appointments, loading, refetch: fetchAppointments };
};