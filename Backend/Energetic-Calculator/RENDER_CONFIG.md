# Configuración para Desplegar en Render con Docker

Este proyecto incluye un Dockerfile optimizado para desplegar en Render.

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en el panel de Render (Environment Variables):

```
PORT=8081

FIREBASE_TYPE=service_account

FIREBASE_PROJECT_ID=calculadora-electronica

FIREBASE_PRIVATE_KEY_ID=50372f822120ebe613b1ff807e49fa56e3be10a7

FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD6f+dQKmePSfPJ\neyiQl3y2QMTjQs5RsWOV8cj+cUelasOMewHWcj8HMBgvfsA+LFoj+2Y/FefNM260\nk3qzBMhPe9NqteiqjTlFxVZc9h9RCUXzEQlsrZXKXnNtENWBIjgizSDGr8aDABpL\nNIGgyp0Y0ZdmQmOqA8V2v2ahGex5MTItJnbREpu/C21ot2CMSbWxmNGWVnZ6mtm/\nVzAoNBMdLC8gzNoDW6/7Ggz3hM71YOtCA36NVoUvCmWP6z2UA3gDIIeVBE6RRDNB\nttpkiVtv+ZaETDsjhEde0g5vU4VQzGaND7gQKmHseYjG2GWFHg5PSbqTnfo1oE6t\nNlAPu3ALAgMBAAECggEADZEu2Icra7XQJ9ntRQOHZCGW6E4eeYs3fxAE2E8PV9Sz\n+aBR5ajzY/LFZJEjXVqumSNNEt6fWtxNwyb3rsl0BeYJec6XZuFWOEKrXkaQRKXR\nbYw/K+0s3zSFYONYBPHzA2ODwm8Tu9WeFvOlj61Zm9YCMq4m0rb4k2ljaBdM2PVn\nOXVlN0X0OqsYhwuN8CouQhP/Ip7U2ZJz3NGdxegs8rmcSn2UacKISYDPOMn9OtWm\ny7FC/xdAxNXaV8exN0etm5UoYF9a5kyxsg03lPDpvvTdFrQmh+1rnoAmb4RV/aEI\n2RAPERsHeypsiWIvNabwLXQ3Y2t/xLG3iwQI9d5rFQKBgQD948/0StpGmif1AQRt\n4f/tEwNhNkjeB/mZAOqUhOO7X4aYM/ZcTnPpEGiLtFYMMtNrtdarURHQ8Nxs7rNc\nQoYyXwK0wREqw9gvgjg8F/z1FAonmJ10Efg0YOwQ6GiDxLEKYhUmOhxcIq9KO+2E\nhqOgfCiqYr1c0/myEdoUdJG1rwKBgQD8lODBulEI1E3NI6UsdLE/2xzMUsjvy6TK\nqMC7jPWfZuo2mQpas90QOiE0/EVMPSJQdm0JckU4E7n8Hj2dPIJdYwGpm4hzV78s\nMPM7OhXaO95otpVD6FUc/Itx2V7xZPE98P+uWU+4YunkQjzgNmYaRzfwA6ocxcIl\nQ0rs0Z/eZQKBgQCDUBh2WWCbs4+HAIex7XnYvES7OsBlVeqaYAbz2eePOdD7V6TM\nCSeaG4p290ap+H+w7dOht8RnNKxNCwhpZ17RHqLfqhue6rwdllRPgHisqTi3Ug/d\nwI2HSbnO5OVpgYmvvRsDMnsIjEftNSGbsadfkdfWiEs4f8pddy479i6GsQKBgDIO\nXyyFfCG/0VtiQQ26YpZBGkfz8BZ1yUbQgsGogdUBVFFVqxOmqZzZqFMT27fsNay0\ni49fshAW+LjaVWOf5kYTpPSz+irBrQVY/hsyu7nwO3eNF6/Jj3SbKBd7+LDmTFj2\nNfWbhY0JLUkrR1036qwyiQdr8n6ZQoyX9XVRZdlxAoGAKaivimkehvAZKR/sEY/8\n1j7+4qG2WmCLbep/jyLxU9yl7ats3KkmPNASe/UkNqy3IFKf96/6cedL/W1NAqwW\nn98WEk8j8YQU1B0CGBmsKzOyr3c1V33eZHOJBgGnCSDnQGqX249sjKzkKWUaG84X\nFjIJZ3x20p8I8fbR1mrU0g8=\n-----END PRIVATE KEY-----\n

FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@calculadora-electronica.iam.gserviceaccount.com

FIREBASE_CLIENT_ID=113931851913150264683

FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth

FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs

FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40calculadora-electronica.iam.gserviceaccount.com

FIREBASE_UNIVERSE_DOMAIN=googleapis.com

FIREBASE_DATABASE_URL=https://calculadora-electronica-default-rtdb.firebaseio.com
```

## Configuración del Web Service en Render

### 1. Crear nuevo Web Service

En el dashboard de Render:
- Click en "New +" → "Web Service"
- Conecta tu repositorio de GitHub/GitLab

### 2. Configuración Básica

- **Name**: `calculadora-energetica-backend` (o el nombre que prefieras)
- **Region**: Elige la más cercana a tus usuarios
- **Branch**: `main` (o la rama que uses)
- **Root Directory**: `Backend/Energetic-Calculator`
- **Runtime**: Selecciona **Docker** desde el dropdown

### 3. Build Settings

Render detectará automáticamente el Dockerfile y lo usará. No necesitas configurar comandos de build o start.

Si necesitas especificarlo manualmente:
- **Dockerfile Path**: `Dockerfile` (si está en el Root Directory)
- El puerto se configura automáticamente desde la variable `PORT` que Render proporciona

### 4. Variables de Entorno

En la sección "Environment Variables", agrega TODAS las variables listadas arriba.

**IMPORTANTE**: Para `FIREBASE_PRIVATE_KEY`, asegúrate de que los saltos de línea estén representados como `\n` (no saltos de línea reales).

### 5. Plan

- Selecciona el plan que prefieras (Free tier disponible para empezar)

### 6. Crear Web Service

- Click en "Create Web Service"
- Render comenzará a construir la imagen Docker y desplegar tu aplicación
- El proceso de build puede tomar 5-10 minutos la primera vez

### 7. Verificar el Build

En los logs verás:
1. Build de la imagen Docker (Etapa 1: compilación con Maven)
2. Creación de la imagen runtime (Etapa 2: imagen ligera con JRE)
3. Inicio de la aplicación Spring Boot
4. El mensaje: `✅ Firebase inicializado correctamente con Realtime Database desde variables de entorno`

## Notas Importantes

### Puerto

El backend está configurado para usar la variable `PORT` que Render proporciona automáticamente. No necesitas cambiar nada.

### CORS

El backend está configurado para aceptar peticiones de cualquier origen (`*`). Esto es útil para desarrollo y despliegue inicial, pero considera restringirlo en producción a tu dominio del frontend.

### Java Version

El proyecto usa Java 21. Render debería detectarlo automáticamente desde el `pom.xml`, pero si tienes problemas, puedes agregar una variable de entorno:
```
JAVA_VERSION=21
```

### Health Check

Render realizará health checks automáticamente. Si tu aplicación tiene un endpoint de health (como `/actuator/health`), puedes configurarlo en:
- Health Check Path: `/actuator/health` (si tienes Spring Boot Actuator)

### Logs

Una vez desplegado, puedes ver los logs en tiempo real desde el dashboard de Render para verificar que Firebase se inicializó correctamente.

## Probar el Dockerfile Localmente (Opcional)

Antes de desplegar, puedes probar el Dockerfile localmente:

### 1. Construir la imagen:
```bash
cd Backend/Energetic-Calculator
docker build -t calculadora-energetica-backend .
```

### 2. Ejecutar el contenedor:
```bash
docker run -p 8081:8081 \
  -e FIREBASE_TYPE=service_account \
  -e FIREBASE_PROJECT_ID=calculadora-electronica \
  -e FIREBASE_PRIVATE_KEY_ID=tu-key-id \
  -e FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" \
  -e FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com \
  -e FIREBASE_CLIENT_ID=tu-client-id \
  -e FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com \
  calculadora-energetica-backend
```

### 3. Verificar:
La aplicación estará disponible en `http://localhost:8081`

## Verificar el Despliegue

Una vez desplegado en Render, deberías ver en los logs:
```
✅ Firebase inicializado correctamente con Realtime Database desde variables de entorno
```

Tu API estará disponible en: `https://tu-servicio.onrender.com`

## Actualizar el Frontend

No olvides actualizar la URL del backend en tu frontend para apuntar a la nueva URL de Render.

## Ventajas del Despliegue con Docker

✅ **Entorno consistente**: La misma imagen funciona en desarrollo y producción
✅ **Build optimizado**: Multi-stage build reduce el tamaño de la imagen final
✅ **Caché de dependencias**: Maven descarga las dependencias una sola vez si pom.xml no cambia
✅ **Seguridad**: La aplicación corre con un usuario no-root
✅ **Portabilidad**: Puedes desplegar en cualquier plataforma que soporte Docker

