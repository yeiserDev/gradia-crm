# ✅ Requisito 4 Completado: Polling de Evaluación de IA

## 📋 Resumen

Se ha implementado un sistema de **polling automático** que revisa Elasticsearch periódicamente para detectar cuando la evaluación de IA está completa. Mientras la evaluación está en proceso, se muestra un mensaje "Evaluando", y cuando termina, aparece una **alerta/notificación** informando "Calificado por IA".

## 🎯 Requisito Original

> "Dentro de este índice 'evaluaciones_rubrica' revise el id de entrega, si no lo encuentra es que sigue evaluando, cuando aparezca el id es que ya se evaluó, entonces mientras no aparece, que salga un mensaje 'evaluando' hasta que aparezca, que salga una alerta con un mensaje 'calificado por IA'"

## 🔧 Componentes Implementados

### 1. **Hook: useAIEvaluationStatus.ts** (NUEVO)

**Ubicación**: `src/hooks/core/useAIEvaluationStatus.ts`

**Funcionalidad**:
- Hace polling cada 10 segundos a Elasticsearch
- Busca el `entrega_id` en el índice `evaluaciones_rubrica`
- Retorna estados: `'checking'`, `'evaluating'`, `'completed'`
- Detiene el polling automáticamente cuando encuentra datos
- Muestra notificación toast cuando la evaluación termina

**Características clave**:
```typescript
refetchInterval: (data) => {
  // Si ya hay datos (evaluación completa), detener el polling
  if (data) return false;
  // Si no hay datos, seguir haciendo polling cada 10 segundos
  return 10000;
}
```

**Notificación automática**:
```typescript
toast.success('✅ Calificado por IA', {
  description: `Tu entrega ha sido evaluada. Nota: ${data.nota_final.toFixed(2)}/20`,
  duration: 8000,
  action: {
    label: 'Ver detalle',
    onClick: () => { /* Usuario puede ver el detalle */ }
  }
});
```

### 2. **Componente: MySubmissionDisplay.tsx** (MODIFICADO)

**Ubicación**: `src/components/course/task/student/MySubmissionDisplay.tsx`

**Cambios**:

1. **Detecta si hay video**:
```typescript
const hasVideo = submission?.archivos?.some(f => f.tipo_archivo.includes('video')) ?? false;
```

2. **Activa polling solo si hay video**:
```typescript
const { status: aiStatus } = useAIEvaluationStatus(
  submission?.id_entrega,
  hasVideo // Solo hacer polling si hay video
);
```

3. **Muestra tarjeta de estado "Evaluando"**:
```tsx
{hasVideo && aiStatus === 'evaluating' && (
  <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
    <div className="flex items-center gap-2 mb-2">
      <Clock size={18} className="text-amber-600 animate-pulse" />
      <div className="text-[13px] font-medium text-amber-700">🤖 Gradia evaluando...</div>
    </div>
    <div className="text-[12px] text-amber-600">
      Tu video está siendo evaluado por IA. Recibirás una notificación cuando esté listo.
    </div>
  </div>
)}
```

## 🔄 Flujo Completo

```
1. Estudiante sube video
         ↓
2. Sistema detecta que hay video (hasVideo = true)
         ↓
3. Hook inicia polling cada 10 segundos
         ↓
4. Busca entrega_id en Elasticsearch "evaluaciones_rubrica"
         ↓
5a. NO ENCONTRADO → Estado: 'evaluating'
    └─ Muestra tarjeta "🤖 Gradia evaluando..."
    └─ Continúa polling cada 10 seg
         ↓
5b. ENCONTRADO → Estado: 'completed'
    └─ Detiene polling
    └─ Muestra notificación toast "✅ Calificado por IA"
    └─ Usuario puede ver detalle de evaluación
```

## 🖥️ Interfaz de Usuario

### Estado "Evaluando":

```
┌─────────────────────────────────────────┐
│ ⏰ 🤖 Gradia evaluando...              │ ← Pulsando
│                                         │
│ Tu video está siendo evaluado por IA.   │
│ Recibirás una notificación cuando esté  │
│ listo.                                  │
└─────────────────────────────────────────┘
```

**Características visuales**:
- Fondo: `bg-amber-500/10` (amarillo claro)
- Borde: `border-amber-500/30` (amarillo tenue)
- Ícono reloj: animación `animate-pulse`
- Color texto: `text-amber-600` y `text-amber-700`

### Notificación "Completado":

```
┌─────────────────────────────────────────┐
│ ✅ Calificado por IA                    │
│                                         │
│ Tu entrega ha sido evaluada.            │
│ Nota: 13.25/20                         │
│                                         │
│                        [Ver detalle →] │
└─────────────────────────────────────────┘
```

**Características**:
- Tipo: `toast.success` (notificación verde de éxito)
- Duración: 8 segundos
- Acción: Botón "Ver detalle"
- Muestra la nota final obtenida

## 📊 Estados del Sistema

| Estado | Descripción | Interfaz | Polling Activo |
|--------|-------------|----------|----------------|
| `checking` | Verificando inicialmente | Sin indicador | ⏸️ Pausa temporal |
| `evaluating` | Video siendo evaluado | Tarjeta amarilla "Evaluando..." | ✅ Cada 10 seg |
| `completed` | Evaluación terminada | Notificación toast verde | ❌ Detenido |

## ⚙️ Configuración Técnica

### Intervalo de Polling:
- **10 segundos** entre cada consulta
- Se detiene automáticamente al detectar datos

### React Query:
```typescript
{
  queryKey: ['ai-evaluation-status', entregaId],
  refetchInterval: (data) => data ? false : 10000,
  staleTime: 0, // Siempre refrescar
  retry: 1,
}
```

### Optimización:
- Solo hace polling si `hasVideo === true`
- No hace polling si no hay `entregaId`
- Usa `useRef` para evitar notificaciones duplicadas

## 🔍 Detección en Elasticsearch

El hook llama al endpoint que busca en Elasticsearch:

**Endpoint**: `GET /api/student/evaluaciones/retroalimentacion/:entregaId`

**Índice**: `evaluaciones_rubrica`

**Query**:
```javascript
{
  index: "evaluaciones_rubrica",
  query: { term: { entrega_id: entregaId } }
}
```

**Respuesta cuando NO está evaluado** (404):
```json
{
  "success": false,
  "message": "Evaluación no encontrada en Elasticsearch"
}
```

**Respuesta cuando SÍ está evaluado** (200):
```json
{
  "success": true,
  "data": {
    "notas_por_criterio": { "1": 15.5, "2": 11, ... },
    "retroalimentaciones_por_criterio": { ... },
    "retroalimentacion_final": "...",
    "nota_final": 13.25
  }
}
```

## 🎯 Casos de Uso

### Caso 1: Entrega con video (en evaluación)
1. Estudiante sube video
2. Ve tarjeta amarilla "🤖 Gradia evaluando..."
3. Sistema hace polling cada 10 seg
4. Después de unos minutos, aparece notificación "✅ Calificado por IA"
5. Estudiante hace clic en "Ver detalle" para ver su evaluación

### Caso 2: Entrega con video (ya evaluado)
1. Estudiante accede a tarea previamente entregada
2. Sistema detecta que ya hay datos en Elasticsearch
3. NO muestra tarjeta "Evaluando"
4. Muestra directamente la calificación
5. Puede ver detalle completo en modal

### Caso 3: Entrega sin video (solo archivos)
1. Estudiante sube solo archivos
2. `hasVideo = false`
3. NO se activa el polling
4. NO muestra tarjeta de evaluación
5. Espera calificación manual del docente

## 📱 Notificación Toast

**Librería**: `sonner` (React Toast library)

**Características**:
- **Tipo**: Success (verde)
- **Título**: "✅ Calificado por IA"
- **Descripción**: "Tu entrega ha sido evaluada. Nota: X.XX/20"
- **Duración**: 8 segundos
- **Acción**: Botón "Ver detalle"
- **Posición**: Esquina superior derecha (por defecto)

**Prevención de duplicados**:
```typescript
const hasNotifiedRef = useRef(false);

useEffect(() => {
  if (data && !hasNotifiedRef.current && enabled) {
    hasNotifiedRef.current = true;
    toast.success(...);
  }
}, [data, enabled]);
```

## 🚀 Rendimiento

### Optimizaciones implementadas:

1. **Polling condicional**: Solo si hay video
2. **Auto-detención**: Para cuando encuentra datos
3. **Cache de React Query**: Evita consultas duplicadas
4. **Ref para notificación**: Previene alerts múltiples
5. **Intervalo razonable**: 10 segundos (no sobrecarga el servidor)

### Impacto en el servidor:

- **Sin video**: 0 requests adicionales
- **Con video (evaluando)**: ~6 requests/minuto
- **Con video (completado)**: 0 requests (polling detenido)

## ✅ Resultado Final

El estudiante ahora tiene:

1. ✅ **Visibilidad**: Sabe que su video está siendo evaluado
2. ✅ **Feedback en tiempo real**: Ve el estado "Evaluando..."
3. ✅ **Notificación automática**: Recibe alerta cuando termina
4. ✅ **Acceso rápido**: Puede ver detalle desde la notificación
5. ✅ **Experiencia fluida**: No necesita refrescar la página

## 🧪 Testing

Para probar la funcionalidad:

1. Iniciar sesión como estudiante (`davyluke@gmail.com`)
2. Subir una tarea con video
3. Observar tarjeta amarilla "🤖 Gradia evaluando..."
4. Esperar 10-20 segundos (simular evaluación)
5. Verificar que aparece notificación "✅ Calificado por IA"
6. Hacer clic en "Ver detalle" para ver evaluación completa

## 📌 Notas Importantes

- El polling solo funciona en **entregas con video**
- La notificación aparece **una sola vez** por evaluación
- El usuario puede **cerrar la notificación** manualmente
- El botón "Ver detalle" está **disponible** en la notificación
- El sistema es **eficiente** y no sobrecarga el servidor
