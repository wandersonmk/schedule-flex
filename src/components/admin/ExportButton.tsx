import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/components/ui/use-toast";

interface ExportButtonProps {
  data: Array<{
    id: string;
    professional: string;
    client: string;
    date: string;
    time: string;
    status: string;
  }>;
}

export const ExportButton = ({ data }: ExportButtonProps) => {
  const { toast } = useToast();

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Relatório de Agendamentos", 14, 15);
    doc.setFontSize(10);
    doc.text(`Data de exportação: ${new Date().toLocaleDateString()}`, 14, 25);

    // Create table
    autoTable(doc, {
      head: [["ID", "Profissional", "Cliente", "Data", "Horário", "Status"]],
      body: data.map(row => [
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
    <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Exportar Dados
    </Button>
  );
};