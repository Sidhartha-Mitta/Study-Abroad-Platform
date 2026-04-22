# Submission Guidelines

Please find the requested details for the Study Abroad Platform below. You can copy-paste and modify this document directly for your submission.

## 1. GitHub Repository Link
**[Insert Your GitHub Repository Link Here]**

## 2. Setup and Run Instructions

The easiest way to bootstrap the application is by using Docker, which orchestrates the Frontend, Backend, MongoDB, and Redis instances automatically.

### Running with Docker

1. Ensure [Docker Installion](https://docs.docker.com/get-docker/) and `docker-compose` are available on your system.
2. In the root directory (where `docker-compose.yml` is located), execute the following command:
   ```bash
   docker-compose up -d --build
   ```
3. Once the containers are running:
   - **Frontend UI** will be accessible at: `http://localhost:8080`
   - **Backend API** will be accessible at: `http://localhost:5001`

### Running Locally (Without Docker)

You will need instances of MongoDB and Redis running on your machine.

**Backend Setup:**
1. Navigate to the backend directory: `cd study-abroad-backend`
2. Install dependencies: `npm install`
3. Setup the `.env` file (copied from `.env.example`).
4. Start the server: `npm run dev` (Runs on `http://localhost:5000`)

**Frontend Setup:**
1. Navigate to the frontend directory: `cd study-abroad-frontend`
2. Install dependencies: `npm install`
3. Start Vite dev server: `npm run dev`

## 3. Environment Variables

### Backend (`study-abroad-backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/studyabroad  # Change if not using localhost
JWT_SECRET=replace_this_with_a_long_random_secret # Use a strong hash for production
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379                 # Standard Redis local port
CLIENT_URL=*                                     # Adjust to frontend URL for CORS in production
```
*(Note: If using Docker, these are automatically injected via the `docker-compose.yml` file)*

### Frontend (`study-abroad-frontend/.env`)

```env
VITE_API_URL=http://localhost:5001/api  # Points to local docker backend. Use /api for local dev.
```

## 4. Assumptions or Notes Needed for Evaluation

1. **Admin Registration Mechanism:** To successfully create an Administrator role, the system might ask for an `ADMIN_SECRET` upon registration. If running via Docker, this defaults to `studyabroad_admin_2026` (as seen in `docker-compose.yml`).
2. **Container Ports:** To avoid port collision with local dev environments, the Docker container maps the backend to port `5001` externally and the frontend to port `8080`.
3. **Database Population:** The database starts empty. Evaluators should register an admin account first, then proceed to the dashboard to create program listings.
4. **Caching & Extensibility:** Redis is implemented for caching API requests and handling potential rate-limiting, increasing robustness against heavy traffic or brute-forcing.
5. **Testing Subsystem:** A suite of unit tests has been provided inside the `tests` directory of the backend, utilizing `mongodb-memory-server` to mock DB actions without wiping evaluation data. You can run these via `npm run test` inside the backend directory.
