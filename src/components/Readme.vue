<template>
  <div class="container my-5">
    <h1 class="page-title mb-5">Vue.js Project Setup Guide</h1>
    
    <div class="step-card">
      <h3><span class="step-number">1</span>Project Overview</h3>
      <p>
        This project is built with Vue 3, using the Composition API and the latest features. 
        The project includes:
      </p>
      <ul>
        <li>Vue 3 with Composition API</li>
        <li>Vue Router for navigation</li>
        <li>Bootstrap 5 for styling</li>
        <li>Custom green, yellow, and white color scheme</li>
        <li>Responsive design that works on all devices</li>
      </ul>
    </div>

    <div class="step-card">
      <h3><span class="step-number">2</span>Environment Setup</h3>
      <p>
        Before you start working with Vue.js, you need to set up your development environment:
      </p>
      <div class="code-block">
        <pre><code># Make sure you have Node.js installed (v16.0 or higher recommended)
node -v

# Install Vue CLI globally (if you haven't already)
npm install -g @vue/cli</code></pre>
      </div>
    </div>

    <div class="step-card">
      <h3><span class="step-number">3</span>Creating a New Vue Project</h3>
      <p>
        If you want to create a new Vue project from scratch:
      </p>
      <div class="code-block">
        <pre><code># Using Vue CLI
vue create my-project

# Or using npm init
npm init vue@latest

# Or using Vite (recommended)
npm create vite@latest my-project -- --template vue</code></pre>
      </div>
      <p>
        Follow the prompts to configure your project with your desired options.
      </p>
    </div>

    <div class="step-card">
      <h3><span class="step-number">4</span>Project Structure</h3>
      <p>
        A typical Vue.js project structure looks like this:
      </p>
      <div class="code-block">
        <pre><code>my-project/
├── public/              # Static assets (copied to dist as-is)
├── src/                 # Source files
│   ├── assets/          # Assets processed by build tool
│   ├── components/      # Vue components
│   ├── router/          # Vue Router configuration
│   ├── views/           # Page components
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Build configuration</code></pre>
      </div>
    </div>

    <div class="step-card">
      <h3><span class="step-number">5</span>Installing Dependencies</h3>
      <p>
        In this project, we've included Bootstrap for styling. Here's how you can add dependencies to your project:
      </p>
      <div class="code-block">
        <pre><code># Install Bootstrap and Vue Router
npm install bootstrap vue-router</code></pre>
      </div>
      <p>
        These dependencies are already included in this project's package.json.
      </p>
    </div>

    <div class="step-card">
      <h3><span class="step-number">6</span>Integrating Bootstrap with Vue</h3>
      <p>
        To use Bootstrap in your Vue project, import it in your main.js file:
      </p>
      <div class="code-block">
        <pre><code>// In main.js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'  // Optional, for Bootstrap JS components</code></pre>
      </div>
      <p>
        You can also import only the specific Bootstrap components you need to optimize bundle size.
      </p>
    </div>

    <div class="step-card">
      <h3><span class="step-number">7</span>Setting Up Vue Router</h3>
      <p>
        To handle navigation in your app, set up Vue Router:
      </p>
      <div class="code-block">
        <pre><code>// In main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import About from './components/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')</code></pre>
      </div>
    </div>

    <div class="step-card">
      <h3><span class="step-number">8</span>Creating Vue Components</h3>
      <p>
        Vue components are the building blocks of your application. Here's a basic component structure:
      </p>
      <div class="code-block">
        <pre><code>&lt;script setup&gt;
import { ref, onMounted } from 'vue'

// State
const count = ref(0)

// Methods
function increment() {
  count.value++
}

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
&lt;/script&gt;

&lt;template&gt;
  &lt;div class="component"&gt;
    &lt;p&gt;Count: {{ count }}&lt;/p&gt;
    &lt;button @click="increment"&gt;Increment&lt;/button&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;style scoped&gt;
.component {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
&lt;/style&gt;</code></pre>
      </div>
    </div>

    <div class="step-card">
      <h3><span class="step-number">9</span>Custom Theme Implementation</h3>
      <p>
        In this project, we've implemented a custom green, yellow, and white color scheme. Here's how:
      </p>
      <ol>
        <li>Define CSS variables in your style.css file:</li>
      </ol>
      <div class="code-block">
        <pre><code>:root {
  --primary: #2e8b57;     /* Sea Green */
  --primary-light: #3cb371; /* Medium Sea Green */
  --primary-dark: #1d6b45;  /* Darker Green */
  --accent: #ffd700;      /* Gold */
  --accent-light: #ffeb99; /* Light Yellow */
  --accent-dark: #cca800;  /* Darker Yellow */
  --white: #ffffff;
}</code></pre>
      </div>
      <ol start="2">
        <li>Override Bootstrap's default classes or create your own classes that use these variables.</li>
      </ol>
    </div>

    <div class="step-card">
      <h3><span class="step-number">10</span>Building and Deploying</h3>
      <p>
        When you're ready to deploy your Vue.js application:
      </p>
      <div class="code-block">
        <pre><code># Build for production
npm run build

# The built files will be in the dist/ directory
# You can deploy these files to any static hosting service like:
# - Netlify
# - Vercel
# - GitHub Pages
# - AWS S3
# - etc.</code></pre>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">Additional Resources</h3>
            <ul class="list-unstyled">
              <li class="mb-2">
                <a href="https://vuejs.org/guide/introduction.html" target="_blank" class="text-decoration-none">
                  Official Vue.js Guide
                </a>
              </li>
              <li class="mb-2">
                <a href="https://router.vuejs.org/" target="_blank" class="text-decoration-none">
                  Vue Router Documentation
                </a>
              </li>
              <li class="mb-2">
                <a href="https://getbootstrap.com/docs/5.3/getting-started/introduction/" target="_blank" class="text-decoration-none">
                  Bootstrap Documentation
                </a>
              </li>
              <li class="mb-2">
                <a href="https://vitejs.dev/guide/" target="_blank" class="text-decoration-none">
                  Vite Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="card h-100 primary-bg">
          <div class="card-body">
            <h3 class="card-title text-white">Need Help?</h3>
            <p class="card-text text-white">
              If you run into any issues or have questions, check out these community resources:
            </p>
            <ul class="list-unstyled text-white">
              <li class="mb-2">📌 Vue.js Discord Server</li>
              <li class="mb-2">📌 Vue Forum</li>
              <li class="mb-2">📌 Stack Overflow</li>
              <li class="mb-2">📌 GitHub Issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  font-size: 0.9rem;
}

h3 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.card-title {
  position: relative;
  padding-bottom: 0.75rem;
}

.card-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 60px;
  background-color: var(--accent);
  border-radius: 2px;
}

.primary-bg .card-title::after {
  background-color: var(--white);
}
</style>