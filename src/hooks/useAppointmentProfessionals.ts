import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Professional {
  id: string;
  name: string;
}

export const useAppointmentProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfessionals = async () => {
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

      // Busca os profissionais da organização
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name')
        .eq('organization_id', orgMember.organization_id);

      if (error) throw error;

      setProfessionals(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar profissionais:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de profissionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  return { professionals, loading };
};