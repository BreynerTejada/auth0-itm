# API Reference

## Authentication Endpoints

### Login

**GET** `/auth0/login/`

Inicia el flujo de autenticación con Auth0 (redirecciona a Universal Login).

**Response**: Redirect (302) a Auth0 login page

**Example**:
```bash
curl -L http://localhost:8000/auth0/login/
```

---

### Callback

**GET** `/auth0/callback/?code=<auth_code>&state=<state>`

Callback automático de Auth0. Maneja el intercambio de código por token.

**Parameters**:
- `code` (string): Authorization code de Auth0
- `state` (string): State parameter para CSRF protection

**Response**: Redirect (302) a home page

**Note**: Este endpoint se llama automáticamente, no lo llames directamente desde React.

---

### Logout

**GET** `/auth0/logout/`

Cierra la sesión y redirige a Auth0 logout.

**Response**: 
- Limpia la sesión
- Redirect (302) a Auth0 logout endpoint

**Example**:
```bash
curl -L http://localhost:8000/auth0/logout/
```

---

### User Info

**GET** `/auth0/user-info/`

Obtiene el estado de autenticación actual del usuario.

**Authorization**: None (verifica sesión)

**Response** (si autenticado):
```json
{
  "authenticated": true,
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "sub": "auth0|123456"
  }
}
```

**Response** (si no autenticado):
```json
{
  "authenticated": false
}
```

**Status Codes**:
- 200: OK

---

## API Endpoints (Require Authentication)

### Get User Profile

**GET** `/api/user/profile/`

Obtiene el perfil completo del usuario incluyendo user_metadata de Auth0.

**Authorization**: Session (debe estar autenticado)

**Response**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "sub": "auth0|123456",
  "picture": "https://example.com/avatar.jpg",
  "user_metadata": {
    "tipo_documento": "CC",
    "numero_documento": "1234567890",
    "direccion": "Carrera 70 No. 53-50",
    "telefono": "+57 1 1234567"
  }
}
```

**Status Codes**:
- 200: OK
- 401: Unauthorized (no session)
- 500: Server error

**Example**:
```bash
curl -X GET http://localhost:8000/api/user/profile/ \
  -H "X-CSRFToken: <csrf_token>"
```

---

### Get User Metadata

**GET** `/api/user/metadata/`

Obtiene SOLO la metadata del usuario (sin email ni nombre).

**Authorization**: Session

**Response**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "sub": "auth0|123456",
  "picture": "https://example.com/avatar.jpg",
  "user_metadata": {
    "tipo_documento": "CC",
    "numero_documento": "1234567890",
    "direccion": "Carrera 70 No. 53-50",
    "telefono": "+57 1 1234567"
  }
}
```

**Status Codes**:
- 200: OK
- 401: Unauthorized
- 400: User ID not found
- 500: Auth0 error

**Example**:
```bash
curl -X GET http://localhost:8000/api/user/metadata/ \
  -H "X-CSRFToken: <csrf_token>"
```

---

### Update User Metadata

**POST** `/api/user/metadata/update/`

Actualiza la metadata del usuario en Auth0.

**Authorization**: Session

**Request Body**:
```json
{
  "tipo_documento": "CC",
  "numero_documento": "1234567890",
  "direccion": "Carrera 70 No. 53-50",
  "telefono": "+57 1 1234567"
}
```

**Content-Type**: `application/json`

**Response** (Success):
```json
{
  "message": "User metadata updated successfully",
  "user_metadata": {
    "tipo_documento": "CC",
    "numero_documento": "1234567890",
    "direccion": "Carrera 70 No. 53-50",
    "telefono": "+57 1 1234567"
  }
}
```

**Status Codes**:
- 200: Updated successfully
- 400: Bad request (invalid data)
- 401: Unauthorized
- 500: Server error

**Validation Rules**:
- `tipo_documento`: max 50 chars, optional but recommended
- `numero_documento`: max 50 chars
- `direccion`: max 255 chars
- `telefono`: max 20 chars

**Allowed tipo_documento values**:
- `CC` - Cédula de Ciudadanía
- `CE` - Cédula de Extranjería
- `PAS` - Pasaporte
- `TI` - Tarjeta de Identidad
- `NIT` - NIT

**Example**:
```bash
curl -X POST http://localhost:8000/api/user/metadata/update/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <csrf_token>" \
  -d '{
    "tipo_documento": "CC",
    "numero_documento": "1234567890",
    "direccion": "Carrera 70 No. 53-50",
    "telefono": "+57 1 1234567"
  }'
```

**Error Examples**:

Invalid field:
```json
{
  "tipo_documento": ["Invalid value. Must be one of: CC, CE, PAS, TI, NIT"]
}
```

Field too long:
```json
{
  "telefono": ["Ensure this field has no more than 20 characters."]
}
```

Unauthorized:
```json
{
  "error": "User ID not found in session"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error description"]
}
```

### 401 Unauthorized
```json
{
  "error": "User ID not found in session"
}
```

### 403 Forbidden
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Server Error
```json
{
  "error": "An unexpected error occurred",
  "details": "Error message from server"
}
```

---

## CSRF Protection

**El CSRF token es requerido para todas las mutaciones (POST, PUT, DELETE).**

### Obtener CSRF Token

El token se envía automáticamente en:
1. Cookie `csrftoken` (desde Django)
2. Template HTML `{% csrf_token %}`
3. localStorage.csrfToken (desde React)

### Usar CSRF Token en Requests

Opción 1: Header
```bash
curl -X POST http://localhost:8000/api/user/metadata/update/ \
  -H "X-CSRFToken: <token>"
```

Opción 2: Form Data
```bash
curl -X POST http://localhost:8000/api/user/metadata/update/ \
  -d "csrfmiddlewaretoken=<token>" \
  -d "tipo_documento=CC"
```

---

## Session Management

### Session Duration

Por defecto, la sesión expira después de **2 semanas** de inactividad.

Cambiar en `settings.py`:
```python
SESSION_COOKIE_AGE = 1209600  # 2 semanas en segundos
```

### Verificar Sesión

```bash
curl -I http://localhost:8000/auth0/user-info/
# Verifica que exista cookie "sessionid"
```

---

## Rate Limiting

No hay rate limiting implementado actualmente.
Para producción, considera usar: `django-ratelimit` o similar.

---

## Ejemplos desde JavaScript/React

### Obtener CSRF Token
```javascript
const csrfToken = localStorage.getItem('csrfToken')
```

### Hacer Request GET
```javascript
fetch('/api/user/profile/', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'X-CSRFToken': csrfToken,
  }
})
.then(r => r.json())
.then(data => console.log(data))
```

### Hacer Request POST
```javascript
fetch('/api/user/metadata/update/', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  },
  body: JSON.stringify({
    tipo_documento: 'CC',
    numero_documento: '1234567890',
    direccion: 'Cra 70 No. 53-50',
    telefono: '+57 1 1234567'
  })
})
.then(r => r.json())
.then(data => {
  if (data.message) {
    console.log('¡Actualizado!')
  } else {
    console.error('Error:', data)
  }
})
```

---

## Testing Endpoints

### Con cURL

```bash
# 1. Login (manual en navegador)
# ir a http://localhost:8000/auth0/login/

# 2. Obtener CSRF Token
curl http://localhost:8000/auth0/user-info/

# 3. Get Profile
curl -H "X-CSRFToken: <token>" \
     http://localhost:8000/api/user/profile/

# 4. Update Metadata
curl -X POST http://localhost:8000/api/user/metadata/update/ \
     -H "Content-Type: application/json" \
     -H "X-CSRFToken: <token>" \
     -d '{"tipo_documento":"CC","numero_documento":"123","direccion":"Cra 70","telefono":"3001234"}'
```

### Con Postman

1. GET http://localhost:8000/auth0/user-info/ (para obtener sesión)
2. Verificar cookies `sessionid` and `csrftoken`
3. POST requests usar header `X-CSRFToken` con valor del cookie

### Con Python requests

```python
import requests

session = requests.Session()

# Login (abre navegador manualmente)
# sesión guardada en cookies del Session object

# Get profile
response = session.get('http://localhost:8000/api/user/profile/')
print(response.json())

# Update metadata
response = session.post(
    'http://localhost:8000/api/user/metadata/update/',
    json={
        'tipo_documento': 'CC',
        'numero_documento': '1234567890',
        'direccion': 'Cra 70 No. 53-50',
        'telefono': '+57 1 1234567'
    }
)
print(response.json())
```

---

## Troubleshooting

### CSRF Token Missing (403)
- Asegúrate que `X-CSRFToken` header está presente
- Verifica que la sesión existe

### 401 Unauthorized
- Necesitas autenticarte primero
- Ir a http://localhost:8000/auth0/login/

### Metadata no actualiza
- Verifica los logs: `docker-compose logs django`
- Revisa que la credencial M2M es correcta
- Confirma permisos en Auth0 Dashboard

---

## Versioning

Versión API: `v1` (implícita en las URLs)

No hay versionamiento explícito. Para cambios rotos, se recomienda usar nuevo prefijo:
- `/api/v2/user/metadata/` para futuras versiones
