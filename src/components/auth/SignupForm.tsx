import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SignupFields } from "./SignupFields";
import { useSignup } from "@/hooks/useSignup";

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
  const { toast } = useToast();
  
  const {
    isLoading,
    showUserExistsDialog,
    setShowUserExistsDialog,
    handleSignup,
  } = useSignup(setIsLogin);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro!",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro!",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    await handleSignup(email, password, nomeEmpresa, nomeUsuario);
  };

  return (
    <>
      <form onSubmit={handleCreateAccount} className="space-y-6">
        <SignupFields
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