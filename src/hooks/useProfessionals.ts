import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
}

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot;
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.user.id)
        .single();

      if (!orgMember) {
        console.error('Usuário não pertence a nenhuma organização');
        return;
      }

      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('organization_id', orgMember.organization_id);

      if (error) {
        console.error('Erro ao buscar profissionais:', error);
        return;
      }

      setProfessionals(data.map(prof => ({
        ...prof,
        availability: {}
      })));
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    }
  };

  const addProfessional = async (newProfessional: Omit<Professional, "id">) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return;
      }

      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.user.id)
        .single();

      if (!orgMember) {
        toast({
          title: "Erro",
          description: "Usuário não pertence a nenhuma organização",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('professionals')
        .insert([{
          name: newProfessional.name,
          specialty: newProfessional.specialty,
          email: newProfessional.email,
          phone: newProfessional.phone,
          organization_id: orgMember.organization_id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar profissional:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar profissional",
          variant: "destructive",
        });
        return;
      }

      await fetchProfessionals();
      
      toast({
        title: "Sucesso",
        description: "Profissional adicionado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar profissional",
        variant: "destructive",
      });
    }
  };

  const updateProfessional = async (updatedProfessional: Professional) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({
          name: updatedProfessional.name,
          specialty: updatedProfessional.specialty,
          email: updatedProfessional.email,
          phone: updatedProfessional.phone,
        })
        .eq('id', updatedProfessional.id);

      if (error) {
        console.error('Erro ao atualizar profissional:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar profissional",
          variant: "destructive",
        });
        return;
      }

      await fetchProfessionals();
      toast({
        title: "Sucesso",
        description: "Profissional atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar profissional",
        variant: "destructive",
      });
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar profissional:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar profissional",
          variant: "destructive",
        });
        return;
      }

      await fetchProfessionals();
      toast({
        title: "Sucesso",
        description: "Profissional removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar profissional",
        variant: "destructive",
      });
    }
  };

  return {
    professionals,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
  };
};