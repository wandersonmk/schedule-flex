import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Limpar qualquer dado local
      localStorage.clear();
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Redirecionar para a página de login
      navigate('/login');
      
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar. Tente novamente.",
      });
      
      // Ainda redireciona para a página de login por segurança
      navigate('/login');
    }
  };

  return { logout };
};