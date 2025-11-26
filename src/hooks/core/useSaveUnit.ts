import { useState } from 'react';
import { createUnit, CreateUnitPayload } from '@/lib/services/core/unitService';

/**
 * Hook para gestionar la creación de unidades
 * Maneja estado de loading, error y éxito
 */
export const useSaveUnit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Guarda una nueva unidad
   * @param data - Datos de la unidad a crear
   * @returns La unidad creada o null en caso de error
   */
  const saveUnit = async (data: CreateUnitPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const newUnit = await createUnit(data);
      setIsLoading(false);
      return newUnit;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la unidad';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return {
    saveUnit,
    isLoading,
    error,
  };
};
