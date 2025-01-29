import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: string;
  name: string;
  specialty: string;
}

export const useAppointmentProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data: orgMember } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .single();

        if (!orgMember) throw new Error('No organization found');

        const { data, error } = await supabase
          .from('professionals')
          .select('id, name, specialty')
          .eq('organization_id', orgMember.organization_id);

        if (error) throw error;
        setProfessionals(data || []);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  return { professionals, loading };
};