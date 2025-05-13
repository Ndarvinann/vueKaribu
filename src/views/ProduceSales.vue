<template>
  <div>
    <h1 class="text-h4 mb-6">Record Sale</h1>

    <v-card class="mb-6">
      <v-card-title>New Sale</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.produce"
                :items="produce"
                item-title="name"
                item-value="_id"
                label="Select Produce"
                :rules="[v => !!v || 'Please select a produce']"
                required
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.tonnage"
                label="Tonnage (kg)"
                type="number"
                :rules="[
                  v => !!v || 'Tonnage is required',
                  v => v > 0 || 'Tonnage must be greater than 0',
                  v => v <= selectedProduce.tonnage || 'Insufficient stock'
                ]"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.amountPaid"
                label="Amount Paid (UGX)"
                type="number"
                :rules="[v => !!v || 'Amount is required', v => v >= 10000 || 'Minimum amount is 10,000 UGX']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.buyer.name"
                label="Buyer Name"
                :rules="[v => !!v || 'Buyer name is required', v => v.length >= 2 || 'Minimum 2 characters required']"
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
              Record Sale
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Recent Sales</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="sales"
          :loading="loading"
        >
          <template v-slot:item.amountPaid="{ item }">
            {{ formatCurrency(item.amountPaid) }}
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
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const form = ref(null)
const loading = ref(false)
const sales = ref([])
const produce = ref([])

const formData = ref({
  produce: null,
  tonnage: null,
  amountPaid: null,
  buyer: {
    name: ''
  }
})

const headers = [
  { title: 'Produce', key: 'produce.name' },
  { title: 'Tonnage (kg)', key: 'tonnage' },
  { title: 'Amount Paid', key: 'amountPaid' },
  { title: 'Buyer', key: 'buyer.name' },
  { title: 'Date', key: 'createdAt' }
]

const selectedProduce = computed(() => {
  return produce.value.find(p => p._id === formData.value.produce) || {}
})

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
    const response = await axios.post('/api/sales', formData.value, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    sales.value.unshift(response.data)
    form.value.reset()
    await fetchProduce() // Refresh produce list to get updated stock
  } catch (error) {
    console.error('Failed to record sale:', error)
  } finally {
    loading.value = false
  }
}

const fetchSales = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/sales', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    sales.value = response.data
  } catch (error) {
    console.error('Failed to fetch sales:', error)
  } finally {
    loading.value = false
  }
}

const fetchProduce = async () => {
  try {
    const response = await axios.get('/api/produce', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    produce.value = response.data
  } catch (error) {
    console.error('Failed to fetch produce:', error)
  }
}

onMounted(() => {
  fetchSales()
  fetchProduce()
})
</script>