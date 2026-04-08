# logicoh

LogicOh! es una solucion para practicar vocabulario academico y conceptos de razonamiento logico mediante una app cliente (Expo/React Native) y una API serverless en Vercel conectada a MongoDB Atlas.

## Arquitectura

- `api/`: backend serverless con estructura MVC (model, service, controller, view).
- `client/`: app mobile con estructura modular en `src/` y carpetas `assets/` para recursos visuales.
- `setup.md`: guia principal dividida en setup local y despliegue Vercel.
- `localdev.md`: flujo detallado para correr API + Expo en local con hot reload.

## Estructura resumida

- `api/index.js`: entrypoint de API (local y Vercel).
- `api/src/config/db.js`: conexion y configuracion de MongoDB.
- `api/src/models/wordModel.js`: normalizacion del objeto de palabra.
- `api/src/services/wordService.js`: logica de negocio para obtener palabra aleatoria e incrementar vistas.
- `api/src/controllers/wordController.js`: manejo HTTP y errores.
- `api/src/views/wordView.js`: serializacion de respuesta para cliente.
- `api/scripts/seed.js`: script de poblado inicial.
- `client/App.js`: pantalla principal.
- `client/src/services/wordService.js`: consumo de API y fallback.
- `client/src/config/env.js`: URL base configurable por entorno.

## Desarrollo local rapido

- Node recomendado para cliente Expo: `20.x` (o `18.x`). Evitar `22+` en Windows con Expo SDK 50.
- API hot reload: en `api/` ejecutar `npm run dev` (nodemon).
- API sin hot reload: en `api/` ejecutar `npm run start`.
- Expo app: en `client/` ejecutar `npm run start`.

Para instrucciones completas, revisar `localdev.md`.
