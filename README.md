# 🧠 Job Assessment Task — Role-Based Task Management System (Admin & Employee)

This project is a **Job Assessment Task** created as part of a **job application**.  
It is a **full-stack, role-based Task Management System** built with modern technologies:
- 🧩 **Backend:** Node.js, Express.js, MongoDB  
- ⚛️ **Frontend:** React (Vite)  
- 🐳 **Dockerized** for easy deployment and environment consistency  

---

## 🚀 **Overview**

This system allows an **Admin** to assign tasks to registered **Employees** and track their progress.  
Employees can log in, view their assigned tasks, and update their status accordingly.

---

## 💼 **Features**

### 🔐 **Role-Based Authentication**
- **Admin** and **Employee** roles using JWT-based authentication.
- Admins can manage all tasks and view employees.
- Employees can view and update their own assigned tasks.

### 🧾 **Admin Capabilities**
- Create, assign, update, and delete tasks.
- Assign tasks only to employees.
- Monitor task status updates from employees in real-time.

### 👨‍💻 **Employee Capabilities**
- View assigned tasks.
- Update task status (`In Progress`, `Completed`, or `Failed`).
- Report issues or mark a task as failed.

### 🧠 **Tech Stack**
- **Frontend:** React + Vite, TailwindCSS, Axios  
- **Backend:** Node.js, Express.js, MongoDB (Mongoose ODM)  
- **Authentication:** JWT (JSON Web Token)  
- **Containerization:** Docker  
- **Hosting Ready:** Easily deployable using Docker or manual Node/React setup  

---

## 🏗️ **Project Structure**

```
📦 project-root/
├── 📁 backend/ # Node.js + Express API
│ ├── server.js
│ ├── db.js
│ ├── models/
│ ├── routes/
│ └── .env.example
│
├── 📁 src/ # React (Vite) Frontend
│ ├── components/
│ ├── context/
│ ├── pages/
│ ├── utils/
│ └── main.jsx
│
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## ⚙️ **Setup Instructions**

You can run this project in **two ways**:

---

### 🧩 **Option 1: Using Node.js (Manual Setup)**

#### **Backend Setup**
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
   
2. Install dependencies:
```
npm install
```

 3. Create a .env file (use .env.example as reference) and configure:
```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret_key>
PORT=5000
```

 4. Start the backend server:
```
nodemon server.js
```
or
```
node server.js
```

Backend will start on: http://localhost:5000

### Frontend Setup

 1. From the root folder:
```
npm install

```

 2. Start the frontend:
```
npm run dev

```

Frontend will start on: http://localhost:5173

### 🐳 Option 2: Using Docker (Recommended)

This project is fully Dockerized — no manual environment setup needed.

 1. Clone the repository:
```
git clone github_repo_url
cd folder_name
```

 2. Build and start containers:
```
docker-compose up --build
```

Once built, the containers will automatically start both:

Backend API on port 5000

Frontend (Vite React) on port 5173

You can now open the app in your browser:
👉 http://localhost:5173

To stop containers:
```
docker-compose down
```
### 🔑 Roles Overview

Role	Permissions
Admin	Create, assign, update, and delete tasks; view all users and tasks
Employee	View assigned tasks, update task status, report issues

### 🧰 APIs Overview

Authentication
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Log in and receive JWT
Admin Routes
Method	Endpoint	Description
GET	/api/users	Get all registered employees
POST	/api/tasks	Create a new task
PATCH	/api/tasks/:taskId/status	Update a task's status
DELETE	/api/tasks/:taskId	Delete a task
Employee Routes
Method	Endpoint	Description
GET	/api/tasks/user/:userId	Get all tasks assigned to a specific user
PATCH	/api/tasks/:taskId/status	Update task status (e.g., in progress, completed, failed)

### 🧑‍💻 Environment Variables (.env Example)
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=supersecretjwtkey

### 🧱 Docker Support

The included Dockerfile and docker-compose.yml handle:

Multi-container setup for backend (Node.js) and frontend (React)

Automatic dependency installation

Environment variable injection

Port mapping for 5173 (frontend) and 5000 (backend)

To rebuild images:

docker-compose build

### 🧡 Acknowledgments

This project was developed as part of a Job Assessment Task to demonstrate:

Full-stack development skills (React + Node + MongoDB)

API design and authentication

Role-based access control (RBAC)

Dockerization for deployment-ready architecture

### 👨‍💻 Developer
Prince Bhatt

📧 Email: princebhatt316@gmail.com

🌐 Portfolio: [Prince Bhatt](https://princebhatt03.github.io/Portfolio)

💼 GitHub: [princebhatt03](https://github.com/princebhatt03)

💬 LinkedIn: [Prince Bhatt](https://www.linkedin.com/in/prince-bhatt-0958a725a/)

📄 License

This project is created and owned by Prince Bhatt

✨Thank you for connecting...
