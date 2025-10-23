# Projekt — Frontend

**Projekt** is a role-based project & task management frontend built with React (Vite) and TailwindCSS.  
This repository contains the UI layer that talks to the Projekt backend API.

---

##  Tech Stack

- **React** (Vite) — fast development + production builds  
- **Tailwind CSS** — utility-first styling  
- **Axios** — HTTP client for API communication  
- **React Router** (v6) — routing  
- **React Context API** — authentication & global state  
- **@hello-pangea/dnd** — drag-and-drop Kanban (task board)  
- **react-hot-toast** — toast notifications

---

##  Roles

The app supports three user roles with distinct capabilities:

- **Admin**  
- **Project Manager (PM)**  
- **Developer**

---

##  What each role can do

### 1) Admin
- Create, edit and delete **projects**.
- Create **Project Manager** and **Developer** accounts.
- Assign a Project Manager to a project.
- View all ongoing and completed projects in an overview.
- Access user management UI to manage PM and Developer accounts.

### 2) Project Manager (PM)
- View projects assigned to them and open project details.
- Create tasks under their projects and assign them to Developers or themselves.
- Edit task metadata (title, due date, assignee) with restrictions:
  - Cannot reassign a task if it is already `ongoing`.
  - Cannot modify a `completed` task.
- Delete tasks only if they are `pending` or `completed` (cannot delete `ongoing` tasks).
- Use the Kanban board (drag & drop) to move tasks through statuses:
  - `pending` → `ongoing` → `completed` (transitions enforced).
- See quick visual indicators for overdue tasks and status breakdowns.

### 3) Developer
- View projects and tasks that are assigned to them.
- Update their assigned task status via the Kanban board (drag & drop).
- Edit their own task’s title or due date (restrictions apply: e.g., cannot reassign).
- Track overdue tasks and progress on personal task lists.

---

## Thank you

Thanks for checking out the Projekt frontend.  

---
