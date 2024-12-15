import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { AddProfessionalModal } from "@/components/professionals/AddProfessionalModal";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { EditProfessionalModal } from "@/components/professionals/EditProfessionalModal";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

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
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Primeiro, buscar a organização do usuário
      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.user.id)
        .single();

      if (!orgMember) {
        console.error('Usuário não pertence a nenhuma organização');
        return;
      }

      // Agora buscar os profissionais da organização
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('organization_id', orgMember.organization_id);

      if (error) {
        console.error('Erro ao buscar profissionais:', error);
        return;
      }

      // Converter os dados do banco para o formato esperado pelo componente
      const formattedProfessionals = data.map(prof => ({
        ...prof,
        availability: {} // Inicialmente vazio, você pode implementar a busca da disponibilidade depois
      }));

      setProfessionals(formattedProfessionals);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleAddProfessional = async (newProfessional: Omit<Professional, "id">) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return;
      }

      // Buscar a organização do usuário
      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.user.id)
        .single();

      if (!orgMember) {
        toast({
          title: "Erro",
          description: "Usuário não pertence a nenhuma organização",
          variant: "destructive",
        });
        return;
      }

      // Inserir o novo profissional
      const { data, error } = await supabase
        .from('professionals')
        .insert([
          {
            name: newProfessional.name,
            specialty: newProfessional.specialty,
            email: newProfessional.email,
            phone: newProfessional.phone,
            organization_id: orgMember.organization_id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar profissional:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar profissional",
          variant: "destructive",
        });
        return;
      }

      // Atualizar a lista de profissionais
      await fetchProfessionals();

      toast({
        title: "Sucesso",
        description: "Profissional adicionado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar profissional",
        variant: "destructive",
      });
    }
  };

  const handleEditProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfessional = async (updatedProfessional: Professional) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({
          name: updatedProfessional.name,
          specialty: updatedProfessional.specialty,
          email: updatedProfessional.email,
          phone: updatedProfessional.phone,
        })
        .eq('id', updatedProfessional.id);

      if (error) {
        console.error('Erro ao atualizar profissional:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar profissional",
          variant: "destructive",
        });
        return;
      }

      await fetchProfessionals();
      toast({
        title: "Sucesso",
        description: "Profissional atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar profissional",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar profissional:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar profissional",
          variant: "destructive",
        });
        return;
      }

      await fetchProfessionals();
      toast({
        title: "Sucesso",
        description: "Profissional removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar profissional",
        variant: "destructive",
      });
    }
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