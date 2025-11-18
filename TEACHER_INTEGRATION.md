# 🎓 Integración Backend Teacher - Documentación

Esta guía explica cómo usar las funcionalidades de DOCENTE en el frontend.

---

## ✅ Ya Implementado

### 1. Servicios (API Calls)

Ubicación: `src/lib/services/teacher/`

- **courseService.ts**: CRUD completo de cursos
- **unitService.ts**: CRUD completo de unidades
- **activityService.ts**: CRUD completo de actividades

### 2. Hooks React Query

Ubicación: `src/hooks/teacher/`

- **useCourses.ts**: Hooks para gestión de cursos
- **useUnits.ts**: Hooks para gestión de unidades
- **useActivities.ts**: Hooks para gestión de actividades

### 3. Componente de Ejemplo

Ubicación: `src/components/teacher/CreateCourseModal.tsx`

Modal simple para crear un curso.

---

## 🚀 Cómo Usar

### Ejemplo 1: Crear un Curso

```tsx
import { useState } from 'react';
import { useCreateCourse } from '@/hooks/teacher/useCourses';
import CreateCourseModal from '@/components/teacher/CreateCourseModal';

export default function TeacherDashboard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Crear Nuevo Curso
      </button>

      <CreateCourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
```

### Ejemplo 2: Listar Cursos del Docente

```tsx
import { useTeacherCourses } from '@/hooks/teacher/useCourses';

export default function MyCourses() {
  const { data, isLoading, isError } = useTeacherCourses();

  if (isLoading) return <div>Cargando cursos...</div>;
  if (isError) return <div>Error al cargar cursos</div>;

  const courses = data?.data || [];

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id_curso}>
          {course.nombre_curso} - {course.codigo_curso}
        </li>
      ))}
    </ul>
  );
}
```

### Ejemplo 3: Crear una Unidad

```tsx
import { useCreateUnit } from '@/hooks/teacher/useUnits';

export default function CreateUnitButton({ courseId }: { courseId: number }) {
  const { mutate: createUnit, isPending } = useCreateUnit();

  const handleClick = () => {
    createUnit(
      {
        id_curso: courseId,
        titulo_unidad: 'Unidad 1: Introducción',
        descripcion: 'Conceptos básicos',
        orden: 1,
      },
      {
        onSuccess: () => alert('Unidad creada!'),
        onError: (error) => console.error(error),
      }
    );
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Creando...' : 'Crear Unidad'}
    </button>
  );
}
```

### Ejemplo 4: Crear una Actividad

```tsx
import { useCreateActivity } from '@/hooks/teacher/useActivities';

export default function CreateActivityButton({ unitId }: { unitId: number }) {
  const { mutate: createActivity, isPending } = useCreateActivity();

  const handleClick = () => {
    createActivity(
      {
        id_unidad: unitId,
        nombre_actividad: 'Tarea 1',
        descripcion: 'Resolver ejercicios del 1 al 10',
        tipo_actividad: 'TAREA',
        fecha_limite: '2025-12-31',
        puntuacion_maxima: 20,
      },
      {
        onSuccess: () => alert('Actividad creada!'),
        onError: (error) => console.error(error),
      }
    );
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Creando...' : 'Crear Actividad'}
    </button>
  );
}
```

---

## 🔧 Hooks Disponibles

### Cursos

```tsx
import {
  useTeacherCourses,     // GET /api/cursos (todos)
  useTeacherCourse,      // GET /api/cursos/:id (uno)
  useCreateCourse,       // POST /api/cursos (crear)
  useUpdateCourse,       // PUT /api/cursos/:id (actualizar)
  useDeleteCourse,       // DELETE /api/cursos/:id (eliminar)
} from '@/hooks/teacher/useCourses';
```

### Unidades

```tsx
import {
  useTeacherUnits,       // GET /api/unidades (todas)
  useTeacherUnit,        // GET /api/unidades/:id (una)
  useUnitsByCourse,      // GET /api/cursos/:id/unidades (por curso)
  useCreateUnit,         // POST /api/unidades (crear)
  useUpdateUnit,         // PUT /api/unidades/:id (actualizar)
  useDeleteUnit,         // DELETE /api/unidades/:id (eliminar)
} from '@/hooks/teacher/useUnits';
```

### Actividades

```tsx
import {
  useTeacherActivities,      // GET /api/actividades (todas)
  useTeacherActivity,        // GET /api/actividades/:id (una)
  useActivitiesByUnit,       // GET /api/unidades/:id/actividades (por unidad)
  useActivitiesByCourse,     // GET /api/cursos/:id/actividades (por curso)
  useCreateActivity,         // POST /api/actividades (crear)
  useUpdateActivity,         // PUT /api/actividades/:id (actualizar)
  useDeleteActivity,         // DELETE /api/actividades/:id (eliminar)
} from '@/hooks/teacher/useActivities';
```

---

## 🧪 Probar la Integración

### 1. Iniciar los backends

```bash
# Terminal 1: Auth backend
cd auth_gradia
npm start  # Puerto 8080

# Terminal 2: Teacher backend
cd gradia-module-manager-teacher
npm start  # Puerto 3000

# Terminal 3: Student backend
cd gradia-module-manager-student
npm start  # Puerto 3001

# Terminal 4: Frontend
cd gradia-crm
npm run dev  # Puerto 3000 (Next.js)
```

### 2. Crear un usuario DOCENTE

Usa el script SQL `CREAR_DOCENTE.sql` para crear un usuario con rol DOCENTE en la base de datos.

### 3. Login como DOCENTE

1. Ve a `http://localhost:3000/auth/login`
2. Ingresa con el email del DOCENTE
3. Deberías ser redirigido al dashboard

### 4. Probar Creación de Curso

Agrega el botón de crear curso en algún componente del dashboard:

```tsx
// En src/app/(dashboard)/dashboard/page.tsx
import { useState } from 'react';
import CreateCourseModal from '@/components/teacher/CreateCourseModal';
import { useAuth } from '@/context/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const isTeacher = user?.roles?.includes('DOCENTE');

  return (
    <div>
      <h1>Dashboard</h1>

      {isTeacher && (
        <>
          <button onClick={() => setShowModal(true)}>
            + Crear Curso
          </button>

          <CreateCourseModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </>
      )}
    </div>
  );
}
```

---

## 🔍 Verificar en Postman

### Crear Curso

```
POST http://localhost:3000/api/cursos
Headers:
  Authorization: Bearer <TOKEN_DEL_DOCENTE>
  Content-Type: application/json

Body:
{
  "nombre_curso": "Matemáticas I",
  "codigo_curso": "MAT101",
  "descripcion": "Curso introductorio de matemáticas"
}
```

### Listar Cursos del Docente

```
GET http://localhost:3000/api/cursos
Headers:
  Authorization: Bearer <TOKEN_DEL_DOCENTE>
```

---

## 📝 Notas Importantes

1. **Autenticación**: Todos los endpoints requieren JWT válido con rol `DOCENTE` o `ADMIN`
2. **Caché**: React Query invalida automáticamente la caché después de cada mutación
3. **Errores**: Todos los hooks tienen `isError` y `error` para manejo de errores
4. **Loading States**: Usa `isPending` para mostrar spinners durante las mutaciones
5. **Backend URLs**: Asegúrate de que `.env` tenga las URLs correctas

---

## ✅ Checklist de Pruebas

- [ ] Login como DOCENTE funciona
- [ ] Dashboard detecta rol DOCENTE
- [ ] Crear curso desde el frontend
- [ ] Listar cursos del docente
- [ ] Crear unidad en un curso
- [ ] Crear actividad en una unidad
- [ ] Ver detalles de una actividad
- [ ] Actualizar curso
- [ ] Eliminar curso

---

## 🐛 Problemas Comunes

### Error: "Network Error"
**Causa**: Backend Teacher no está corriendo
**Solución**: `cd gradia-module-manager-teacher && npm start`

### Error: "403 Forbidden"
**Causa**: Usuario no tiene rol DOCENTE
**Solución**: Verifica en la BD que el usuario tenga el rol asignado

### Error: "CORS"
**Causa**: Frontend URL no está en FRONTEND_URL del backend
**Solución**: Verifica `.env` del backend Teacher

---

## 📚 Próximos Pasos

1. Crear modales para unidades y actividades (similar a CreateCourseModal)
2. Integrar con las rutas existentes del dashboard
3. Agregar validaciones de formularios
4. Agregar confirmaciones para eliminaciones
5. Implementar vistas de lista con filtros y búsqueda
