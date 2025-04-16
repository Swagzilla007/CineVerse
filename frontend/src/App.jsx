import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Main Pages
import Home from './pages/Home'
import MovieDetails from './pages/movies/MovieDetails'
import BookingPage from './pages/booking/BookingPage'
import MyBookings from './pages/booking/MyBookings'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageMovies from './pages/admin/ManageMovies'
import ManageScreenings from './pages/admin/ManageScreenings'
import ManageTheatres from './pages/admin/ManageTheatres'

function App() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          
          {/* Protected Routes */}
          <Route
            path="/booking/:screeningId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/movies"
            element={
              <ProtectedRoute requireAdmin>
                <ManageMovies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/screenings"
            element={
              <ProtectedRoute requireAdmin>
                <ManageScreenings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/theatres"
            element={
              <ProtectedRoute requireAdmin>
                <ManageTheatres />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App
