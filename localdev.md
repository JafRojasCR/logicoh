# Local Development Guide (API + Expo)

This guide explains exactly how to run the LogicOh API and Expo client locally before wiring everything to Vercel.

## 1. Create local env files

In `api/`, create `.env` from `.env.example`:

```bash
cd api
copy .env.example .env
```

Then edit `api/.env` and set at minimum:

- `MONGODB_URI`
- `API_PORT` (default `3001`)
- optional `MONGODB_DB_NAME`, `MONGODB_COLLECTION`, `CORS_ORIGIN`

In `client/`, create `.env` from `.env.example`:

```bash
cd ../client
copy .env.example .env
```

Set `EXPO_PUBLIC_API_BASE_URL` to your local API host.

Use one of these values:

- Android emulator: `http://10.0.2.2:3001`
- iOS simulator / same machine web: `http://localhost:3001`
- Real phone on same Wi-Fi: `http://YOUR_LOCAL_IP:3001` (example: `http://192.168.1.8:3001`)

## 2. Install dependencies

### Important Node version note (Expo SDK 50)

Use Node `20.x` (recommended) or `18.x`.

- Do not use Node `22+` for this client setup.
- On Windows with newer Node versions, Expo can fail with:
	- `ENOENT ... .expo\\metro\\externals\\node:sea`

Quick check:

```bash
node -v
```

If version is `22+`, switch to Node 20 and retry.

With nvm-windows (if installed):

```bash
nvm install 20.19.0
nvm use 20.19.0
node -v
```

If `nvm` is not installed, install it first with winget:

```powershell
winget install --id CoreyButler.NVMforWindows --exact --accept-package-agreements --accept-source-agreements
```

Then close and reopen PowerShell, and run:

```powershell
nvm install 20.19.0
nvm use 20.19.0
node -v
```

Then clean and reinstall client dependencies:

```powershell
cd client
if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }
if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }
npm install
```

From repository root:

```bash
cd api
npm install

cd ../client
npm install
```

## 3. Seed local database (once, or anytime you want to reset data)

```bash
cd api
npm run seed
```

This clears and repopulates the configured collection with refined word objects.

## 4. Run API locally with hot reload (nodemon)

In terminal 1:

```bash
cd api
npm run dev
```

What this does:

- Runs `nodemon index.js`.
- Restarts the API automatically when files in `api/` change.
- Uses `API_PORT` from `api/.env` (default `3001`).

If you want production-like behavior locally (without hot reload):

```bash
cd api
npm run start
```

Expected URL:

- API health: `http://localhost:3001/api/health`
- Random word: `http://localhost:3001/api/get-word`

## 5. Run Expo client locally

In terminal 2:

```bash
cd client
npm run start
```

If Expo fails after a Node switch, clear Metro cache once:

```bash
cd client
npx expo start --clear
```

Then use Expo options:

- press `a` for Android emulator
- press `w` for web
- scan QR with Expo Go on device

## 6. Verify end-to-end quickly

1. Open `http://localhost:3001/api/health` in browser and confirm `{ "status": "ok" ... }`.
2. Open `http://localhost:3001/api/get-word` and confirm enriched object with `tags` and `metadata`.
3. In Expo app, tap refresh and confirm words load from API.

## 7. Daily local dev workflow

Start both processes each session:

```bash
# terminal 1 (hot reload)
cd api
npm run dev

# terminal 2
cd client
npm run start
```

Optional data reset:

```bash
cd api
npm run seed
```

## 8. Notes for later Vercel migration

- Keep `api/index.js` as the backend entry point.
- Current `api/vercel.json` sends `/api/*` traffic to `api/index.js`.
- When deploying, set the same env variables in Vercel project settings.

## 9. Useful local checks

```bash
# Health
Invoke-WebRequest -Uri http://localhost:3001/api/health -UseBasicParsing | Select-Object -ExpandProperty Content

# Random word
Invoke-WebRequest -Uri http://localhost:3001/api/get-word -UseBasicParsing | Select-Object -ExpandProperty Content
```
