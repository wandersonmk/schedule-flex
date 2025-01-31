import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AddProfessionalModal } from "@/components/professionals/AddProfessionalModal";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { EditProfessionalModal } from "@/components/professionals/EditProfessionalModal";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
        <main className="flex-1 p-3 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Gerenciamento de Profissionais
              </h1>
              <AddProfessionalModal onAddProfessional={addProfessional} />
            </div>

            <div className="overflow-x-auto -mx-3 md:mx-0">
              <div className="min-w-full inline-block align-middle">
                <ProfessionalsTable
                  professionals={professionals}
                  onEdit={handleEditProfessional}
                  onDelete={deleteProfessional}
                  isMobile={isMobile}
                />
              </div>
            </div>
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