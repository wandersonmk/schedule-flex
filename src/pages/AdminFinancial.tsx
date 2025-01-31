import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { FinancialMetrics } from "@/components/admin/financial/FinancialMetrics";
import { RevenueChart } from "@/components/admin/financial/RevenueChart";
import { FilterSection } from "@/components/admin/FilterSection";
import { ExportButton } from "@/components/admin/ExportButton";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FinancialData {
  revenue: string;
  revenueChange: string;
  pendingPayments: string;
  pendingChange: string;
  averageTicket: string;
  ticketChange: string;
  totalTransactions: string;
  transactionsChange: string;
  monthlyRevenue: { month: string; revenue: number }[];
}

const AdminFinancial = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm] = useState("");
  const [professionalFilter] = useState("");
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: "R$ 0",
    revenueChange: "0%",
    pendingPayments: "R$ 0",
    pendingChange: "0%",
    averageTicket: "R$ 0",
    ticketChange: "0%",
    totalTransactions: "0",
    transactionsChange: "0%",
    monthlyRevenue: [],
  });
  const { toast } = useToast();

  const fetchFinancialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Buscar organização do usuário
      const { data: orgMember } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (!orgMember) throw new Error("Organização não encontrada");

      // Construir query base
      let query = supabase
        .from("appointments")
        .select("*")
        .eq("organization_id", orgMember.organization_id);

      // Aplicar filtros de data se existirem
      if (startDate) {
        query = query.gte("start_time", startDate.toISOString());
      }
      if (endDate) {
        query = query.lte("start_time", endDate.toISOString());
      }

      const { data: appointments, error } = await query;

      if (error) throw error;

      // Calcular métricas
      const total = appointments?.length || 0;
      const revenue = appointments?.reduce((acc, curr) => acc + 100, 0); // Exemplo: R$ 100 por consulta
      const pending = appointments?.filter(a => a.status === "pending").length || 0;
      const avgTicket = total > 0 ? revenue / total : 0;

      // Calcular dados mensais para o gráfico
      const monthlyData = appointments?.reduce((acc: any, curr) => {
        const month = new Date(curr.start_time).toLocaleString('pt-BR', { month: 'short' });
        acc[month] = (acc[month] || 0) + 100; // Exemplo: R$ 100 por consulta
        return acc;
      }, {});

      const monthlyRevenue = Object.entries(monthlyData || {}).map(([month, revenue]) => ({
        month,
        revenue: Number(revenue),
      }));

      setFinancialData({
        revenue: `R$ ${revenue}`,
        revenueChange: "+12.5%", // Exemplo
        pendingPayments: `R$ ${pending * 100}`,
        pendingChange: "-2.3%", // Exemplo
        averageTicket: `R$ ${avgTicket.toFixed(2)}`,
        ticketChange: "+5.2%", // Exemplo
        totalTransactions: String(total),
        transactionsChange: "+8.1%", // Exemplo
        monthlyRevenue,
      });

    } catch (error: any) {
      console.error("Erro ao buscar dados financeiros:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados financeiros.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [startDate, endDate]);

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // Mock data for export - this would be replaced with real data from your API
  const mockData = [
    {
      id: "TRX001",
      professional: "Dr. Silva",
      client: "João Santos",
      date: "2024-03-20",
      time: "09:00",
      status: "Pago",
    },
    {
      id: "TRX002",
      professional: "Dra. Costa",
      client: "Maria Oliveira",
      date: "2024-03-20",
      time: "10:00",
      status: "Pendente",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
              <ExportButton data={mockData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <FilterSection
                startDate={startDate}
                endDate={endDate}
                searchTerm={searchTerm}
                professionalFilter={professionalFilter}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onSearchTermChange={() => {}}
                onProfessionalFilterChange={() => {}}
                onResetFilters={handleResetFilters}
              />
            </div>

            <FinancialMetrics metrics={financialData} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <RevenueChart data={financialData.monthlyRevenue} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminFinancial;