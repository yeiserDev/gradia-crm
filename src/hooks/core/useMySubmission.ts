import { useQuery } from '@tanstack/react-query';
import { axiosStudent } from '@/lib/services/config/axiosStudent';

interface SubmissionFile {
  id_archivo_entrega: number;
  nombre_archivo: string;
  tipo_archivo: string;
  url_archivo: string;
  created_at: string;
}

interface MySubmission {
  id_entrega: number;
  id_actividad: number;
  id_usuario: number;
  fecha_entrega: string;
  calificacion: number | null;
  retroalimentacion: string | null;
  archivos: SubmissionFile[];
}

/**
 * Hook para obtener la entrega del estudiante autenticado para una actividad específica
 */
export const useMySubmission = (taskId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['my-submission', taskId],
    queryFn: async (): Promise<MySubmission | null> => {
      try {
        const { data } = await axiosStudent.get(`/entregas/actividad/${taskId}`);

        if (!data.success) {
          return null; // No hay entrega
        }

        console.log('📥 [useMySubmission] Data from backend:', data.data);
        return data.data;
      } catch (error: any) {
        // Si el error es 404 o 403, significa que no hay entrega o no tiene acceso
        if (error.response?.status === 404 || error.response?.status === 403) {
          return null;
        }
        throw error;
      }
    },
    enabled: enabled, // Solo ejecutar si está habilitado
    retry: false, // No reintentar si falla
  });
};
