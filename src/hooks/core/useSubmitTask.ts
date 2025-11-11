import { useMutation } from '@tanstack/react-query';
import { submitTask } from '@/lib/services/core/submitTask';
import { useAuth } from '@/context/AuthProvider'; // Para obtener el ID/nombre

export const useSubmitTask = () => {
  const { user } = useAuth(); // Obtenemos el usuario real

  const { 
    mutateAsync, // Usamos 'mutateAsync' para poder usar 'await'
    isPending: isLoading // Renombramos 'isPending' a 'isLoading'
  } = useMutation({
    
    mutationFn: ({ taskId, files }: { taskId: string, files: File[] }) => {
      if (!user) throw new Error("Usuario no autenticado");

      // ¡OJO! Usamos fallbacks temporales porque 'name' no está en 'user'
      // (el problema 'victus')
      const studentName = user.correo_institucional.split('@')[0];
      const studentId = String(user.id_usuario);
      
      return submitTask({
        taskId,
        files,
        studentId,
        studentName
      });
    },
    
    // Aquí puedes añadir 'onError' o 'onSuccess' si lo necesitas
  });

  return { submitTask: mutateAsync, isLoading };
};