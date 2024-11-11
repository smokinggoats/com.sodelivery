import '@/assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App.vue'
import { DirectusPlugin } from '@/plugins/directus'
import router from '@/router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fab as brands } from '@fortawesome/free-brands-svg-icons'
import { far as regular } from '@fortawesome/free-regular-svg-icons'
import { fas as solid } from '@fortawesome/free-solid-svg-icons'

import VueMarkdown from 'vue-markdown-render'

const app = createApp(App)

library.add(...[brands, regular, solid])

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('markdown', VueMarkdown)
app.use(createPinia())
app.use(router)
app.use(DirectusPlugin)

app.mount('#app')
