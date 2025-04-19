import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyBookings from '../pages/MyBookings';
import AdminDashboard from '../pages/AdminDashboard';
import Movies from '../pages/Movies';
import Screenings from '../pages/Screenings';
import Theatres from '../pages/Theatres';
import UpcomingMovies from '../pages/UpcomingMovies';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<Movies />} />
        <Route path="/admin/screenings" element={<Screenings />} />
        <Route path="/admin/theatres" element={<Theatres />} />
        <Route path="/upcoming-movies" element={<UpcomingMovies />} />
       
      </Routes>
    </Router>
  );
};

export default AppRoutes;