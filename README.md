# 🚀 Dayflow HRMS — Enterprise Workforce & Indian Payroll Platform

> **Next-Generation Human Resource Management System (HRMS) built for Indian enterprise scale.**  
> Features dynamic role-based portals (Admin & Employee), automated EPFO/ESI/PT statutory Indian payroll in INR (₹), network-aware biometric attendance muster roll, 6-tab employee KYC & document vault, and intelligent Login ID generation.

---

## 📁 Clean Repository Folder Structure

```text
dayflow-hrms/
├── frontend/                   # React 18 + TypeScript + Vite + Tailwind CSS App
│   ├── src/                    # Complete frontend components, context, and data
│   │   ├── components/         # Attendance, Auth, Directory, Payroll, Leaves, Settings
│   │   ├── context/            # HRMSContext persistent state & RBAC
│   │   └── data/               # Seed data & Indian payroll formulas
│   ├── index.html              # Entry HTML
│   ├── package.json            # Frontend dependencies & scripts
│   ├── tailwind.config.js      # Tailwind SaaS color design system
│   └── vite.config.ts          # Vite bundler configuration
├── backend/                    # Node.js + Express + Prisma ORM REST API
│   ├── prisma/                 # Prisma database schema & migrations
│   ├── src/                    # REST API controllers, routes, and services
│   ├── tests/api-test.ts       # Automated backend test suite
│   ├── Dockerfile              # Backend container definition
│   └── package.json            # Backend dependencies
├── docker-compose.yml          # Container orchestration (MySQL 8.0 + Backend)
└── README.md                   # Hackathon Documentation & Judge Guide
```

---

## ⚡ Quickstart Guide for Judges

You can run the entire platform in **less than 2 minutes** using either Docker or local standalone mode.

### Option A: Running the Frontend App (Instant Local Run)

```bash
# 1. Navigate into the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite dev server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### Option B: Full-Stack Docker Launch (Database + Backend + Frontend)

#### Step 1: Start Database & Backend Container
In the root directory, run:
```bash
docker-compose up -d
```
> Spins up:
> - **MySQL 8.0 Database** on port `3307`
> - **Dayflow REST API** on `http://localhost:5000`

#### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Test Credentials & Demo Accounts

| Role | Name & Designation | Login ID / Email | Password | Role & Features |
| :--- | :--- | :--- | :--- | :--- |
| **👑 Admin** | Marcus Vance *(VP of HR)* | `DFMAVA20210001` <br> `admin@dayflow.com` | `Password@123` | Executive Admin view, full headcount control, batch payroll disbursement, org chart, audit log |
| **💼 HR Officer** | Sarah Jenkins *(Senior HR)* | `DFSAJE20220001` <br> `hr@dayflow.com` | `Password@123` | Employee onboarding, custom payslip generation, leave approvals, document vault |
| **👤 Employee** | John Doe *(Lead Engineer)* | `DFJODO20230001` <br> `employee@dayflow.com` | `Password@123` | Self-service portal, live shift tracker, apply leave, view own payslip only, Wi-Fi settings |
| **✨ New Signups** | *Your Registered Name* | *Your Auto-Generated Login ID* | *Your Password* | **Defaults to EMPLOYEE role** with unassigned salary until HR sets up compensation |

---

## 🌟 Key Functional Highlights

1. **Self-Service & Role Protection**:
   - All new user signups default to **`EMPLOYEE`** role for strict security.
   - Employees only see their own salary, attendance, and leave records.
   - Settings for employees are streamlined to **Network Geofence & Office Wi-Fi** parameters only.

2. **Manager Employee Provisioning & Unassigned Salary**:
   - When an Admin/Manager creates a new employee, their card is permanently saved to the directory and database.
   - Newly created accounts have salary set to **Unassigned / Pending HR Setup** until HR configures compensation.

3. **📄 Certified Digital Payslips (₹ INR)**:
   - Automated calculations for Basic, HRA (40%), Conveyance, EPFO PF (12%), Professional Tax (₹200), ESI, and TDS.
   - Features sticky top & bottom **Back to Payroll** navigation buttons, print/PDF export, and digital verification QR hash.

4. **⏱️ Network-Aware Attendance Muster Roll**:
   - Live shift tracker circle with break timer, WFH/Office Wi-Fi toggle, and Admin punch adjustment logs.

---

## 📜 License

Built with ❤️ for the Odoo Hackathon 2026. Distributed under the MIT License.
