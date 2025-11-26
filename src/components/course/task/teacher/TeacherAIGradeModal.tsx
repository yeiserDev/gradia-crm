'use client';

import { useEffect } from 'react';
import type { Submission } from '@/lib/types/core/submission.model';
import { useAIFeedback } from '@/hooks/core/useAIFeedback';
import GradeDetailModal from '../notamodal/GradeDetailModal';

export default function TeacherAIGradeModal({
  submission,
  onClose,
}: {
  submission: Submission;
  onClose: () => void;
}) {
  // Obtener el ID de la entrega desde submission
  const submissionId = submission.id;

  // Obtener retroalimentación de IA (usando rol de docente)
  const { data: aiFeedback, isLoading } = useAIFeedback(submissionId, ['DOCENTE']);

  // Detectar si hay video (tipo_archivo puede ser "video" o "video/mp4", "video/webm", etc.)
  const hasVideo = submission.attachments?.some(a =>
    a.type === 'video' || a.type?.includes('video/')
  ) ?? false;

  // Obtener URL del video si existe
  const videoUrl = submission.attachments?.find(a =>
    a.type === 'video' || a.type?.includes('video/')
  )?.url;

  // DEBUG: Logging para verificar datos
  useEffect(() => {
    console.log('🔍 [TeacherAIGradeModal] Debugging info:');
    console.log('  - submissionId:', submissionId);
    console.log('  - submission:', submission);
    console.log('  - hasVideo:', hasVideo);
    console.log('  - videoUrl:', videoUrl);
    console.log('  - aiFeedback:', aiFeedback);
    console.log('  - isLoading:', isLoading);
  }, [submissionId, submission, hasVideo, videoUrl, aiFeedback, isLoading]);

  // Preparar datos para el modal
  const aiData = aiFeedback ? {
    videoUrl: videoUrl,
    retroalimentacion_final: aiFeedback.retroalimentacion_final,
    nota_final: aiFeedback.nota_final,
    notas_por_criterio: aiFeedback.notas_por_criterio,
    retroalimentaciones_por_criterio: aiFeedback.retroalimentaciones_por_criterio,
  } : undefined;

  console.log('🔍 [TeacherAIGradeModal] aiData being passed to modal:', aiData);
  console.log('🔍 [TeacherAIGradeModal] Props being passed to GradeDetailModal:', {
    isOpen: true,
    grade: aiFeedback?.nota_final ?? submission.grade,
    manualGrade: submission.grade ?? undefined,
    manualFeedback: submission.feedback ?? undefined,
    hasVideo,
    ai: aiData,
  });

  return (
    <GradeDetailModal
      isOpen={true}
      onClose={onClose}
      grade={aiFeedback?.nota_final ?? submission.grade}
      manualGrade={submission.grade ?? undefined}
      manualFeedback={submission.feedback ?? undefined}
      hasVideo={hasVideo}
      rubric={[]} // Sin rúbrica manual para docentes
      ai={aiData}
    />
  );
}
