import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySchedule } from "./AvailabilitySchedule";
import { ProfessionalFormFields } from "./ProfessionalFormFields";
import type { Professional } from "@/types/professional";
import type { WeeklySchedule } from "@/types/availability";

interface EditProfessionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
  onUpdate: (professional: Professional) => void;
}

interface FormData {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
}

export const EditProfessionalModal = ({
  open,
  onOpenChange,
  professional,
  onUpdate,
}: EditProfessionalModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    availability: {},
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name,
        specialty: professional.specialty,
        email: professional.email,
        phone: professional.phone || "",
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

  const handleUpdateProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professional) return;

    try {
      setIsSubmitting(true);

      await onUpdate({
        ...professional,
        ...formData,
      });

      onOpenChange(false);
      toast({
        title: "Profissional atualizado",
        description: "As informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar profissional:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o profissional.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Editar Profissional</DialogTitle>
          <DialogDescription>
            Atualize as informações do profissional e sua disponibilidade semanal.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <form onSubmit={handleUpdateProfessional} className="space-y-6">
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
              {isSubmitting ? "Atualizando..." : "Atualizar"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};