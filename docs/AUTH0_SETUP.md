# Configuración de Auth0

Este documento detalla cómo configurar Auth0 para esta aplicación paso a paso.

## 1. Crear Cuenta en Auth0

1. Accede a https://auth0.com
2. Click **"Sign Up"**
3. Completa el formulario:
   - Email
   - Password
   - Nombre de cuenta (tenant)
4. Verifica tu email
5. Accede a https://manage.auth0.com

## 2. Crear Aplicación Regular Web App

### 2.1 Crear la Aplicación

1. En el dashboard, ve a **Applications** → **Applications**
2. Click **"+ Create Application"** (botón azul)
3. Llena el formulario:
   - **Name**: `Auth0 ITM App`
   - **Application Type**: Selecciona **"Regular Web Application"**
4. Click **"Create"**

### 2.2 Ver Credenciales

Después de crear, se abre la página de configuración. Verás tres tabs:

- **Settings**: Configuración general
- **Quick Start**: Tutorial
- **Credentials**: Aquí están tus credenciales

**En la sección "Settings", copia:**

```
Domain: xxxxx.auth0.com
Client ID: xxxxxxxxxxxxxxxx
Client Secret: xxxxxxxxxxxxxxxx
```

Guarde estos valores en tu archivo `.env`:

```env
AUTH0_DOMAIN=xxxxx.auth0.com
AUTH0_CLIENT_ID=xxxxxxxxxxxxxxxx
AUTH0_CLIENT_SECRET=xxxxxxxxxxxxxxxx
```

### 2.3 Configurar URLs Permitidas

Aún en **Settings**, busca estas secciones y actualiza:

#### Application URLs

- **Allowed Callback URLs**: 
  ```
  http://localhost:8000/auth0/callback/
  ```

- **Allowed Logout URLs**: 
  ```
  http://localhost:8000
  ```

- **Allowed Web Origins**: 
  ```
  http://localhost:8000
  http://localhost:5173
  ```

Scroll hacia abajo y click **"Save Changes"** (botón azul)

## 3. Crear Aplicación Machine-to-Machine (M2M)

La Management API requiere credenciales M2M para actualizar `user_metadata`.

### 3.1 Crear la Aplicación M2M

1. Ve a **Applications** → **Applications**
2. Click **"+ Create Application"**
3. Llena el formulario:
   - **Name**: `Auth0 ITM Management`
   - **Application Type**: Selecciona **"Machine to Machine Applications"**
4. Click **"Create"**

### 3.2 Autorizar la Management API

Se abre un diálogo: **"Select an API"**

1. Busca y selecciona **"Auth0 Management API"**
2. Click **"Authorize"**
3. Se abre otro diálogo con permisos disponibles

### 3.3 Seleccionar Permisos

En el diálogo de permisos, marca estos:

- ✅ `read:users` - Leer datos de usuarios
- ✅ `update:users` - Actualizar datos de usuarios

Deja los demás sin marcar. Click **"Authorize"**

### 3.4 Copiar Credenciales M2M

Se cierra el diálogo. Aún en la página de la aplicación M2M:

1. Click en la pestaña **"Settings"**
2. En la sección que dice "Client ID" y "Client Secret", copia ambos valores

Guarda en tu `.env`:

```env
AUTH0_MANAGEMENT_CLIENT_ID=xxxxxxxxxxxxxxxx
AUTH0_MANAGEMENT_CLIENT_SECRET=xxxxxxxxxxxxxxxx
```

## 4. Verificar Configuración

Accede desde la terminal:

```bash
# Dentro del proyecto
cd ~/Documents/uni/auth0

# Verifica que todos los valores están en .env
cat .env | grep AUTH0
```

Deberías ver:

```
AUTH0_DOMAIN=xxxxx.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_MANAGEMENT_CLIENT_ID=...
AUTH0_MANAGEMENT_CLIENT_SECRET=...
```

## 5. Personalizar Universal Login (Opcional)

El "Universal Login" es el formulario de login que ve el usuario.

### 5.1 Acceder a Branding

1. En Auth0 Dashboard, ve a **Branding**
2. Busca la sección **"Universal Login"**
3. Tab **"Login"**

### 5.2 Personalizar

Puedes editar:

- **Color primario**: Cambia a colores de ITM
- **Logo URL**: Sube logo ITM (ej: `https://www.itm.edu.co/logo.png`)
- **Favicon URL**: Favicon de ITM
- **Custom CSS**: CSS personalizado

### 5.3 Guardar

Click **"Save"** y verifica en el navegador visitando `http://localhost:8000/auth0/login/`

## 6. Solucionar Problemas

### Problem: "Invalid Callback URL"

**Causa**: La URL en Auth0 no coincide con la de Django

**Solución**: 
1. Verifica en Auth0 Dashboard → Applications → Tu App → Settings
2. Asegúrate que "Allowed Callback URLs" incluya: `http://localhost:8000/auth0/callback/`
3. Nota el trailing slash `/`

### Problem: "Unauthorized"

**Causa**: El M2M client no tiene permisos

**Solución**:
1. Ve a Auth0 Dashboard → Applications → Tu App M2M
2. Click en **"APIs"** tab
3. Click en **"Auth0 Management API"**
4. Verifica que están marcados: `read:users` y `update:users`
5. Si no, Add Permissions y marca esos dos

### Problem: "Invalid Client ID"

**Causa**: Client ID incorrecto o expirado

**Solución**:
1. Copia nuevamente el Client ID desde Auth0 Dashboard
2. Actualiza tu `.env`
3. Reinicia Docker: `docker-compose restart django`

## 7. Referencias

- Auth0 Docs: https://auth0.com/docs
- Management API: https://auth0.com/docs/api/management/v2
- Universal Login: https://auth0.com/docs/login/universal-login
