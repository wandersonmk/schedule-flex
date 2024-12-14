import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  availability?: {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    created_at: string;
    professional_id: string;
  }[];
}

export interface ProfessionalsTableProps {
  professionals: Professional[];
  isLoading: boolean;
  onEdit: (professional: Professional) => void;
  onDelete: (id: string) => void;
}

export const ProfessionalsTable = ({
  professionals,
  isLoading,
  onEdit,
  onDelete,
}: ProfessionalsTableProps) => {
  const getDayOfWeek = (day: number) => {
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    return days[day];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Disponibilidade</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell>{professional.name}</TableCell>
              <TableCell>{professional.specialty}</TableCell>
              <TableCell>
                {professional.email}
                {professional.phone && (
                  <>
                    <br />
                    <span className="text-sm text-gray-500">
                      {professional.phone}
                    </span>
                  </>
                )}
              </TableCell>
              <TableCell>
                {professional.availability?.map((avail) => (
                  <div key={avail.id} className="text-sm">
                    <span className="font-medium">
                      {getDayOfWeek(avail.day_of_week)}:
                    </span>{" "}
                    {avail.start_time.slice(0, 5)} - {avail.end_time.slice(0, 5)}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(professional)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(professional.id)}
                      className="text-red-600"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};