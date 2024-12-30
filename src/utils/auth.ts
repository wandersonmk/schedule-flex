import { supabase } from "@/integrations/supabase/client";

export const createAccount = async (
  email: string,
  password: string,
  nomeEmpresa: string,
  nomeUsuario: string
) => {
  console.log('Criando conta com:', { email, nomeEmpresa, nomeUsuario });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome_empresa: nomeEmpresa,
        nome_usuario: nomeUsuario,
      },
    },
  });

  if (error) {
    console.error('Erro ao criar conta:', error);
    throw error;
  }

  console.log('Conta criada com sucesso:', data);
  return data;
};

export const checkOrganizationMembership = async (userId: string) => {
  console.log('Verificando organização para usuário:', userId);
  
  const { data: orgMember, error } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erro ao verificar organização:', error);
    throw error;
  }

  console.log('Membro da organização encontrado:', orgMember);
  return orgMember;
};

export const loginWithEmail = async (email: string, password: string) => {
  console.log('Iniciando processo de login para:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro durante o login:', error);
      return { data: null, error };
    }

    console.log('Login bem sucedido:', data.user?.id);
    return { data, error: null };
  } catch (error) {
    console.error('Erro inesperado durante o login:', error);
    return { data: null, error };
  }
};