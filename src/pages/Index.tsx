import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoginSection } from "@/components/auth/LoginSection";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: orgMember } = await supabase
          .from('organization_members')
          .select('organization_id, role')
          .eq('user_id', session.user.id)
          .single();

        if (orgMember) {
          navigate("/admin");
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: orgMember } = await supabase
          .from('organization_members')
          .select('organization_id, role')
          .eq('user_id', session.user.id)
          .single();

        if (orgMember) {
          navigate("/admin");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
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
  );
};

export default Index;