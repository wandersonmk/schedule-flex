import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot;
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

interface AvailabilityScheduleProps {
  onChange: (schedule: WeeklySchedule) => void;
  initialSchedule?: WeeklySchedule;
}

const WEEK_DAYS = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export const AvailabilitySchedule = ({ onChange, initialSchedule }: AvailabilityScheduleProps) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>(() => {
    if (initialSchedule) {
      return initialSchedule;
    }

    const defaultSchedule: WeeklySchedule = {};
    Object.keys(WEEK_DAYS).forEach((day) => {
      defaultSchedule[day] = {
        enabled: false,
        timeSlots: {
          start: "08:00",
          end: "18:00",
        },
      };
    });
    return defaultSchedule;
  });

  useEffect(() => {
    if (initialSchedule) {
      setSchedule(initialSchedule);
    }
  }, [initialSchedule]);

  const handleDayToggle = (day: string) => {
    setSchedule((prev) => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          enabled: !prev[day].enabled,
        },
      };
      onChange(newSchedule);
      return newSchedule;
    });
  };

  const handleTimeChange = (day: string, type: "start" | "end", value: string) => {
    setSchedule((prev) => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: {
            ...prev[day].timeSlots,
            [type]: value,
          },
        },
      };
      onChange(newSchedule);
      return newSchedule;
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-base">Disponibilidade Semanal</Label>
      <div className="space-y-4">
        {Object.entries(WEEK_DAYS).map(([day, label]) => (
          <div key={day} className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={schedule[day].enabled}
                onCheckedChange={() => handleDayToggle(day)}
              />
              <Label htmlFor={day}>{label}</Label>
            </div>
            {schedule[day].enabled && (
              <div className="flex items-center space-x-2">
                <Select
                  value={schedule[day].timeSlots.start}
                  onValueChange={(value) => handleTimeChange(day, "start", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Início" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>até</span>
                <Select
                  value={schedule[day].timeSlots.end}
                  onValueChange={(value) => handleTimeChange(day, "end", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Término" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};