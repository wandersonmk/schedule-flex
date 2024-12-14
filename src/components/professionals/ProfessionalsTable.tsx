import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { DeleteAppointmentDialog } from "../admin/DeleteAppointmentDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: {
    day_of_week: number;
    start_time: string;
    end_time: string;
  }[];
}

export interface ProfessionalsTableProps {
  professionals: Professional[];
  isLoading?: boolean;
  onEdit: (professional: Professional) => void;
  onDelete: (id: string) => void;
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

const formatAvailability = (availability: Professional['availability']): string => {
  const days = {
    1: "Seg",
    2: "Ter",
    3: "Qua",
    4: "Qui",
    5: "Sex",
    6: "Sáb",
    0: "Dom",
  };

  const availableDays = availability
    .map((schedule) => {
      const period = getPeriodOfDay(schedule.start_time, schedule.end_time);
      return `${days[schedule.day_of_week as keyof typeof days]} (${period})`;
    })
    .join(", ");

  return availableDays || "Profissional indisponível";
};

export const ProfessionalsTable = ({
  professionals,
  onEdit,
  onDelete,
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
                        className={`flex items-center gap-2 ${!professional.availability || professional.availability.length === 0 ? 'text-red-500' : ''}`}
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
