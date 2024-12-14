import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação
    toast({
      title: "Login realizado com sucesso!",
      description: "Você será redirecionado para o painel.",
    });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo - Formulário de login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/7ffcef83-575e-412f-a0e1-9e70cb63fd3b.png" 
              alt="Agzap Logo" 
              className="h-12"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b border-gray-200">
            <button className="pb-2 text-primary border-b-2 border-primary font-medium">
              Entrar
            </button>
            <button className="pb-2 text-gray-500 hover:text-gray-700">
              Criar
            </button>
          </div>

          {/* Texto informativo */}
          <p className="text-gray-600 text-sm">
            Preencha os campos com seu e-mail e senha.
          </p>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
            >
              Acessar
            </Button>

            <div className="text-center">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-primary"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Lado direito - Imagem */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
        backgroundImage: "url('/lovable-uploads/7ffcef83-575e-412f-a0e1-9e70cb63fd3b.png')"
      }}>
      </div>
    </div>
  );
};

export default Index;