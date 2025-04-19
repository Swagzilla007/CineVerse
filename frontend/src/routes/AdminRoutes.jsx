import ManageBookings from '../pages/admin/ManageBookings';
// ...existing code...

const AdminRoutes = () => {
  return (
    <Routes>
      // ...existing routes...
      <Route path="/bookings" element={<ManageBookings />} />
    </Routes>
  );
};