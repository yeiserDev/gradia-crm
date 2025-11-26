# 🔧 Configurar Variables de Entorno en Vercel

## 📋 Variables a configurar

Ve a: https://vercel.com/dashboard → **gradia-crm** → **Settings** → **Environment Variables**

Añade estas 3 variables:

### 1. Auth Service
```
Name: NEXT_PUBLIC_AUTH_API_URL
Value: https://auth-gradia.onrender.com/api/auth
Environments: ✅ Production ✅ Preview ✅ Development
```

### 2. Teacher API
```
Name: NEXT_PUBLIC_TEACHER_API_URL
Value: https://gradia-module-manager-teacher.onrender.com/api
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3. Student API
```
Name: NEXT_PUBLIC_STUDENT_API_URL
Value: https://gradia-module-manager-student.onrender.com/api/student
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## 🚀 Después de añadir las variables

Vercel **automáticamente** hará un nuevo deploy con las variables actualizadas.

O puedes forzar un redeploy:

```bash
cd gradia-crm
git commit --allow-empty -m "Update API URLs to production"
git push
```

---

## ✅ Verificar que funciona

Una vez que Vercel termine el deploy:

1. Ve a: https://gradia-crm-zsj5.vercel.app
2. Abre la consola del navegador (F12)
3. Intenta hacer login
4. Deberías ver requests a:
   - `https://auth-gradia.onrender.com/api/auth/login`
   - `https://gradia-module-manager-teacher.onrender.com/api/cursos`
   - etc.

---

## ⚠️ Importante

- ❌ **NO** quites las comillas `"` de los valores
- ❌ **NO** agregues `/` al final de las URLs
- ✅ **SÍ** marca las 3 checkboxes (Production, Preview, Development)

---

## 🔄 Si necesitas volver a desarrollo local

Simplemente comenta las URLs de producción en `.env.local` y descomenta las de localhost:

```env
# Producción (comentar):
# NEXT_PUBLIC_AUTH_API_URL="https://auth-gradia.onrender.com/api/auth"
# NEXT_PUBLIC_TEACHER_API_URL="https://gradia-module-manager-teacher.onrender.com/api"
# NEXT_PUBLIC_STUDENT_API_URL="https://gradia-module-manager-student.onrender.com/api/student"

# Desarrollo local (descomentar):
NEXT_PUBLIC_TEACHER_API_URL="http://localhost:3002/api"
NEXT_PUBLIC_STUDENT_API_URL="http://localhost:3001/api/student"
NEXT_PUBLIC_AUTH_API_URL="http://localhost:8080/api/auth"
```
