# 🎨 Projekt — Frontend

**Projekt Frontend** is the user interface layer of the **Projekt** application — a role-based project and task management system.  
It connects seamlessly with the backend API to provide a responsive, secure, and intuitive experience for Admins, Project Managers, and Developers.

---

## ⚙️ Tech Stack

- ⚛️ **React (Vite)** — modern, fast, and modular frontend framework  
- 🎨 **Tailwind CSS** — utility-first styling for responsive UI  
- 🔁 **Axios** — HTTP client for API communication  
- 🧭 **React Router (v6)** — route-based navigation  
- 🔐 **React Context API** — authentication and state management  
- 🧩 **@hello-pangea/dnd** — drag-and-drop Kanban interaction  
- 🔔 **react-hot-toast** — user feedback & alerts

---

## 👥 Roles

The frontend supports three distinct user roles with tailored interfaces:

- **Admin**  
- **Project Manager (PM)**  
- **Developer**

---

## 🧰 Role-Based Capabilities

### 👑 1) Admin

**Primary Responsibility:** Oversee and manage projects and user hierarchy.  
**Capabilities:**
- Create, edit, and delete **projects**.  
- Create and manage **Project Manager** and **Developer** accounts.  
- Assign PMs to projects.  
- Monitor overall project statuses and team progress.  
- Manage users through a clean, accessible dashboard.

---

### 👨‍💼 2) Project Manager (PM)

**Primary Responsibility:** Manage projects, tasks, and developers.  
**Capabilities:**
- View all **projects** assigned to them.  
- Create and assign **tasks** to Developers or themselves.  
- Edit task details — title, due date, assignee *(with restrictions)*:  
  - Cannot reassign an **ongoing** task.  
  - Cannot modify a **completed** task.  
- Delete tasks only if they are **pending** or **completed**.  
- Use the **Kanban board** for drag-and-drop status transitions:  
  `pending → ongoing → completed` 
- View overdue task indicators and project progress in real time.

---

### 👨‍💻 3) Developer

**Primary Responsibility:** Execute and track assigned tasks.  
**Capabilities:**
- View all **assigned projects and tasks**.  
- Update task progress via **Kanban drag-and-drop**.  
- Edit task title or due date (limited access).  
- Cannot delete or reassign tasks.  
- View visual indicators for overdue and completed tasks.

---

## 🙏 Thank You

Thanks for checking out the **Projekt Frontend**! 💻  
This interface was designed for clarity, collaboration, and productivity across all roles.


---
