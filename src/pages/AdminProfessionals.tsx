import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { AddProfessionalModal } from "@/components/professionals/AddProfessionalModal";
import { ProfessionalsTable } from "@/components/professionals/ProfessionalsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

const AdminProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: "1",
      name: "Dr. João Silva",
      specialty: "Clínico Geral",
      email: "joao.silva@exemplo.com",
      phone: "(11) 99999-9999",
    },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
  });

  const { toast } = useToast();

  const handleAddProfessional = (newProfessional: Omit<Professional, "id">) => {
    const professional = {
      id: Date.now().toString(),
      ...newProfessional,
    };
    setProfessionals((prev) => [...prev, professional]);
  };

  const handleEditProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setFormData({
      name: professional.name,
      specialty: professional.specialty,
      email: professional.email,
      phone: professional.phone,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfessional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfessional) return;

    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === selectedProfessional.id
          ? { ...p, ...formData }
          : p
      )
    );
    setIsEditDialogOpen(false);
    setFormData({
      name: "",
      specialty: "",
      email: "",
      phone: "",
    });
    toast({
      title: "Profissional atualizado",
      description: "As informações foram atualizadas com sucesso.",
    });
  };

  const handleDeleteProfessional = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este profissional?")) {
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: "Profissional removido",
        description: "O profissional foi removido com sucesso.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Profissional</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateProfessional} className="space-y-4">
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
                <Button type="submit" className="w-full">
                  Atualizar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminProfessionals;