# ZorvFin — Finance Dashboard UI

> Frontend Developer Intern Assignment — Zorvyn FinTech Pvt. Ltd.

A clean, interactive, and fully responsive finance dashboard built with **React** and **Recharts**. The application delivers a modern fintech-style user experience with role-based UI, interactive charts, advanced filtering, theme persistence, export functionality, and insightful financial summaries powered by realistic mock transaction data [file:1].

---

## Live Demo / Repository

- **Live Demo**: https://zorvfin-financedashboard.netlify.app/
- **GitHub Repository**: https://github.com/2300033094/finance-dashboard

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | React (Create React App) | Component-based architecture with a simple and reliable setup [file:1] |
| Charts | Recharts | Flexible charting library that integrates smoothly with React components [file:1] |
| Styling | Inline styles + embedded style tag | Complete UI control with theme-based styling [file:1] |
| State Management | React Context + Hooks | Centralized and lightweight state handling for the full dashboard [file:1] |
| Persistence | `localStorage` | Preserves theme, role, and transaction data across sessions [file:1] |
| Data | Seeded mock transactions | Provides realistic visuals and insights from the first launch [file:1] |

---

## Features

### Dashboard Overview
- Summary cards for **Total Balance**, **Total Income**, **Total Expenses**, and **Savings Rate** [file:1]
- **Balance Trend** line chart for month-by-month movement [file:1]
- **Spending by Category** donut chart with color-coded legend [file:1]
- **Recent Transactions** table for quick review [file:1]

### Transactions Section
- Complete transactions table with:
  - Date
  - Description
  - Category
  - Type
  - Amount [file:1]
- Live **search** across description and category [file:1]
- Filter by **type**, **category**, and **date range** [file:1]
- Sort by **newest**, **oldest**, **highest amount**, and **lowest amount** [file:1]
- **Clear Filters** option for quick reset [file:1]

### Role-Based UI
- `Admin` mode supports adding, editing, and deleting transactions [file:1]
- `Viewer` mode supports read-only access with full dashboard visibility [file:1]
- Role switching is available directly from the top bar [file:1]
- Selected role is saved and restored automatically using `localStorage` [file:1]

### Insights Section
- Savings rate with target comparison [file:1]
- Top spending category overview [file:1]
- Average monthly expense calculation [file:1]
- Net savings summary [file:1]
- Monthly income vs expense bar chart [file:1]
- Category-wise breakdown with progress indicators [file:1]
- Month-over-month comparison for income, expenses, and savings [file:1]

### UI/UX Enhancements
- Dark / Light mode toggle with persistence [file:1]
- Responsive layout for mobile, tablet, and desktop screens [file:1]
- Add/Edit transaction modal with validation [file:1]
- CSV and JSON export support [file:1]
- Smooth hover states and subtle transition effects [file:1]
- Clear empty states for transactions and charts [file:1]

---

## Role Permissions

| Feature | Admin | Viewer |
|---|---|---|
| View dashboard data | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
| Export CSV / JSON | ✅ | ✅ |

This role behavior is implemented as a frontend UI simulation to demonstrate conditional rendering and permission-aware interactions [file:1].

---

## State Management

The app uses a centralized `AppContext` to manage dashboard-wide state and actions [file:1].

```text
AppContext
├── transactions     — master transaction list
├── filters          — search, type, category, date range, sort
├── role             — admin / viewer
├── dark             — theme mode
└── activeTab        — current selected dashboard tab
```

Implementation highlights:
- `useMemo` powers derived calculations such as totals, chart data, category summaries, and filtered results [file:1]
- `useCallback` is used for add, edit, delete, and export actions [file:1]
- `localStorage` preserves theme, role, and transaction data between sessions [file:1]

---

## Project Structure

```text
src/
├── App.js   — Main finance dashboard application
└── index.js — React entry point
```

The dashboard is intentionally built in a compact, review-friendly structure so the full implementation can be understood quickly during assessment [file:1].

---

## Setup & Run

### Prerequisites
- Node.js
- npm

### Installation

```bash
git clone https://github.com/2300033094/finance-dashboard
cd finance-dashboard
npm install
npm install recharts
```

### Run Locally

```bash
npm start
```

The app will run locally at:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
```

This generates the production-ready files in the `build` folder for deployment [file:1].

---

## Design Decisions

1. **React Context for app-wide state**  
   A centralized context keeps shared state organized and easy to manage across tabs and components [file:1].

2. **Memoized derived calculations**  
   Financial summaries, filters, monthly trends, and chart datasets are computed efficiently with `useMemo` [file:1].

3. **Seeded mock transaction data**  
   Realistic sample transactions provide immediate chart output, category analysis, and meaningful insights [file:1].

4. **Role-aware UI behavior**  
   Admin and Viewer modes clearly demonstrate permission-based rendering in a frontend-only environment [file:1].

5. **Themed visual system**  
   The dashboard supports both dark and light themes with a consistent color system across cards, tables, charts, and actions [file:1].

---

## Highlights

- Interactive **finance dashboard** experience [file:1]
- Modern **chart-driven** data presentation [file:1]
- Strong **UI responsiveness** across devices [file:1]
- Frontend-only **role-based access behavior** [file:1]
- Built-in **CSV/JSON export** tools [file:1]
- Smooth **dark/light mode persistence** [file:1]

---

## Deployment

This project is successfully deployed on Netlify:

- **Live Demo**: https://zorvfin-financedashboard.netlify.app/

---

## Repository

Source code is available on GitHub:

- **GitHub Repository**: https://github.com/2300033094/finance-dashboard

---

Built for **Zorvyn FinTech Pvt. Ltd.** as part of the **Frontend Developer Intern Screening Assignment**.
