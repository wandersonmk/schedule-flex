import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Professional, NewProfessional } from '@/types/professional';
import {
  fetchProfessionalsFromApi,
  addProfessionalToApi,
  updateProfessionalInApi,
  deleteProfessionalFromApi
} from '@/api/professionals';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const data = await fetchProfessionalsFromApi();
      setProfessionals(data);
    } catch (error: any) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao carregar profissionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProfessional = async (newProfessional: NewProfessional) => {
    try {
      await addProfessionalToApi(newProfessional);
      await fetchProfessionals();
      toast({
        title: "Sucesso",
        description: "Profissional adicionado com sucesso",
      });
    } catch (error: any) {
      console.error('Error adding professional:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao adicionar profissional",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfessional = async (updatedProfessional: Professional) => {
    try {
      await updateProfessionalInApi(updatedProfessional);
      await fetchProfessionals();
      toast({
        title: "Sucesso",
        description: "Profissional atualizado com sucesso",
      });
    } catch (error: any) {
      console.error('Error updating professional:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar profissional",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      await deleteProfessionalFromApi(id);
      await fetchProfessionals();
      toast({
        title: "Sucesso",
        description: "Profissional removido com sucesso",
      });
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao remover profissional",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    professionals,
    loading,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
  };
};