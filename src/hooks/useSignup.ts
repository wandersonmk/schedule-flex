import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useSignup = (setIsLogin: (value: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUserExistsDialog, setShowUserExistsDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (
    email: string,
    password: string,
    nomeEmpresa: string,
    nomeUsuario: string
  ) => {
    setIsLoading(true);
    try {
      console.log("Iniciando signup...");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_empresa: nomeEmpresa,
            nome_usuario: nomeUsuario,
          },
        },
      });

      if (error) {
        console.error("Erro ao criar conta:", error);
        
        if (error.message.includes("User already registered")) {
          setShowUserExistsDialog(true);
          return;
        }

        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        // Aguardar um momento para garantir que os triggers do banco foram executados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado para o painel.",
        });
        
        navigate("/admin");
      }
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showUserExistsDialog,
    setShowUserExistsDialog,
    handleSignup,
  };
};