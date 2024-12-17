import { createApp } from 'vue';
import Vuelidate from 'vuelidate';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import App from './App.vue';
import components from "@/components";
import router from './router/router';
import './assets/fontello/css/fontello.css';
import store from './store';
import './assets/css/main.css';
import './assets/css/fonts.css';

const app = createApp(App);

components.forEach(component => {
    app.component(component.name, component)
});

app.use(router)
    .use(store)
    .use(Vuelidate)
    .mount('#app');
