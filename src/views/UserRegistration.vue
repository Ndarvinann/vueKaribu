<template>
    <div>
      <h1 class="text-h4 mb-6">Register New User</h1>
  
      <v-card class="mb-6">
        <v-card-title>New User Registration</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSubmit" ref="form">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name"
                  label="Full Name"
                  :rules="[v => !!v || 'Name is required', v => v.length >= 2 || 'Minimum 2 characters required']"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Invalid email format']"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
  
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.password"
                  label="Password"
                  type="password"
                  :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Minimum 6 characters required']"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
  
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.role"
                  :items="roles"
                  label="Role"
                  :rules="[v => !!v || 'Role is required']"
                  required
                  variant="outlined"
                ></v-select>
              </v-col>
  
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.branch"
                  :items="branches"
                  label="Branch"
                  :rules="[v => !!v || 'Branch is required']"
                  required
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
  
            <div class="d-flex justify-end mt-4">
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
              >
                Register User
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
  
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useAuthStore } from '../stores/auth'
  
  const authStore = useAuthStore()
  const form = ref(null)
  const loading = ref(false)
  
  const formData = ref({
    name: '',
    email: '',
    password: '',
    role: '',
    branch: authStore.user?.branch || ''
  })
  
  const roles = ['manager', 'sales_agent']
  const branches = ['Maganjo', 'Matugga']
  
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
  })
  
  const handleSubmit = async () => {
    const { valid } = await form.value.validate()
    
    if (!valid) return
  
    try {
      loading.value = true
      await axios.post('/api/auth/register', formData.value, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      snackbar.value = {
        show: true,
        message: 'User registered successfully',
        color: 'success'
      }
      form.value.reset()
    } catch (error) {
      snackbar.value = {
        show: true,
        message: error.response?.data?.message || 'Failed to register user',
        color: 'error'
      }
    } finally {
      loading.value = false
    }
  }
  </script>