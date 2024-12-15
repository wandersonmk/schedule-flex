import { supabase } from '@/integrations/supabase/client';
import type { Professional, NewProfessional } from '@/types/professional';

export const fetchProfessionalsFromApi = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Usuário não autenticado');
      return [];
    }

    // Primeiro, buscar a organization_id do usuário
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
      return [];
    }

    // Depois, buscar os profissionais da organização
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
      availability: {} // Inicializa availability como objeto vazio
    }));
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
};

export const addProfessionalToApi = async (newProfessional: NewProfessional) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
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
  } catch (error) {
    console.error('Erro ao adicionar profissional:', error);
    throw error;
  }
};

export const updateProfessionalInApi = async (professional: Professional) => {
  try {
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
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    throw error;
  }
};

export const deleteProfessionalFromApi = async (id: string) => {
  try {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar profissional:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    throw error;
  }
};