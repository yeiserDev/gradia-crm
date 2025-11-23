// src/lib/types/core/material.model.ts

/**
 * Tipos de documentos soportados para materiales educativos
 */
export type MaterialType = 'pdf' | 'video' | 'ppt' | 'doc' | 'docx' | 'link' | 'otro';

/**
 * Representa un material educativo asociado a una actividad
 */
export interface Material {
  id_documento_actividad: number; // El backend devuelve este nombre
  id_actividad: number;
  nombre_documento: string;
  tipo_documento: MaterialType;
  url_archivo: string;
  created_at?: string; // El backend devuelve este nombre
}

/**
 * Payload para crear un nuevo material
 */
export interface CreateMaterialPayload {
  id_actividad: number;
  nombre_documento: string;
  tipo_documento: MaterialType;
  url_archivo: string;
}

/**
 * Payload para actualizar un material existente
 */
export interface UpdateMaterialPayload {
  nombre_documento?: string;
  tipo_documento?: MaterialType;
  url_archivo?: string;
}