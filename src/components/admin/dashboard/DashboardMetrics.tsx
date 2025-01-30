import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserCheck, AlertCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const MetricCard = ({ title, value, description, icon, trend }: MetricCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className={`flex items-center text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {trend.value}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const DashboardMetrics = () => {
  // Estes seriam substituídos por dados reais da API
  const metrics = {
    totalAppointments: {
      value: "128",
      trend: { value: "+12.5%", isPositive: true }
    },
    confirmedAppointments: {
      value: "98",
      trend: { value: "+8.2%", isPositive: true }
    },
    canceledAppointments: {
      value: "12",
      trend: { value: "-2.3%", isPositive: true }
    },
    revenue: {
      value: "R$ 12.450",
      trend: { value: "+15.3%", isPositive: true }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total de Agendamentos"
        value={metrics.totalAppointments.value}
        description="Mês atual"
        icon={<Calendar className="h-4 w-4 text-primary" />}
        trend={metrics.totalAppointments.trend}
      />
      <MetricCard
        title="Confirmados"
        value={metrics.confirmedAppointments.value}
        description="Agendamentos confirmados"
        icon={<UserCheck className="h-4 w-4 text-green-500" />}
        trend={metrics.confirmedAppointments.trend}
      />
      <MetricCard
        title="Cancelamentos"
        value={metrics.canceledAppointments.value}
        description="Mês atual"
        icon={<AlertCircle className="h-4 w-4 text-red-500" />}
        trend={metrics.canceledAppointments.trend}
      />
      <MetricCard
        title="Receita"
        value={metrics.revenue.value}
        description="Mês atual"
        icon={<DollarSign className="h-4 w-4 text-primary" />}
        trend={metrics.revenue.trend}
      />
    </div>
  );
};