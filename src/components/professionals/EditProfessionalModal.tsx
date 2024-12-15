import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { AvailabilitySchedule } from "./AvailabilitySchedule";
import { supabase } from "@/integrations/supabase/client";
import type { Professional } from "@/types/professional";

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

  const handleAvailabilityChange = (schedule: any) => {
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

      // Update professional in database
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

      // Update professional availability
      const { error: availabilityError } = await supabase
        .from('professional_availability')
        .delete()
        .eq('professional_id', professional.id);

      if (availabilityError) {
        throw availabilityError;
      }

      // Insert new availability records
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

      // Call onUpdate with updated professional data
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
      console.error('Error updating professional:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o profissional.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDayNumber = (day: string): number => {
    const days = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    return days[day as keyof typeof days];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Profissional</DialogTitle>
          <DialogDescription>
            Atualize as informações do profissional e sua disponibilidade semanal.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <form onSubmit={handleUpdateProfessional} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

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