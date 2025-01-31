import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const AdminReports = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 bg-gray-50 w-full overflow-x-hidden">
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminReports;