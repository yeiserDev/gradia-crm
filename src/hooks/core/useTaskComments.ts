import { useState, useEffect, useCallback } from 'react';
import { TaskComment } from '@/lib/types/core/task.model';
import { Role } from '@/lib/types/core/role.model';
import { useAuth } from '@/context/AuthProvider';
import { axiosTeacher } from '@/lib/services/config/axiosTeacher';
import { axiosStudent } from '@/lib/services/config/axiosStudent';

export const useTaskComments = (taskId: string, role: Role) => {
  const { user } = useAuth();
  const [items, setItems] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(true);

  // Seleccionar la instancia de axios correcta según el rol
  const axiosInstance = role === 'DOCENTE' ? axiosTeacher : axiosStudent;

  // Tipo recursivo para comentarios
  type BackendComment = {
    id_comentario: number;
    contenido: string;
    created_at: string;
    parent_id: number | null;
    usuario?: {
      correo_institucional?: string;
      persona?: { nombre: string; apellido: string };
    };
    respuestas?: BackendComment[];
  };

  // Función para aplanar la estructura anidada del backend
  const flattenComments = useCallback((backendComments: BackendComment[]): TaskComment[] => {
    let flatList: TaskComment[] = [];

    backendComments.forEach((c) => {
      // Mapear comentario principal
      flatList.push({
        id: c.id_comentario.toString(),
        authorName: c.usuario?.persona
          ? `${c.usuario.persona.nombre} ${c.usuario.persona.apellido}`
          : c.usuario?.correo_institucional || 'Usuario',
        createdAt: c.created_at,
        body: c.contenido,
        parentId: c.parent_id ? c.parent_id.toString() : null,
      });

      // Si tiene respuestas, procesarlas recursivamente (aunque el backend solo da 1 nivel por ahora)
      if (c.respuestas && c.respuestas.length > 0) {
        flatList = [...flatList, ...flattenComments(c.respuestas)];
      }
    });

    return flatList;
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/comentarios/actividad/${taskId}`);

      if (response.data.success) {
        const flatComments = flattenComments(response.data.data);
        setItems(flatComments);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setLoading(false);
    }
  }, [taskId, axiosInstance, flattenComments]);

  // Cargar comentarios al montar o cambiar taskId
  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId, fetchComments]);

  const add = useCallback(async (body: string, parentId: string | null) => {
    try {
      // Optimistic update (opcional, pero mejor esperar respuesta para tener ID real)

      const response = await axiosInstance.post('/comentarios', {
        id_actividad: taskId,
        contenido: body,
        parent_id: parentId
      });

      if (response.data.success) {
        const newCommentBackend = response.data.data;

        // Mapear el nuevo comentario
        const newComment: TaskComment = {
          id: newCommentBackend.id_comentario.toString(),
          authorName: newCommentBackend.usuario?.persona
            ? `${newCommentBackend.usuario.persona.nombre} ${newCommentBackend.usuario.persona.apellido}`
            : user?.correo_institucional || 'Yo',
          createdAt: newCommentBackend.created_at,
          body: newCommentBackend.contenido,
          parentId: newCommentBackend.parent_id ? newCommentBackend.parent_id.toString() : null,
        };

        setItems(current => [...current, newComment]);
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      alert('Error al enviar comentario');
    }
  }, [taskId, axiosInstance, user]);

  return { items, loading, add };
};