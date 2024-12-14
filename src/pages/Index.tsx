import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/admin");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/admin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/62034df4-f2bf-49e0-93fa-1bcdc61cf498.png" 
            alt="Agzap Logo" 
            className="h-12"
          />
        </div>

        <AuthTabs isLogin={isLogin} setIsLogin={setIsLogin} />

        {/* Info text */}
        <p className="text-gray-600 text-sm text-center">
          {isLogin 
            ? "Preencha os campos com seu e-mail e senha."
            : "Vamos começar preenchendo o formulário abaixo."
          }
        </p>

        {/* Forms */}
        {isLogin ? (
          <LoginForm />
        ) : (
          <SignupForm setIsLogin={setIsLogin} />
        )}
      </div>
    </div>
  );
};

export default Index;