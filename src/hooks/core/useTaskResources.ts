import { useState, useEffect } from 'react';
import { getMaterialsByActivity, getMaterialsByActivityStudent, createMaterial, deleteMaterial } from '@/lib/services/core/materialService';
import type { Material, MaterialType } from '@/lib/types/core/material.model';
import { useAuth } from '@/context/AuthProvider';

// Definimos un tipo 'Resource' simple para compatibilidad con la UI existente
export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'document' | 'notebook' | 'slide' | 'link' | 'video';
  url: string;
  size?: string;
  updatedAt?: string;
}

// Mapeo de MaterialType a Resource type
const mapMaterialTypeToResourceType = (materialType: MaterialType): Resource['type'] => {
  switch (materialType) {
    case 'pdf': return 'pdf';
    case 'video': return 'video';
    case 'ppt': return 'slide';
    case 'doc':
    case 'docx': return 'document';
    case 'link': return 'link';
    default: return 'document';
  }
};

// Convertir Material a Resource
const materialToResource = (material: Material): Resource => ({
  id: material.id_documento_actividad.toString(),
  title: material.nombre_documento,
  type: mapMaterialTypeToResourceType(material.tipo_documento),
  url: material.url_archivo,
  updatedAt: material.created_at,
});

/**
 * Hook para obtener los recursos/materiales de una tarea desde la API real
 */
export const useTaskResources = (taskId: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);

        console.log(`🔍 [useTaskResources] Fetching resources for task ${taskId}`, {
          user: user ? 'exists' : 'null',
          roles: user?.roles
        });

        // Usar el servicio correcto según el rol del usuario
        const isTeacher = user?.roles?.includes('DOCENTE') || user?.roles?.includes('ADMIN');
        console.log(`👤 [useTaskResources] User is ${isTeacher ? 'TEACHER' : 'STUDENT'}`);

        const materials = isTeacher
          ? await getMaterialsByActivity(taskId)
          : await getMaterialsByActivityStudent(taskId);

        console.log(`📦 [useTaskResources] Received ${materials.length} materials from backend`);

        const mappedResources = materials.map(materialToResource);
        setResources(mappedResources);
        console.log(`✅ [useTaskResources] Set ${mappedResources.length} resources in state`);
      } catch (error) {
        console.error('❌ [useTaskResources] Error al cargar recursos:', error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    if (taskId && user) {
      console.log(`🚀 [useTaskResources] Starting fetch for task ${taskId}`);
      fetchResources();
    } else {
      console.warn(`⚠️ [useTaskResources] Not fetching - taskId: ${taskId}, user: ${user ? 'exists' : 'null'}`);
      setLoading(false);
    }
  }, [taskId, user]);

  // Añadir recurso
  const addResource = async (r: Omit<Resource, 'id'>) => {
    try {
      // 1. Subir archivo si es necesario (por ahora usamos la URL directamente)
      // En el futuro, aquí subirías el archivo real

      // 2. Detectar tipo de material
      let tipoDocumento: MaterialType = 'otro';
      if (r.type === 'pdf') tipoDocumento = 'pdf';
      else if (r.type === 'video') tipoDocumento = 'video';
      else if (r.type === 'slide') tipoDocumento = 'ppt';
      else if (r.type === 'document') tipoDocumento = 'doc';
      else if (r.type === 'link') tipoDocumento = 'link';

      // 3. Crear material en el backend
      const newMaterial = await createMaterial({
        id_actividad: parseInt(taskId),
        nombre_documento: r.title,
        tipo_documento: tipoDocumento,
        url_archivo: r.url,
      });

      if (newMaterial) {
        const newResource = materialToResource(newMaterial);
        setResources(prev => [newResource, ...prev]);
        return newResource;
      }

      throw new Error('No se pudo crear el material');
    } catch (error) {
      console.error('Error al añadir recurso:', error);
      throw error;
    }
  };

  // Eliminar recurso
  const removeResource = async (id: string) => {
    try {
      const materialId = parseInt(id);
      await deleteMaterial(materialId);
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      throw error;
    }
  };

  return { resources, loading, addResource, removeResource };
};