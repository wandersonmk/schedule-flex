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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import InputMask from "react-input-mask";

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
    whatsapp?: string;
    sendNotification?: boolean;
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
  const [whatsapp, setWhatsapp] = useState("");
  const [sendNotification, setSendNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      professional,
      client,
      date,
      time,
      status: "Pendente",
      whatsapp,
      sendNotification,
    });
    setProfessional("");
    setClient("");
    setDate("");
    setTime("");
    setWhatsapp("");
    setSendNotification(false);
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
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <InputMask
                mask="(99) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              >
                {(inputProps: any) => (
                  <Input
                    {...inputProps}
                    id="whatsapp"
                    type="tel"
                    placeholder="(11) 91234-5678"
                  />
                )}
              </InputMask>
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendNotification"
                checked={sendNotification}
                onCheckedChange={(checked) => setSendNotification(checked as boolean)}
                className="data-[state=checked]:bg-primary"
              />
              <Label
                htmlFor="sendNotification"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Notificar o paciente
              </Label>
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