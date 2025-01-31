import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";

const data = [
  { date: "01/03", appointments: 4, revenue: 400 },
  { date: "02/03", appointments: 6, revenue: 600 },
  { date: "03/03", appointments: 8, revenue: 800 },
  { date: "04/03", appointments: 5, revenue: 500 },
  { date: "05/03", appointments: 7, revenue: 700 },
  { date: "06/03", appointments: 9, revenue: 900 },
  { date: "07/03", appointments: 6, revenue: 600 },
];

export const AppointmentsChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Visão Geral</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                stroke={isDark ? "#666666" : "#888888"}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={isDark ? "#666666" : "#888888"}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  color: isDark ? '#e5e7eb' : 'inherit'
                }}
              />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke={isDark ? "#60a5fa" : "#2563eb"}
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                name="Agendamentos"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={isDark ? "#34d399" : "#10b981"}
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                name="Receita"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};