import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { LoginSection } from "@/components/auth/LoginSection";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setIsLoading(false);
          return;
        }

        if (session) {
          console.log("Session found, checking organization membership...");
          const { data: orgMember, error: orgError } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', session.user.id)
            .single();

          if (orgError) {
            console.error("Error checking organization:", orgError);
            setIsLoading(false);
            return;
          }

          if (orgMember) {
            console.log("Organization member found, redirecting to admin...");
            navigate("/admin");
            return;
          }
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
      }
      
      setIsLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: orgMember, error } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error("Error checking organization membership:", error);
            return;
          }

          if (orgMember) {
            navigate("/admin");
          }
        } catch (error) {
          console.error("Error checking organization membership:", error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <LoginSection isLogin={isLogin} setIsLogin={setIsLogin} />
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
    </div>
  );
};

export default Index;