import { createApp } from 'vue'
import Vuelidate from 'vuelidate';
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключение CSS Bootstrap
import 'bootstrap'; // Подключение JS Bootstrap
import App from './App.vue';
import components from "@/components/UI";
import router from './router/router'; 

const app = createApp(App)

components.forEach(component => {
    app.component(component.name, component)
});

app.use(router).use(Vuelidate).mount('#app')
