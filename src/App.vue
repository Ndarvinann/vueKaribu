<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title class="text-white font-weight-bold">KGL - Karibu Groceries LTD</v-app-bar-title>
      <template v-slot:append>
        <v-btn v-if="isLoggedIn" @click="logout" variant="text" class="text-white">
          Logout
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="bg-light-gray">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
.bg-light-gray {
  background-color: var(--light-gray) !important;
}
</style>