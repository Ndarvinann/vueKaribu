<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title class="text-center text-h5 mb-4">
            Login to KGL System
          </v-card-title>

          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              :error-messages="emailErrors"
              required
              variant="outlined"
              ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              :error-messages="passwordErrors"
              required
              variant="outlined"
              ></v-text-field>

            <v-select
              v-model="branch"
              label="Branch"
              :items="branches"
              variant="outlined"
              required
            ></v-select>

            <div class="d-flex justify-center mt-4">
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                block
              >
                Login
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema
})

const { value: email, errorMessage: emailErrors } = useField('email')
const { value: password, errorMessage: passwordErrors } = useField('password')
const branch = ref('')

const branches = ['Maganjo', 'Matugga']

// REMOVED const resetErrors = () => {
//   emailErrors.value = ''
//   passwordErrors.value = ''
// }

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    await authStore.login({
      email: values.email,
      password: values.password,
      branch: branch.value
    })
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.v-card {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>