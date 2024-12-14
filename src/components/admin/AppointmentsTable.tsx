import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

export interface AppointmentsTableProps {
  appointments: {
    id: string;
    professional_id: string;
    client_id: string;
    start_time: string;
    end_time: string;
    status: string;
    notes?: string;
    professional: {
      name: string;
      specialty: string;
    };
    client: {
      name: string;
      phone?: string;
    };
  }[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AppointmentsTable = ({
  appointments,
  isLoading,
  onEdit,
  onDelete,
}: AppointmentsTableProps) => {
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
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                {format(new Date(appointment.start_time), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                {format(new Date(appointment.start_time), "HH:mm", {
                  locale: ptBR,
                })}
                {" - "}
                {format(new Date(appointment.end_time), "HH:mm", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                {appointment.professional.name}
                <br />
                <span className="text-sm text-gray-500">
                  {appointment.professional.specialty}
                </span>
              </TableCell>
              <TableCell>
                {appointment.client.name}
                {appointment.client.phone && (
                  <>
                    <br />
                    <span className="text-sm text-gray-500">
                      {appointment.client.phone}
                    </span>
                  </>
                )}
              </TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(appointment.id)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(appointment.id)}
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