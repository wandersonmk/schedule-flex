import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteAppointmentDialog } from "../admin/DeleteAppointmentDialog";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

interface ProfessionalsTableProps {
  professionals: Professional[];
  onEdit: (professional: Professional) => void;
  onDelete: (id: string) => void;
}

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