import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

interface LoginSectionProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const LoginSection = ({ isLogin, setIsLogin }: LoginSectionProps) => {
  return (
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
  );
};