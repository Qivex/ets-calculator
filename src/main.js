import { createApp } from 'vue'
import App from './App.vue'

// Don't even try to load on mobile
if (window.matchMedia("(pointer: fine)").matches === true)
	createApp(App).mount('#vue-app')