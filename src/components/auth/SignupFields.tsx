import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface SignupFieldsProps {
  nomeEmpresa: string;
  setNomeEmpresa: (value: string) => void;
  nomeUsuario: string;
  setNomeUsuario: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  isLoading: boolean;
}

export const SignupFields = ({
  nomeEmpresa,
  setNomeEmpresa,
  nomeUsuario,
  setNomeUsuario,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
}: SignupFieldsProps) => {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Nome da sua empresa"
        value={nomeEmpresa}
        onChange={(e) => setNomeEmpresa(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        type="text"
        placeholder="Digite o seu nome"
        value={nomeUsuario}
        onChange={(e) => setNomeUsuario(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          disabled={isLoading}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          disabled={isLoading}
        >
          {showConfirmPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};