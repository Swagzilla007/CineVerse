<template>
  <div class="booking-management">
    <h2>Booking Management</h2>
    <div class="booking-list">
      <div v-for="booking in bookings" :key="booking.id" class="booking-item">
        <div class="booking-info">
          <h3>Booking #{{ booking.booking_number }}</h3>
          <p>Movie: {{ booking.screening.movie.title }}</p>
          <p>User: {{ booking.user.name }}</p>
          <p>Theatre: {{ booking.screening.theatre.name }}</p>
          <p>Date: {{ formatDate(booking.screening.screening_time) }}</p>
          <p>Amount: LKR {{ booking.total_amount }}</p>
        </div>
        <div class="booking-actions">
          <select
            v-model="booking.status"
            @change="updateStatus(booking.id, booking.status)"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BookingManagement",
  data() {
    return {
      bookings: [],
    };
  },
  mounted() {
    this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      try {
        const response = await axios.get("/api/admin/bookings");
        this.bookings = response.data;
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    },
    async updateStatus(bookingId, status) {
      try {
        await axios.put(`/api/admin/bookings/${bookingId}/status`, { status });
        this.$toast.success("Booking status updated successfully");
      } catch (error) {
        console.error("Error updating booking status:", error);
        this.$toast.error("Failed to update booking status");
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
};
</script>

<style scoped>
.booking-management {
  padding: 20px;
}

.booking-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-actions select {
  padding: 8px;
  border-radius: 4px;
}

.booking-info h3 {
  margin: 0 0 10px 0;
}

.booking-info p {
  margin: 5px 0;
}
</style>
