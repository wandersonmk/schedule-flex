import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { CreateClientDialog } from "@/components/admin/CreateClientDialog";
import { FilterSection } from "@/components/admin/FilterSection";
import { useToast } from "@/components/ui/use-toast";

const AdminClients = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
  };

  const handleSaveClient = (client: any) => {
    // TODO: Implement client creation logic
    setIsCreateDialogOpen(false);
    toast({
      title: "Cliente cadastrado",
      description: `${client.name} foi cadastrado com sucesso.`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Novo Cliente
              </Button>
            </div>

            <FilterSection
              startDate={startDate}
              endDate={endDate}
              searchTerm={searchTerm}
              professionalFilter=""
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSearchTermChange={setSearchTerm}
              onProfessionalFilterChange={() => {}}
              onResetFilters={handleResetFilters}
            />

            <ClientsTable
              clients={[
                {
                  id: "1",
                  name: "João Silva",
                  email: "joao@email.com",
                  phone: "(11) 98765-4321",
                  createdAt: "2024-03-20",
                },
                {
                  id: "2",
                  name: "Maria Santos",
                  email: "maria@email.com",
                  phone: "(11) 91234-5678",
                  createdAt: "2024-03-19",
                },
              ]}
              onEdit={(id) => {
                console.log("Edit client:", id);
              }}
              onDelete={(id) => {
                console.log("Delete client:", id);
              }}
            />
          </div>
        </main>
      </div>
      <CreateClientDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveClient}
      />
    </SidebarProvider>
  );
};

export default AdminClients;