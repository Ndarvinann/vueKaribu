<template>
  <div>
    <h1 class="text-h4 mb-6">Welcome {{ user && user.name }}</h1>

    <v-row>
      <v-col cols="12" md="4" v-if="isManager">
        <v-card
          to="/users/register"
          class="dashboard-card"
          elevation="2"
        >
          <v-card-title>User Registration</v-card-title>
          <v-card-text>Register new users and manage access</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" v-if="isManager">
        <v-card
          to="/produce/procurement"
          class="dashboard-card"
          elevation="2"
        >
          <v-card-title>Produce Procurement</v-card-title>
          <v-card-text>Record new produce purchases and manage inventory</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
          to="/produce/sales"
          class="dashboard-card"
          elevation="2"
        >
          <v-card-title>Sales Recording</v-card-title>
          <v-card-text>Record new sales and view sales history</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
          to="/produce/credit"
          class="dashboard-card"
          elevation="2"
        >
          <v-card-title>Credit Sales</v-card-title>
          <v-card-text>Manage credit sales and track payments</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isManager = computed(() => authStore.isManager)
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}
</style>