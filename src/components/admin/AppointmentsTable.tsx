import { format } from "date-fns";
import { Edit, Trash2, MessageCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  professional: string;
  client: string;
  date: string;
  time: string;
  status: string;
  whatsapp?: string;
}

interface AppointmentsTableProps {
  appointments: Appointment[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmado":
      return "bg-green-100 text-green-800";
    case "Pendente":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelado":
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
};

const openWhatsApp = (phoneNumber: string) => {
  const formattedNumber = phoneNumber.replace(/\D/g, '');
  window.open(`https://wa.me/55${formattedNumber}`, '_blank');
};

export const AppointmentsTable = ({ appointments, onEdit, onDelete }: AppointmentsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.id.replace('APT', '')}</TableCell>
              <TableCell>{appointment.professional}</TableCell>
              <TableCell>{appointment.client}</TableCell>
              <TableCell>
                {appointment.whatsapp && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                    onClick={() => openWhatsApp(appointment.whatsapp!)}
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    {appointment.whatsapp}
                  </Button>
                )}
              </TableCell>
              <TableCell>{format(new Date(appointment.date), "dd/MM/yyyy")}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(appointment.status))}>
                  {appointment.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(appointment.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(appointment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
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