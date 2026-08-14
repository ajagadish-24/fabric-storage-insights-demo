# Storage Insights Prototype (Microsoft Fabric Warehouse)

This repository contains a clickable React + TypeScript prototype for **Storage Insights** inside a Microsoft Fabric Warehouse shell experience.

## Highlights

- Fabric-style shell framing (workspace + warehouse breadcrumbs, left navigation, command bar, preview badge)
- Storage Insights pages:
  - Overview
  - Storage breakdown
  - Tables
  - Trends
  - Query views
  - Retention simulation (future concept)
  - Alerts (future concept)
- Reconciled local mock data (warehouse totals, category totals, and table totals)
- Side-pane investigations for table details and anomalies
- Fluent UI v9 components and Segoe UI styling

## Prerequisites

- Node.js 20+
- npm 10+

## Run locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Notes

- Prototype uses local mock data only.
- No external services, secrets, or production Fabric API calls are required.
