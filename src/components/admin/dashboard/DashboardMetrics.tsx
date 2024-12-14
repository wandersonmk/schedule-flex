import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserCheck, AlertCircle, DollarSign } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, description, icon }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export const DashboardMetrics = () => {
  // Estes seriam substituídos por dados reais da API
  const metrics = {
    totalAppointments: "128",
    confirmedAppointments: "98",
    canceledAppointments: "12",
    revenue: "R$ 12.450",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total de Agendamentos"
        value={metrics.totalAppointments}
        description="Mês atual"
        icon={<Calendar className="h-4 w-4 text-primary" />}
      />
      <MetricCard
        title="Confirmados"
        value={metrics.confirmedAppointments}
        description="Agendamentos confirmados"
        icon={<UserCheck className="h-4 w-4 text-green-500" />}
      />
      <MetricCard
        title="Cancelamentos"
        value={metrics.canceledAppointments}
        description="Mês atual"
        icon={<AlertCircle className="h-4 w-4 text-red-500" />}
      />
      <MetricCard
        title="Receita"
        value={metrics.revenue}
        description="Mês atual"
        icon={<DollarSign className="h-4 w-4 text-primary" />}
      />
    </div>
  );
};