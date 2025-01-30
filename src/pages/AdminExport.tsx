import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet, Search, Calendar as CalendarIcon } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/components/ui/use-toast";
import ExcelJS from 'exceljs';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date>();
  
  // Filtrar dados baseado na pesquisa e data
  const filteredData = mockData.filter((item) => {
    const matchesSearch = 
      item.professional.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDate = !date || item.date === format(date, 'yyyy-MM-dd');
    
    return matchesSearch && matchesDate;
  });

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Configurar fonte e cor padrão
      doc.setFont("helvetica");
      doc.setTextColor(33, 33, 33);

      // Adicionar cabeçalho
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Relatório de Agendamentos", 14, 20);

      // Adicionar data e hora
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const dataHora = new Date().toLocaleString('pt-BR');
      doc.text(`Data de exportação: ${dataHora}`, 14, 30);

      // Adicionar filtros aplicados
      if (searchTerm || date) {
        doc.setFontSize(10);
        doc.text("Filtros aplicados:", 14, 40);
        let yPos = 45;
        if (searchTerm) {
          doc.text(`Termo de busca: ${searchTerm}`, 14, yPos);
          yPos += 5;
        }
        if (date) {
          doc.text(`Data: ${format(date, 'dd/MM/yyyy')}`, 14, yPos);
          yPos += 5;
        }
      }

      // Adicionar tabela
      autoTable(doc, {
        head: [["ID", "Profissional", "Cliente", "Data", "Horário", "Status"]],
        body: filteredData.map(row => [
          row.id,
          row.professional,
          row.client,
          new Date(row.date).toLocaleDateString('pt-BR'),
          row.time,
          row.status
        ]),
        startY: date || searchTerm ? 55 : 40,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          font: "helvetica",
          textColor: [33, 33, 33],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [63, 131, 248],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
          halign: 'center',
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
      });

      // Adicionar rodapé
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Salvar o PDF
      doc.save("relatorio-agendamentos.pdf");

      toast({
        title: "Exportação concluída",
        description: "O arquivo PDF foi gerado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao gerar o arquivo PDF.",
        variant: "destructive"
      });
    }
  };

  const exportToXLS = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Agendamentos');

      // Adicionar cabeçalhos
      worksheet.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Profissional', key: 'professional' },
        { header: 'Cliente', key: 'client' },
        { header: 'Data', key: 'date' },
        { header: 'Horário', key: 'time' },
        { header: 'Status', key: 'status' }
      ];

      // Adicionar dados filtrados
      worksheet.addRows(filteredData);

      // Estilizar cabeçalhos
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3F83F8' }
      };
      worksheet.getRow(1).font = { color: { argb: 'FFFFFF' } };

      // Ajustar largura das colunas
      worksheet.columns.forEach(column => {
        column.width = 15;
      });

      // Gerar o arquivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agendamentos.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: "O arquivo Excel foi gerado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao gerar o arquivo Excel.",
        variant: "destructive"
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
              <h1 className="text-2xl font-bold text-gray-900">Relatório de Agendamentos</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Pesquisar</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      placeholder="Buscar por nome, ID ou status..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 flex items-end">
                  {(date || searchTerm) && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDate(undefined);
                        setSearchTerm("");
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.professional}</TableCell>
                        <TableCell>{row.client}</TableCell>
                        <TableCell>{new Date(row.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              row.status === 'Confirmado'
                                ? 'bg-green-100 text-green-800'
                                : row.status === 'Pendente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {row.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Botões de exportação */}
              <div className="flex gap-4 justify-end mt-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={exportToPDF}
                >
                  <FileDown className="h-4 w-4" />
                  Exportar como PDF
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => exportToXLS().catch(error => {
                    toast({
                      title: "Erro na exportação",
                      description: "Ocorreu um erro ao gerar o arquivo Excel.",
                      variant: "destructive"
                    });
                    console.error(error);
                  })}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar como XLS
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