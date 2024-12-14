import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AddProfessionalModal } from "@/components/professionals/AddProfessionalModal";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { EditProfessionalModal } from "@/components/professionals/EditProfessionalModal";
import { useProfessionals } from "@/hooks/useProfessionals";

const AdminProfessionals = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

  const {
    professionals,
    isLoading,
    createProfessional,
    updateProfessional,
    deleteProfessional
  } = useProfessionals();

  const handleAddProfessional = async (professionalData: any) => {
    await createProfessional.mutateAsync(professionalData);
  };

  const handleEditProfessional = (professional: any) => {
    setSelectedProfessional(professional);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfessional = async (professionalData: any) => {
    await updateProfessional.mutateAsync(professionalData);
  };

  const handleDeleteProfessional = async (id: string) => {
    await deleteProfessional.mutateAsync(id);
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
              professionals={professionals || []}
              isLoading={isLoading}
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