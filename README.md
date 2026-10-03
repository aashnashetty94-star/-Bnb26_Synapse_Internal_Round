# 🎟️ TicketMatrix: High-Concurrency Flash Drop System

A high-performance movie ticket booking application designed to handle extreme traffic spikes (flash drops) without crashing, featuring real-time bot mitigation and live telemetry tracking. Built for the Mirzapur Movie Special release.

## 🚀 Tech Stack
* **Framework:** Next.js (App Router, React, TypeScript)
* **Styling:** Tailwind CSS
* **Telemetry & Charts:** Recharts
* **Backend State:** Next.js API Routes (In-memory telemetry sync)

---

## 🛠️ How to Run & Test Locally

Follow these quick steps to get the application running on your machine:

### 1. Install Dependencies
Open your terminal inside the project folder and install the required packages:
\`\`\`
npm install
\`\`\`

### 2. Run the Development Server
Start the local Next.js development server:
\`\`\`
npm run dev
\`\`\`

### 3. Open in Your Browser
Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## ✨ Key Features & Demo Flow

* **Movie Booking Flow:** Experience the cinematic flash-drop interface, session token generation, and secure atomic seat allocation (`MZP-xxx`).
* **Admin Anti-Bot Monitor:** Switch to the live telemetry dashboard to monitor real-time requests, IP velocity throttling, and bot vs. human allocations powered by live API polling.
* **Integrity Guardrails:** Guaranteed zero overselling and zero duplicate seat allocations under high-velocity test loads.
