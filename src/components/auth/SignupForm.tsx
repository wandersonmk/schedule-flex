import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SignupFormFields } from "./SignupFormFields";
import { createAccount, checkOrganizationMembership } from "@/utils/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SignupFormProps {
  setIsLogin: (value: boolean) => void;
}

export const SignupForm = ({ setIsLogin }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showUserExistsDialog, setShowUserExistsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro!",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { user } = await createAccount(email, password, nomeEmpresa, nomeUsuario);
      
      if (!user) {
        throw new Error("Erro ao criar usuário");
      }

      // Aguardar um momento para garantir que os triggers do Supabase foram executados
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orgMember = await checkOrganizationMembership(user.id);

      if (orgMember) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado para o painel.",
        });
        navigate("/admin");
      } else {
        throw new Error("Erro ao configurar organização");
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      
      if (error.message === "User already registered") {
        setShowUserExistsDialog(true);
      } else {
        toast({
          title: "Erro ao criar conta",
          description: error.message || "Ocorreu um erro ao tentar criar sua conta. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleCreateAccount} className="space-y-6">
        <SignupFormFields
          nomeEmpresa={nomeEmpresa}
          setNomeEmpresa={setNomeEmpresa}
          nomeUsuario={nomeUsuario}
          setNomeUsuario={setNomeUsuario}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          isLoading={isLoading}
        />

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <AlertDialog open={showUserExistsDialog} onOpenChange={setShowUserExistsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuário já cadastrado</AlertDialogTitle>
            <AlertDialogDescription>
              Este email já está cadastrado em nossa plataforma. Por favor, faça login ou utilize outro email para criar uma nova conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowUserExistsDialog(false);
              setIsLogin(true);
            }}>
              Ir para login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};