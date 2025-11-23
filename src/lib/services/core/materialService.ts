// src/lib/services/core/materialService.ts

import { axiosTeacher } from '../config/axiosTeacher';
import { axiosStudent } from '../config/axiosStudent';
import type { Material, CreateMaterialPayload, UpdateMaterialPayload } from '@/lib/types/core/material.model';

/**
 * TEACHER: Obtener todos los materiales de una actividad
 */
export const getMaterialsByActivity = async (actividadId: string): Promise<Material[]> => {
  try {
    const response = await axiosTeacher.get(`/materiales/actividad/${actividadId}`);

    if (!response.data.success) {
      console.warn('No se pudieron obtener materiales:', response.data.message);
      return [];
    }

    return response.data.data || [];
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    return [];
  }
};

/**
 * STUDENT: Obtener todos los materiales de una actividad
 */
export const getMaterialsByActivityStudent = async (actividadId: string): Promise<Material[]> => {
  try {
    const response = await axiosStudent.get(`/materiales/actividad/${actividadId}`);

    if (!response.data.success) {
      console.warn('No se pudieron obtener materiales:', response.data.message);
      return [];
    }

    return response.data.data || [];
  } catch (error) {
    console.error('Error al obtener materiales:', error);
    return [];
  }
};

/**
 * TEACHER: Crear un nuevo material
 * NOTA: Por ahora solo soportamos URLs. Para archivos reales necesitarás implementar upload de archivos.
 */
export const createMaterial = async (payload: CreateMaterialPayload): Promise<Material | null> => {
  try {
    const response = await axiosTeacher.post('/materiales', payload);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al crear material');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error al crear material:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al crear el material');
  }
};

/**
 * TEACHER: Actualizar un material existente
 */
export const updateMaterial = async (materialId: number, payload: UpdateMaterialPayload): Promise<Material | null> => {
  try {
    const response = await axiosTeacher.put(`/materiales/${materialId}`, payload);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al actualizar material');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error al actualizar material:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al actualizar el material');
  }
};

/**
 * TEACHER: Eliminar un material
 */
export const deleteMaterial = async (materialId: number): Promise<boolean> => {
  try {
    const response = await axiosTeacher.delete(`/materiales/${materialId}`);

    return response.data.success;
  } catch (error: any) {
    console.error('Error al eliminar material:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al eliminar el material');
  }
};

/**
 * TEACHER: Subir archivo al servidor
 */
export const uploadFile = async (file: File): Promise<string> => {
  try {
    console.log('📤 Subiendo archivo:', file.name, file.type, file.size);

    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);

    // Subir archivo al backend
    const response = await axiosTeacher.post('/materiales/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al subir archivo');
    }

    console.log('✅ Archivo subido exitosamente:', response.data.data.url);
    return response.data.data.url;
  } catch (error: any) {
    console.error('❌ Error al subir archivo:', error);
    throw new Error(error.response?.data?.message || error.message || 'Error al subir el archivo');
  }
};