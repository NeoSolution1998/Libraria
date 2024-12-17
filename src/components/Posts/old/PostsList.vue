<template>

</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import debounce from 'lodash/debounce';

export default {
  name: "PostsList",

/*   props: {
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
  }, */
/*   watch: {
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
  }, */
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
