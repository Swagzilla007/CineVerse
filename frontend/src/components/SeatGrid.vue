<template>
  <div class="seat-container">
    <h3>Select Your Seats</h3>
    <div class="screen">Screen</div>
    <div class="seat-grid">
      <div v-for="row in rows" :key="row" class="seat-row">
        <span class="row-label">{{ row }}</span>
        <div
          v-for="seat in seatsInRow(row)"
          :key="seat.id"
          class="seat"
          :class="{
            selected: isSelected(seat.id),
            booked: seat.status === 'booked',
            available: seat.status === 'available',
          }"
          @click="handleSeatClick(seat)"
        >
          {{ seat.number }}
        </div>
      </div>
    </div>
    <div class="legend">
      <div><span class="seat available"></span> Available</div>
      <div><span class="seat selected"></span> Selected</div>
      <div><span class="seat booked"></span> Booked</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    screeningId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      seats: [],
      selectedSeats: [],
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    };
  },
  mounted() {
    this.fetchSeats();
  },
  methods: {
    async fetchSeats() {
      try {
        const response = await axios.get(
          `/api/screenings/${this.screeningId}/seats`
        );
        this.seats = response.data;
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    },
    seatsInRow(row) {
      return this.seats.filter((seat) => seat.row === row);
    },
    handleSeatClick(seat) {
      if (seat.status === "booked") {
        return;
      }

      const index = this.selectedSeats.indexOf(seat.id);
      if (index === -1) {
        this.selectedSeats.push(seat.id);
      } else {
        this.selectedSeats.splice(index, 1);
      }
      this.$emit("seats-selected", this.selectedSeats);
    },
    isSelected(seatId) {
      return this.selectedSeats.includes(seatId);
    },
  },
};
</script>

<style scoped>
.seat-container {
  padding: 20px;
  text-align: center;
}

.screen {
  background: #777;
  color: white;
  padding: 10px;
  margin: 20px auto;
  width: 80%;
  text-align: center;
  border-radius: 5px;
}

.seat-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin: 20px 0;
}

.seat-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.row-label {
  width: 20px;
}

.seat {
  width: 35px;
  height: 35px;
  margin: 3px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.seat.available {
  background-color: #e0e0e0;
  color: #333;
}

.seat.available:hover {
  background-color: #4caf50;
  color: white;
  transform: scale(1.05);
}

.seat.selected {
  background-color: #4caf50;
  color: white;
}

.seat.booked {
  background-color: #ff4444;
  color: white;
  cursor: not-allowed;
  opacity: 0.8;
}

.seat.booked:hover {
  transform: none;
  opacity: 0.8;
}

.seat.booked:hover {
  transform: none;
}

.seat:not(.booked):hover {
  background-color: #e0e0e0;
}

.seat.selected:not(.booked) {
  background-color: #4caf50;
  color: white;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.legend div {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
