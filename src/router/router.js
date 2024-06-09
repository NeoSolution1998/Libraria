import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import BooksPage from '@/pages/Books/BooksPage.vue';
import BookPage from '@/pages/Books/BookPage.vue';
import PostsPage from '@/pages/Posts/PostsPage.vue';
import LoginPage from '@/pages/Auth/LoginPage.vue';
import RegistrationPage from '@/pages/Auth/RegistrationPage.vue';
import ProfilePage from '@/pages/Profile/ProfilePage.vue';
import SettingsPage from '@/pages/Profile/SettingsPage.vue';
import PostsItemCopy from '@/components/Posts/PostsItem copy.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainPage, 
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
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage, 
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage, 
  },
  {
    path: '/books/:id',
    name: 'Book',
    component: BookPage, 
  },
  {
    path: '/test',
    name: 'Test',
    component: PostsItemCopy, 
  },
  {
    path: '/vuex',
    name: 'Test',
    component: PostsItemCopy, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
