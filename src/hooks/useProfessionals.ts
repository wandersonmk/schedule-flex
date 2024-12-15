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
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os profissionais. Por favor, tente novamente.",
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
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o profissional. Por favor, tente novamente.",
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
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o profissional. Por favor, tente novamente.",
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
    } catch (error) {
      console.error('Erro ao deletar profissional:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o profissional. Por favor, tente novamente.",
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