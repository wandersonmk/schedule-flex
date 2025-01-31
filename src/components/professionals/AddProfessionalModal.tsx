import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySchedule } from "./AvailabilitySchedule";
import { ProfessionalFormFields } from "./ProfessionalFormFields";
import type { WeeklySchedule } from "@/types/availability";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onAddProfessional(formData);
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
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
      toast({
        title: "Erro ao adicionar",
        description: "Ocorreu um erro ao adicionar o profissional.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar Profissional
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Profissional</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo profissional e defina sua disponibilidade semanal.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfessionalFormFields
              formData={formData}
              onInputChange={handleInputChange}
            />
            
            <div className="border-t pt-4">
              <AvailabilitySchedule 
                onChange={handleAvailabilityChange}
                initialSchedule={formData.availability}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};