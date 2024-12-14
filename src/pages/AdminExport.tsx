import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/components/ui/use-toast";

const mockData = [
  {
    id: "APT001",
    professional: "Dr. Silva",
    client: "João Santos",
    date: "2024-03-20",
    time: "09:00",
    status: "Confirmado",
  },
  {
    id: "APT002",
    professional: "Dra. Costa",
    client: "Maria Oliveira",
    date: "2024-03-20",
    time: "10:00",
    status: "Pendente",
  },
  {
    id: "APT003",
    professional: "Dr. Santos",
    client: "Pedro Lima",
    date: "2024-03-20",
    time: "11:00",
    status: "Cancelado",
  },
];

const AdminExport = () => {
  const { toast } = useToast();

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Relatório de Agendamentos", 14, 15);
    doc.setFontSize(10);
    doc.text(`Data de exportação: ${new Date().toLocaleDateString()}`, 14, 25);

    // Create table
    autoTable(doc, {
      head: [["ID", "Profissional", "Cliente", "Data", "Horário", "Status"]],
      body: mockData.map(row => [
        row.id,
        row.professional,
        row.client,
        row.date,
        row.time,
        row.status
      ]),
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [63, 131, 248],
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
    });

    // Save the PDF
    doc.save("agendamentos.pdf");

    toast({
      title: "Exportação concluída",
      description: "O arquivo PDF foi gerado com sucesso.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Exportar Dados</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Opções de Exportação</h2>
              <p className="text-gray-600">
                Escolha o formato desejado para exportar os dados dos agendamentos.
              </p>
              
              <div className="flex gap-4">
                <Button
                  onClick={exportToPDF}
                  className="flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Exportar como PDF
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminExport;