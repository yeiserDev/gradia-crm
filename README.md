# 🎓 GradIA CRM - Sistema de Gestión de Cursos con IA

**Frontend de GradIA** - Plataforma web construida con Next.js 15 para la gestión de cursos, actividades y evaluación automática mediante Inteligencia Artificial.

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwind-css)
![React Query](https://img.shields.io/badge/React%20Query-5.90-FF4154?logo=react-query)

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Características Técnicas](#-características-técnicas)
- [Integración con Backend](#-integración-con-backend)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Troubleshooting](#-troubleshooting)
- [Contribución](#-contribución)

---

## ⭐ Características Principales

### 🎯 Para Estudiantes
- ✅ **Dashboard personalizado** con cursos activos y progreso
- ✅ **Visualización de actividades** con fechas de entrega
- ✅ **Subida de archivos** (documentos, videos, imágenes)
- ✅ **Evaluación automática con IA** para entregas con video
- ✅ **Retroalimentación detallada** con criterios de evaluación
- ✅ **Polling en tiempo real** - Sin necesidad de refrescar la página
- ✅ **Notificaciones** cuando la IA termina de evaluar
- ✅ **Vista previa de archivos** (PDF, video) en modal

### 👨‍🏫 Para Docentes
- ✅ **Gestión de cursos y unidades**
- ✅ **Creación de actividades** con rúbricas
- ✅ **Subida de recursos** (PDFs, videos, enlaces)
- ✅ **Monitoreo de entregas** con estado en tiempo real
- ✅ **Vista de evaluaciones de IA** para videos
- ✅ **Calificación manual** para documentos
- ✅ **Estadísticas de curso** con gráficos
- ✅ **Auto-actualización** sin F5 cuando la IA evalúa

### 🤖 Evaluación Inteligente
- ✅ **Integración con AWS Lambda** para procesamiento de videos
- ✅ **Elasticsearch** para almacenamiento de evaluaciones
- ✅ **Polling inteligente** que detecta automáticamente cuando la evaluación está lista
- ✅ **Cache sincronizado** entre estudiantes y docentes
- ✅ **Deduplicación automática** de registros

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     GRADIA CRM (Frontend)                    │
│                        Next.js 15                            │
└──────────────┬──────────────────────────────┬────────────────┘
               │                              │
       ┌───────▼────────┐            ┌────────▼────────┐
       │  Auth Service  │            │  Backend APIs   │
       │   (Port 4001)  │            │                 │
       └────────────────┘            ├─────────────────┤
                                     │ Student (3001)  │
                                     │ Teacher (3002)  │
                                     └────────┬────────┘
                                              │
                                     ┌────────▼────────┐
                                     │   PostgreSQL    │
                                     │   AWS RDS       │
                                     └─────────────────┘
                                              │
                                     ┌────────▼────────┐
                                     │  Elasticsearch  │
                                     │  (AI Feedback)  │
                                     └─────────────────┘
```

---

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Backends corriendo**:
  - Auth Service (puerto 4001)
  - Student Module (puerto 3001)
  - Teacher Module (puerto 3002)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd gradia-crm
```

### 2. Instalar dependencias

```bash
npm install
```

---

## ⚙️ Configuración

### Archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URLs de los backends
NEXT_PUBLIC_API_URL_AUTH=http://localhost:4001/api
NEXT_PUBLIC_API_URL_STUDENT=http://localhost:3001/api
NEXT_PUBLIC_API_URL_TEACHER=http://localhost:3002/api

# Elasticsearch (para búsqueda de evaluaciones de IA)
NEXT_PUBLIC_ELASTICSEARCH_URL=https://your-elasticsearch-url.com
NEXT_PUBLIC_ELASTICSEARCH_API_KEY=your-api-key-here
NEXT_PUBLIC_ELASTICSEARCH_INDEX=gradia-feedback
```

### Archivo `.env.example`

Se proporciona un archivo de ejemplo:

```bash
cp .env.example .env.local
# Editar .env.local con tus valores
```

---

## 🎮 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modo Producción

```bash
# Build
npm run build

# Start
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Estructura del Proyecto

```
gradia-crm/
├── public/                          # Archivos estáticos
├── src/
│   ├── app/                         # App Router (Next.js 15)
│   │   ├── (dashboard)/             # Rutas del dashboard
│   │   │   ├── course/              # Página de curso
│   │   │   ├── dashboard/           # Dashboard principal
│   │   │   └── layout.tsx           # Layout del dashboard
│   │   ├── auth/                    # Autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── globals.css              # Estilos globales
│   │   └── layout.tsx               # Root layout
│   │
│   ├── components/                  # Componentes de React
│   │   ├── auth/                    # Componentes de autenticación
│   │   ├── common/                  # Componentes compartidos
│   │   ├── course/                  # Componentes de curso
│   │   │   └── task/                # Componentes de actividades
│   │   │       ├── student/         # Vista estudiante
│   │   │       ├── teacher/         # Vista docente
│   │   │       └── notamodal/       # Modal de calificaciones
│   │   ├── dashboard/               # Componentes del dashboard
│   │   ├── profile/                 # Componentes de perfil
│   │   └── ui/                      # UI components base
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── auth/                    # Hooks de autenticación
│   │   │   └── useAuth.ts
│   │   ├── core/                    # Hooks principales
│   │   │   ├── useAIEvaluationStatus.ts  # Polling de IA
│   │   │   ├── useAIFeedback.ts          # Feedback de IA
│   │   │   ├── useMySubmission.ts        # Entrega del estudiante
│   │   │   ├── useTaskSubmissionsList.ts # Lista de entregas
│   │   │   └── ...
│   │   └── teacher/                 # Hooks del docente
│   │
│   ├── lib/                         # Utilidades y servicios
│   │   ├── services/                # Servicios de API
│   │   │   ├── auth/
│   │   │   ├── config/              # Configuración de Axios
│   │   │   └── core/                # Servicios principales
│   │   │       ├── submissionService.ts
│   │   │       ├── getAIFeedback.ts
│   │   │       └── ...
│   │   ├── types/                   # TypeScript types
│   │   └── utils/                   # Utilidades
│   │
│   └── context/                     # Context API
│       └── AuthContext.tsx
│
├── .env.local                       # Variables de entorno (no commitear)
├── .env.example                     # Ejemplo de variables
├── next.config.ts                   # Configuración de Next.js
├── tailwind.config.ts               # Configuración de Tailwind
├── tsconfig.json                    # Configuración de TypeScript
└── package.json                     # Dependencias
```

---

## 🔧 Características Técnicas

### State Management

- **React Query (@tanstack/react-query)**: Gestión de estado del servidor con cache inteligente
- **React Context API**: Estado global de autenticación

### Data Fetching

```typescript
// Ejemplo: Hook con polling automático
export const useAIEvaluationStatus = (entregaId, enabled) => {
  return useQuery({
    queryKey: ['ai-feedback', entregaId],
    queryFn: () => getAIFeedback(entregaId),
    enabled: enabled && !!entregaId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Si ya hay nota final, detener polling
      if (data?.nota_final != null) return false;
      // Seguir haciendo polling cada 5s
      return 5000;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
```

### Real-time Updates

- ✅ **Polling inteligente** con React Query
- ✅ **Auto-detiene el polling** cuando la evaluación está completa
- ✅ **Cache compartido** entre componentes
- ✅ **Deduplicación** de estudiantes duplicados del backend

### Forms & Validation

- **React Hook Form**: Gestión de formularios
- **Zod**: Validación de esquemas
- **@hookform/resolvers**: Integración entre RHF y Zod

### UI Components

- **Iconsax React**: Iconos modernos
- **Lucide React**: Iconos adicionales
- **Recharts**: Gráficos y estadísticas
- **Sonner**: Toast notifications elegantes
- **Framer Motion**: Animaciones suaves

### Styling

- **TailwindCSS 4.1**: Utility-first CSS
- **CSS Variables**: Tematización dinámica
- **Dark Mode Ready**: Preparado para modo oscuro

---

## 🔗 Integración con Backend

### Configuración de Axios

```typescript
// src/lib/services/config/axiosStudent.ts
import axios from 'axios';

export const axiosStudent = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_STUDENT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
axiosStudent.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints Principales

| Servicio | Base URL | Puerto | Descripción |
|----------|----------|--------|-------------|
| Auth | `http://localhost:4001/api` | 4001 | Autenticación y registro |
| Student | `http://localhost:3001/api` | 3001 | Módulo de estudiante |
| Teacher | `http://localhost:3002/api` | 3002 | Módulo de docente |

### Flujo de Evaluación con IA

```
1. Estudiante sube video
   ↓
2. Frontend → POST /api/entregas (Student Backend)
   ↓
3. Backend → Guarda en BD + S3 + Trigger AWS Lambda
   ↓
4. AWS Lambda → Procesa video con IA
   ↓
5. Lambda → Guarda resultado en Elasticsearch
   ↓
6. Frontend → Polling GET /api/ai-feedback/:id (cada 5s)
   ↓
7. Elasticsearch → Retorna evaluación cuando está lista
   ↓
8. Frontend → Muestra nota y feedback automáticamente
```

---

## 📸 Capturas de Pantalla

### Dashboard del Estudiante
![Dashboard](./docs/screenshots/student-dashboard.png)
*Vista principal del estudiante con cursos activos*

### Actividad con Evaluación de IA
![AI Evaluation](./docs/screenshots/ai-evaluation.png)
*Retroalimentación detallada de la IA con criterios*

### Vista del Docente
![Teacher View](./docs/screenshots/teacher-submissions.png)
*Lista de entregas con estado en tiempo real*

### Modal de Calificación
![Grade Modal](./docs/screenshots/grade-detail-modal.png)
*Modal con detalles completos de la evaluación*

> **Nota**: Crea una carpeta `docs/screenshots/` y agrega las capturas de pantalla mencionadas.

---

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"

**Problema**: Frontend no puede conectarse a los backends.

**Solución**:
```bash
# Verificar que los backends estén corriendo
curl http://localhost:4001/api/health  # Auth
curl http://localhost:3001/api/health  # Student
curl http://localhost:3002/api/health  # Teacher
```

### Error: "Polling no se detiene"

**Problema**: El polling sigue haciendo requests aunque la evaluación esté completa.

**Solución**: Verificar que `useAIEvaluationStatus` tenga la lógica correcta:

```typescript
refetchInterval: (query) => {
  const data = query.state.data;
  if (data?.nota_final != null) return false; // Detener
  return 5000; // Continuar
}
```

### Error: "Estudiantes duplicados"

**Problema**: El backend devuelve registros duplicados.

**Solución**: Ya implementado en `submissionService.ts` con deduplicación automática.

### Error: "Build failed"

**Problema**: Error al hacer build de producción.

**Solución**:
```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules
npm install
npm run build
```

---

## 🤝 Contribución

### Guía de Contribución

1. **Fork** el repositorio
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Estándares de Código

- ✅ Usar **TypeScript** para todo el código
- ✅ Seguir **ESLint** rules
- ✅ Componentes en **PascalCase**
- ✅ Hooks personalizados con prefijo `use`
- ✅ Archivos de servicio en **camelCase**
- ✅ Comentarios en español para claridad

---

## 📝 Licencia

Este proyecto es privado y confidencial.

---

## 👥 Equipo

Desarrollado por el equipo de GradIA.

---

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

---

**¡Gracias por usar GradIA CRM! 🚀**
