## Backend - Task Management API

Deploy: [https://dev-pro-back.vercel.app/]

Project Overview

- This is the backend for the Task Management web application. It provides a RESTful API built with Node.js, Express, and TypeScript. The API includes authentication, task management routes, and input validation using Zod.

Prerequisites

- Node.js (v16 or later)

- npm or yarn (latest version)

- MongoDB (local or cloud, e.g., MongoDB Atlas)

- Auth0 credentials for authentication

Setup Instructions

- Clone the Repository
```bash
git clone <backend-repo-url>
cd <backend-repo-folder>
```
- Install Dependencies
```bash
npm install
or
yarn install
```
- Configure Environment Variables

 Create a .env file in the root directory and add the following variables:
```bash
MONGO_URL= 
AUTH0_SECRET = 
AUTH0_BASE_URL=
AUTH0_CLIENT_ID =  
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_SECRET = 
NEXT_PUBLIC_API_BACKEND = 
```

Run the Application

- Start the development server:
```bash
npm run dev
or
yarn dev
```
The API will be accessible at http://localhost:4000.

API Endpoints

- POST /tasks/createTasks - Create a new task

- GET /tasks/getAllTasks - Retrieve all tasks for the authenticated user

- GET /tasks/getTask/:id - Retrieve a specific task by ID

- PUT /tasks/editTasks/:description - Update a task by description

- DELETE /tasks/deleteTask/:id - Delete a task by ID

Deployment: Deploy to Vercel

- Configure the same environment variables in your hosting platform as listed in the .env file.

- Test the live API endpoints.

Testing

- Run unit tests:
```bash
npm run test
# or
yarn test
```
- Verify task creation functionality with expected data responses.

