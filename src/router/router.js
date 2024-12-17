import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/Home/HomePage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import BooksPage from '@/pages/Books/BooksPage.vue';
import BookPage from '@/pages/Books/BookPage.vue';
import BookCreatePage from '@/pages/Books/BookCreatePage.vue';
import ChapterPage from '@/pages/Chapter/ChapterPage.vue';
import PostsPage from '@/pages/Posts/PostsPage.vue';
import PostPage from '@/pages/Posts/PostPage.vue';
import PostCreatePage from '@/pages/Posts/PostCreatePage.vue';
import LoginPage from '@/pages/Auth/LoginPage.vue';
import RegistrationPage from '@/pages/Auth/RegistrationPage.vue';
import ProfilePage from '@/pages/Profile/ProfilePage.vue';
import SettingsPage from '@/pages/Profile/SettingsPage.vue';
import PostsItemCopy from '@/components/Posts/PostsItem copy.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { breadcrumb: [{ text: 'Главная', path: '/' }] },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: {
      breadcrumb: [
        { text: "Главная", path: "/" },
        { text: "О нас", path: "/about" },
      ],
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Вход', path: '/login' },
      ],
    },
  },
  {
    path: '/registration',
    name: 'Registration',
    component: RegistrationPage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Регистрация', path: '/registration' },
      ],
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Профиль', path: '/profile' },
      ],
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Настройки', path: '/settings' },
      ],
    },
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksPage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Книги', path: '/books' },
      ],
    },
  },
  {
    path: '/books/:id',
    name: 'Book',
    component: BookPage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Книги', path: '/books' },
        { text: 'Детали книги', path: '' },
      ],
    },
  },
  {
    path: '/books/create',
    name: 'BookCreate',
    component: BookCreatePage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Книги', path: '/books' },
        { text: 'Создание книги', path: '/books/create' },
      ],
    },
  },
  {
    path: '/books/:bookId/chapter/:chapterId',
    name: 'Chapter',
    component: ChapterPage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Книги', path: '/books' },
        { text: 'Глава книги', path: '' },
      ],
    },
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsPage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Посты', path: '/posts' },
      ],
    },
  },
  {
    path: '/posts/:id',
    name: 'Post',
    component: PostPage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Посты', path: '/posts' },
        { text: 'Детали поста', path: '' },
      ],
    },
  },
  {
    path: '/posts/create',
    name: 'PostCreate',
    component: PostCreatePage,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Посты', path: '/posts' },
        { text: 'Создать пост', path: '/posts/create' },
      ],
    },
  },
  {
    path: '/test',
    name: 'Test',
    component: PostsItemCopy,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Тестовая страница', path: '/test' },
      ],
    },
  },
  {
    path: '/vuex',
    name: 'VuexTest',
    component: PostsItemCopy,
    meta: {
      breadcrumb: [
        { text: 'Главная', path: '/' },
        { text: 'Vuex', path: '/vuex' },
      ],
    },
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
