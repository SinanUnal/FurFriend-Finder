# FurFriend Animal-Adoption-App

## Description

This project is an animal adoption platform that connects animal givers with potential adopters. It includes functionality for user registration and authentication, animal submission, adoption application management, and real-time messaging between users. The platform is built using React for the frontend and Express.js along with MongoDB for the backend.

## Features

- User authentication and authorization
- Admin and user dashboards
- Animal listing and submission
- Adoption application management
- Real-time chat functionality
- Responsive design for various devices

## Tech Stack

- **Frontend:** React, Material-UI, React Router
- **Backend:** Node.js, Express.js, MongoDB
- **Other Tools:** Firebase for storage, Socket.IO for real-time communication, bcrypt for password hashing, JWT for authentication

## Setup and Installation

1. **Clone the repository**

   ```
   git clone [git@github.com:SinanUnal/FurFriend-Finder.git]
   ```

2. **Install Dependencies**

   Navigate to both the frontend and backend directories in separate terminal windows and install the necessary packages using npm.

   For frontend:

   ```
   cd client-side
   npm install
   ```

   For backend:

   ```
   cd server-side
   npm install
   ```

3. **Running the Application**

   In the frontend directory:

   ```
   npm start
   ```

   In the backend directory:

   ```
   npm start
   ```

   The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Project Structure

### Frontend

- `src/components` - Contains React components for various parts of the application.
- `src/utils` - Utility functions and axios setup for API calls.
- `src/firebase` - Firebase configuration for storage.
- `src/Routes` - Routing setup for the application.

### Backend

- `models` - MongoDB models for Users, Admins, Submissions, etc.
- `Routes` - Express routes for handling API requests.
- `middleware` - Custom middleware for authentication and other purposes.

## API Endpoints

### User Endpoints

- `POST /signup` - Register a new user.
- `GET /user/:userId` - Retrieve a user by their ID.
- `PATCH /user/profile/:userId` - Update a user's profile.

### Admin Endpoints

- `POST /signup/admin` - Register a new admin.
- `GET /admin/approvals` - Retrieve all pending submissions.
- `POST /admin/approve/:submissionId` - Approve a submission.
- `POST /admin/reject/:submissionId` - Reject a submission.

### Giver Dashboard Endpoints

- `GET /giverDashboard/:userId` - Retrieve giver dashboard information.
- `POST /giverDashboard/submissions` - Submit a new animal for adoption.
- `GET /giverDashboard/currentListings/:userId` - Retrieve all active listings for a giver.

### Adopter Dashboard Endpoints

- `GET /adopterDashboard/animals` - Retrieve all active animals for adoption.
- `GET /adopterDashboard/applications/:adopterId` - Retrieve all applications made by an adopter.

### Adoption Application Endpoints

- `POST /submitApplication` - Submit an adoption application.

### Message Endpoints

- `GET /messages/:adopterId/:giverId` - Retrieve messages between adopter and giver.

## Contributing

We welcome contributions to this project! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.
