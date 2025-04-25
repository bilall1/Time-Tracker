# Time Tracker

A modern time tracking application built with React, Node.js, and Docker.

## Features

- Track time spent on different tasks
- User-friendly interface
- Real-time updates
- Docker containerization for easy deployment
- RESTful API backend

## Project Structure

```
Time-Tracker/
├── client/           # Frontend React application
├── server/           # Backend Node.js application
├── docker-compose.yml # Docker Compose configuration
└── README.md         # Project documentation
```

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd Time-Tracker
   ```

2. Start the application:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Local Development

1. Start the backend server:
   ```bash
   cd server
   npm install
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm install
   npm start
   ```
