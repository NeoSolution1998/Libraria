<template>
  <div class="books-toolbar">
    <div class="books-toolbar__search" :class="{ 'is-filled': localQuery }">
      <span class="books-toolbar__search-icon icon-search" aria-hidden="true"></span>
      <input
        id="books-search-input"
        v-model="localQuery"
        type="text"
        class="books-toolbar__input"
        placeholder="Найти книгу, автора или историю…"
        aria-label="Поиск книг по названию, автору или описанию"
        autocomplete="off"
        @input="onSearchInput"
        @keyup.enter="applySearchNow"
        @keydown.esc="clearSearch"
      />
      <button
        v-if="localQuery"
        type="button"
        class="books-toolbar__clear"
        aria-label="Очистить поиск"
        @click="clearSearch"
      >
        <span class="icon-cancel-1" aria-hidden="true"></span>
      </button>
      <span v-if="searchQuery && localQuery === searchQuery" class="books-toolbar__hint">
        ищем по всей библиотеке
      </span>
    </div>

    <div class="books-toolbar__controls">
      <label class="books-toolbar__sort">
        <span class="books-toolbar__sort-label">Сортировка</span>
        <span class="books-toolbar__select-wrap">
          <select :value="sort" aria-label="Сортировка книг" @change="onSortChange">
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
            <option value="title_asc">По названию (А–Я)</option>
            <option value="title_desc">По названию (Я–А)</option>
            <option value="rating_desc">Высокий рейтинг</option>
            <option value="rating_asc">Низкий рейтинг</option>
            <option value="likes_desc">Больше лайков</option>
            <option value="likes_asc">Меньше лайков</option>
          </select>
          <span class="books-toolbar__select-arrow icon-down-open" aria-hidden="true"></span>
        </span>
      </label>

      <button
        type="button"
        class="books-toolbar__filters"
        :class="{ 'is-active': activeFiltersCount > 0, 'is-open': filtersOpen }"
        :aria-expanded="filtersOpen"
        aria-controls="books-filters-panel"
        aria-label="Фильтры книг"
        @click="$emit('toggle-filters')"
      >
        <span class="icon-filter-1" aria-hidden="true"></span>
        <span class="books-toolbar__filters-text">Фильтры</span>
        <span v-if="activeFiltersCount > 0" class="books-toolbar__filters-badge">
          {{ activeFiltersCount }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

const BOOKS_PER_PAGE = 12;

export default {
  name: 'SearchBarFilter',
  emits: ['toggle-filters'],
  props: {
    filtersOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localQuery: this.$store.state.books.searchQuery || '',
      searchTimeout: null,
    };
  },
  computed: {
    ...mapGetters('books', ['sort', 'activeFiltersCount', 'searchQuery']),
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
    ...mapActions('books', ['fetchBooks']),
    ...mapMutations('books', ['setSearchQuery', 'setSort', 'setCurrentPage']),

    onSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.applySearch(), 350);
    },
    applySearchNow() {
      clearTimeout(this.searchTimeout);
      this.applySearch();
    },
    applySearch() {
      const query = this.localQuery.trim();

      if (query === this.searchQuery) return;

      this.setSearchQuery(query);
      this.setCurrentPage(1);
      this.fetchBooks(1, BOOKS_PER_PAGE);
    },
    clearSearch() {
      clearTimeout(this.searchTimeout);
      this.localQuery = '';
      this.setSearchQuery('');
      this.setCurrentPage(1);
      this.fetchBooks(1, BOOKS_PER_PAGE);
    },
    onSortChange(event) {
      this.setSort(event.target.value);
      this.setCurrentPage(1);
      this.fetchBooks(1, BOOKS_PER_PAGE);
    },
  },
};
</script>

<style scoped>
.books-toolbar {
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

.books-toolbar__search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.books-toolbar__search-icon {
  position: absolute;
  left: var(--space-4);
  z-index: 1;
  color: var(--text-muted);
  font-size: var(--text-lg);
  pointer-events: none;
  transition: color var(--transition-fast);
}

.books-toolbar__search.is-filled .books-toolbar__search-icon {
  color: var(--accent);
}

.books-toolbar__input {
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

.books-toolbar__input::placeholder {
  color: var(--text-muted);
}

.books-toolbar__input:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.14);
}

.books-toolbar__clear {
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
  border-radius: 50%;
  cursor: pointer;
}

.books-toolbar__clear:hover {
  color: var(--ink);
  background: var(--line);
}

.books-toolbar__hint {
  position: absolute;
  right: 46px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  pointer-events: none;
}

.books-toolbar__controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.books-toolbar__sort {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
}

.books-toolbar__sort-label {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.books-toolbar__select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.books-toolbar__select-wrap select {
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
}

.books-toolbar__select-wrap select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.14);
}

.books-toolbar__select-arrow {
  position: absolute;
  right: 13px;
  color: var(--text-muted);
  font-size: 9px;
  pointer-events: none;
}

.books-toolbar__filters {
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

.books-toolbar__filters:hover,
.books-toolbar__filters.is-active {
  border-color: var(--accent);
  background: rgba(231, 165, 74, 0.1);
}

.books-toolbar__filters.is-open {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.books-toolbar__filters-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.books-toolbar__filters.is-open .books-toolbar__filters-badge {
  color: var(--accent);
  background: var(--text-on-accent);
}

@media (min-width: 1025px) {
  .books-toolbar__filters {
    display: none;
  }
}

@media (max-width: 900px) {
  .books-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }

  .books-toolbar__controls {
    justify-content: space-between;
  }

  .books-toolbar__sort {
    flex: 1;
    min-width: 0;
  }

  .books-toolbar__select-wrap {
    flex: 1;
    min-width: 0;
  }

  .books-toolbar__select-wrap select {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 560px) {
  .books-toolbar {
    padding: var(--space-2);
    border-radius: var(--radius-lg);
  }

  .books-toolbar__input {
    height: 46px;
    padding-right: 44px;
    font-size: var(--text-sm);
  }

  .books-toolbar__hint {
    display: none;
  }

  .books-toolbar__sort-label {
    display: none;
  }

  .books-toolbar__filters {
    height: 44px;
    padding: 0 var(--space-3);
  }
}

@media (max-width: 380px) {
  .books-toolbar__filters-text {
    display: none;
  }
}
</style>
