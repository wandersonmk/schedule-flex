import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const daysInWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Escolha um horário
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-6">
        {daysInWeek.map((date) => (
          <Button
            key={date.toISOString()}
            variant={
              date.toDateString() === selectedDate.toDateString()
                ? "default"
                : "outline"
            }
            className="flex flex-col p-2 h-auto"
            onClick={() => setSelectedDate(date)}
          >
            <span className="text-sm">
              {date.toLocaleDateString("pt-BR", { weekday: "short" })}
            </span>
            <span className="text-lg font-semibold">
              {date.getDate()}
            </span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((time) => (
          <Button key={time} variant="outline" className="w-full">
            {time}
          </Button>
        ))}
      </div>
    </Card>
  );
};