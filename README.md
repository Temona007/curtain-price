# Curtain Price Calculator

A standalone, mortgage-style calculator for estimating curtain costs based on measurements and options.

## Quick Start

Open `index.html` in a browser, or run a local server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080` (or the port shown).

## Inputs

- **Width / Height** – Window dimensions in cm
- **Mount Type** – Standard Rod, Double Rod, Ceiling Mount, etc.
- **Header Type** – Grommet, Tab Top, Pinch Pleat, etc.
- **Fabric Cost** – Price per m²
- **Installation** – Toggle installation fee
- **On-Site Hemming** – Toggle hemming fee

## Pricing Logic

- Fabric: `width × 2 (fullness) × height × cost per m²`
- Mount and header types add fixed fees
- Installation and hemming are optional add-ons

All pricing uses demo data; no external APIs or databases.
