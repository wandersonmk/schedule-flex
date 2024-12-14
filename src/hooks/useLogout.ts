import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { error } = await supabase.auth.signOut();
        // If we get a 403, it means the user is already logged out, which is fine
        if (error && error.status !== 403) {
          throw error;
        }
      }

      // Always show success message and redirect to login page
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Redirect to login page
      navigate('/');
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // If we get here, something really went wrong
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar. Tente novamente.",
      });
      // Still redirect to login page for safety
      navigate('/');
    }
  };

  return { handleLogout };
};