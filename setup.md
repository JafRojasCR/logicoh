# LogicOh Setup Guide

This guide explains how to initialize the project, define environment variables, and understand how the application works after the backend/frontend refinement.

## 1. Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas cluster (or compatible MongoDB URI)
- Expo Go app (optional, for mobile testing)

## 2. Project Layout

- `api/`: Vercel serverless backend in MVC style.
- `client/`: Expo React Native mobile app.
- `setup.md`: this initialization and architecture guide.
- `localdev.md`: focused local workflow for running API + Expo together.

### Backend MVC Map

- `api/index.js`: API entrypoint and route wiring for local/Vercel.
- `api/src/config/db.js`: MongoDB client + db/collection config.
- `api/src/models/wordModel.js`: word object normalization.
- `api/src/services/wordService.js`: random word retrieval + `viewCount` increment.
- `api/src/controllers/wordController.js`: HTTP control flow and status codes.
- `api/src/views/wordView.js`: response shaping for client.
- `api/src/data/seedWords.js`: enriched seed dataset.
- `api/scripts/seed.js`: database seeding script.

### Frontend Order

- `client/App.js`: main screen.
- `client/src/config/env.js`: environment-driven API base URL.
- `client/src/services/wordService.js`: API consumption and fallback behavior.
- `client/src/constants/theme.js`: palette and default style fallback.
- `client/src/data/fallbackWord.js`: offline/default word object.
- `client/assets/images/`: image assets.
- `client/assets/resources/`: static resources (JSON, docs, etc.).

## 3. Environment Variables

## Backend (`api/.env`)

Copy `api/.env.example` to `api/.env` and define:

- `MONGODB_URI`: MongoDB connection string.
- `MONGODB_DB_NAME`: database name (default: `logicoh`).
- `MONGODB_COLLECTION`: collection name (default: `conceptos`).
- `CORS_ORIGIN`: allowed CORS origin (`*` for open).

Example:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/logicoh?retryWrites=true&w=majority
MONGODB_DB_NAME=logicoh
MONGODB_COLLECTION=conceptos
CORS_ORIGIN=*
```

## Frontend (`client/.env`)

Copy `client/.env.example` to `client/.env` and define:

- `EXPO_PUBLIC_API_BASE_URL`: public base URL of your API.

Example:

```env
EXPO_PUBLIC_API_BASE_URL=https://logicoh.com
```

For local development against Vercel dev/API mock, use an accessible URL from your device/emulator.

## Part A: Local Dev Testing

### A.0 Node version compatibility

- Use Node `20.x` (recommended) or `18.x` for the Expo client.
- Avoid Node `22+` with this stack because Expo SDK 50 can fail on Windows with `ENOENT` related to `node:sea` path generation.
- A project `.nvmrc` is included with `20`.
- On Windows, if `nvm` is missing, install nvm-windows with:

```powershell
winget install --id CoreyButler.NVMforWindows --exact --accept-package-agreements --accept-source-agreements
```

- If nvm-windows is not available in your environment, use fnm:

```powershell
winget install --id Schniz.fnm --exact --accept-package-agreements --accept-source-agreements
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
fnm install 20.19.0
fnm use 20.19.0
```

### A.1 Install dependencies

From project root:

```bash
cd api
npm install

cd ../client
npm install
```

If reinstalling client dependencies in PowerShell:

```powershell
cd client
if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }
if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }
npm install
```

### A.2 Seed the database

Run the backend seed script after defining `api/.env`:

```bash
cd api
npm run seed
```

This clears the target collection and inserts refined words with this shape:

```json
{
  "_id": "...",
  "term": "Anodino",
  "category": "adjetivo",
  "tags": ["vocabulario-culto", "verbal", "prioridad-alta"],
  "definition": "Que es insignificante o carece de valor.",
  "example": "La exploracion fisica fue anodina, sin hallazgos relevantes.",
  "metadata": {
    "difficulty": 3,
    "viewCount": 0
  }
}
```

### A.3 Run the API with hot reload

```bash
cd api
npm run dev
```

This uses nodemon and auto-restarts on backend file changes.

For production-like local run (no hot reload):

```bash
cd api
npm run start
```

### A.4 Run Expo client

```bash
cd client
npm run start
```

Then use:

- `a` for Android emulator
- `w` for web
- Expo Go QR for real device

### A.5 Verify local endpoints

```bash
Invoke-WebRequest -Uri http://localhost:3001/api/health -UseBasicParsing | Select-Object -ExpandProperty Content
Invoke-WebRequest -Uri http://localhost:3001/api/get-word -UseBasicParsing | Select-Object -ExpandProperty Content
```

## Part B: Production Vercel Deployment

### B.1 API entry and routing

- Backend entrypoint is `api/index.js`.
- `api/vercel.json` routes `/api/*` to `api/index.js`.

### B.2 Required production env vars

Set these in Vercel project settings:

- `MONGODB_URI`
- `MONGODB_DB_NAME` (or keep default `logicoh`)
- `MONGODB_COLLECTION` (or keep default `conceptos`)
- `CORS_ORIGIN`

Client runtime variable:

- `EXPO_PUBLIC_API_BASE_URL` must point to your deployed backend domain.

### B.3 Pre-deploy checklist

- Seed data exists in production database (`npm run seed` against target env if required).
- `GET /api/health` returns status ok.
- `GET /api/get-word` returns enriched payload with `tags` and `metadata`.

## 4. API Behavior

Endpoint:

- `GET /api/get-word`

Additional endpoint:

- `GET /api/health`

Response behavior:

- Selects one random word from MongoDB.
- Increments `metadata.viewCount` by 1 for the selected document.
- Returns normalized object plus UI style hints:
  - `_id`, `term`, `category`, `tags`, `definition`, `example`, `metadata`
  - `style.backgroundColor`, `style.textColor`

Errors:

- `404` when collection is empty.
- `405` for unsupported methods.
- `500` for server/internal failures.

## 5. Consistency Checklist

- `api/.env` exists and has `MONGODB_URI`.
- `client/.env` exists and points to API base URL.
- Seed script runs without errors.
- Client can fetch words and displays `difficulty`, `viewCount`, and `tags`.
- `client/assets/images/` and `client/assets/resources/` are used for future static content organization.

## 6. Suggested Next Additions

- Add API endpoints for filtering by `tags` and `difficulty`.
- Add pagination/list endpoint for admin review.
- Add tests for model normalization and controller status handling.
