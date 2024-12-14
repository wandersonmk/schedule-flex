import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      // Try to sign out normally
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If we get a user_not_found error, we still want to clear local state
        if (error.message.includes('user_not_found')) {
          // Clear any local storage data
          localStorage.clear();
          
          // Show success message anyway since we're effectively logging out
          toast({
            title: "Logout realizado com sucesso!",
            description: "Você foi desconectado com sucesso.",
          });
          
          // Redirect to login page
          navigate('/login');
          return;
        }
        
        // For other errors, show error message
        throw error;
      }

      // If successful, show success message
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Redirect to login page
      navigate('/login');
      
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      
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