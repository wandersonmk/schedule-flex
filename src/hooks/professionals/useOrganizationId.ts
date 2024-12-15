import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOrganizationId = () => {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Usuário não autenticado');
          setLoading(false);
          return;
        }

        const { data: orgMember, error: orgError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .single();

        if (orgError) {
          console.error('Erro ao buscar organização:', orgError);
          setError('Erro ao buscar organização');
          setLoading(false);
          return;
        }

        if (!orgMember) {
          setError('Usuário não pertence a nenhuma organização');
          setLoading(false);
          return;
        }

        setOrganizationId(orgMember.organization_id);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar ID da organização:', err);
        setError('Erro ao buscar ID da organização');
        setLoading(false);
      }
    };

    fetchOrganizationId();
  }, []);

  return { organizationId, loading, error };
};