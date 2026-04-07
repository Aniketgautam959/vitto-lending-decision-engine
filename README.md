# 🏦 Vitto Lending Decision Engine

A full-stack web application designed for MSME (Micro, Small, and Medium Enterprises) credit access. It features an intelligent risk engine that provides an instant, real-time credit decision based on the applicant's financial parameters.

## 🛠 Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS (Custom Light Theme)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)

---

## 🚀 Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- Local or Cloud [MongoDB](https://www.mongodb.com/) instance

### 1. Start the Database (MongoDB)
Ensure you have a local MongoDB daemon running on your machine.
- If you wish to use a cloud database (like MongoDB Atlas), create a `.env` file in the `server/` directory:
```env
MONGODB_URI=your_mongo_connection_string
PORT=5005
```
*(If no environment file is provided, it defaults safely to `mongodb://localhost:27017/vitto_lending` and port `5005`).*

### 2. Start the Backend API (Server)
Open a terminal, navigate into your project folder, and run:
```bash
cd server
npm install
npm run dev
```

### 3. Start the Frontend App (Client)
Open a **new** terminal window, navigate to your project folder, and run:
```bash
cd client
npm install
npm run dev
```
The client will automatically start and connect securely to the backend. Open the provided `http://localhost:5173` link in your browser!

---

## 📡 API Documentation

### `POST /api/application`
Submits a new loan application to the decision engine.

**Request Payload (JSON):**
```json
{
  "name": "Aditya Sharma",
  "pan": "ABCDE1234F",
  "monthlyRevenue": 100000,
  "loanAmount": 500000,
  "tenure": 60
}
```

**Successful Response (201 Created):**
```json
{
  "success": true,
  "applicationId": "60d5ecb8b392d7... (MongoDB ID)",
  "result": {
    "decision": "Approved",
    "creditScore": 100,
    "reasons": [
      "All financial parameters are accepted."
    ]
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": [
    "Monthly revenue must be a positive number.",
    "Invalid PAN format."
  ]
}
```

---

## 🌟 Implemented Bonus Features

This application implements several recommended bonus features to ensure a hardened, enterprise-grade mock environment:

- **📦 Full Docker Support:** The application is completely containerized. You can run the entire stack (Database, Node backend, and Vite frontend) via Docker Compose using: `docker-compose up --build`. No local npm installs needed!
- **🛑 Rate Limiting:** The backend is protected by `express-rate-limit`, permitting a maximum of 100 requests per IP per 15 minutes to prevent network spam and basic DDOS attacks.
- **📝 Audit Trails & Logging:** All incoming requests are actively logged to the standard console and seamlessly appended strictly into an enclosed `server/audit.log` file using `morgan`.
- **🛡️ API Validation & Error Handling:** The backend strictly sanitizes `PAN` formatting, verifies strict `positive-number` rules, and gracefully catches edge-case server crashes, returning exact arrays of failure reasons.

---

## ⚙️ Decision Logic Explanation

The core risk assessment lives in `server/services/decisionEngine.js`. When valid data enters the engine, it starts the applicant with a perfect `100` credit score and validates them against two crucial thresholds:

1. **Base Income Threshold Check:**
   - Evaluates if `monthlyRevenue` is less than **₹20,000**.
   - If true: The application is strictly **Rejected**, penalizing the score by `-50` points.
2. **Debt-to-Income (DTI) Check:**
   - Calculates theoretical monthly payout: `EMI = Loan Amount ÷ Tenure`.
   - Checks if the new EMI consumes more than **40%** of the user's `monthlyRevenue`.
   - If true: The applicant is classified as overleveraged and is **Rejected**, penalizing the score by `-50` points.

If the applicant passes both financial checks, their final status is **Approved**, maintaining a `100` credit score, and an array of descriptive `reasonCodes` is returned to the frontend.

---

## 💡 Assumptions Made

When architecting this project, a few logical and technical assumptions were made:
- **Zero-Interest Baseline:** For simplicity in this MSME MVP, the EMI is calculated purely as principal divided by tenure (`Loan Amount ÷ Tenure`) without compound interest, floating rates, or processing fees attached.
- **Port 5005 Allocation:** To avoid extreme local deployment caching conflicts and completely bypass the notoriously occupied Apple macOS AirPlay Receiver port (`5000`), the Node server relies implicitly on Port `5005`.
- **Database Fallbacks:** The system attempts to safely log applications to MongoDB but is resilient; if a user has not started their local mongo daemon, the Node engine catches the error, bypasses logging, and returns the real-time credit decision to the frontend anyway (designed specifically to prevent breaking local reviewer experiences).
- **PAN Uniqueness:** PAN logic uses a regex check for formatting (5 letters, 4 numbers, 1 letter) but does not do live deduplication to check if an applicant already has active debt—every application is calculated strictly statelessly.
