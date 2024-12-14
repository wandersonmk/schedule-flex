import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { AddProfessionalModal } from "@/components/professionals/AddProfessionalModal";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { EditProfessionalModal } from "@/components/professionals/EditProfessionalModal";

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

const AdminProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: "1",
      name: "Dr. João Silva",
      specialty: "Clínico Geral",
      email: "joao.silva@exemplo.com",
      phone: "(11) 99999-9999",
      availability: {
        monday: {
          enabled: true,
          timeSlots: {
            start: "08:00",
            end: "18:00",
          },
        },
        tuesday: {
          enabled: true,
          timeSlots: {
            start: "08:00",
            end: "18:00",
          },
        },
        wednesday: {
          enabled: true,
          timeSlots: {
            start: "08:00",
            end: "18:00",
          },
        },
        thursday: {
          enabled: true,
          timeSlots: {
            start: "08:00",
            end: "18:00",
          },
        },
        friday: {
          enabled: true,
          timeSlots: {
            start: "08:00",
            end: "18:00",
          },
        },
        saturday: {
          enabled: false,
          timeSlots: {
            start: "08:00",
            end: "18:00",
          },
        },
        sunday: {
          enabled: false,
          timeSlots: {
            start: "08:00",
            end: "18:00",
          },
        },
      },
    },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  const handleAddProfessional = (newProfessional: Omit<Professional, "id">) => {
    const professional = {
      id: Date.now().toString(),
      ...newProfessional,
    };
    setProfessionals((prev) => [...prev, professional]);
  };

  const handleEditProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfessional = (updatedProfessional: Professional) => {
    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === updatedProfessional.id ? updatedProfessional : p
      )
    );
  };

  const handleDeleteProfessional = (id: string) => {
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Gerenciamento de Profissionais
              </h1>
              <AddProfessionalModal onAddProfessional={handleAddProfessional} />
            </div>

            <ProfessionalsTable
              professionals={professionals}
              onEdit={handleEditProfessional}
              onDelete={handleDeleteProfessional}
            />
          </div>

          <EditProfessionalModal
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            professional={selectedProfessional}
            onUpdate={handleUpdateProfessional}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminProfessionals;