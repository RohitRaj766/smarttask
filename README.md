# SmartTask Management Application

Independent Task Management Application with Next.js 15 Frontend and Express Node.js Backend.

---

## 📁 Directory Structure

```text
smarttask/
├── apps/
│   ├── backend/             # Node.js, Express, MongoDB, JWT Auth, Swagger (has its own package.json & node_modules)
│   └── frontend/            # Next.js 15 App Router, React 19, Tailwind CSS (has its own package.json & node_modules)
└── README.md
```

---

## 🚀 How to Run

### 1. Backend Setup & Run
```bash
cd apps/backend
npm install
npm run dev
```
Backend will start on [http://localhost:5000/api/v1](http://localhost:5000/api/v1) and Swagger Docs on [http://localhost:5000/api-docs](http://localhost:5000/api-docs).

### 2. Frontend Setup & Run
```bash
cd apps/frontend
npm install
npm run dev
```
Frontend will start on [http://localhost:3000](http://localhost:3000).
