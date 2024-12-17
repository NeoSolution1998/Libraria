<template>
<!--   <div class="container">
    <h2 class="mb-4">Популярные посты</h2>
    <div class="row">
      <div class="col-sm-6 col-md-4 col-lg-3 mb-5" v-for="post in posts" :key="post.id">

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
              <a href="#" @click.prevent="likePost(post)" title="Лайк">
                <icon-vue
                  class="w-100 icon-clickable"
                  :name="this.liked ? 'star' : 'star-empty'"
                ></icon-vue>
              </a>
            </div>
            <div class="col-2">
              <a href="#" @click.prevent="savePost(post)" title="Сохранить">
                <icon-vue
                  class="w-100 icon-clickable"
                  :name="this.saved ? 'heart' : 'heart-empty'"
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
  </div> -->
</template>

<script>
import axios from "axios";
export default {
  name: "PopularPosts",
  data() {
    return {
      liked: false,
      saved: false,
      posts: [],
    };
  },
  props: {
    popularPosts: {
      type: Array,
      required: true,
    },
  },
 /*  methods: {
    async fetchPosts(page = 1, perPage = 4) {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/posts", {
          params: {
            page: page,
            per_page: perPage,
          },
          headers: {
            Authorization: `Bearer CIFZiME42jOGAdciZfkD6FKuN3XL3Pwx0kOQb9lzf5ac247a`, 
          },
        });
        console.log("Get response", response.data.posts);
        this.posts = response.data.posts;
        this.totalPages = Math.ceil(response.data.total_posts / response.data.per_page);
        this.currentPage = response.data.current_page;
      } catch (e) {
        console.error(e);
      }
    },
    handlePageChanged(newPage) {
      this.currentPage = newPage;
      this.fetchPosts(newPage, this.perPage);
    },
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      }
      return text;
    },
    likePost(post) {
      if (this.liked) {
        this.liked = false;
      } else {
        this.liked = true;
      }
    },
    savePost(post) {
      if (this.saved) {
        this.saved = false;
      } else {
        this.saved = true;
      }
    },
  },
  mounted() {
    this.fetchPosts();
  }, */
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
  font-size: 1rem; /* Новый размер шрифта */
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.875rem; /* Новый размер шрифта */
  margin-bottom: 0.75rem;
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
