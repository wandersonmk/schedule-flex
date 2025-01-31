import { Button } from "@/components/ui/button";
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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-purple-900 text-white p-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          {/* Mini calendar could be added here */}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Profissionais</h3>
          <div className="space-y-4">
            {professionals.map((prof) => (
              <div
                key={prof.id}
                className={cn(
                  "flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors",
                  selectedProfessional === prof.id
                    ? "bg-purple-800"
                    : "hover:bg-purple-800/50"
                )}
                onClick={() => setSelectedProfessional(prof.id)}
              >
                <Avatar className="h-10 w-10">
                  {/* Add professional image if available */}
                </Avatar>
                <div>
                  <p className="font-medium">{prof.name}</p>
                  <p className="text-sm text-purple-200">{prof.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-semibold">Clínica Saúde</h1>
          <div className="flex items-center gap-2">
            <Button variant="default" className="bg-purple-700 hover:bg-purple-800">
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
            <Button variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          {/* Week Navigation */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            {/* Time column */}
            <div className="bg-white">
              <div className="h-12"></div>
              {timeSlots.map((time) => (
                <div key={time} className="h-20 p-2 text-sm text-gray-500">
                  {time}
                </div>
              ))}
            </div>

            {/* Days columns */}
            {weekDays.map((date) => (
              <div key={date.toISOString()} className="bg-white">
                <div className="h-12 p-2 border-b">
                  <div className="text-sm font-medium">
                    {format(date, "d", { locale: ptBR })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(date, "EEEE", { locale: ptBR })}
                  </div>
                </div>
                {timeSlots.map((time) => {
                  const appointments = getAppointmentsForTimeSlot(date, time);
                  return (
                    <div
                      key={`${date.toISOString()}-${time}`}
                      className="h-20 border-b p-1"
                    >
                      {loadingAppointments ? (
                        <Skeleton className="h-16 w-full" />
                      ) : (
                        appointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-2 rounded-lg bg-purple-900 text-white text-xs mb-1 cursor-pointer hover:bg-purple-800"
                          >
                            <div className="font-medium truncate">
                              {apt.client?.name}
                            </div>
                            <div className="text-purple-200 text-xs">
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