import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySchedule } from "./AvailabilitySchedule";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot;
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
}

interface EditProfessionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
  onUpdate: (professional: Professional) => void;
}

export const EditProfessionalModal = ({
  open,
  onOpenChange,
  professional,
  onUpdate,
}: EditProfessionalModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    availability: {} as WeeklySchedule,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name,
        specialty: professional.specialty,
        email: professional.email,
        phone: professional.phone,
        availability: professional.availability,
      });
    }
  }, [professional]);

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

  const handleUpdateProfessional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!professional) return;

    onUpdate({
      ...professional,
      ...formData,
    });
    onOpenChange(false);
    toast({
      title: "Profissional atualizado",
      description: "As informações foram atualizadas com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Profissional</DialogTitle>
          <DialogDescription>
            Atualize as informações do profissional e sua disponibilidade semanal.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-180px)]">
          <form onSubmit={handleUpdateProfessional} className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-specialty">Especialidade</Label>
              <Input
                id="edit-specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="border-t pt-4">
              <AvailabilitySchedule
                onChange={handleAvailabilityChange}
                initialSchedule={formData.availability}
              />
            </div>

            <Button type="submit" className="w-full">
              Atualizar
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};