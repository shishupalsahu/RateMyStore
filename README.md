# RateMyStore - A Full-Stack Store Rating Application
RateMyStore is a complete web application that allows users to register, find local stores, and submit ratings. The application features a robust backend built with Node.js and Express, a MongoDB database, and a secure authentication system. It supports three distinct user roles: Normal User, Store Owner, and System Administrator, each with their own dedicated interface and functionalities.

# Features
User Authentication: Secure user registration and login system using JSON Web Tokens (JWT). Passwords are encrypted using bcryptjs.
Role-Based Access Control: The application supports three user roles with different permissions:
Normal User: Can sign up, log in, view all stores, and submit/modify ratings (1-5 stars) for any store.
Store Owner: Can log in and view a dashboard showing their store's average rating and a list of all users who have rated their store.
System Administrator: Has a full dashboard to view system statistics (total users, stores, ratings) and manage all users and stores on the platform.
Dynamic Frontend: Three separate frontend interfaces built with HTML, Tailwind CSS, and vanilla JavaScript, tailored to each user role.
RESTful API: A well-structured backend API built with Express.js to handle all data operations.

# Tech Stack
Backend:

Framework: Node.js, Express.js
Database: MongoDB (with Mongoose ODM)
Authentication: JSON Web Tokens (JWT), bcryptjs

Frontend:

Languages: HTML, CSS, JavaScript
Styling: Tailwind CSS
Icons: Font Awesome
 
# Project Structure

RateMyStore/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env         // Your secret keys and database URI go here
│   └── index.js     // Main backend server file
│
├── frontend/
│   ├── admin/       // UI for the System Administrator
│   ├── business/    // UI for the Store Owner
│   └── user/        // UI for the Normal User
│
└── README.md        // This file

# Setup and Installation
To run this project locally, you will need two terminal windows.

1. Backend Setup
Navigate to the backend directory:
cd RateMyStore/backend
Install dependencies:

npm install

Create your .env file:
Create a file named .env in the backend folder.
Add your MongoDB connection string and a JWT secret:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000

Start the backend server:

npm run dev

The server will be running at http://localhost:5000.

# 2. Frontend Setup
Open a new terminal window.
Install the serve package globally (if you haven't already):
npm install -g serve
Navigate to the frontend directory:
cd RateMyStore/frontend
Start the frontend server:

serve

The server will be running at http://localhost:3000.

# 3. Accessing the Application
Open your web browser and go to http://localhost:3000.
You will see the main landing page, where you can choose to log in or sign up.
