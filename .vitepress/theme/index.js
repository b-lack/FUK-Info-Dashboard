// https://vitepress.dev/guide/custom-theme
import { h, watch, ref } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { isDark } from './composables/useGlobalTheme'

import DashboardButton from '../../components/DashboardButton.vue'

let apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w';
let url = 'https://db.forstliche-umweltkontrolle.de:8443';
let rUrl = 'http://db.forstliche-umweltkontrolle.de:7005';

// Local development
if(import.meta.env.DEV) {
  apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
  url = 'http://127.0.0.1:54321';
  rUrl = 'http://localhost:7005';
}

import './style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#3eaf7c',
          secondary: '#10B981',
          accent: '#8256D0',
          error: '#E74C3C',
          info: '#3498DB',
          warning: '#F39C12',
          success: '#2ECC71'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#3eaf7c',
          secondary: '#10B981',
          accent: '#9D7AFF',
          error: '#FF5252',
          info: '#4FC1E9',
          warning: '#FFB74D',
          success: '#5BD778'
        }
      }
    }
  }
})

// Create a shared reactive isDark ref
const globalIsDark = ref(false)

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    // Get VitePress theme data
    const { isDark: vitePressDark } = useData()

    // Watch for theme changes and update Vuetify and global isDark
    watch(
      () => vitePressDark.value,
      (newIsDark) => {
        vuetify.theme.global.name.value = newIsDark ? 'dark' : 'light'
        isDark.value = newIsDark // Update our composable's isDark value
      },
      { immediate: true }
    )

    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(vuetify)
    app.component('DashboardButton', DashboardButton)

    app.config.globalProperties.$apikey = apikey
    app.config.globalProperties.$url = url;
    app.config.globalProperties.$rUrl = rUrl;
  },
  setup() {
    // This ensures the theme is correct on initial load
    const { isDark } = useData()
    if (isDark.value) {
      vuetify.theme.global.name.value = 'dark'
    }
    globalIsDark.value = isDark.value
  }
}
