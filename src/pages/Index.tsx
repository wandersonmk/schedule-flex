import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: orgMember } = await supabase
            .from('membros_organizacao')
            .select('organization_id, role')
            .eq('user_id', session.user.id)
            .single();

          if (orgMember) {
            navigate("/admin");
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: orgMember } = await supabase
          .from('membros_organizacao')
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/62034df4-f2bf-49e0-93fa-1bcdc61cf498.png" 
              alt="Agzap Logo" 
              className="h-12"
            />
          </div>

          <AuthTabs isLogin={isLogin} setIsLogin={setIsLogin} />

          <p className="text-gray-600 text-sm text-center">
            {isLogin 
              ? "Preencha os campos com seu e-mail e senha."
              : "Vamos começar preenchendo o formulário abaixo."
            }
          </p>

          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm setIsLogin={setIsLogin} />
          )}
        </div>
      </div>

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