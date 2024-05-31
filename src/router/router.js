import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import BooksPage from '@/pages/Books/BooksPage.vue';
import PostsPage from '@/pages/Posts/PostsPage.vue';
import LoginPage from '@/pages/Auth/LoginPage.vue';
import RegistrationPage from '@/pages/Auth/RegistrationPage.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage, 
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsPage, 
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksPage, 
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage, 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage, 
  },
  {
    path: '/registration',
    name: 'Registration',
    component: RegistrationPage, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
