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
    professional: "Dr. Carlos Silva",
    professional_id: "prof_01",
    client: "João Santos",
    client_id: "cli_01",
    date: "2024-01-30",
    time: "09:00",
    end_time: "10:00",
    status: "Confirmado",
    notes: "Consulta de rotina",
    created_at: "2024-01-25T14:30:00",
    organization_id: "org_01"
  },
  {
    id: "APT002",
    professional: "Dra. Maria Costa",
    professional_id: "prof_02",
    client: "Ana Oliveira",
    client_id: "cli_02",
    date: "2024-01-30",
    time: "10:30",
    end_time: "11:30",
    status: "Pendente",
    notes: "Primeira consulta",
    created_at: "2024-01-26T09:15:00",
    organization_id: "org_01"
  },
  {
    id: "APT003",
    professional: "Dr. Pedro Santos",
    professional_id: "prof_03",
    client: "Lucas Lima",
    client_id: "cli_03",
    date: "2024-01-30",
    time: "13:00",
    end_time: "14:00",
    status: "Cancelado",
    notes: "Paciente solicitou cancelamento",
    created_at: "2024-01-26T16:45:00",
    organization_id: "org_01"
  },
  {
    id: "APT004",
    professional: "Dra. Ana Beatriz",
    professional_id: "prof_04",
    client: "Mariana Costa",
    client_id: "cli_04",
    date: "2024-01-30",
    time: "14:30",
    end_time: "15:30",
    status: "Confirmado",
    notes: "Retorno",
    created_at: "2024-01-27T10:20:00",
    organization_id: "org_01"
  },
  {
    id: "APT005",
    professional: "Dr. Ricardo Mendes",
    professional_id: "prof_05",
    client: "Paulo Souza",
    client_id: "cli_05",
    date: "2024-01-30",
    time: "16:00",
    end_time: "17:00",
    status: "Confirmado",
    notes: "Avaliação inicial",
    created_at: "2024-01-27T11:00:00",
    organization_id: "org_01"
  },
  {
    id: "APT006",
    professional: "Dra. Carla Rodrigues",
    professional_id: "prof_06",
    client: "Fernanda Lima",
    client_id: "cli_06",
    date: "2024-01-31",
    time: "09:00",
    end_time: "10:00",
    status: "Pendente",
    notes: "Aguardando confirmação",
    created_at: "2024-01-27T14:30:00",
    organization_id: "org_01"
  },
  {
    id: "APT007",
    professional: "Dr. Carlos Silva",
    professional_id: "prof_01",
    client: "Roberto Alves",
    client_id: "cli_07",
    date: "2024-01-31",
    time: "10:30",
    end_time: "11:30",
    status: "Confirmado",
    notes: "Consulta de acompanhamento",
    created_at: "2024-01-28T09:00:00",
    organization_id: "org_01"
  },
  {
    id: "APT008",
    professional: "Dra. Maria Costa",
    professional_id: "prof_02",
    client: "Camila Santos",
    client_id: "cli_08",
    date: "2024-01-31",
    time: "13:00",
    end_time: "14:00",
    status: "Cancelado",
    notes: "Profissional indisponível",
    created_at: "2024-01-28T11:15:00",
    organization_id: "org_01"
  }
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
        head: [["ID", "Profissional", "Cliente", "Data", "Início", "Término", "Status", "Observações"]],
        body: filteredData.map(row => [
          row.id,
          row.professional,
          row.client,
          new Date(row.date).toLocaleDateString('pt-BR'),
          row.time,
          row.end_time,
          row.status,
          row.notes || ''
        ]),
        startY: date || searchTerm ? 55 : 40,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          font: "helvetica",
          textColor: [33, 33, 33],
          lineWidth: 0.1,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [63, 131, 248],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
          halign: 'center',
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 },
          7: { cellWidth: 40 }
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
        { header: 'ID', key: 'id', width: 12 },
        { header: 'Profissional', key: 'professional', width: 20 },
        { header: 'Cliente', key: 'client', width: 20 },
        { header: 'Data', key: 'date', width: 15 },
        { header: 'Início', key: 'time', width: 10 },
        { header: 'Término', key: 'end_time', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Observações', key: 'notes', width: 30 }
      ];

      // Adicionar dados filtrados
      worksheet.addRows(filteredData.map(row => ({
        ...row,
        date: new Date(row.date).toLocaleDateString('pt-BR')
      })));

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
        <main className="flex-1 p-4 md:p-8 bg-background w-full overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-foreground">Relatório de Agendamentos</h1>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm space-y-6">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Pesquisar</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                      className="text-primary hover:text-primary/90"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Término</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          Nenhum agendamento encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.professional}</TableCell>
                          <TableCell>{row.client}</TableCell>
                          <TableCell>{new Date(row.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>{row.end_time}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                row.status === 'Confirmado'
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                                  : row.status === 'Pendente'
                                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                              }`}
                            >
                              {row.status}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={row.notes}>
                            {row.notes}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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