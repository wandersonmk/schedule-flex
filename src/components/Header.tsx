import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

export const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <header className="w-full py-4 px-6 bg-white border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Agzap</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Button variant="link" asChild>
              <Link to="/">Início</Link>
            </Button>
            <Button variant="link" asChild>
              <Link to="/admin">Administração</Link>
            </Button>
            <Button variant="link">Recursos</Button>
            <Button variant="link">Preços</Button>
          </nav>
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsLogin(true);
                setIsLoginModalOpen(true);
              }}
            >
              Entrar
            </Button>
            <Button onClick={() => {
              setIsLogin(false);
              setIsLoginModalOpen(true);
            }}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold mb-4">
              {isLogin ? "Acessar sua conta" : "Criar sua conta"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AuthTabs isLogin={isLogin} setIsLogin={setIsLogin} />
            <div className="mt-6">
              {isLogin ? (
                <LoginForm />
              ) : (
                <SignupForm setIsLogin={setIsLogin} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};