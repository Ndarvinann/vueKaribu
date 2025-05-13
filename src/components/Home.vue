<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = ref([
  { 
    title: 'Vue Fundamentals', 
    description: 'Learn the core concepts of Vue.js 3, Composition API, reactivity, and component design patterns.',
    icon: '📚'
  },
  { 
    title: 'Bootstrap Integration', 
    description: 'See how Bootstrap 5 integrates with Vue to create beautiful responsive layouts.',
    icon: '🎨'
  },
  { 
    title: 'Vue Router', 
    description: 'Understand client-side routing and navigation with Vue Router.',
    icon: '🧭'
  },
  { 
    title: 'Custom Styling', 
    description: 'Learn to create and apply custom color schemes and themes.',
    icon: '✨'
  }
])
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section py-5 mb-5 primary-bg">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 text-white mb-3">Start Your Vue.js Journey</h1>
            <p class="lead text-white mb-4">
              A comprehensive starter project with Bootstrap styling and a custom green, yellow, and white theme.
            </p>
            <div class="d-flex gap-3">
              <button class="btn btn-light" @click="router.push('/readme')">Read Documentation</button>
              <a href="https://vuejs.org" target="_blank" class="btn btn-accent">Learn More</a>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-block text-center">
            <img src="https://vuejs.org/images/logo.png" alt="Vue Logo" width="300" class="img-fluid" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section">
      <div class="container">
        <h2 class="page-title text-center mb-5">What You'll Learn</h2>
        <div class="row">
          <div class="col-md-6 col-lg-3 mb-4" v-for="(feature, index) in features" :key="index">
            <div class="card h-100">
              <div class="card-body text-center">
                <div class="feature-icon mb-3" style="font-size: 3rem">{{ feature.icon }}</div>
                <h3 class="card-title h5">{{ feature.title }}</h3>
                <p class="card-text">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Vue Section -->
    <section class="section accent-bg py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <h2 class="page-title">Why Vue.js?</h2>
            <p class="mb-4">
              Vue.js is a progressive JavaScript framework that's easy to learn and integrates into projects gradually.
              It's perfect for building everything from simple landing pages to complex single-page applications.
            </p>
            <ul class="list-unstyled">
              <li class="mb-2">✅ Easy learning curve</li>
              <li class="mb-2">✅ Flexible integration options</li>
              <li class="mb-2">✅ Powerful Composition API</li>
              <li class="mb-2">✅ Excellent performance</li>
              <li class="mb-2">✅ Strong community support</li>
            </ul>
          </div>
          <div class="col-lg-6">
            <div class="card">
              <div class="card-body">
                <div class="code-block">
                  <pre><code>&lt;script setup&gt;
import { ref } from 'vue'

const message = ref('Hello Vue!')
const count = ref(0)

function increment() {
  count.value++
}
&lt;/script&gt;

&lt;template&gt;
  &lt;h1&gt;{{ message }}&lt;/h1&gt;
  &lt;p&gt;Count: {{ count }}&lt;/p&gt;
  &lt;button @click="increment"&gt;Increment&lt;/button&gt;
&lt;/template&gt;</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section text-center py-5">
      <div class="container">
        <h2 class="mb-4">Ready to dive deeper?</h2>
        <p class="lead mb-4">Check out our detailed documentation to learn more about Vue.js and Bootstrap.</p>
        <button class="btn btn-primary btn-lg" @click="router.push('/readme')">
          Get Started
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  background-image: linear-gradient(120deg, var(--primary), var(--primary-dark));
  border-radius: 0 0 50px 0;
}

.feature-icon {
  transition: transform 0.3s ease;
}

.card:hover .feature-icon {
  transform: scale(1.2);
}

h1, h2 {
  font-weight: 700;
}

.hero-section h1 {
  color: white;
}

.hero-section h1::after {
  background-color: var(--accent);
}
</style>