import { FaTicketAlt } from 'react-icons/fa';
// ...existing imports...

const AdminLayout = () => {
  // ...existing code...
  
  const navItems = [
    // ...existing items...
    {
      label: 'Bookings',
      icon: FaTicketAlt, // Add this import if not already present
      path: '/admin/bookings'
    },
  ];

  // ...rest of the component...
};