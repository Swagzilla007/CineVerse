<template>
  <div class="booking-container">
    <div class="movie-info">
      <!-- ...existing movie info code... -->
    </div>

    <SeatGrid @seats-selected="updateSelectedSeats" />

    <div class="booking-summary" v-if="selectedSeats.length">
      <h3>Booking Summary</h3>
      <p>Selected Seats: {{ selectedSeats.join(", ") }}</p>
      <p>Total Price: LKR {{ totalPrice }}</p>
      <button @click="confirmBooking" class="confirm-btn">
        Confirm Booking
      </button>
    </div>
  </div>
</template>

<script>
import SeatGrid from "@/components/SeatGrid.vue";

export default {
  name: "Booking",
  components: {
    SeatGrid,
  },
  data() {
    return {
      selectedSeats: [],
      seatPrice: 1000, // This should come from your theatre data
    };
  },
  computed: {
    totalPrice() {
      return this.selectedSeats.length * this.seatPrice;
    },
  },
  methods: {
    updateSelectedSeats(seats) {
      this.selectedSeats = seats;
    },
    async confirmBooking() {
      try {
        // Add your booking API call here
        const response = await this.axios.post("/api/bookings", {
          screening_id: this.$route.params.screeningId,
          seats: this.selectedSeats,
          total_price: this.totalPrice,
        });

        this.$router.push(`/booking-confirmation/${response.data.id}`);
      } catch (error) {
        console.error("Booking failed:", error);
      }
    },
  },
};
</script>

<style scoped>
.booking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.booking-summary {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.confirm-btn:hover {
  background-color: #45a049;
}
</style>
