import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Verificando sessão...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro ao verificar sessão:", sessionError);
          setIsLoading(false);
          return;
        }

        if (session) {
          console.log("Sessão encontrada, verificando organização...");
          const { data: orgMember, error: orgError } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', session.user.id)
            .single();

          if (orgError) {
            console.error("Erro ao verificar organização:", orgError);
            setIsLoading(false);
            return;
          }

          if (orgMember) {
            console.log("Membro da organização encontrado, redirecionando...");
            navigate("/admin");
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        console.log("Finalizando verificação de sessão...");
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Estado de autenticação alterado:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: orgMember, error } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error("Erro ao verificar membro da organização:", error);
            return;
          }

          if (orgMember) {
            navigate("/admin");
          }
        } catch (error) {
          console.error("Erro ao verificar organização:", error);
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
    <div className="minVou analisar o código da página de login para identificar e corrigir o problema do carregamento infinito. O problema provavelmente está relacionado à verificação da sessão do usuário.

<lov-code>
Vamos atualizar o arquivo src/pages/Index.tsx para corrigir o problema de carregamento infinito:

<lov-write file_path="src/pages/Index.tsx">
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

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
          }
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
      } finally {
        setIsLoading(false);
      }
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
    </div>
  );
};

export default Index;