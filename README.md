# 🚀 Dayflow HRMS - Master Product & Engineering Platform

> **"Every workday, perfectly aligned."**  
> *A next-generation, Odoo-inspired Human Resource Management System (HRMS) featuring real-time attendance, intelligent time-off management, role-based payroll, employee document vaults, and AI-powered HR capabilities.*

---

## 🎨 Color System & Design Language (Odoo / Cleariq Inspired)

- **Primary Brand Blue**: `#007BFF` (active buttons, active menu item pill, key highlights)
- **Page Background**: `#F4F7FB` (soft, modern light-grey/blue surface)
- **Card Containers**: Pure `#FFFFFF` with generous rounded corners (`rounded-2xl`), subtle border (`#E2E8F0`), and soft ambient shadows (`shadow-card`)
- **Secondary Accents**:
  - **Cyan / Teal**: `#00D2D3` (radial progress rings, attendance metrics)
  - **Mint Green**: `#2ED573` (status tags like "GOOD", +% growth chips)
  - **Warm Amber / Orange**: `#FF9F43` (alerts, HR highlight badge, warning states)
  - **Soft Lavender**: `#A4B0F5` (bar chart backgrounds and secondary analytics fills)
- **Typography**: Clean sans-serif (Inter & Plus Jakarta Sans). Dark slate text (`#1E293B`) for primary headers; muted gray (`#8898AA` / `#64748B`) for sub-labels.

---

## 📑 Core Modules & Features

### 1. Dual-Perspective Role System & Switcher
- **👑 HR Admin (Marcus Vance - VP of HR)**: Executive analytics dashboard, attendance muster roll, manual overrides, leave approval queue, bulk payroll runner, and audit log.
- **💼 HR Officer (Sarah Jenkins - Senior HR Generalist)**: Staff management, attendance corrections, leave approvals, and compensation structures.
- **👤 Employee (Alex Rivera - Lead Full Stack Engineer)**: Live circular punch clock with break mode, weekly timesheets, leave quota deduction estimator, and 1-click PDF payslips.

### 2. Executive Analytics Dashboard
- **Top Metric Row (4 Cards)**: Key stats (Total Employees, Present Today, On Leave, Average Salary) with clean numeric readouts, micro-percentage chips (+13% in light green), and miniature circular progress rings.
- **Segmented Bar Chart**: "Total Attendance & Salary by Unit" featuring rounded pill bars in `#007BFF` and `#A4B0F5` with hover tooltips.
- **Department Venn Metrics**: Overlapping circular bubble charts in `#007BFF`, `#00D2D3`, and `#2ED573`.
- **Employee Structure Donut**: Centered on 100% with contract type breakdowns.
- **Employee Performance / Muster Roll Table**: Soft pill status badges with direct inspection actions.

### 3. Employee Directory & Deep Profile Vault
- Kanban Card & Dense Table view switchers.
- Search & Department filters (`Engineering`, `Design`, `Product`, `Human Resources`, `Marketing`, `Finance`).
- Deep Profile Drawer with 4 tabs:
  1. *Personal Details*: Contact info, residential address, emergency contact.
  2. *Job Details*: Designation, department, joining date, reporting manager.
  3. *Salary Structure*: Itemized Basic, HRA, Special Allowance, Gross, PF, Tax, and Net monthly CTC.
  4. *Document Vault*: Upload and preview contracts, ID cards, offer letters with verification status badges.

### 4. Real-Time Attendance & Punch Clock
- Interactive digital clock with live ticking seconds, check-in, break toggle, check-out timer.
- Auto status calculation (`FULL_DAY (≥8h)`, `HALF_DAY (4-8h)`, `ABSENT (<4h)`).
- Daily punch timeline, weekly timesheet calendar grid, anomaly flag (e.g. Late punch > 09:30 AM), and Admin manual override with audit log.
- Geo & Network-aware smart punch (`Office Verified IP` vs `Remote WFH` toggle/badge).

### 5. Leave & Time-Off Engine
- Leave quota counters with visual progress bars (Paid Annual, Sick, Casual, LOP).
- Application modal with automated working days calculation (excluding weekends).
- **⚡ Smart Collision & Bandwidth Engine**: Calculates if $\ge 30\%$ of department is on leave during requested dates and displays real-time warning alerts.
- HR 1-Click Approve / Reject with mandatory reviewer comment modal and instant balance adjustment.

### 6. Payroll & Compensation Management
- Configurable salary components: Basic Pay (50%), HRA (30%), Special Allowance (20%), PF Deduction (12% of Basic), Professional Tax (Fixed).
- Monthly payroll cycle status & bulk batch runner.
- **📄 1-Click Pixel-Perfect Printable / PDF Payslip**:
  - Official Dayflow HRMS branded letterhead with company logo & address.
  - Employee info, bank details, PF number, UAN, pay period (August 2026).
  - Itemized Earnings vs Deductions table with exact sums.
  - Net Pay in bold with amount in words.
  - Verifiable Digital QR Code verification stamp & official authorized signature.
  - Instant Print / PDF Download functionality (via window.print() styled CSS).

---

## 🌟 7 Unique Standout Features

1. **🤖 AI HR Copilot (Powered by Gemini)**: Natural language policy queries, leave reason auto-drafter, and burnout/overtime anomaly analysis.
2. **⚡ Smart Leave Collision & Bandwidth Engine**: Visual team clash warnings on leave applications when capacity drops below 60%.
3. **📄 1-Click Pixel-Perfect PDF Payslip Generator**: Client/server printable branded payslip featuring digital QR verification code.
4. **🌐 Interactive Drag-and-Drop Org Chart**: Visual tree showing reporting lines from CEO $\rightarrow$ VPs $\rightarrow$ Leads $\rightarrow$ Engineers with collapsible nodes.
5. **📍 Geo & Network-Aware Smart Punch**: Seamlessly tags punches as `Office Network (Verified IP)` or `Remote / Work-From-Home`.
6. **🏆 Gamified Attendance & Wellness Streaks**: 5-Day On-Time Streak badges with confetti celebration animations.
7. **🛡️ Enterprise Immutable Audit Log**: Complete timeline tracking sensitive actions (salary updates, attendance overrides, role promotions) with before/after diffs.

---

## 🛠️ Local Development & Quick Start

```bash
# Clone the repository
git clone https://github.com/roswelldcosta6/Odoo-hackathon-.git

# Navigate to project
cd Odoo-hackathon-

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
