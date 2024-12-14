import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminCalendar from "./pages/AdminCalendar";
import AdminFilters from "./pages/AdminFilters";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/calendar" element={<AdminCalendar />} />
            <Route path="/admin/filters" element={<AdminFilters />} />
            <Route path="/admin/professionals" element={<Admin />} />
            <Route path="/admin/clients" element={<Admin />} />
            <Route path="/admin/notifications" element={<Admin />} />
            <Route path="/admin/reports" element={<Admin />} />
            <Route path="/admin/settings" element={<Admin />} />
            <Route path="/admin/financial" element={<Admin />} />
            <Route path="/admin/export" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;