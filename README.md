# My Smart Home — Energy Control Dashboard

A responsive React + TypeScript dashboard prototype inspired by the supplied reference image. Includes a custom CSS-built isometric house scene, energy cards, charts, device toggles, quick actions, device management, automation concept, analytics and integration settings.

## Run locally

1. Install Node.js 20+.
2. In this folder run `npm install`
3. Run `npm run dev`
4. Open the local URL printed by Vite.

## Current state

This is a front-end prototype. It uses illustrative demo readings; device toggles and device addition work locally in the UI, but do not control real devices or persist after refresh. The 3D-looking house is a CSS illustration, not yet a Three.js interactive model.

## Real integration checklist

- Create a backend service (never put provider secrets in browser code).
- Confirm eWeLink Open API access, region, account/device support and permissions.
- Identify the exact Solex inverter/monitor model and its supported API, local protocol or export options.
- For grid import/export and whole-home load, confirm a compatible meter/CT or inverter measurement is available.
- Establish a safe, supported control path for EV charging; don't assume the car itself exposes a charge-control API.
- Configure tariff and currency (LKR) before calculating cost/savings.
- Replace demo values with timestamped API readings and show stale/offline status when data is unavailable.

## Stack

React, TypeScript, Vite, Lucide, Recharts, Framer Motion. Three.js / React Three Fiber packages are included for the next phase of true interactive 3D.
