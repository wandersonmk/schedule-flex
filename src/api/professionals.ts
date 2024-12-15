import { supabase } from '@/integrations/supabase/client';
import type { Professional, NewProfessional } from '@/types/professional';

export const fetchProfessionalsFromApi = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Erro de autenticação:', authError);
    throw new Error('Usuário não autenticado');
  }

  const { data: orgMember, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (orgError) {
    console.error('Erro ao buscar organização:', orgError);
    throw orgError;
  }

  if (!orgMember) {
    console.error('Usuário não pertence a nenhuma organização');
    throw new Error('Usuário não pertence a nenhuma organização');
  }

  const { data: professionals, error: profError } = await supabase
    .from('professionals')
    .select('*')
    .eq('organization_id', orgMember.organization_id);

  if (profError) {
    console.error('Erro ao buscar profissionais:', profError);
    throw profError;
  }

  return professionals.map(prof => ({
    ...prof,
    availability: {}
  }));
};

export const addProfessionalToApi = async (newProfessional: NewProfessional) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Usuário não autenticado');
  }

  const { data: orgMember, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (orgError || !orgMember) {
    throw new Error('Usuário não pertence a nenhuma organização');
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
    throw error;
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
    console.error('Erro ao atualizar profissional:', error);
    throw error;
  }
};

export const deleteProfessionalFromApi = async (id: string) => {
  const { error } = await supabase
    .from('professionals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar profissional:', error);
    throw error;
  }
};