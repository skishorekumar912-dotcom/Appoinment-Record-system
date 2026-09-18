# Appointment Record System

A simple full-stack web application for managing appointment records.  
This project is developed as part of my internship task to practice CRUD operations, REST API development, database integration, and frontend-backend communication.

## Tech Stack

- Frontend: React.js with Vite
- Backend: Node.js with Express.js
- Database: MySQL
- API: REST API
- Version Control: Git & GitHub

## Features

- Add a new appointment
- View all appointment records
- View an individual appointment
- Edit appointment details
- Delete an appointment
- Change appointment status between PENDING and CONFIRMED
- Form validation for required fields
- MySQL database integration

## Appointment Details

Each appointment contains:

- Name
- Email
- Phone
- Appointment Date
- Reason
- Status

New appointments are created with `PENDING` status by default.

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/appointments` | Create a new appointment |
| GET | `/appointments` | Get all appointments |
| GET | `/appointments/:id` | Get an appointment by ID |
| PUT | `/appointments/:id` | Update an appointment |
| DELETE | `/appointments/:id` | Delete an appointment |
| PATCH | `/appointments/:id/status` | Change appointment status |

## Project Structure

```text
appointment-record-system/
├── frontend/       # React frontend
├── backend/        # Node.js and Express backend
├── .gitignore
└── README.md
```

## Current Progress

- Project structure initialized
- React frontend configured
- Node.js and Express backend configured
- MySQL database and appointments table created
- Backend connected successfully with MySQL
- Git repository initialized
- Project pushed to GitHub

## Next Steps

- Complete and test CRUD REST APIs
- Develop the appointment entry page
- Develop the appointment list page
- Integrate React frontend with backend APIs
- Add edit, delete, and status update functionality
- Perform final testing and UI improvements

## Purpose

The main purpose of this project is to demonstrate a basic full-stack CRUD application using React, Node.js, Express, MySQL, and REST APIs.
