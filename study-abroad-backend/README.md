# Study Abroad Platform Backend API ⚙️

This is the Node.js/Express.js backend for the Study Abroad Platform. It provides a RESTful API for managing programs, applications, user authentication, and serving the frontend application.

## 🚀 Features

- **Authentication:** JWT-based user authentication and role-based access control (RBAC).
- **Program Management:** Complete CRUD operations for study programs.
- **Application Tracking:** API endpoints for students to submit and track their program applications.
- **Caching:** Redis integration for rate-limiting and performance caching.
- **Database:** MongoDB configured using Mongoose schemas.
- **Testing:** Comprehensive unit and integration testing with Jest and Supertest.

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** MongoDB & Mongoose
- **Caching / Rate Limiting:** Redis & Express Rate Limit
- **Security:** bcryptjs, jsonwebtoken
- **Testing:** Jest, Supertest, MongoDB Memory Server

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or a URI)
- Redis (running locally or a URI)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

### Running Locally

**Development Mode (with Nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The API will be available at `http://localhost:5000`.

## 🐳 Docker Deployment

To run the complete platform using Docker (including frontend, backend, MongoDB, and Redis), use the `docker-compose.yml` located in the root directory of the main project:

```bash
cd ..
docker-compose up -d --build
```

## 🧪 Testing

Run the test suite, which spins up an in-memory MongoDB instance for isolated testing:

```bash
npm run test
```
To run tests in watch mode:
```bash
npm run test:watch
```

## 📜 Structure

- `server.js`: Application entry point.
- `/src`: Contains core domain logic (controllers, routes, services, middleware, models).
- `/tests`: Jest specs for unit and integration testing.
