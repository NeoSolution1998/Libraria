<template>
  <div class="container-fluid">
    <!-- Кнопки для открытия фильтров, поиска и боковой панели на мобильных устройствах -->
    <div class="d-md-none mb-3">
      <button class="btn btn-outline-dark mr-2" type="button" data-bs-toggle="collapse" data-bs-target="#filterSearchBar" aria-expanded="false" aria-controls="filterSearchBar">
        Фильтры и поиск
      </button>
      <button class="btn btn-outline-dark" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar" aria-expanded="false" aria-controls="sidebar">
        Категории
      </button>
    </div>

    <!-- Фильтры и поиск -->
    <div id="filterSearchBar" class="filter-search-bar bg-light p-3 mb-4 rounded shadow-sm collapse d-md-block">
      <div class="row align-items-center">
        <div class="col-md-6">
          <input
            v-model="localSearchQuery"
            @input="onSearchInput"
            type="text"
            class="form-control"
            placeholder="Поиск..."
          />
        </div>
        <div class="col-md-6 text-md-right mt-3 mt-md-0">
          <div class="btn-group mr-2">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownDate" data-bs-toggle="dropdown" aria-expanded="false">
              Сортировать по дате
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownDate">
              <li><button class="dropdown-item" type="button" @click="sortPostsByDate('date_asc')">По возрастанию</button></li>
              <li><button class="dropdown-item" type="button" @click="sortPostsByDate('date_desc')">По убыванию</button></li>
            </ul>
          </div>
          <div class="btn-group">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownName" data-bs-toggle="dropdown" aria-expanded="false">
              Сортировать по имени
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownName">
              <li><button class="dropdown-item" type="button" @click="sortPostsByName('name_asc')">По алфавиту</button></li>
              <li><button class="dropdown-item" type="button" @click="sortPostsByName('name_desc')">По алфавиту в обратном порядке</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Боковая панель -->
      <div id="sidebar" class="col-lg-3 collapse d-lg-block">
        <div class="sidebar bg-light p-3 rounded shadow-sm mb-4">
          <h5 class="sidebar-title">Посты для книг</h5>
          <select class="form-select mb-3">
            <option>
            </option>
          </select>
          <h5 class="sidebar-title">Теги</h5>
          <ul class="list-group">
            <li class="list-group-item">Фантастика</li>
            <li class="list-group-item">Детективы</li>
            <li class="list-group-item">Романы</li>
          </ul>
        </div>
        <div class="sidebar bg-light p-3 rounded shadow-sm mb-4">
          <div>Хотите прокомментировать книгу? Перейдите на вот эту <router-link :to="{ name: 'PostCreate' }">страницу</router-link> и добавьте пост.</div>
        </div>
      </div>

      <!-- Лента постов -->
      <div class="col-lg-9">
        <div class="posts-grid">
          <div v-if="posts.length === 0" class="text-center">
            <p class="text-muted">Посты не найдены.</p>
          </div>
          <div class="post-card" v-for="post in posts" :key="post.id">
            <div class="card h-100 shadow-sm">
              <!-- Изображение с проверкой загрузки -->
              <img
                v-if="post.images && post.images.length > 0"
                :src="post.images[0].image"
                class="card-img-top card-image"
                alt="Book Cover"
                @load="onImageLoad(post.id)"
                v-show="loadedImages.includes(post.id)"
              />
              <img
                v-else
                src="/images/default_books.jpg"
                class="card-img-top card-image"
                alt="No Image"
              />
              <div class="card-body">
                <h5 class="card-title"><router-link :to="{ name: 'Post', params: { id: post.id } }">{{ truncateText(post.title, 21) }}</router-link></h5>
                <p class="card-author text-muted"><strong>Автор поста:</strong> {{ truncateText(post.user.name, 20) }}</p>
                <p class="card-content"><strong>Описание: </strong>{{ truncateText(post.content, 100) }}</p>
              </div>
              <div class="card-footer d-flex justify-content-between align-items-center">
                <div>
                  <span class="badge bg-secondary me-2">Новости</span>
                  <span class="badge bg-secondary">Книги</span>
                </div>
                <div>
                  <a href="#" class="icon-link" title="Лайк"><icon-vue class="icon" :name="true ? 'star' : 'star-empty'"></icon-vue></a>
                  <a href="#" class="icon-link" title="Сохранить"><icon-vue class="icon" :name="true ? 'heart' : 'heart-empty'"></icon-vue></a>
                  <a href="#" class="icon-link" title="Комментарии"><icon-vue class="icon" name="chat"></icon-vue></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import debounce from 'lodash/debounce';

export default {
  name: "PostsList",

  props: {
    posts: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      localSearchQuery: '',
      loadedImages: [], // Массив для хранения ID постов с загруженными изображениями
      showSearch: false, // Переменная для управления видимостью панели поиска на мобильных устройствах
      showFilters: false // Переменная для управления видимостью фильтров на мобильных устройствах
    };
  },
  computed: {
    ...mapState({
      searchQuery: state => state.posts.searchQuery,
    }),
  },
  watch: {
    searchQuery: {
      immediate: true,
      handler(newVal) {
        this.localSearchQuery = newVal;
      }
    }
  },
  methods: {
    ...mapActions({
      fetchPosts: "posts/fetchPosts",
      initializeStateFromURL: "posts/initializeStateFromURL",
    }),
    ...mapMutations({
      setSearchQuery: "posts/setSearchQuery",
      setSortByDate: "posts/setSortByDate",
      setSortByName: "posts/setSortByName",
    }),
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      }
      return text;
    },
    onSearchInput: debounce(function() {
      this.setSearchQuery(this.localSearchQuery);
      this.fetchPosts();
    }, 300),
    sortPostsByDate(order) {
      this.setSortByDate(order);
      this.fetchPosts();
    },
    sortPostsByName(order) {
      this.setSortByName(order);
      this.fetchPosts();
    },
    onImageLoad(postId) {
      if (!this.loadedImages.includes(postId)) {
        this.loadedImages.push(postId);
      }
    },
    toggleSearch() {
      this.showSearch = !this.showSearch;
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    }
  },
};
</script>

<style scoped>
.card-image {
  height: 200px;
}

.icon-link {
  color: #555;
  margin-left: 10px;
  cursor: pointer;
  transition: color 0.2s;
}

.icon-link:hover {
  color: #000;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  width: 100%;
  height: auto;
  border-radius: 5px 5px 0 0;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #333;
}

.card-author {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: #777;
}

.card-content {
  margin-bottom: 1rem;
  color: #555;
}

.card-footer {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.posts-grid {
  display: grid;
  gap: 20px;
}

@media (min-width: 1200px) {
  .posts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1199px) and (min-width: 992px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 991px) {
  .posts-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.sidebar {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 1.25rem;
  margin-bottom: 15px;
}

.list-group-item {
  font-size: 1rem;
  margin-bottom: 5px;
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .filter-search-bar {
    padding: 10px;
  }

  .filter-search-bar .row {
    flex-direction: column;
    text-align: center;
  }

  .btn-group {
    width: 100%;
    margin-top: 10px;
  }

  .sidebar {
    padding: 15px;
  }

  .card-body {
    padding: 0.75rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-author,
  .card-content {
    font-size: 0.875rem;
  }
}
</style>
