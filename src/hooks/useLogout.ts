import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Show success message regardless of error since we're logging out anyway
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Always redirect to login page
      navigate('/login');
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // If we get here, something really went wrong
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar. Tente novamente.",
      });
      // Still redirect to login page for safety
      navigate('/login');
    }
  };

  return { logout };
};