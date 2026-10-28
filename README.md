# Ágora · Red social (Programación IV – TP 2)

| Carpeta     | Tecnología          |
|-------------|---------------------|
| `frontend/` | Angular 21 (diseño Ágora, sistema Modernist) |
| `backend/`  | NestJS 12 + MongoDB |

## Sprint 1 – qué incluye

**Front**
- Pantallas: Registro, Login, Publicaciones y Mi perfil, con navegación libre entre ellas (navbar).
- Favicon propio (`frontend/public/favicon.svg`).
- Login por **correo o nombre de usuario** (ambos únicos en la base) con validaciones y mensajes.
- Contraseña: mínimo 8 caracteres, una mayúscula y un número (validado en front y back).
- Registro con nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña,
  fecha de nacimiento, descripción breve e imagen de perfil (input `file` con vista previa).
- Mensajes en **modales** propios (nunca `alert()`).

**Back**
- Módulos `auth`, `users` (usuarios) y `publicaciones`.
- `POST /auth/registro` (multipart/form-data, archivo en el campo `imagenPerfil`):
  valida los datos, encripta la contraseña con bcrypt, guarda la imagen en `uploads/`
  y su URL en la base. Responde **201**; **400** si hay datos inválidos;
  **409** si el correo o el usuario ya existen.
- `POST /auth/login` (`{ identificador, password }`): compara la contraseña con bcrypt
  y devuelve todos los datos del usuario (sin la contraseña). **200** / **401** / **400**.
- Los usuarios tienen el atributo `perfil` (`usuario` por defecto, o `administrador`).

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
> y las imágenes subidas se borran en cada nuevo deploy.

### 2. Frontend en Vercel
1. Poner la URL del backend en `frontend/src/environments/environment.ts` (`apiUrl`) y subir el cambio.
2. vercel.com → **Add New → Project** → el repo → **Root Directory: `frontend`** → Deploy.
   Vercel detecta Angular solo; `vercel.json` hace que las rutas funcionen al recargar.
3. Si la URL del front cambió, actualizar `CORS_ORIGIN` en Render.

## Postman

En `postman/red-social.postman_collection.json` hay una colección con las pruebas del Sprint 1
(registro OK, duplicado, contraseña inválida, contraseñas distintas, login por usuario y por correo,
login incorrecto y login vacío). Cada request verifica el status esperado.

1. En Postman: **Import** → elegir el archivo.
2. Con el backend corriendo, botón derecho sobre la colección → **Run collection**.
3. Para probar el backend desplegado, cambiar la variable `baseUrl` de la colección.

## Conectar MongoDB Atlas

1. En Atlas: crear el cluster → **Database Access**: crear un usuario con contraseña →
   **Network Access**: agregar `0.0.0.0/0` (necesario para Render).
2. **Connect → Drivers** y copiar la URI.
3. Pegarla en `backend/.env` agregando el nombre de la base antes del `?`:
   `MONGODB_URI=mongodb+srv://usuario:clave@cluster0.xxxxx.mongodb.net/red-social?retryWrites=true&w=majority`
4. `npm run start:dev`. La colección `users` se crea sola con el primer registro.
