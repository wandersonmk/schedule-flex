import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-white border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">BookingPro</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Button variant="link">Como funciona</Button>
          <Button variant="link">Recursos</Button>
          <Button variant="link">Preços</Button>
        </nav>
        <div className="flex space-x-4">
          <Button variant="ghost">Entrar</Button>
          <Button>Começar Grátis</Button>
        </div>
      </div>
    </header>
  );
};