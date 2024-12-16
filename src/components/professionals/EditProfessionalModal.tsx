import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySchedule } from "./AvailabilitySchedule";
import { ProfessionalFormFields } from "./ProfessionalFormFields";
import { supabase } from "@/integrations/supabase/client";
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

  const getDayNumber = (day: string): number => {
    const days: { [key: string]: number } = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    return days[day];
  };

  const handleUpdateProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professional) return;

    try {
      setIsSubmitting(true);

      const { error: updateError } = await supabase
        .from('professionals')
        .update({
          name: formData.name,
          specialty: formData.specialty,
          email: formData.email,
          phone: formData.phone,
        })
        .eq('id', professional.id);

      if (updateError) {
        throw updateError;
      }

      const { error: availabilityError } = await supabase
        .from('professional_availability')
        .delete()
        .eq('professional_id', professional.id);

      if (availabilityError) {
        throw availabilityError;
      }

      const availabilityRecords = Object.entries(formData.availability)
        .filter(([_, schedule]) => schedule.enabled)
        .map(([day, schedule]) => ({
          professional_id: professional.id,
          day_of_week: getDayNumber(day),
          start_time: schedule.timeSlots.start,
          end_time: schedule.timeSlots.end,
        }));

      if (availabilityRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('professional_availability')
          .insert(availabilityRecords);

        if (insertError) {
          throw insertError;
        }
      }

      onUpdate({
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