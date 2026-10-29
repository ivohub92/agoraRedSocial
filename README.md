# AnimeVerse · Red social (Programación IV – TP 2)

| Carpeta     | Tecnología          |
|-------------|---------------------|
| `frontend/` | Angular 21 (tema AnimeVerse: oscuro, neón y paneles de vidrio) |
| `backend/`  | NestJS 12 + MongoDB |

## Sprint 1 – qué incluye

**Front**
- Pantallas: Acceso, Publicaciones y Mi perfil, con navegación libre entre ellas (navbar).
- **Login y registro en la misma página** (`/login`), con pestañas "Iniciar sesión" / "Registrarse".
  La pestaña viaja en la URL (`/login?tab=registro`) y la vieja ruta `/registro` redirige ahí.
- Favicon propio (`frontend/public/favicon.svg`).
- Login por **correo o nombre de usuario** (ambos únicos en la base) con validaciones y mensajes.
- Contraseña: mínimo 8 caracteres, una mayúscula y un número (validado en front y back).
- Registro con nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña,
  fecha de nacimiento, descripción breve e imagen de perfil (input `file` con vista previa).
- Mensajes en **modales** propios (nunca `alert()`).

**Back**
- Módulos `auth`, `users` (usuarios) y `publicaciones`.
- `POST /auth/registro` (multipart/form-data, archivo en el campo `imagenPerfil`):
  valida los datos, encripta la contraseña con bcrypt, guarda la imagen (en Cloudinary si
  está configurado, si no en `uploads/`) y su URL en la base. Responde **201**; **400** si hay datos inválidos;
  **409** si el correo o el usuario ya existen.
- `POST /auth/login` (`{ identificador, password }`): compara la contraseña con bcrypt
  y devuelve todos los datos del usuario (sin la contraseña). **200** / **401** / **400**.
- Los usuarios tienen el atributo `perfil` (`usuario` por defecto, o `administrador`).

## Sprint 2 – Publicaciones

**API** (`/publicaciones`)

| Método y ruta | Qué hace | Status |
|---|---|---|
| `GET /publicaciones?orden=fecha\|meGusta&offset=0&limit=10&usuario=<id>` | Listado paginado (por fecha por defecto) | 200 · 400 si los parámetros no son válidos |
| `POST /publicaciones` (multipart: `titulo`, `mensaje`, `imagen` opcional, `puntaje` opcional de 1 a 5) | Crea una publicación del usuario. Sin `puntaje` es un debate (`puntaje: null`) | 201 · 400 (también si el puntaje no es un entero de 1 a 5) · 401 |
| `DELETE /publicaciones/:id` | Baja lógica (`activa = false`), solo el autor o un administrador | 200 · 403 · 404 |
| `POST /publicaciones/:id/me-gusta` | Da me gusta (uno por usuario) | 201 · 409 si ya lo había dado |
| `DELETE /publicaciones/:id/me-gusta` | Quita el me gusta, solo si lo había dado | 200 · 409 |

> **Usuario que hace el pedido (temporal):** hasta el Sprint 3 (JWT), el front envía el id del usuario
> logueado en el header `X-Usuario-Id` (interceptor `usuario.interceptor.ts`). El backend lo valida en
> `UsuarioActualGuard` (`common/usuario-actual.ts`) y responde 401 si falta o no es un usuario activo.
> En el Sprint 3 se reemplaza por el token del header `Authorization` cambiando solo esos dos archivos.

**Front** (pantalla Publicaciones)
- Listado de 5 por página con **Anterior / Siguiente**, ordenado por fecha; selector **Más recientes / Más me gusta**.
- Cada publicación es un componente (`shared/publicacion`): autor, título, mensaje, imagen, me gusta.
- **Me gusta**: se marca o desmarca al instante y se revierte si el servidor responde error.
- **Eliminar**: solo en las publicaciones propias, con un modal de confirmación.
- Caja para publicar (título, mensaje e imagen opcional).

## Correr en local

```bash
# Backend (necesita MongoDB local o una URI de MongoDB Atlas en .env)
cd backend
cp .env.example .env
npm install
npm run start:dev          # http://localhost:3000

# Frontend
cd frontend
npm install
npm start                  # http://localhost:4200
```

## Deploy

- **Backend (NestJS) → Render**, como servidor web que queda siempre prendido.
- **Frontend (Angular) → Vercel.**
- **Base de datos → MongoDB Atlas** (en Network Access debe estar `0.0.0.0/0`).

Los `.npmrc` de cada carpeta hacen que la instalación use `legacy-peer-deps` sola.

### 1. Backend en Render
1. render.com → entrar con GitHub → **New → Blueprint** → elegir el repo.
   Render lee `render.yaml` (carpeta `backend`, build y arranque ya configurados).
2. Completar las variables que pide:
   - `MONGODB_URI` → la URI de Atlas.
   - `CORS_ORIGIN` → la URL del front (ej. `https://agora-social-ruddy.vercel.app`).
     Para probar también desde la PC: `https://agora-social-ruddy.vercel.app,http://localhost:4200`.
3. **Apply**. Al terminar, Render muestra la URL del backend (ej. `https://agora-backend.onrender.com`).
4. Abrir esa URL: debe responder `{"estado":"ok","mongo":"conectado",...}`.
   Si responde `"estado":"error"`, el campo `error` dice el motivo.

> Plan gratuito: el servicio se duerme tras ~15 min sin uso (el primer pedido tarda ~50 s)
> y el disco se borra en cada deploy. Por eso las imágenes conviene guardarlas en Cloudinary.

### Imágenes en Cloudinary (recomendado en Render)
1. Crear una cuenta gratis en cloudinary.com.
2. En el Dashboard → **API Keys** (o "Go to API Keys"), copiar el **API environment variable**:
   `CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME`.
3. En Render → el servicio → **Environment** → agregar `CLOUDINARY_URL` con el valor
   (solo lo que va después del `=`) → **Save** (se redeploya solo).
4. Desde ese momento las imágenes se guardan en la carpeta `agora/perfiles` de Cloudinary y en la
   base queda su URL `https://res.cloudinary.com/...`. Sin la variable, se usan `uploads/` en disco.

### 2. Frontend en Vercel
1. Poner la URL del backend en `frontend/src/environments/environment.ts` (`apiUrl`) y subir el cambio.
2. vercel.com → **Add New → Project** → el repo → **Root Directory: `frontend`** → Deploy.
   Vercel detecta Angular solo; `vercel.json` hace que las rutas funcionen al recargar.
3. Si la URL del front cambió, actualizar `CORS_ORIGIN` en Render.

## Postman

`postman/red-social.postman_collection.json` tiene **25 consultas en 5 carpetas**, cada una con tests que
verifican el status y el mensaje:

| Carpeta | Qué prueba |
|---|---|
| 0 · Estado del servidor | `GET /` → 200 y conectado a MongoDB |
| 1 · Registro | 201 (con y sin imagen), 409 duplicados (también en mayúsculas), 400 por cada validación |
| 2 · Seguridad del registro | 400 al intentar registrarse como administrador y al subir un archivo que no es imagen |
| 3 · Login | 200 por usuario, correo y correo en mayúsculas; 401 con el mismo mensaje si falla; 400 |
| 4 · Rutas que no existen | 404 |

1. En Postman: **Import** → elegir el archivo.
2. Con el backend corriendo: botón derecho sobre la colección → **Run collection**, sin cambiar el orden.
3. Los dos pedidos marcados **"elegir archivo"** necesitan seleccionar el archivo a mano en Body
   (o destildarlos en el Runner).
4. Para probar el backend desplegado, cambiar la variable `baseUrl` de la colección (pestaña Variables).

## Conectar MongoDB Atlas

1. En Atlas: crear el cluster → **Database Access**: crear un usuario con contraseña →
   **Network Access**: agregar `0.0.0.0/0` (necesario para Render).
2. **Connect → Drivers** y copiar la URI.
3. Pegarla en `backend/.env` agregando el nombre de la base antes del `?`:
   `MONGODB_URI=mongodb+srv://usuario:clave@cluster0.xxxxx.mongodb.net/red-social?retryWrites=true&w=majority`
4. `npm run start:dev`. La colección `users` se crea sola con el primer registro.
