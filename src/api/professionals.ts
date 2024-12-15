import { supabase } from '@/integrations/supabase/client';
import type { Professional, NewProfessional } from '@/types/professional';

export const fetchProfessionalsFromApi = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Authentication error:', authError);
    throw new Error('User not authenticated');
  }

  const { data: orgMember, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (orgError || !orgMember) {
    console.error('Error fetching organization:', orgError);
    throw new Error('Failed to fetch organization');
  }

  const { data: professionals, error: profError } = await supabase
    .from('professionals')
    .select('*')
    .eq('organization_id', orgMember.organization_id);

  if (profError) {
    console.error('Error fetching professionals:', profError);
    throw new Error('Failed to fetch professionals');
  }

  return professionals.map(prof => ({
    ...prof,
    availability: {}
  }));
};

export const addProfessionalToApi = async (newProfessional: NewProfessional) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data: orgMember, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (orgError || !orgMember) {
    throw new Error('Failed to fetch organization');
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
    console.error('Error adding professional:', error);
    throw new Error('Failed to add professional');
  }

  return data;
};

export const updateProfessionalInApi = async (professional: Professional) => {
  const { error } = await supabase
    .from('professionals')
    .update({
      name: professional.name,
      specialty: professional.specialty,
      email: professional.email,
      phone: professional.phone,
    })
    .eq('id', professional.id);

  if (error) {
    console.error('Error updating professional:', error);
    throw new Error('Failed to update professional');
  }
};

export const deleteProfessionalFromApi = async (id: string) => {
  const { error } = await supabase
    .from('professionals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting professional:', error);
    throw new Error('Failed to delete professional');
  }
};