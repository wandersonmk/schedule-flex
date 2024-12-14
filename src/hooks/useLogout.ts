import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = async () => {
    try {
      // First try to get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // If there's no session, just redirect to login
      if (!session) {
        navigate('/login');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      // If we get a user_not_found error, the session is already invalid
      // We can safely ignore this and proceed with logout
      if (error && !error.message.includes('user_not_found')) {
        throw error;
      }

      // Show success message
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Clear any local storage or state if needed
      localStorage.removeItem('supabase.auth.token');
      
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