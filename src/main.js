import axios from 'axios';
import { createApp } from 'vue';
import VueAxios from 'vue-axios';
import { createPinia } from 'pinia'; 

import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';  
import Toast from 'primevue/toast';

import i18n from '@/locale';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); 
app.use(router);
app.use(i18n);
app.use(VueAxios, axios);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.component('Toast', Toast); 
app.use(ConfirmationService);

app.mount('#app');
