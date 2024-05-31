<template>
  <header-vue></header-vue>
  <div class="container-fluid">
    <div class="row">
      <!-- Сайдбар с жанрами -->
      <div class="col-lg-3">
        <div class="sidebar">
          <h2>Жанры</h2>
          <!-- Список жанров -->
          <ul class="list-group">
            <li class="list-group-item">Фантастика</li>
            <li class="list-group-item">Детективы</li>
            <li class="list-group-item">Романы</li>
            <!-- Добавьте другие жанры здесь -->
          </ul>
        </div>
      </div>

      <!-- Основной контент с постами -->
      <div class="col-lg-6">
        <!-- Список постов -->
        <div class="posts">
          <h2>Список постов</h2>
          <button @click="showDialog" class="btn">Создать пост</button>
          <post-list v-bind:posts="posts" @remove-post="removePost"></post-list>
          <dialog-vue v-model:show="dialogVisible">
            <post-form @add-post="createPost"></post-form>
          </dialog-vue>
        </div>
      </div>

      <!-- Боковая панель с фильтрами и поиском -->
      <div class="col-lg-3">
        <div class="sidebar">
          <h2>Фильтры и поиск</h2>
          <!-- Форма для поиска -->
          <div class="mb-3">
            <input type="text" class="form-control" placeholder="Поиск..." />
          </div>
          <!-- Дополнительные фильтры -->
          <h4>Дополнительные фильтры</h4>
          <!-- Добавьте дополнительные фильтры здесь -->
        </div>
      </div>
    </div>

    <!-- Раздел с популярными книгами -->
    <div class="row">
      <div class="col">
        <popular-vue></popular-vue>
      </div>
    </div>

    <!-- Раздел с сохраненными книгами -->
    <div class="row">
      <div class="col">
        <h2>Сохраненные книги</h2>
        <!-- Содержимое раздела с сохраненными книгами -->
      </div>
    </div>

    <!-- Футер -->
    <footer class="mt-5">
      <div class="row">
        <div class="col">
          <FooterVue></FooterVue>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import PostForm from "@/components/PostForm.vue";
import PostList from "@/components/Books/BooksList.vue";
import HeaderVue from "@/components/HeaderVue.vue";
import FooterVue from "@/components/FooterVue.vue";
import PopularVue from "@/components/PopularVue.vue";
import axios from "axios";

export default {
  components: {
    PostForm,
    PostList,
    HeaderVue,
    FooterVue,
    PopularVue,
  },
  data() {
    return {
      posts:  [
      { 
        title: 'Игра престолов',
        description: 'Эпическая сага "Песнь льда и пламени" начинается с этой книги. В мире Вестероса разворачиваются интриги, битвы за власть и загадочные события, создавая захватывающий эпос о силе и предательстве.',
        author: 'Джордж Мартин',
        createdAt: '1 февраля 2024 г.'
      },
      { 
        title: 'Хроники Нарнии: Лев, колдунья и платяной шкаф',
        description: 'Первая книга из знаменитой серии о приключениях детей в волшебной стране Нарнии.',
        author: 'Клайв Льюис',
        createdAt: '15 июня 1950 г.'
      },
      { 
        title: 'Гарри Поттер и философский камень',
        description: 'Первая книга о приключениях юного волшебника Гарри Поттера в Хогвартсе.',
        author: 'Дж. К. Роулинг',
        createdAt: '26 июня 1997 г.'
      },
      { 
        title: 'Властелин колец: Братство Кольца',
        description: 'Первая часть знаменитой трилогии о приключениях в Средиземье.',
        author: 'Дж. Р. Р. Толкин',
        createdAt: '29 июля 1954 г.'
      },
      { 
        title: 'Алиса в стране чудес',
        description: 'Знаменитая книга Льюиса Кэрролла о приключениях девочки Алисы в удивительной стране чудес.',
        author: 'Льюис Кэрролл',
        createdAt: '26 ноября 1865 г.'
      },
      // Еще книги...
    ],
      dialogVisible: false,
    };
  },
  methods: {
    createPost(newPost) {
      this.posts.push(newPost);
      this.dialogVisible = false;
    },
    removePost(postId) {
      this.posts = this.posts.filter((post) => post.id !== postId);
    },
    showDialog() {
      this.dialogVisible = true;
    },
    /* async fetchPosts() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/books?page=1", {
          headers: {
            Authorization: `Bearer CIFZiME42jOGAdciZfkD6FKuN3XL3Pwx0kOQb9lzf5ac247a`, // Замените на ваш токен авторизации
          },
        });
        this.posts = response.data;
      } catch (e) {
        console.error(e);
      }
    }, */
  },
  mounted() {
   /*  this.fetchPosts(); */
  },
};
</script>

<style>
.btn {
  margin: 20px;
  padding: 10px;
}

.sidebar {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.posts {
  margin-bottom: 20px;
}
</style>
