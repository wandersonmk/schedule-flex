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
}

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
      return `${days[day as keyof typeof days]} ${schedule.timeSlots.start}-${schedule.timeSlots.end}`;
    })
    .join(", ");

  return availableDays || "Não definida";
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
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
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