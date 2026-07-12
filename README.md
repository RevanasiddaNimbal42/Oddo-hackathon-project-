# 🚛 TransitOps – Smart Transport Operations Platform

TransitOps is a centralized transport operations platform built to digitize fleet management, driver management, trip scheduling, maintenance, fuel tracking, and operational analytics.

Developed as part of the **Odoo Hackathon**, the platform replaces traditional spreadsheet-based transport management with an intelligent, role-based web application.

---

## 📌 Problem Statement

Many logistics companies still rely on manual logbooks and spreadsheets to manage their fleet. This results in:

- Scheduling conflicts
- Underutilized vehicles
- Missed maintenance
- Expired driver licenses
- Inaccurate expense tracking
- Poor operational visibility

TransitOps provides a single platform to manage the complete lifecycle of transport operations. :contentReference[oaicite:1]{index=1}

---

# ✨ Features

## 🔐 Authentication
- Secure Login
- Role-Based Access Control (RBAC)

## 📊 Dashboard
- Active Vehicles
- Available Vehicles
- Vehicles in Maintenance
- Active Trips
- Pending Trips
- Drivers on Duty
- Fleet Utilization

## 🚚 Vehicle Management
- Vehicle Registration
- Vehicle Status Tracking
- Vehicle Details
- Load Capacity
- Odometer Tracking

## 👨‍✈️ Driver Management
- Driver Profiles
- License Management
- Safety Score
- Driver Availability

## 🛣️ Trip Management
- Create Trips
- Assign Vehicle
- Assign Driver
- Cargo Validation
- Trip Lifecycle Management

## 🔧 Maintenance
- Maintenance Logs
- Vehicle Status Automation
- Service History

## ⛽ Fuel & Expense Management
- Fuel Logs
- Expense Tracking
- Operational Cost Calculation

## 📈 Reports & Analytics
- Fleet Utilization
- Fuel Efficiency
- Vehicle ROI
- Operational Cost Analysis

---

# ⚙️ Business Rules

The system automatically enforces several transport rules including:

- Unique vehicle registration numbers
- Prevent assigning retired or maintenance vehicles
- Prevent assigning suspended or expired-license drivers
- Prevent assigning vehicles/drivers already on a trip
- Validate cargo weight against vehicle capacity
- Automatic status updates during trip and maintenance lifecycle :contentReference[oaicite:2]{index=2}

---

# 🗂️ Project Structure

```
src/
│
├── components/
│   ├── auth/
│   ├── layout/
│   └── ui/
│
├── pages/
├── contexts/
├── config/
├── data/
├── types/
├── utils/
│
├── App.tsx
└── main.tsx
```

---

# 🛠️ Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Git & GitHub

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/RevanasiddaNimbal42/Oddo-hackathon-project-.git
```

Navigate to the project

```bash
cd Oddo-hackathon-project-
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Build the project

```bash
npm run build
```

---

# 📌 Future Enhancements

- PDF Report Export
- Email Notifications
- Vehicle Document Management
- Advanced Analytics
- Search & Filtering
- Dark Mode

---

# 👥 Team

- Jayaram Naik
- Karthik
- Revan Siddha
- Anjan poojari 

---

# 📜 License

This project was developed for the **Odoo Hackathon** and is intended for educational and demonstration purposes.

---

## ⭐ If you like this project, consider giving it a star!
