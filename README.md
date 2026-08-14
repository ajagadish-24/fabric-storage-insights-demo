# Fabric Storage Insights

Fabric Storage Insights is a Rayfin Data App tailored to feel native inside a Microsoft Fabric Data Warehouse workspace.

## What is included

- Latest **Rayfin Data App** project scaffolding
- Fabric-auth setup and app metadata (`fabric.yaml`, `rayfin/rayfin.yml`)
- Fluent UI based workspace shell, navigation tabs, KPI cards, table view, and activity feed
- Mock storage insights data for local development before wiring a semantic model

## Local development

```bash
npm install
npm run dev
```

When running outside Fabric in development mode, the app automatically falls back to a local mock-auth path so you can build UI quickly.

## Run tests

```bash
npm test
```

## Build

```bash
npm run build
```

## Deploy and validate inside Fabric

1. Sign in and provision/update app resources:
   ```bash
   npx rayfin up
   ```
2. Build deployable assets:
   ```bash
   npm run build:fabric
   ```
3. Open the app in Fabric shell with local dev URI:
   ```bash
   npm run test:fabric
   ```
