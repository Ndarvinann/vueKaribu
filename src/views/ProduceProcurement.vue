<template>
  <div>
    <h1 class="text-h4 mb-6">Produce Procurement</h1>

    <v-card class="mb-6">
      <v-card-title>Add New Produce</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.name"
                label="Produce Name"
                :rules="[v => !!v || 'Name is required', v => /^[a-zA-Z0-9\s]+$/.test(v) || 'Only alphanumeric characters allowed']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.type"
                label="Produce Type"
                :rules="[v => !!v || 'Type is required', v => /^[a-zA-Z]{2,}$/.test(v) || 'Only alphabets, minimum 2 characters']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.tonnage"
                label="Tonnage (kg)"
                type="number"
                :rules="[v => !!v || 'Tonnage is required', v => v >= 1000 || 'Minimum 1000kg required']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.costPerKg"
                label="Cost per Kg (UGX)"
                type="number"
                :rules="[v => !!v || 'Cost is required', v => v >= 100 || 'Minimum 100 UGX required']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.sellingPricePerKg"
                label="Selling Price per Kg (UGX)"
                type="number"
                :rules="[v => !!v || 'Selling price is required', v => v >= 100 || 'Minimum 100 UGX required']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.dealer.name"
                label="Dealer Name"
                :rules="[v => !!v || 'Dealer name is required', v => v.length >= 2 || 'Minimum 2 characters required']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.dealer.contact"
                label="Dealer Contact"
                :rules="[v => !!v || 'Contact is required', v => /^[0-9]{10}$/.test(v) || 'Enter valid phone number']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="d-flex justify-end mt-4">
            <v-btn
              color="primary"
              type="submit"
              :loading="loading"
            >
              Record Procurement
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Recent Procurements</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="procurements"
          :loading="loading"
        >
          <template v-slot:item.totalCost="{ item }">
            {{ formatCurrency(item.totalCost) }}
          </template>
          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const form = ref(null)
const loading = ref(false)
const procurements = ref([])

const formData = ref({
  name: '',
  type: '',
  tonnage: null,
  costPerKg: null,
  sellingPricePerKg: null,
  dealer: {
    name: '',
    contact: ''
  }
})

const headers = [
  { title: 'Produce Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Tonnage (kg)', key: 'tonnage' },
  { title: 'Total Cost', key: 'totalCost' },
  { title: 'Dealer', key: 'dealer.name' },
  { title: 'Date', key: 'createdAt' }
]

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX'
  }).format(value)
}

const formatDate = (date) => {
  return format(new Date(date), 'PPpp')
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  try {
    loading.value = true
    const response = await axios.post('/api/procurement', formData.value, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    procurements.value.unshift(response.data)
    form.value.reset()
  } catch (error) {
    console.error('Failed to record procurement:', error)
  } finally {
    loading.value = false
  }
}

const fetchProcurements = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/procurement', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    procurements.value = response.data
  } catch (error) {
    console.error('Failed to fetch procurements:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProcurements()
})
</script>