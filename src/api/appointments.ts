import { supabase } from '@/integrations/supabase/client';

interface CreateAppointmentData {
  professional: string;
  client: string;
  date: string;
  time: string;
  status: string;
  whatsapp?: string;
}

export const createAppointmentInApi = async (appointmentData: CreateAppointmentData) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Usuário não autenticado');
  }

  // Buscar organization_id do usuário
  const { data: orgMember, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (orgError || !orgMember) {
    throw new Error('Falha ao buscar organização');
  }

  // Buscar professional_id
  const { data: professional, error: profError } = await supabase
    .from('professionals')
    .select('id')
    .eq('name', appointmentData.professional)
    .eq('organization_id', orgMember.organization_id)
    .single();

  if (profError || !professional) {
    throw new Error('Profissional não encontrado');
  }

  // Buscar ou criar cliente
  let clientId;
  const { data: existingClient, error: clientError } = await supabase
    .from('clients')
    .select('id')
    .eq('name', appointmentData.client)
    .eq('organization_id', orgMember.organization_id)
    .single();

  if (clientError) {
    // Cliente não existe, vamos criar
    const { data: newClient, error: createClientError } = await supabase
      .from('clients')
      .insert({
        name: appointmentData.client,
        phone: appointmentData.whatsapp,
        organization_id: orgMember.organization_id,
      })
      .select()
      .single();

    if (createClientError || !newClient) {
      throw new Error('Falha ao criar cliente');
    }
    clientId = newClient.id;
  } else {
    clientId = existingClient.id;
  }

  // Criar o agendamento
  const startTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Adiciona 1 hora

  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .insert({
      organization_id: orgMember.organization_id,
      professional_id: professional.id,
      client_id: clientId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: appointmentData.status,
    })
    .select()
    .single();

  if (appointmentError) {
    throw new Error('Falha ao criar agendamento');
  }

  return appointment;
};