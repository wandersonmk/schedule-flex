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
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    try {
      const data = await fetchProfessionalsFromApi();
      setProfessionals(data);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar profissionais",
        variant: "destructive",
      });
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
        description: "Erro ao adicionar profissional",
        variant: "destructive",
      });
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
        description: "Erro ao atualizar profissional",
        variant: "destructive",
      });
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
        description: "Erro ao deletar profissional",
        variant: "destructive",
      });
    }
  };

  return {
    professionals,
    fetchProfessionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
  };
};