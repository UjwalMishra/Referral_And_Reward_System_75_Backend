# 📦 Referral & Reward System – Backend

Backend service for a **Referral & Reward System** supporting user tiers, referral tracking, admin reports, leaderboard, and payout management.

Built using **Node.js, TypeScript, Express, and MongoDB** with a modular and scalable architecture.

---

## 🚀 Features

### 👤 User Management
- Signup & login with JWT authentication
- User types:
  - **NORMAL** – standard referral rewards
  - **OMNI** – higher referral rewards
- Unique referral code for each user
- User dashboard summary (referrals & earnings)

### 🔗 Referrals & Rewards
- Track inviter → invited user
- Reward calculation based on invited user type
- Reward lifecycle:
  - `PENDING`
  - `PAID`

### 🧑‍💼 Admin APIs
- Referral commission report
- Search, filter & pagination
- Export reports as **CSV** and **PDF**
- Leaderboard (top referrers)
- Payout processing with MongoDB transactions

---

## 🛠 Tech Stack
- Node.js
- TypeScript
- Express.js
- MongoDB + Mongoose
- JWT Authentication

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
FRONTEND_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/referral_system

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---

## 🔑 Authentication APIs

### Signup
`POST /api/auth/signup`

### Login
`POST /api/auth/login`

### Refresh Token
`POST /api/auth/refresh-token`

### Logout
`POST /api/auth/logout`

### Forgot Password
`POST /api/auth/forgot-password`

### Reset Password
`POST /api/auth/reset-password/:token`

---

## 👤 User APIs

### User Dashboard
`GET /api/users/dashboard`

## 🧑‍💼 Admin APIs

All admin routes require **authentication** and **admin access**.

### Referral Commission Report
`GET /api/admin/referral-report`

**Query Params**
- `search`
- `userType` (NORMAL | OMNI)
- `minEarnings`
- `page`
- `limit`

### Export Referral Report (CSV)
`GET /api/admin/referral-report/export/csv`

### Export Referral Report (PDF)
`GET /api/admin/referral-report/export/pdf`

### Leaderboard
`GET /api/admin/leaderboard`

---

## 💸 Payout APIs (Admin)

### View Pending Payouts
`GET /api/admin/payouts/pending`

### Process Payout
`POST /api/admin/payouts/process`

---

## 🧪 Running the Project

### Install Dependencies
```bash
npm install
```

### Run in Development
```bash
npm run dev
```
