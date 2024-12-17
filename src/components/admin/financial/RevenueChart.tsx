import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Fev", revenue: 3000 },
  { month: "Mar", revenue: 2000 },
  { month: "Abr", revenue: 2780 },
  { month: "Mai", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
  { month: "Jul", revenue: 3490 },
  { month: "Ago", revenue: 3200 },
  { month: "Set", revenue: 2800 },
  { month: "Out", revenue: 4300 },
  { month: "Nov", revenue: 4100 },
  { month: "Dez", revenue: 4500 },
];

export const RevenueChart = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Receita Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `R$ ${value}`}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value}`, "Receita"]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};