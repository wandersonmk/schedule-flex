import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fadeIn">
        Agendamento Profissional
        <span className="text-primary block mt-2">Simplificado</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fadeIn">
        Gerencie sua agenda de forma inteligente. Configure horários personalizados
        para cada profissional e deixe seus clientes agendarem automaticamente.
      </p>
      <div className="flex justify-center space-x-4">
        <Button size="lg" className="animate-fadeIn">
          Começar Agora
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button size="lg" variant="outline" className="animate-fadeIn">
          Ver Demo
        </Button>
      </div>
    </div>
  );
};