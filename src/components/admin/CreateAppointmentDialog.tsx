import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Lista de profissionais (pode ser movida para um arquivo separado posteriormente)
const professionals = [
  "Dr. Silva",
  "Dra. Costa",
  "Dr. Santos",
  "Dra. Oliveira",
  "Dr. Lima",
];

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (appointment: {
    professional: string;
    client: string;
    date: string;
    time: string;
    status: string;
  }) => void;
}

export const CreateAppointmentDialog = ({
  open,
  onOpenChange,
  onSave,
}: CreateAppointmentDialogProps) => {
  const [professional, setProfessional] = useState("");
  const [client, setClient] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      professional,
      client,
      date,
      time,
      status: "Pendente",
    });
    setProfessional("");
    setClient("");
    setDate("");
    setTime("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="professional">Profissional</Label>
              <Select
                value={professional}
                onValueChange={setProfessional}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};