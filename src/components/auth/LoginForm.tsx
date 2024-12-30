import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { loginWithEmail } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await loginWithEmail(email, password);

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Usuário não encontrado");
      }

      // Aguardar um momento para garantir que os triggers do Supabase foram executados
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para o painel.",
      });
      
      navigate("/admin");
    } catch (error: any) {
      console.error("Erro no login:", error);
      setIsLoading(false); // Importante resetar o loading em caso de erro
      
      toast({
        title: "Erro ao fazer login",
        description: error.message === "Invalid login credentials"
          ? "Email ou senha incorretos"
          : "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            disabled={isLoading}
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
        className="w-full bg-primary hover:bg-primary-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Acessar"}
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
  );
};