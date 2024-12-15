import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AddProfessionalModal } from "@/components/professionals/AddProfessionalModal";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { EditProfessionalModal } from "@/components/professionals/EditProfessionalModal";
import { useProfessionals } from "@/hooks/useProfessionals";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability: WeeklySchedule;
}

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

const AdminProfessionals = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  
  const {
    professionals,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
  } = useProfessionals();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleEditProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsEditDialogOpen(true);
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
              <AddProfessionalModal onAddProfessional={addProfessional} />
            </div>

            <ProfessionalsTable
              professionals={professionals}
              onEdit={handleEditProfessional}
              onDelete={deleteProfessional}
            />
          </div>

          <EditProfessionalModal
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            professional={selectedProfessional}
            onUpdate={updateProfessional}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminProfessionals;