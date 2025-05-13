<template>
  <div>
    <h1 class="text-h4 mb-6">Credit Sales</h1>

    <v-card class="mb-6">
      <v-card-title>New Credit Sale</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.buyer.name"
                label="Buyer Name"
                :rules="[v => !!v || 'Name is required', v => v.length >= 2 || 'Minimum 2 characters required']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.buyer.nationalId"
                label="National ID"
                :rules="[v => !!v || 'National ID is required', v => /^CM[A-Z0-9]{12}$/.test(v) || 'Invalid NIN format']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.buyer.location"
                label="Location"
                :rules="[v => !!v || 'Location is required', v => v.length >= 2 || 'Minimum 2 characters required']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.buyer.contact"
                label="Contact"
                :rules="[v => !!v || 'Contact is required', v => /^[0-9]{10}$/.test(v) || 'Invalid phone number format']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

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
                v-model.number="formData.amountDue"
                label="Amount Due (UGX)"
                type="number"
                :rules="[v => !!v || 'Amount is required', v => v >= 10000 || 'Minimum amount is 10,000 UGX']"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.dueDate"
                label="Due Date"
                type="date"
                :rules="[v => !!v || 'Due date is required']"
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
              Record Credit Sale
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Credit Sales</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="creditSales"
          :loading="loading"
        >
          <template v-slot:item.amountDue="{ item }">
            {{ formatCurrency(item.amountDue) }}
          </template>
          <template v-slot:item.dueDate="{ item }">
            {{ formatDate(item.dueDate) }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              :text="item.status"
            ></v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="item.status !== 'paid'"
              color="primary"
              size="small"
              @click="openPaymentDialog(item)"
            >
              Record Payment
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="paymentDialog" max-width="500px">
      <v-card>
        <v-card-title>Record Payment</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handlePayment" ref="paymentForm">
            <v-text-field
              v-model.number="paymentAmount"
              label="Payment Amount (UGX)"
              type="number"
              :rules="[v => !!v || 'Amount is required', v => v > 0 || 'Amount must be greater than 0']"
              required
              variant="outlined"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="paymentDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="handlePayment" :loading="loading">
            Submit Payment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const form = ref(null)
const paymentForm = ref(null)
const loading = ref(false)
const creditSales = ref([])
const produce = ref([])
const paymentDialog = ref(false)
const paymentAmount = ref(null)
const selectedCreditSale = ref(null)

const formData = ref({
  buyer: {
    name: '',
    nationalId: '',
    location: '',
    contact: ''
  },
  produce: null,
  tonnage: null,
  amountDue: null,
  dueDate: null
})

const headers = [
  { title: 'Buyer', key: 'buyer.name' },
  { title: 'Produce', key: 'produce.name' },
  { title: 'Tonnage (kg)', key: 'tonnage' },
  { title: 'Amount Due', key: 'amountDue' },
  { title: 'Due Date', key: 'dueDate' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions' }
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
  return format(new Date(date), 'PP')
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    partial: 'info',
    paid: 'success'
  }
  return colors[status] || 'default'
}

const openPaymentDialog = (creditSale) => {
  selectedCreditSale.value = creditSale
  paymentDialog.value = true
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  try {
    loading.value = true
    const response = await axios.post('/api/credit', formData.value, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    creditSales.value.unshift(response.data)
    form.value.reset()
    await fetchProduce() // Refresh produce list to get updated stock
  } catch (error) {
    console.error('Failed to record credit sale:', error)
  } finally {
    loading.value = false
  }
}

const handlePayment = async () => {
  const { valid } = await paymentForm.value.validate()
  
  if (!valid) return

  try {
    loading.value = true
    const response = await axios.post(`/api/credit/${selectedCreditSale.value._id}/payment`, {
      amount: paymentAmount.value
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    const index = creditSales.value.findIndex(cs => cs._id === selectedCreditSale.value._id)
    if (index !== -1) {
      creditSales.value[index] = response.data
    }
    
    paymentDialog.value = false
    paymentAmount.value = null
    selectedCreditSale.value = null
  } catch (error) {
    console.error('Failed to record payment:', error)
  } finally {
    loading.value = false
  }
}

const fetchCreditSales = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/credit', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    creditSales.value = response.data
  } catch (error) {
    console.error('Failed to fetch credit sales:', error)
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
  fetchCreditSales()
  fetchProduce()
})
</script>