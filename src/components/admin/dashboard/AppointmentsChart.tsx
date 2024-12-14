import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "01/03", appointments: 4 },
  { date: "02/03", appointments: 6 },
  { date: "03/03", appointments: 8 },
  { date: "04/03", appointments: 5 },
  { date: "05/03", appointments: 7 },
  { date: "06/03", appointments: 9 },
  { date: "07/03", appointments: 6 },
];

export const AppointmentsChart = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Agendamentos por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};