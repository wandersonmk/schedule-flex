import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  percentage?: string;
}

const MetricCard = ({ title, value, description, icon, trend, percentage }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {trend && percentage && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {percentage}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const FinancialMetrics = () => {
  // Estes seriam substituídos por dados reais da API
  const metrics = {
    revenue: "R$ 45.231",
    revenueChange: "+12.5%",
    pendingPayments: "R$ 3.450",
    pendingChange: "-2.3%",
    averageTicket: "R$ 180",
    ticketChange: "+5.2%",
    totalTransactions: "251",
    transactionsChange: "+8.1%",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Receita Total"
        value={metrics.revenue}
        description="Mês atual"
        icon={<DollarSign className="h-4 w-4 text-primary" />}
        trend="up"
        percentage={metrics.revenueChange}
      />
      <MetricCard
        title="Pagamentos Pendentes"
        value={metrics.pendingPayments}
        description="A receber"
        icon={<CreditCard className="h-4 w-4 text-yellow-500" />}
        trend="down"
        percentage={metrics.pendingChange}
      />
      <MetricCard
        title="Ticket Médio"
        value={metrics.averageTicket}
        description="Por atendimento"
        icon={<DollarSign className="h-4 w-4 text-green-500" />}
        trend="up"
        percentage={metrics.ticketChange}
      />
      <MetricCard
        title="Total de Transações"
        value={metrics.totalTransactions}
        description="Mês atual"
        icon={<CreditCard className="h-4 w-4 text-blue-500" />}
        trend="up"
        percentage={metrics.transactionsChange}
      />
    </div>
  );
};