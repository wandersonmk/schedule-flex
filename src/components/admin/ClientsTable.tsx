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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface ClientsTableProps {
  clients: Client[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const openWhatsApp = (phoneNumber: string) => {
  const formattedNumber = phoneNumber.replace(/\D/g, "");
  window.open(`https://wa.me/55${formattedNumber}`, "_blank");
};

export const ClientsTable = ({ clients, onEdit, onDelete }: ClientsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                {client.phone && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gray-50 text-gray-700 hover:text-gray-900 flex items-center gap-2"
                          onClick={() => openWhatsApp(client.phone)}
                        >
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          {client.phone}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chamar no WhatsApp</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(client.createdAt), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(client.id)}
                          className="hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar cliente</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(client.id)}
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