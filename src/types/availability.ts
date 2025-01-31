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