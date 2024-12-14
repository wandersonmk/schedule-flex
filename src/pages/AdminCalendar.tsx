import { Calendar } from "@/components/Calendar";

const AdminCalendar = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendário de Agendamentos</h1>
      <Calendar />
    </div>
  );
};

export default AdminCalendar;