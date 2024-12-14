import { useState } from "react";

interface AuthTabsProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const AuthTabs = ({ isLogin, setIsLogin }: AuthTabsProps) => {
  return (
    <div className="flex space-x-6 border-b border-gray-200">
      <button 
        className={`pb-2 ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'} font-medium`}
        onClick={() => setIsLogin(true)}
      >
        Entrar
      </button>
      <button 
        className={`pb-2 ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'} font-medium`}
        onClick={() => setIsLogin(false)}
      >
        Criar
      </button>
    </div>
  );
};