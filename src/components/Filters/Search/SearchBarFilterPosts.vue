<template>
  <div class="posts-toolbar">
    <div class="posts-toolbar__search" :class="{ 'is-filled': localQuery }">
      <span class="posts-toolbar__search-icon icon-search" aria-hidden="true"></span>
      <input
        id="posts-search-input"
        v-model="localQuery"
        type="text"
        class="posts-toolbar__input"
        placeholder="Найти пост, автора или книгу…"
        aria-label="Поиск постов по названию, тексту или автору"
        autocomplete="off"
        @input="onSearchInput"
        @keyup.enter="applySearchNow"
        @keydown.esc="clearSearch"
      />
      <button
        v-if="localQuery"
        type="button"
        class="posts-toolbar__clear"
        aria-label="Очистить поиск"
        @click="clearSearch"
      >
        <span class="icon-cancel-1" aria-hidden="true"></span>
      </button>
      <span v-if="searchQuery && localQuery === searchQuery" class="posts-toolbar__search-hint">
        ищем по всей библиотеке
      </span>
    </div>

    <div class="posts-toolbar__controls">
      <label class="posts-toolbar__sort">
        <span class="posts-toolbar__sort-label">Сортировка</span>
        <span class="posts-toolbar__select-wrap">
          <select :value="sort" aria-label="Сортировка постов" @change="onSortChange">
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
            <option value="likes_desc">Больше лайков</option>
            <option value="likes_asc">Меньше лайков</option>
            <option value="rating_desc">Высокий рейтинг</option>
            <option value="rating_asc">Низкий рейтинг</option>
            <option value="title_asc">По названию (А–Я)</option>
            <option value="title_desc">По названию (Я–А)</option>
          </select>
          <span class="posts-toolbar__select-arrow icon-down-open" aria-hidden="true"></span>
        </span>
      </label>

      <button
        type="button"
        class="posts-toolbar__filters"
        :class="{
          'is-active': activeFiltersCount > 0,
          'is-open': filtersOpen,
        }"
        :aria-expanded="filtersOpen"
        aria-controls="posts-filters-panel"
        @click="$emit('toggle-filters')"
      >
        <span class="icon-filter-1" aria-hidden="true"></span>
        <span class="posts-toolbar__filters-text">Фильтры</span>
        <span v-if="activeFiltersCount > 0" class="posts-toolbar__filters-badge">
          {{ activeFiltersCount }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

const POSTS_PER_PAGE = 6;

export default {
  name: 'SearchBarFilterPosts',
  emits: ['toggle-filters'],
  props: {
    filtersOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localQuery: this.$store.state.posts.searchQuery || '',
      searchTimeout: null,
    };
  },
  computed: {
    ...mapGetters('posts', ['sort', 'activeFiltersCount', 'searchQuery']),
  },
  watch: {
    searchQuery(value) {
      if (value !== this.localQuery) {
        this.localQuery = value;
      }
    },
  },
  beforeUnmount() {
    clearTimeout(this.searchTimeout);
  },
  methods: {
    ...mapActions('posts', ['fetchPosts']),
    ...mapMutations('posts', ['setSearchQuery', 'setSort', 'setCurrentPage']),

    onSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.applySearch();
      }, 350);
    },
    applySearchNow() {
      clearTimeout(this.searchTimeout);
      this.applySearch();
    },
    applySearch() {
      const query = this.localQuery.trim();

      if (query === this.searchQuery) {
        return;
      }

      this.setSearchQuery(query);
      this.setCurrentPage(1);
      this.fetchPosts(1, POSTS_PER_PAGE);
    },
    clearSearch() {
      clearTimeout(this.searchTimeout);
      this.localQuery = '';
      this.setSearchQuery('');
      this.setCurrentPage(1);
      this.fetchPosts(1, POSTS_PER_PAGE);
    },
    onSortChange(event) {
      this.setSort(event.target.value);
      this.setCurrentPage(1);
      this.fetchPosts(1, POSTS_PER_PAGE);
    },
  },
};
</script>

<style scoped>
.posts-toolbar {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.posts-toolbar__search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.posts-toolbar__search-icon {
  position: absolute;
  left: var(--space-4);
  z-index: 1;
  color: var(--text-muted);
  font-size: var(--text-lg);
  pointer-events: none;
  transition: color var(--transition-fast);
}

.posts-toolbar__search.is-filled .posts-toolbar__search-icon {
  color: var(--accent);
}

.posts-toolbar__input {
  width: 100%;
  height: 48px;
  padding: 0 122px 0 46px;
  color: var(--ink);
  background: var(--paper);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  outline: none;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.posts-toolbar__input::placeholder {
  color: var(--text-muted);
}

.posts-toolbar__input:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.14);
}

.posts-toolbar__clear {
  position: absolute;
  right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: var(--text-muted);
  background: var(--surface-hover);
  border: 0;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.posts-toolbar__clear:hover {
  color: var(--ink);
  background: var(--line);
}

.posts-toolbar__search-hint {
  position: absolute;
  right: 46px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  letter-spacing: 0.02em;
  pointer-events: none;
}

.posts-toolbar__controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.posts-toolbar__sort {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
}

.posts-toolbar__sort-label {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.posts-toolbar__select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.posts-toolbar__select-wrap select {
  height: 42px;
  max-width: 210px;
  padding: 0 36px 0 var(--space-4);
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  outline: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.posts-toolbar__select-wrap select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.14);
}

.posts-toolbar__select-arrow {
  position: absolute;
  right: 13px;
  color: var(--text-muted);
  font-size: 9px;
  pointer-events: none;
}

.posts-toolbar__filters {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 42px;
  padding: 0 var(--space-4);
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast);
}

.posts-toolbar__filters:hover,
.posts-toolbar__filters.is-active {
  border-color: var(--accent);
  background: rgba(231, 165, 74, 0.1);
}

.posts-toolbar__filters.is-open {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.posts-toolbar__filters-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.posts-toolbar__filters.is-open .posts-toolbar__filters-badge {
  color: var(--accent);
  background: var(--text-on-accent);
}

@media (min-width: 1025px) {
  .posts-toolbar__filters {
    display: none;
  }
}

@media (max-width: 900px) {
  .posts-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }

  .posts-toolbar__controls {
    justify-content: space-between;
  }

  .posts-toolbar__sort {
    flex: 1;
    min-width: 0;
  }

  .posts-toolbar__select-wrap {
    flex: 1;
    min-width: 0;
  }

  .posts-toolbar__select-wrap select {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 560px) {
  .posts-toolbar {
    padding: var(--space-2);
    border-radius: var(--radius-lg);
  }

  .posts-toolbar__input {
    height: 46px;
    padding-right: 44px;
    font-size: var(--text-sm);
  }

  .posts-toolbar__search-hint {
    display: none;
  }

  .posts-toolbar__sort-label {
    display: none;
  }

  .posts-toolbar__filters {
    height: 44px;
    padding: 0 var(--space-3);
  }
}

@media (max-width: 380px) {
  .posts-toolbar__filters-text {
    display: none;
  }
}
</style>
