import type { WeeklySchedule } from './availability';

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
  organization_id?: string;
}

export interface NewProfessional {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
}