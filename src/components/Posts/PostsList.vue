<template>
  <div class="container-fluid">
    <!-- Блок с фильтром и поиском -->
    <div class="filter-search-bar bg-light p-3 mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <input type="text" class="form-control" placeholder="Поиск по постам" />
        </div>
        <div class="col-md-6 text-md-right mt-3 mt-md-0">
          <div class="btn-group">
            <button
              class="btn dropdown-toggle"
              type="button"
              id="dropdownDate"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              по дате
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownDate">
              <li><button class="dropdown-item" type="button">По возрастанию</button></li>
              <li><button class="dropdown-item" type="button">По убыванию</button></li>
            </ul>
          </div>
          <div class="btn-group ml-2">
            <button
              class="btn dropdown-toggle"
              type="button"
              id="dropdownName"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              по имени
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownName">
              <li><button class="dropdown-item" type="button">По алфавиту</button></li>
              <li>
                <button class="dropdown-item" type="button">
                  По алфавиту в обратном порядке
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Лента постов -->
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-5" v-for="post in posts" :key="post.id">
        <div class="card card-sm h-100 p-2">
          <img
            src="https://u.9111s.ru/uploads/202301/18/696d4101c5253a70f08f4f0d165b5092.jpg"
            class="card-img-top card-image"
            alt="Book Cover"
          />
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text text-muted">
              <strong>{{ post.user.name }}</strong>
            </p>
            <p class="card-text text-body-secondary">
              {{ truncateText(post.content, 100) }}
            </p>
          </div>

          <div class="m-2">
            <span class="badge bg-secondary m-2">Новости</span>
            <span class="badge bg-secondary">Книги</span>
          </div>

          <div class="row align-items-center m-3">
            <div class="col-2">
              <a href="#" title="Лайк">
                <icon-vue
                  class="w-100 icon-clickable"
                  :name=" true ? 'star' : 'star-empty'"
                ></icon-vue>
              </a>
            </div>
            <div class="col-2">
              <a href="#" title="Сохранить">
                <icon-vue
                  class="w-100 icon-clickable"
                  :name=" true ? 'heart' : 'heart-empty'"
                ></icon-vue>
              </a>
            </div>
            <div class="col text-end">
              <a href="#" @click.prevent="icon" title="В избранное">
                <icon-vue class="w-100" name="chat"></icon-vue>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostsList",

  props: {
    posts: {
      type: Array,
      required: true,
    },
  },

  methods: {
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      }
      return text;
    },
  },
};
</script>

<style scoped>
.card-image {
  height: 200px;
}
.icons-clicable {
  cursor: pointer;
}
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
}

.card-img-top {
  width: 100%;
  height: auto;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.card-text {
  margin-bottom: 1rem;
}

.card-footer {
  background-color: white;
  border-top: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments-icon {
  font-size: 1.2em;
  margin-right: 10px;
  color: #555;
}

.filter-search-bar input {
  width: 100%;
  margin-bottom: 10px;
}

.filter-search-bar button {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .card-body {
    padding: 0.5rem;
  }

  .card-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .card-text {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .comments-icon {
    font-size: 1rem;
  }

  .post-tags span {
    font-size: 0.75rem;
  }
}
</style>
