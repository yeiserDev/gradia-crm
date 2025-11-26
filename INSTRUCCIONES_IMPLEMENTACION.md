# 📋 Instrucciones para Implementar Retroalimentación de IA

## ✅ Lo que ya está hecho:

1. ✅ **Backend Elasticsearch** - Endpoint `/api/student/evaluaciones/retroalimentacion/:entregaId` funcionando
2. ✅ **Servicio Frontend** - `getAIFeedback.ts` creado
3. ✅ **Hook React** - `useAIFeedback.ts` creado
4. ✅ **Componente Modal Mejorado** - `NUEVO_GradeDetailModal.tsx` creado

## 🔧 Pasos para completar la implementación:

### 1. Reemplazar el componente GradeDetailModal

```bash
# Hacer backup del original
mv src/components/course/task/notamodal/GradeDetailModal.tsx src/components/course/task/notamodal/GradeDetailModal.tsx.backup

# Usar el nuevo
mv NUEVO_GradeDetailModal.tsx src/components/course/task/notamodal/GradeDetailModal.tsx
```

### 2. Modificar TaskHeaderCard para obtener datos de IA

Busca donde se usa el `GradeDetailModal` y modifica para obtener la retroalimentación:

```typescript
import { useAIFeedback } from '@/hooks/core/useAIFeedback';

// Dentro del componente, agregar:
const submissionId = ... // ID de la entrega del estudiante
const { data: aiFeedback, isLoading } = useAIFeedback(submissionId);

// Pasar los datos al modal:
const aiData: AIFeedback = {
  videoUrl: aiFeedback?.videoUrl,
  retroalimentacion_final: aiFeedback?.retroalimentacion_final,
  nota_final: aiFeedback?.nota_final,
  notas_por_criterio: aiFeedback?.notas_por_criterio,
  retroalimentaciones_por_criterio: aiFeedback?.retroalimentaciones_por_criterio,
};

<GradeDetailModal
  ...
  ai={aiData}
  grade={aiFeedback?.nota_final ?? existingGrade}
/>
```

### 3. Encontrar dónde obtener el `submissionId`

Necesitas buscar en el componente padre donde se muestra el modal para obtener el ID de la entrega del estudiante. Probablemente esté en:

- `TaskRolePanelClient.tsx`
- `MySubmissionDisplay.tsx`
- O algún componente que maneje las entregas del estudiante

### 4. Agregar estado de carga mientras se obtienen datos

```typescript
{isLoading && (
  <div className="text-[13px] text-[color:var(--muted)]">
    Cargando retroalimentación...
  </div>
)}
```

## 📊 Estructura de datos esperada:

El endpoint devuelve:

```json
{
  "success": true,
  "data": {
    "notas_por_criterio": {
      "1": 15.5,
      "2": 11,
      "3": 15.5,
      "4": 11,
      "5": 15.5,
      "6": 11
    },
    "retroalimentaciones_por_criterio": {
      "1": "El estudiante describe el contexto...",
      "2": "El estudiante define parcialmente...",
      ...
    },
    "retroalimentacion_final": "El estudiante demuestra un buen entendimiento...",
    "nota_final": 13.25
  }
}
```

## 🎯 Resultado esperado:

### Pestaña "Rúbrica Docente":
- Lado izquierdo: 6 criterios con notas en base 20 (15.5/20, 11/20, etc.)
- Lado derecho: Retroalimentación específica por cada criterio

### Pestaña "Evaluación de IA":
- Lado izquierdo: Video del estudiante + Nota final de IA
- Lado derecho: Retroalimentación general de la IA

## 🔍 Para debugging:

Abre la consola del navegador y ejecuta:

```javascript
const token = localStorage.getItem('gradia_access_token');
fetch('http://localhost:3001/api/student/evaluaciones/retroalimentacion/26', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data));
```

Esto te mostrará la respuesta del endpoint para verificar que los datos lleguen correctamente.

## ⚠️ Notas importantes:

1. El endpoint requiere autenticación (JWT token)
2. Solo funciona para entregas que tengan evaluación en Elasticsearch
3. Si no hay datos en Elasticsearch, el hook retornará `null`
4. Asegúrate de que el `entregaId` corresponda a una entrega con video evaluada por IA

## 📝 Próximos pasos (pendientes):

- [ ] Implementar polling para detectar cuando termina la evaluación
- [ ] Mostrar interfaz diferente cuando no hay video
- [ ] Ocultar video en vista docente con mensaje "Evaluando por IA..."
- [ ] Crear modal para que docente vea calificación de IA del estudiante
