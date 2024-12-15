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
  organization_id?: string;
}

export interface NewProfessional {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
}