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

const getDayNumber = (day: string): number => {
  const days: { [key: string]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return days[day];
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

  // Primeiro, insere o profissional
  const { data: professional, error: profError } = await supabase
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

  if (profError || !professional) {
    console.error('Error adding professional:', profError);
    throw new Error('Failed to add professional');
  }

  // Depois, insere a disponibilidade
  const availabilityRecords = Object.entries(newProfessional.availability)
    .filter(([_, schedule]) => schedule.enabled)
    .map(([day, schedule]) => ({
      professional_id: professional.id,
      day_of_week: getDayNumber(day),
      start_time: schedule.timeSlots.start,
      end_time: schedule.timeSlots.end,
    }));

  if (availabilityRecords.length > 0) {
    const { error: availError } = await supabase
      .from('professional_availability')
      .insert(availabilityRecords);

    if (availError) {
      console.error('Error adding availability:', availError);
      // Mesmo com erro na disponibilidade, retornamos o profissional criado
      return professional;
    }
  }

  return professional;
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