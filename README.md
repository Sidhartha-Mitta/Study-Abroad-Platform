# Study Abroad Platform 🌍✈️

A comprehensive, full-stack application designed to streamline the management and application process for study abroad programs. It features a modern, high-contrast, interactive frontend and a robust backend API built on the MERN stack with Redis caching and Docker containerization.

## 🚀 Features

- **Program Management:** Admins can create, view, edit, and manage study abroad programs.
- **Admin Dashboard:** An intuitive and vibrant dashboard with glassmorphism UI to view metrics and application statuses.
- **Student Applications:** Seamless application tracking and submission workflow for students.
- **Authentication & Authorization:** Secure JWT-based authentication system with role-based access control (Admin vs. Users).
- **Responsive & Dynamic Design:** Built with modern CSS approaches and interactive animations using Framer Motion.
- **Dockerized Ecosystem:** One-command local environment setup with MongoDB and Redis seamlessly integrated.

## 🛠️ Technology Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) & [TanStack React Query](https://tanstack.com/query/latest)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** Vanilla CSS variables for robust design systems natively, plus TailwindCSS utility classes.
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Caching & Performance:** [Redis](https://redis.io/) via `ioredis`
- **Security:** `bcryptjs` for hashing, `jsonwebtoken` for auth, and Express Rate Limiter.
- **Testing:** [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest)

## 🏗️ Project Structure

```text
├── study-abroad-backend/      # Express.js REST API
│   ├── src/                   # Controllers, routes, models, middleware
│   ├── tests/                 # Unit and integration tests
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Backend dependencies and scripts
│   └── server.js              # Entry point
│
├── study-abroad-frontend/     # React / Vite application
│   ├── src/                   # Components, pages, hooks, store, utils
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies and scripts
│   └── vite.config.js         # Vite bundler configuration
│
└── docker-compose.yml         # Containerized ecosystem runner
```

## 🐳 Running the Application (Docker)

The fastest way to get everything up and running is via Docker Compose. This local architecture will spin up the Frontend, Backend, MongoDB, and Redis instances.

1. **Clone the repository.**
2. **Setup environment variables:**
   - Review `/study-abroad-backend/.env.example`
   - Create a `.env` in the backend folder if you want to override defaults.
3. **Start the containers:**
   ```bash
   docker-compose up -d --build
   ```
4. **Access the application:**
   - **Frontend UI:** `http://localhost:8080`
   - **Backend API:** `http://localhost:5001` (Note: local Docker maps to 5001 externally)

## 🏃‍♂️ Running Locally (Without Docker)

You will need a running instance of MongoDB and Redis on your machine.

### 1. Start the Backend
```bash
cd study-abroad-backend
npm install
# Ensure you have a `.env` file referencing your local Mongo & Redis connections
npm run dev
```
The backend API will listen on `http://localhost:5000`.

### 2. Start the Frontend
```bash
cd study-abroad-frontend
npm install
npm run dev
```
The frontend will start on your local Vite dev server port (typically `http://localhost:5173`).

## 🧪 Testing

The Backend includes a comprehensive test suite using Jest and in-memory MongoDB servers.

```bash
cd study-abroad-backend
npm run test
```

## 📜 License
ISC License
