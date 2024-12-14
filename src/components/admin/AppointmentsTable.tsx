import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  professional: string;
  client: string;
  date: string;
  time: string;
  status: string;
}

interface AppointmentsTableProps {
  appointments: Appointment[];
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

export const AppointmentsTable = ({ appointments }: AppointmentsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.id}</TableCell>
              <TableCell>{appointment.professional}</TableCell>
              <TableCell>{appointment.client}</TableCell>
              <TableCell>{format(new Date(appointment.date), "dd/MM/yyyy")}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(appointment.status))}>
                  {appointment.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};