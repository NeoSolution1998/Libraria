import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/Home/HomePage.vue';
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

const RedirectToHome = {
  name: 'RedirectToHome',
  created() {
    this.$router.replace({ name: 'Home' });
  },
  render() {
    return null;
  },
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { breadcrumb: [{ text: 'Главная', path: '/' }] },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { breadcrumb: [{ text: 'Вход', path: '' }] },
  },
  {
    path: '/registration',
    name: 'Registration',
    component: RegistrationPage,
    meta: { breadcrumb: [{ text: 'Регистрация', path: '' }] },
  },
  {
    path: '/profile/:id?',
    name: 'Profile',
    component: ProfilePage,
    meta: { breadcrumb: [{ text: 'Профиль', path: '' }] },
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksPage,
    meta: {
      breadcrumb: [{ text: 'Книги', path: '/books' }],
    },
  },
  {
    path: '/books/:id',
    name: 'Book',
    component: BookPage,
    meta: {
      breadcrumb: [
        { text: 'Книги', path: '/books' },
        { text: 'Книга', path: '' },
      ],
    },
  },
  {
    path: '/books/create',
    name: 'BookCreate',
    component: BookCreatePage,
    meta: {
      breadcrumb: [
        { text: 'Книги', path: '/books' },
        { text: 'Новая книга', path: '' },
      ],
    },
  },
  {
    path: '/books/:bookId/chapter/:chapterId',
    name: 'Chapter',
    component: ChapterPage,
    meta: {
      breadcrumb: [
        { text: 'Книги', path: '/books' },
        { text: 'Чтение', path: '' },
      ],
    },
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsPage,
    meta: {
      breadcrumb: [{ text: 'Посты', path: '/posts' }],
    },
  },
  {
    path: '/posts/:id',
    name: 'Post',
    component: PostPage,
    meta: {
      breadcrumb: [
        { text: 'Посты', path: '/posts' },
        { text: 'Публикация', path: '' },
      ],
    },
  },
  {
    path: '/posts/create',
    name: 'PostCreate',
    component: PostCreatePage,
    meta: {
      breadcrumb: [
        { text: 'Посты', path: '/posts' },
        { text: 'Новый пост', path: '' },
      ],
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'RedirectToHome',
    component: RedirectToHome,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

export default router;
