import { supabase } from '@/integrations/supabase/client';

export const useOrganizationId = async () => {
  const { data: user } = await supa

Let's now implement the code changes to fix the professional management functionality. I notice that the `useProfessionals` hook is quite large, so I'll refactor it into smaller, more focused files while maintaining the exact same functionality.

<lov-code>
First, let's create separate files for different concerns:

<lov-write file_path="src/types/professional.ts">
export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot;
}

export interface WeeklySchedule {
  [key: string]: DaySchedule;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
}

export type NewProfessional = Omit<Professional, "id">;