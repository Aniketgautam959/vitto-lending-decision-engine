# Simple Lending Decision Engine

A simple full-stack application for MSME loan decisions.

## Tech Stack
* Frontend: React.js + Tailwind CSS
* Backend: Node.js + Express
* Database: MongoDB

## Features
* Form with Name, PAN, Monthly Revenue, Loan Amount, Tenure
* API: `POST /api/application`
* Simple decision logic:
  * EMI = loanAmount / tenure
  * If revenue < ₹20000 → Reject
  * If EMI > 40% of revenue → Reject
  * Else → Approve
* Clean Frontend returning: Decision, Credit Score, and Reasons.

## Setup Steps

### 1. Database
Ensure you have a local MongoDB running or add `MONGODB_URI` in `server/.env`. Default falls back to `mongodb://localhost:27017/vitto_lending`.

### 2. Backend
```bash
cd server
npm install
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```
