# 🎓 GJU Smart Connect

A modern university management system built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

The project provides separate portals for **Admin**, **Teacher**, and **Student** with role-based authentication and an intuitive user interface.

---

## 🚀 Features

### 👨‍💼 Admin Portal

- Dashboard Overview
- Manage Departments
- Manage Courses
- Manage Semesters
- Manage Subjects
- Manage Teachers
- Manage Students
- Bulk Student Upload (Excel)
- View System Statistics

---

### 👨‍🏫 Teacher Portal

- Secure Login
- Dashboard
- My Subjects
- Attendance Management
- Marks Management
- Assignment Management
- Announcements
- Bulk Marks Upload (Excel)
- Recent Activities

---

### 👨‍🎓 Student Portal

- Secure Login
- Dashboard
- View Subjects
- View Attendance
- View Internal Marks
- View Assignments
- View Announcements

---

## 🛠 Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Lucide React
- XLSX

---

## 📁 Project Structure

```text
app/
│
├── admin/
├── teachers/
├── students/
├── login/
├── api/
│
components/
│
├── auth/
├── layout/
├── ui/
│
constants/
hooks/
lib/
utils/
public/
```

---

## 🔐 Authentication

The application provides role-based authentication for:

- Admin
- Teacher
- Student

Each portal is protected using authentication guards to prevent unauthorized access.

---

## 📊 Modules

### Attendance

- Mark attendance
- View attendance
- Attendance summary

### Marks

- Manual marks entry
- Bulk Excel upload
- Automatic total calculation

### Assignments

- Create assignments
- Manage submissions
- Track deadlines

### Announcements

- Create announcements
- View announcements
- Subject-wise notifications

---

## 📤 Excel Upload Support

The system supports bulk uploads for:

- Students
- Internal Marks

Supported formats:

- XLSX
- XLS
- CSV

---

## 🎨 UI Highlights

- Responsive Design
- Clean Dashboard
- Modern Cards
- Sidebar Navigation
- Mobile Friendly
- Professional Layout
- Light Theme

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/gju-smart-connect.git
```

Go to project folder

```bash
cd gju-smart-connect
```

Install dependencies

```bash
npm install
```

Create environment file

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Run development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## 📸 Screenshots

You can add screenshots here after deployment.

- Login Page
- Admin Dashboard
- Teacher Dashboard
- Student Dashboard
- Attendance Module
- Marks Module

---

## 🔮 Future Improvements

- Email Notifications
- PDF Report Generation
- QR Attendance
- Student Profile Photo
- Password Reset
- Analytics Dashboard
- Dark Mode
- Mobile App

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is developed for educational purposes.

---

## 👨‍💻 Developer

**Manish Kushwaha**

B.Tech Information Technology

Guru Jambheshwar University of Science & Technology

---

## ⭐ Support

If you like this project, don't forget to **Star ⭐ the repository**.
