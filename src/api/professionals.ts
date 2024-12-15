import { supabase } from '@/integrations/supabase/client';
import type { Professional, NewProfessional } from '@/types/professional';

const mapAvailabilityToWeeklySchedule = (availability: any[]) => {
  const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const schedule: any = {};

  weekDays.forEach(day => {
    schedule[day] = {
      enabled: false,
      timeSlots: {
        start: '08:00',
        end: '18:00'
      }
    };
  });

  availability.forEach(slot => {
    const day = weekDays[slot.day_of_week];
    schedule[day] = {
      enabled: true,
      timeSlots: {
        start: slot.start_time,
        end: slot.end_time
      }
    };
  });

  return schedule;
};

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

  // Fetch availability for each professional
  const professionalsWithAvailability = await Promise.all(
    professionals.map(async (prof) => {
      const { data: availability, error: availError } = await supabase
        .from('professional_availability')
        .select('*')
        .eq('professional_id', prof.id);

      if (availError) {
        console.error('Error fetching availability:', availError);
        return { ...prof, availability: {} };
      }

      return {
        ...prof,
        availability: mapAvailabilityToWeeklySchedule(availability || [])
      };
    })
  );

  return professionalsWithAvailability;
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