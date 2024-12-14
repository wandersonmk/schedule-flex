import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySchedule } from "./AvailabilitySchedule";

interface WeeklySchedule {
  [key: string]: {
    enabled: boolean;
    timeSlots: {
      start: string;
      end: string;
    };
  };
}

interface AddProfessionalModalProps {
  onAddProfessional: (professional: {
    name: string;
    specialty: string;
    email: string;
    phone: string;
    availability: WeeklySchedule;
  }) => void;
}

export const AddProfessionalModal = ({ onAddProfessional }: AddProfessionalModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    availability: {} as WeeklySchedule,
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (schedule: WeeklySchedule) => {
    setFormData((prev) => ({
      ...prev,
      availability: schedule,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProfessional(formData);
    setFormData({
      name: "",
      specialty: "",
      email: "",
      phone: "",
      availability: {} as WeeklySchedule,
    });
    setIsOpen(false);
    toast({
      title: "Profissional adicionado",
      description: "O profissional foi adicionado com sucesso.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar Profissional
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Profissional</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo profissional e defina sua disponibilidade semanal.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <AvailabilitySchedule onChange={handleAvailabilityChange} />
            </div>

            <Button type="submit" className="w-full">
              Adicionar
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};