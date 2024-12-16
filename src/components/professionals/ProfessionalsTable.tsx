import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Clock, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { DeleteAppointmentDialog } from "../admin/DeleteAppointmentDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

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

interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
}

interface ProfessionalsTableProps {
  professionals: Professional[];
  onEdit: (professional: Professional) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

const getPeriodOfDay = (startTime: string, endTime: string): string => {
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);

  if (startHour >= 5 && endHour <= 12) {
    return "Manhã";
  } else if (startHour >= 12 && endHour <= 18) {
    return "Tarde";
  } else if (startHour >= 18 || endHour <= 5) {
    return "Noite";
  } else {
    return "Manhã e Tarde";
  }
};

const formatAvailability = (availability: WeeklySchedule): string => {
  const days = {
    monday: "Seg",
    tuesday: "Ter",
    wednesday: "Qua",
    thursday: "Qui",
    friday: "Sex",
    saturday: "Sáb",
    sunday: "Dom",
  };

  const availableDays = Object.entries(availability)
    .filter(([_, schedule]) => schedule.enabled)
    .map(([day, schedule]) => {
      const period = getPeriodOfDay(schedule.timeSlots.start, schedule.timeSlots.end);
      return `${days[day as keyof typeof days]} (${period})`;
    })
    .join(", ");

  return availableDays || "Profissional indisponível";
};

const MobileCard = ({ professional, onEdit, onDelete }: { 
  professional: Professional; 
  onEdit: (professional: Professional) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{professional.name}</h3>
              <p className="text-sm text-gray-500">{professional.specialty}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(professional)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(professional.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              {professional.email}
            </div>
            {professional.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                {professional.phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              {formatAvailability(professional.availability)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProfessionalsTable = ({
  professionals,
  onEdit,
  onDelete,
  isMobile,
}: ProfessionalsTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedProfessionalId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProfessionalId) {
      onDelete(selectedProfessionalId);
      setDeleteDialogOpen(false);
      setSelectedProfessionalId(null);
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {professionals.map((professional) => (
          <MobileCard
            key={professional.id}
            professional={professional}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
          />
        ))}
        <DeleteAppointmentDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Disponibilidade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell>{professional.name}</TableCell>
              <TableCell>{professional.specialty}</TableCell>
              <TableCell>{professional.email}</TableCell>
              <TableCell>{professional.phone}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`flex items-center gap-2 ${!professional.availability || Object.entries(professional.availability).filter(([_, schedule]) => schedule.enabled).length === 0 ? 'text-red-500' : ''}`}
                      >
                        <Clock className="h-4 w-4" />
                        <span className="truncate max-w-[200px]">
                          {formatAvailability(professional.availability)}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="whitespace-pre-line">
                        {formatAvailability(professional.availability)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(professional)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(professional.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteAppointmentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};