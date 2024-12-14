import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md space-y-8">
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
            <p className="text-gray-600 text-sm">
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

        {/* Right side - Image */}
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