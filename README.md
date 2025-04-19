# CineVerse - Movie Booking Platform

A modern web application for movie ticket booking and cinema management.

## Features

### For Users

- Browse currently showing movies
- View upcoming movie releases
- Book movie tickets
- Select seats
- View booking history
- User authentication
- View movie details and trailers

### For Admins

- Manage movies (add, edit, delete)
- Manage screenings
- Handle bookings
- Theatre management
- User management

## Tech Stack

### Frontend

- React.js
- Chakra UI
- React Router
- Axios
- Context API for state management
- Tailwind CSS

### Backend

- Laravel/PHP
- MySQL Database
- RESTful API
- JWT Authentication

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/yourusername/CineVerse.git
cd CineVerse
```

2. Install Frontend Dependencies:

```bash
cd frontend
npm install
```

3. Install Backend Dependencies:

```bash
cd backend
composer install
```

4. Database Setup:

- Create a MySQL database named 'cineverse'
- Import the SQL file from `backend/database/cineverse.sql`
- Configure database credentials in `backend/config/database.php`

5. Start Development Servers:

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
# Ensure XAMPP is running (Apache & MySQL)
# Place the project in htdocs directory
```

6. Access the application:

- Frontend: http://localhost:5173
- Backend API: http://localhost/CineVerse/backend/api

## Environment Setup

### Frontend (.env)

```
VITE_API_URL=http://localhost/CineVerse/backend/api
```

### Backend (.env)

```
DB_HOST=localhost
DB_NAME=cineverse
DB_USER=root
DB_PASS=
JWT_SECRET=your_jwt_secret_key
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
