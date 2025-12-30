# LoanLattice Frontend

React frontend for the Smart Document Engine MVP.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

### Dashboard
- Overview of all processed loan documents
- Statistics on total documents, loans, and portfolio value
- Real-time status of at-risk covenants
- Sortable loan table with extraction confidence scores

### Document Upload
- Drag-and-drop PDF upload interface
- Real-time processing status updates
- AI-powered document extraction
- Visual feedback on upload progress

### Covenant Monitor
- Comprehensive covenant tracking dashboard
- Filter covenants by status (compliant, warning, breach)
- Breach probability indicators (30/60/90-day forecasts)
- Color-coded risk alerts

## Tech Stack

- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (API requests)
- React Router (navigation)
- Lucide React (icons)

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── DocumentUpload.jsx
│   │   └── CovenantMonitor.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
