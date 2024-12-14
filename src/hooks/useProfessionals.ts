import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useProfessionals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: professionals, isLoading } = useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select(`
          *,
          availability:professional_availability(*)
        `)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const createProfessional = useMutation({
    mutationFn: async (professionalData: {
      name: string;
      specialty: string;
      email: string;
      phone?: string;
      availability?: {
        day_of_week: number;
        start_time: string;
        end_time: string;
      }[];
    }) => {
      const { data: orgData, error: orgError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .single();

      if (orgError) throw orgError;

      const { data: professional, error } = await supabase
        .from('professionals')
        .insert([
          {
            ...professionalData,
            organization_id: orgData.organization_id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (professionalData.availability && professionalData.availability.length > 0) {
        const { error: availError } = await supabase
          .from('professional_availability')
          .insert(
            professionalData.availability.map(avail => ({
              ...avail,
              professional_id: professional.id,
            }))
          );

        if (availError) throw availError;
      }

      return professional;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast({
        title: "Profissional cadastrado",
        description: "O profissional foi cadastrado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar profissional",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateProfessional = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      specialty: string;
      email: string;
      phone?: string;
      availability?: {
        id?: string;
        day_of_week: number;
        start_time: string;
        end_time: string;
      }[];
    }) => {
      const { error: profError } = await supabase
        .from('professionals')
        .update({
          name: data.name,
          specialty: data.specialty,
          email: data.email,
          phone: data.phone,
        })
        .eq('id', data.id);

      if (profError) throw profError;

      if (data.availability) {
        // Delete existing availability
        const { error: deleteError } = await supabase
          .from('professional_availability')
          .delete()
          .eq('professional_id', data.id);

        if (deleteError) throw deleteError;

        // Insert new availability
        if (data.availability.length > 0) {
          const { error: availError } = await supabase
            .from('professional_availability')
            .insert(
              data.availability.map(avail => ({
                ...avail,
                professional_id: data.id,
              }))
            );

          if (availError) throw availError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast({
        title: "Profissional atualizado",
        description: "O profissional foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar profissional",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteProfessional = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast({
        title: "Profissional excluído",
        description: "O profissional foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir profissional",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    professionals,
    isLoading,
    createProfessional,
    updateProfessional,
    deleteProfessional,
  };
};