# Diagrama de Flujo - Aplicación Auth0 + Django + React

## Flujo General de Autenticación y Edición de Perfil

```
┌─────────────────────────────────────────────────────────────────┐
│                    INICIO - APLICACIÓN WEB                       │
│                  http://localhost:8000/                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Home Page (SPA) │
                    │    "Home.jsx"    │
                    └──────────────────┘
                              │
                ┌─────────────┴──────────────┐
                │                            │
         [Usuario No           [Usuario Autenticado
         Autenticado]                  ]
                │                            │
                ▼                            ▼
        ┌──────────────────┐    ┌────────────────────┐
        │  "Iniciar Sesión"│    │  Dashboard         │
        │  Button          │    │  (Dashboard.jsx)   │
        └──────────────────┘    └────────────────────┘
                │                            │
                ▼                            ├─→ Ver perfil actual
        [Click Botón]                       │
                │                            ▼
                ▼                    ┌────────────────────┐
    ┌──────────────────────────┐     │ Click "Editar      │
    │ GET /auth0/login/        │     │ Perfil"            │
    │ (Django View)            │     └────────────────────┘
    └──────────────────────────┘              │
                │                            ▼
                ▼                   ┌────────────────────┐
┌──────────────────────────────────┐│ Profile Page       │
│ Authlib OAuth                    ││  (Profile.jsx)     │
│ Initialize Flow                  │└────────────────────┘
└──────────────────────────────────┘              │
                │                                 ▼
                ▼                     ┌────────────────────┐
        ┌─────────────────────┐      │ ProfileForm        │
        │ Auth0 Universal     │      │ Component          │
        │ Login Page          │      │ - Tipo Documento   │
        │                     │      │ - Numero Doc.      │
        │ (formulario web)    │      │ - Dirección        │
        │                     │      │ - Teléfono         │
        └─────────────────────┘      └────────────────────┘
                │                              │
     [Usuario ingresa               [Campos prellenados
      credenciales]                 con datos actuales
                │                   del user_metadata]
                ▼                              │
        [Auth0 verifica]             [Usuario completa]
                │                    [y hace click save]
                ▼                              │
        [Autenticación exitosa]               ▼
                │                   ┌─────────────────────┐
                ▼                   │ POST /api/user/     │
        ┌─────────────────────┐    │ metadata/update/    │
        │ Redirect a callback │    │ (Django API View)   │
        │ /auth0/callback/    │    └─────────────────────┘
        └─────────────────────┘              │
                │                            ▼
                ▼                  ┌─────────────────────┐
   ┌────────────────────────────┐  │ UserMetadataSerializer
   │ Django View: callback()    │  │ .validate()         │
   │ ✓ Recibe token de Auth0   │  │ Verifica campos     │
   │ ✓ Extrae userinfo         │  └─────────────────────┘
   │ ✓ Guarda en session       │              │
   └────────────────────────────┘              ├─→ [Válido]
                │                             │
                ▼                             ▼
        ┌─────────────────┐     ┌─────────────────────┐
        │ Session creada  │     │ ManagementClient    │
        │ request.session │     │ .update(user_id,    │
        │ ['user']        │     │ user_metadata)      │
        └─────────────────┘     └─────────────────────┘
                │                             │
                ▼                             ▼
        ┌──────────────────┐     ┌──────────────────────┐
        │ Redirect a Home  │     │ Python-auth0 lib    │
        │ /               │     │ - Obtiene token M2M  │
        └──────────────────┘     │ - Llama Management   │
                │                │   API POST /users/:id│
         [Usuario Autenticado]    └──────────────────────┘
                │                             │
                └──────────────┬──────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
         (Dashboard            (Auth0 actualiza
          accesible)            user_metadata)
                │                             │
                ▼                             ▼
        ┌──────────────────┐     ┌──────────────────────┐
        │ React Hook:      │     │ Respuesta exitosa    │
        │ checkAuth()      │     │ {message: "success", │
        │ →GET /auth0/     │     │  user_metadata: {...}}
        │  user-info/      │     └──────────────────────┘
        └──────────────────┘              │
                │                         ▼
         [Auth confirmada]    ┌──────────────────────┐
                │             │ Django Response      │
                ▼             │ JSON 200 OK          │
        ┌──────────────────┐  └──────────────────────┘
        │ Mostrar:         │           │
        │ - Email          │           ▼
        │ - Nombre         │  ┌──────────────────────┐
        │ - Datos          │  │ Frontend:            │
        │   Personales     │  │ Response.json() ok   │
        │ - Link Perfil    │  │ Muestra success msg  │
        │ - Link Logout    │  │ (por 3 segundos)    │
        └──────────────────┘  └──────────────────────┘
                │                         │
                └─────────────┬───────────┘
                              │
                     [Datos persistentes
                      en Auth0]
                              │
                ┌─────────────┴──────────────┐
                │                            │
        [Visible en     [Próximo login
         Dashboard]      carga auto]
                │                            │
                ▼                            ▼
        ┌──────────────────┐     ┌──────────────────────┐
        │ Logout: Click    │     │ Usuario cierre      │
        │ "Cerrar Sesión"  │     │ sesión y vuelva a   │
        └──────────────────┘     │ entrar              │
                │                └──────────────────────┘
                ▼                         │
        GET /auth0/logout/              ▼
                │                ┌──────────────────┐
                ▼                │ Datos de perfil  │
        ┌──────────────────┐    │ se cargan desde  │
        │ ✓ Session clear  │    │ Auth0            │
        │ ✓ Redirect to    │    │ user_metadata    │
        │   Auth0 logout   │    │ automáticamente  │
        │ ✓ Confirm home   │    └──────────────────┘
        └──────────────────┘              │
                │                         ▼
                └──────┬──────────────────┘
                       │
               [Volver a Home
                sin sesión]
```

## Secuencia de Llamadas API

```
Cliente (React)                 Django API              Auth0 Services
    │                              │                        │
    ├──────── GET /auth0/login/ ───→│                        │
    │                              │                        │
    │                              ├──── authorize_redirect ─→│
    │                              │                        │
    │◄──────────────────────────────────────────────────────┤
    │           [Redirige a Auth0 Login]                    │
    │                                                        │
    │ [Usuario se autentica en Auth0]                        │
    │                                                        │
    │◄───────────────────── Auth0 response ───────────────┬─┤
    │        (Callback a /auth0/callback/?code=...)        │
    │                                                        │
    ├──────── GET /auth0/callback/?code=X ───→│           │
    │                              │                        │
    │                              ├──── authorize_access_token
    │                              ├────────────────────→│
    │                              │◄────────────────────┤
    │                              │     token + userinfo│
    │                              │                     │
    │                              ├──── Save in session─┤
    │                              │                     │
    │◄─────────── Redirect / ──────│                     │
    │                              │                     │
    ├──────── GET / ──────────────→│                     │
    │◄─────────── React App ───────│                     │
    │                              │                     │
    ├──────── GET /auth0/user-info/ →│                   │
    │◄─────────── {authenticated:true, user:{...}} ──┤
    │                              │                     │
    ├──────── GET /api/user/profile/ →│                 │
    │                              │                     │
    │                              ├─── GET ManagementAPI
    │                              ├────────────────────→│
    │                              │◄────────────────────┤
    │                              │  (user data + metadata)
    │◄─────────── response ────────│                     │
    │                              │                     │
    ├──────── POST /api/user/metadata/update/ →│         │
    │         {tipo_documento:..., ...}        │         │
    │                              │                     │
    │                              ├─── validate data   │
    │                              │                     │
    │                              ├─── POST ManagementAPI
    │                              ├──── /users/:id ────→│
    │                              ├─────── update ──────│
    │                              │      user_metadata  │
    │                              │◄────────────────────┤
    │                              │      200 OK         │
    │◄─────────── {success} ───────│                     │
    │                              │                     │
    ├──────── GET /auth0/logout/ ──→│                    │
    │                              │                     │
    │                              ├─── session.clear()─┤
    │                              │                     │
    │                              ├──── Redirect to Auth0
    │                              │      logout endpoint
    │◄─────────────────────────────────────────────────┤
    │             [Sesión finalizada]                  │
```

## Flujo de Datos - User Metadata

```
┌──────────────────────────────────────────────────────────┐
│            ESTRUCTURA DE DATOS EN AUTH0                  │
└──────────────────────────────────────────────────────────┘
                         │
        Auth0 User Object│
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼───┐      ┌──────▼──────┐   ┌──▼────────┐
    │email  │      │ user_metadata│   │name       │
    │...    │      │             │   │...        │
    └───────┘      │   {         │   └───────────┘
                   │   "tipo_...":│
                   │   "CC",      │
                   │   "numero...":
                   │   "12345...",│
                   │   "dirección":
                   │   "Cra 70",  │
                   │   "telefono":│
                   │   "3001234"  │
                   │   }         │
                   └─────────────┘
                         ▲
                         │
                 Management API
                   (M2M Auth)
                         │
                    ┌────┴─────┐
                    │           │
             Django Backend    Auth0
             (PUT /users/:id)   Database
```

## Consideraciones de Seguridad

### 1. CSRF Protection
```
┌─────────────────────┐
│ Django Template     │
│ {% csrf_token %}    │  ─→  localStorage.csrfToken
└─────────────────────┘
                          ↓
                  ┌────────────────────┐
                  │ React hace POST    │
                  │ Header:            │
                  │ "X-CSRFToken": ... │
                  └────────────────────┘
                          │
                          ▼
                  ┌────────────────────┐
                  │ Django verifica    │
                  │ token              │
                  └────────────────────┘
```

### 2. Session Management
```
Navegador (Cookie)  ┌─────────────────┐  Backend (DB)
   │                │ Django Session  │       │
   ├─ session_id ──→│ Almacenado en   │   ✓ Seguro
   │                │ PostgreSQL       │   ✓ No expuesto 
   │                └─────────────────┘   en cliente
   └────────────────────────────────────┘
        Encrypted HTTP-Only Cookie
```

### 3. API Authentication
```
React Request
    │
    ├─ Cookie (session_id)
    ├─ Header (X-CSRFToken)
    │
    ▼
Django Checks:
    1. ¿Session válida?
    2. ¿CSRF token correcto?
    3. ¿Usuario tiene permisos?
    │
    ├─ ✓ Todos OK → Procede
    ├─ ❌ Falla    → 401 Unauthorized,
    │             redirect a login
```

## Notas Importantes

1. **Token de Auth0**: Se guarda SOLO en sesión del servidor, no en el cliente
2. **User Metadata**: Limitado a 1MB por usuario en Auth0
3. **Campos Requeridos**: Los 4 campos son todos obligatorios
4. **Persistencia**: Los datos persisten en Auth0 indefinidamente
5. **HTTPS**: En producción, HTTPS es requerido
