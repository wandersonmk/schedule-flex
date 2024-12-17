import { supabase } from '@/integrations/supabase/client';

export const createAppointmentInApi = async (appointmentData: {
  professional: string;
  client: string;
  date: string;
  time: string;
  status: string;
  whatsapp?: string;
}) => {
  try {
    console.log('Creating appointment with data:', appointmentData);
    
    // Get current user and organization
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
      console.error('Organization error:', orgError);
      throw new Error('Organização não encontrada');
    }

    // Verify if professional exists and belongs to the organization
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id')
      .eq('id', appointmentData.professional)
      .eq('organization_id', orgMember.organization_id)
      .single();

    if (profError || !professional) {
      console.error('Professional error:', profError);
      throw new Error('Profissional não encontrado');
    }

    // Create or find client
    let clientId;
    const { data: existingClient, error: clientSearchError } = await supabase
      .from('clients')
      .select('id')
      .eq('organization_id', orgMember.organization_id)
      .eq('name', appointmentData.client)
      .maybeSingle();

    if (clientSearchError) {
      console.error('Client search error:', clientSearchError);
      throw new Error('Erro ao buscar cliente');
    }

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error: createClientError } = await supabase
        .from('clients')
        .insert({
          organization_id: orgMember.organization_id,
          name: appointmentData.client,
          phone: appointmentData.whatsapp,
        })
        .select('id')
        .single();

      if (createClientError || !newClient) {
        console.error('Create client error:', createClientError);
        throw new Error('Erro ao criar cliente');
      }

      clientId = newClient.id;
    }

    // Create appointment
    const startTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour

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
      console.error('Appointment creation error:', appointmentError);
      throw new Error('Erro ao criar agendamento');
    }

    console.log('Appointment created successfully:', appointment);
    return appointment;
  } catch (error: any) {
    console.error('Error in createAppointmentInApi:', error);
    throw error;
  }
};

export const fetchAppointmentsFromApi = async () => {
  // Fetch appointments logic here
};

export const updateAppointmentInApi = async (appointmentId: string, updatedData: any) => {
  // Update appointment logic here
};

export const deleteAppointmentFromApi = async (appointmentId: string) => {
  // Delete appointment logic here
};
