import { supabase } from "@/integrations/supabase/client";

export const createAccount = async (
  email: string,
  password: string,
  nomeEmpresa: string,
  nomeUsuario: string
) => {
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

  if (error) throw error;
  return data;
};

export const checkOrganizationMembership = async (userId: string) => {
  const { data: orgMember, error } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return orgMember;
};