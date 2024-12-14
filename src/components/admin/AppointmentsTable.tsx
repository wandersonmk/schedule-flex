import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
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
}

export interface AppointmentsTableProps {
  appointments: Appointment[];
  isLoading?: boolean; // Adicionado isLoading como opcional
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
    return <div>Carregando...</div>;
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
            <TableHead className="text-right">Ações</TableHead>
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
                {format(new Date(appointment.start_time), "HH:mm")} -{" "}
                {format(new Date(appointment.end_time), "HH:mm")}
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
                  <br />
                  <span className="text-sm text-gray-500">
                    {appointment.client.phone}
                  </span>
                )}
              </TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(appointment.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDelete(appointment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};