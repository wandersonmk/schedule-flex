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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
    case "Pendente":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
    case "Cancelado":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
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
    <div className="rounded-md border bg-card">
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
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                Nenhum agendamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.id.replace('APT', '')}</TableCell>
                <TableCell>{appointment.professional}</TableCell>
                <TableCell>{appointment.client}</TableCell>
                <TableCell>
                  {appointment.whatsapp && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-accent text-muted-foreground hover:text-foreground flex items-center gap-2"
                            onClick={() => openWhatsApp(appointment.whatsapp!)}
                          >
                            <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            {appointment.whatsapp}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Chamar no WhatsApp</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-accent text-muted-foreground hover:text-foreground"
                            onClick={() => onEdit(appointment.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar agendamento</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-accent text-muted-foreground hover:text-foreground"
                            onClick={() => onDelete(appointment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir agendamento</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};