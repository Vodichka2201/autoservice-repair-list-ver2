<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-4">
            <router-link to="/">
              <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1_14)">
                  <rect x="9" y="8" width="28" height="29" fill="#EA1111" />
                  <path
                    d="M27 13C26.7533 13.255 26.4316 13.6042 25.1179 15.0352C23.9172 16.3431 21.671 18.8635 20.4108 20.2846C19.1506 21.7058 18.947 21.954 18.8166 22.1245C18.5294 22.5 18 22.8122 18 22.8755C18 23.2966 18.3916 23.3348 18.5294 23.5C18.6672 23.6652 18.5294 23.5 20.1177 25C21.5055 26.3108 23.9172 28.6569 25.1179 29.9648C26.4316 31.3958 26.7533 31.745 27 32"
                    stroke="white" stroke-width="5" stroke-linecap="round" />
                </g>
                <defs>
                  <clipPath id="clip0_1_14">
                    <rect width="45" height="45" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </router-link>
          </div>

          <!-- Центрированное меню -->
          <div class="hidden md:flex flex-1 justify-center">
            <div class="flex space-x-2">

              <router-link to="/settings"
                class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
                Настройки
              </router-link>
              <router-link to="/dashboard"
                class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
                Дашборд
              </router-link>
              <router-link to="/clients"
                class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
                Клиенты
              </router-link>
              <router-link to="/cars"
                class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
                Автомобили
              </router-link>
              <router-link to="/orders"
                class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
                Заказы
              </router-link>
              <router-link to="/repair-monitor"
                class="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
                Ремонт
              </router-link>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Theme toggle -->
            <button @click="toggleTheme" aria-label="Toggle Dark Mode"
              class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07 6.07l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 5a7 7 0 000 14 7 7 0 000-14z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800 dark:text-gray-200"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>

            <!-- Mobile menu button -->
            <button @click="toggleMobileMenu" aria-label="Toggle Menu"
              class="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 dark:text-gray-300"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white dark:bg-gray-800 px-4 pt-2 pb-3 space-y-1">

        <router-link @click="closeMobileMenu" to="/settings"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
          Настройки
        </router-link>
        <router-link @click="closeMobileMenu" to="/dashboard"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
          Дашборд
        </router-link>
        <router-link @click="closeMobileMenu" to="/clients"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
          Клиенты
        </router-link>
        <router-link @click="closeMobileMenu" to="/cars"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
          Автомобили
        </router-link>
        <router-link @click="closeMobileMenu" to="/orders"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
          Заказы
        </router-link>
        <router-link @click="closeMobileMenu" to="/repair-monitor"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
          Ремонт
        </router-link>
      </div>
    </nav>

    <main class="flex-grow bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto">
        <router-view>

        </router-view>
      </div>
    </main>

    <footer class="bg-white dark:bg-gray-800 shadow">
      <div class="w-full mx-auto max-w-screen-xl p-4 text-center">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Ti-ROBOTS © {{ new Date().getFullYear() }} <a href="https://t.me/ti_robots_lab" target="_blank"
            class="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
            Поддержка в Telegram
          </a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const isDark = ref(false);
    const mobileMenuOpen = ref(false);


    // Load theme from localStorage or system preference
    onMounted(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark.value = savedTheme === 'dark';
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      updateTheme();
    });

    // Watch and update theme class on html element
    watch(isDark, (newVal) => {
      updateTheme();
      localStorage.setItem('theme', newVal ? 'dark' : 'light');
    });

    function updateTheme() {
      if (isDark.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    function toggleTheme() {
      isDark.value = !isDark.value;
    }

    function toggleMobileMenu() {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    }

    function closeMobileMenu() {
      mobileMenuOpen.value = false;
    }

    return {
      isDark,
      mobileMenuOpen,
      toggleTheme,
      toggleMobileMenu,
      closeMobileMenu
    };
  },
};
</script>

<style>
/* Dark mode styles */
:root {
  --primary-color: #f0b90b;
  --text-color: rgba(0, 0, 0, 0.85);
  --bg-color: #fff;
}

:root.dark {
  --primary-color: #f0b90b;
  --text-color: rgba(255, 255, 255, 0.85);
  --bg-color: #141414;
}

body {
  color: var(--text-color);
  background-color: var(--bg-color);
}

/* Ensure mobile menu stays above overlay */
#mobile-menu {
  position: relative;
  z-index: 20;
}
</style>
