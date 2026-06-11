💊 Pharmacy Analytics Dashboard

A full-stack, real-time pharmacy analytics platform built with React, TypeScript, Vite, and Express. Designed to give pharmacy networks a live command-centre view of revenue, profit, transactions, and regional performance — all in one dashboard.

---

## 🚀 Live Features

- **Real-time KPI Cards** — Today's revenue, profit, transaction count, and margin with live delta vs. yesterday
- **Live Revenue Stream Chart** — Cumulative intra-session revenue & profit that updates every 3.5 seconds
- **Regional Performance Bars** — Live revenue breakdown across 8 European markets (Germany, France, Italy, Spain, Poland, Belgium, Netherlands, Austria)
- **Category Revenue Bars** — Live split across Prescription, OTC, Wellness, Personal Care, and Medical Devices
- **Live Alerts Feed** — Real-time success, warning, and info alerts with timestamps
- **Network Status Panel** — Active pharmacies, markets online, and data freshness indicators
- **Month Range Filtering** — Filter all analytics by a custom month range
- **Interactive Map** — Regional pharmacy location and performance map
- **Dark / Light Theme** — Toggle between themes with persistent preference
- **Pause / Resume** — Freeze the live data stream at any point for closer inspection

---

## 🖥️ Screenshots

> Charts and dashboard previews are included in `client/public/`:
> - `chart_revenue_profit_forecast.png`
> - `chart_regional_performance.png`
> - `chart_category_performance.png`
> - `chart_top_pharmacies.png`
> - `chart_top_products.png`
> - `chart_profit_margins.png`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 7 |
| UI Components | Radix UI, shadcn/ui, Tailwind CSS 4 |
| Charts | Recharts |
| Animations | Framer Motion |
| Routing | Wouter |
| Forms & Validation | React Hook Form + Zod |
| Backend | Express (Node.js) |
| Package Manager | pnpm |

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm

```bash
npm install -g pnpm
```

### Install dependencies

```bash
pnpm install
```

### Run in development

```bash
pnpm dev
```

Opens at `http://localhost:5173`

### Type check

```bash
pnpm check
```

### Build for production

```bash
pnpm build
```

### Start production server

```bash
pnpm start
```

Runs the Express server at `http://localhost:3000`

### Format code

```bash
pnpm format
```

---

## 🗂️ Project Structure

```
pharmacy-analytics-app/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # UI components (Dashboard, Map, Charts, etc.)
│   │   │   └── ui/          # shadcn/ui base components
│   │   ├── contexts/        # React contexts (Theme, MonthRange)
│   │   ├── hooks/           # Custom hooks (useLiveData, useMobile, etc.)
│   │   ├── lib/             # Utility functions
│   │   └── pages/           # Route pages (Home, NotFound)
│   └── public/              # Static assets & chart previews
├── server/                  # Express backend (serves built frontend)
├── shared/                  # Shared constants between client & server
├── patches/                 # pnpm dependency patches
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 📊 Dashboard Sections

| Section | Description |
|---|---|
| Today's Performance | Live KPIs: revenue, profit, transactions, margin |
| Month-to-Date & YTD | Aggregated MTD and year-to-date revenue & profit |
| Live Revenue Stream | Area chart showing cumulative session revenue & profit |
| Revenue by Region | Horizontal bar chart for 8 European markets |
| Revenue by Category | Horizontal bar chart for 5 product categories |
| Live Alerts | Real-time event feed with success/warning/info types |
| Network Status | Active pharmacies, markets online, data freshness |

---

## 🔒 Environment Variables

No environment variables are required to run in development. For production deployments, you can set:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port for the Express server |
| `NODE_ENV` | `development` | Set to `production` for production builds |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

> Built with ❤️ for pharmacy network analytics.
