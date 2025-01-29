import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { format, addDays, startOfWeek, parseISO, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { useAppointments } from "@/hooks/useAppointments";
import { useAppointmentProfessionals } from "@/hooks/useAppointmentProfessionals";
import { Skeleton } from "./ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // Start from 8:00
  return `${hour.toString().padStart(2, '0')}:00`;
});

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string>();
  
  const { professionals, loading: loadingProfessionals } = useAppointmentProfessionals();
  const { appointments, loading: loadingAppointments } = useAppointments(selectedProfessional);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return addDays(date, i);
  });

  const handlePreviousWeek = () => {
    setSelectedDate(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addDays(prev, 7));
  };

  const getAppointmentsForTimeSlot = (date: Date, timeSlot: string) => {
    const [hour] = timeSlot.split(':').map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    return appointments.filter(apt => {
      const aptStart = parseISO(apt.start_time);
      return isWithinInterval(aptStart, { start: slotStart, end: slotEnd });
    });
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Agenda</h1>
          <div className="flex items-center gap-2">
            {!loadingProfessionals ? (
              <Select
                value={selectedProfessional}
                onValueChange={setSelectedProfessional}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione um profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Skeleton className="h-10 w-[200px]" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" className="bg-purple-700 hover:bg-purple-800">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
          <Button variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time slots */}
        <div className="w-20 border-r">
          <div className="h-12 border-b"></div> {/* Header spacer */}
          {timeSlots.map((time) => (
            <div key={time} className="h-20 border-b px-4 py-2 text-sm text-muted-foreground">
              {time}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-full">
            {weekDays.map((date) => (
              <div key={date.toISOString()} className="flex-1 min-w-[200px]">
                <div className="h-12 border-b px-4 py-2">
                  <div className="text-sm font-medium">
                    {format(date, "d", { locale: ptBR })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(date, "EEEE", { locale: ptBR })}
                  </div>
                </div>
                {timeSlots.map((time) => {
                  const appointments = getAppointmentsForTimeSlot(date, time);
                  return (
                    <div
                      key={`${date.toISOString()}-${time}`}
                      className="h-20 border-b border-r px-2 py-1"
                    >
                      {loadingAppointments ? (
                        <Skeleton className="h-16 w-full" />
                      ) : (
                        appointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={cn(
                              "p-2 rounded-lg bg-purple-900 text-white",
                              "text-xs mb-1 cursor-pointer transition-all",
                              "hover:bg-purple-800"
                            )}
                          >
                            <div className="font-medium">
                              {apt.client?.name}
                            </div>
                            <div className="text-purple-200">
                              {format(parseISO(apt.start_time), "HH:mm")} - 
                              {format(parseISO(apt.end_time), "HH:mm")}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};