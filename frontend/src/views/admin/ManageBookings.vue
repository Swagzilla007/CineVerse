<template>
  <div class="manage-bookings">
    <h2>Manage Bookings</h2>
    <div class="bookings-list">
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Movie</th>
            <th>Show Time</th>
            <th>Seat</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            <td>{{ booking.booking_number }}</td>
            <td>{{ booking.user?.name }}</td>
            <td>{{ booking.screening?.movie?.title }}</td>
            <td>{{ formatDate(booking.screening?.screening_time) }}</td>
            <td>{{ booking.seat?.row }}{{ booking.seat?.number }}</td>
            <td>LKR {{ booking.total_amount }}</td>
            <td>
              <span :class="['status', booking.status]">{{
                booking.status
              }}</span>
            </td>
            <td>
              <select
                v-model="booking.status"
                @change="updateStatus(booking.id, booking.status)"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { formatDate } from "@/utils/dateFormatter";

export default {
  name: "ManageBookings",
  data() {
    return {
      bookings: [],
    };
  },
  methods: {
    formatDate,
    async fetchBookings() {
      try {
        const response = await axios.get("/api/admin/bookings");
        this.bookings = response.data.bookings;
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    },
    async updateStatus(bookingId, newStatus) {
      try {
        await axios.put(`/api/admin/bookings/${bookingId}/status`, {
          status: newStatus,
        });
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    },
  },
  mounted() {
    this.fetchBookings();
  },
};
</script>

<style scoped>
.manage-bookings {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.pending {
  background-color: #ffd700;
  color: #000;
}

.confirmed {
  background-color: #4caf50;
  color: white;
}

.cancelled {
  background-color: #f44336;
  color: white;
}

select {
  padding: 6px;
  border-radius: 4px;
}
</style>
