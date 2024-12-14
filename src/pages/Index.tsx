import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Create account states
  const [companyName, setCompanyName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login realizado com sucesso!",
      description: "Você será redirecionado para o painel.",
    });
    navigate("/admin");
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Erro!",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Conta criada com sucesso!",
      description: "Você pode fazer login agora.",
    });
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo - Formulário */}
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
            <button 
              className={`pb-2 ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'} font-medium`}
              onClick={() => setIsLogin(true)}
            >
              Entrar
            </button>
            <button 
              className={`pb-2 ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'} font-medium`}
              onClick={() => setIsLogin(false)}
            >
              Criar
            </button>
          </div>

          {/* Texto informativo */}
          <p className="text-gray-600 text-sm">
            {isLogin 
              ? "Preencha os campos com seu e-mail e senha."
              : "Vamos começar preenchendo o formulário abaixo."
            }
          </p>

          {/* Formulários */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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
          ) : (
            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Nome da sua empresa"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  placeholder="Digite o seu nome"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
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
                    placeholder="Password"
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
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
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
                Criar conta
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Lado direito - Imagem */}
      <div className="hidden md:block md:w-1/2 bg-[#9b87f5] bg-opacity-10">
        <div className="h-full w-full">
          <img 
            src="/lovable-uploads/c8bd5cfb-389e-42cd-bcb8-ce6d6b5cf359.png" 
            alt="Medical Team" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;