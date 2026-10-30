<template>
  <div class="books-container">
    <div class="books-main">
      <div ref="topAnchor" class="books-main__top">
        <SearchBarFilter :filters-open="filtersOpen" @toggle-filters="toggleFilters" />
      </div>

      <div v-if="activeFilterChips.length" class="books-chips">
        <span class="books-chips__label">
          <span class="icon-filter-1" aria-hidden="true"></span>
          Активные фильтры
        </span>

        <button
          v-for="chip in activeFilterChips"
          :key="chip.key"
          type="button"
          class="books-chips__chip"
          :aria-label="`Убрать фильтр: ${chip.label}`"
          @click="removeFilter(chip)"
        >
          {{ chip.label }}
          <span class="icon-cancel-1" aria-hidden="true"></span>
        </button>

        <button type="button" class="books-chips__clear" @click="resetEverything">
          Сбросить всё
        </button>
      </div>

      <div class="books-results-head">
        <div>
          <span class="books-results-head__kicker">
            {{ hasQueryOrFilters ? 'РЕЗУЛЬТАТЫ ПОДБОРА' : 'КАТАЛОГ БИБЛИОТЕКИ' }}
          </span>
          <p class="books-results-head__title">
            <template v-if="hasQueryOrFilters">
              Найдено <b>{{ totalBooks }}</b> {{ bookWord(totalBooks) }}
              <template v-if="searchQuery">по запросу «{{ searchQuery }}»</template>
            </template>
            <template v-else>
              В библиотеке <b>{{ totalBooks }}</b> {{ bookWord(totalBooks) }}
            </template>
          </p>
        </div>
        <span v-if="totalPages > 1" class="books-results-head__pages">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>
      </div>

      <div v-if="loading" class="books-loading-line" role="status" aria-label="Обновляем каталог"></div>

      <div v-if="error" class="books-state books-state--error" role="alert">
        <span class="books-state__icon icon-attention-alt" aria-hidden="true"></span>
        <div class="books-state__copy">
          <strong>Не удалось загрузить каталог</strong>
          <p>{{ error }}</p>
        </div>
        <button type="button" class="books-state__action" @click="retry">Повторить</button>
      </div>

      <div v-else-if="loading && !books.length" class="books-skeleton" aria-hidden="true">
        <div class="books-skeleton__featured">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="books-skeleton__grid">
          <div v-for="item in 6" :key="item" class="books-skeleton__card">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <template v-else-if="books.length">
        <BooksListComponent />

        <div v-if="totalPages > 1" class="books-pagination-wrap">
          <div class="books-pagination__summary">
            Показано {{ rangeStart }}–{{ rangeEnd }} из {{ totalBooks }}
          </div>

          <nav class="books-pagination" aria-label="Пагинация книг">
            <button
              type="button"
              class="books-pagination__nav"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <span class="icon-left-open" aria-hidden="true"></span>
              <span>Назад</span>
            </button>

            <div class="books-pagination__pages">
              <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
                <span v-if="item === '…'" class="books-pagination__dots" aria-hidden="true">…</span>
                <button
                  v-else
                  type="button"
                  class="books-pagination__page"
                  :class="{ 'is-active': item === currentPage }"
                  :aria-current="item === currentPage ? 'page' : undefined"
                  :aria-label="`Страница ${item}`"
                  @click="goToPage(item)"
                >
                  {{ item }}
                </button>
              </template>
            </div>

            <button
              type="button"
              class="books-pagination__nav"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <span>Вперёд</span>
              <span class="icon-right-open" aria-hidden="true"></span>
            </button>
          </nav>
        </div>
      </template>

      <div v-else-if="!error" class="books-state books-state--empty">
        <span class="books-state__icon icon-search" aria-hidden="true"></span>
        <strong>{{ hasQueryOrFilters ? 'Ничего не найдено' : 'Каталог пока пуст' }}</strong>
        <p v-if="hasQueryOrFilters">
          Попробуйте изменить запрос или сбросить фильтры — возможно, подходящие книги есть в другой категории.
        </p>
        <p v-else>Добавьте первую книгу, и она появится в каталоге.</p>
        <button v-if="hasQueryOrFilters" type="button" class="books-state__action" @click="resetEverything">
          Сбросить поиск и фильтры
        </button>
        <router-link v-else-if="user" :to="{ name: 'BookCreate' }" class="books-state__action">
          Добавить книгу
        </router-link>
      </div>
    </div>

    <transition name="books-fade">
      <div v-if="filtersOpen" class="books-sidebar-backdrop" aria-hidden="true" @click="closeFilters"></div>
    </transition>

    <aside class="books-sidebar" :class="{ 'is-open': filtersOpen }" aria-label="Фильтры книг">
      <BooksFilterPanel @close="closeFilters" @apply="applyFilters" @reset="resetFilters" />
    </aside>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SearchBarFilter from '@/components/Filters/Search/SearchBarFilter.vue';
import BooksFilterPanel from '@/components/Books/BooksFilterPanel.vue';

const BOOKS_PER_PAGE = 12;

export default {
  name: 'BooksContainer',
  components: {
    SearchBarFilter,
    BooksFilterPanel,
  },
  data() {
    return {
      filtersOpen: false,
      previousBodyOverflow: '',
    };
  },
  computed: {
    ...mapGetters('books', [
      'books',
      'totalBooks',
      'totalPages',
      'currentPage',
      'loading',
      'error',
      'searchQuery',
      'selectedCategoryIds',
      'authorName',
      'startDate',
      'endDate',
      'minRating',
      'categories',
    ]),
    ...mapGetters('auth', { user: 'user' }),
    hasQueryOrFilters() {
      return Boolean(
        this.searchQuery ||
        this.selectedCategoryIds.length ||
        this.authorName ||
        this.startDate ||
        this.endDate ||
        this.minRating > 0
      );
    },
    categoryNames() {
      return this.selectedCategoryIds
        .map((id) => this.categories.find((category) => Number(category.id) === Number(id))?.name)
        .filter(Boolean);
    },
    activeFilterChips() {
      const chips = [];

      this.categoryNames.forEach((name) => {
        chips.push({ key: `category-${name}`, type: 'category', value: name, label: `Категория: ${name}` });
      });

      if (this.authorName) {
        chips.push({ key: 'author', type: 'author', label: `Автор: ${this.authorName}` });
      }

      if (this.startDate || this.endDate) {
        chips.push({
          key: 'dates',
          type: 'dates',
          label: `Дата: ${this.formatDate(this.startDate)} — ${this.formatDate(this.endDate)}`,
        });
      }

      if (this.minRating > 0) {
        chips.push({ key: 'rating', type: 'rating', label: `Рейтинг от ${this.minRating} ★` });
      }

      return chips;
    },
    rangeStart() {
      if (!this.totalBooks) return 0;
      return (this.currentPage - 1) * BOOKS_PER_PAGE + 1;
    },
    rangeEnd() {
      return Math.min(this.currentPage * BOOKS_PER_PAGE, this.totalBooks);
    },
    pageItems() {
      const total = this.totalPages;
      const current = this.currentPage;

      if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

      const items = [1];
      if (current > 3) items.push('…');

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let page = start; page <= end; page += 1) items.push(page);

      if (current < total - 2) items.push('…');
      items.push(total);
      return items;
    },
  },
  watch: {
    filtersOpen(value) {
      if (value) {
        this.previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this.previousBodyOverflow || '';
      }
    },
  },
  async mounted() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeydown);
    await Promise.allSettled([
      this.fetchBooks(1, BOOKS_PER_PAGE),
      this.fetchFilterOptions(),
    ]);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeydown);
    if (this.filtersOpen) {
      document.body.style.overflow = this.previousBodyOverflow || '';
    }
  },
  methods: {
    ...mapActions('books', ['fetchBooks', 'fetchFilterOptions']),
    ...mapMutations('books', ['setFilters', 'clearFilters', 'setCurrentPage', 'setSearchQuery']),

    handleResize() {
      if (window.innerWidth > 1024 && this.filtersOpen) this.closeFilters();
    },
    handleKeydown(event) {
      if (event.key === 'Escape' && this.filtersOpen) this.closeFilters();
    },
    toggleFilters() {
      this.filtersOpen = !this.filtersOpen;
    },
    closeFilters() {
      this.filtersOpen = false;
    },
    currentFilters() {
      return {
        categoryIds: [...this.selectedCategoryIds],
        authorName: this.authorName,
        startDate: this.startDate,
        endDate: this.endDate,
        minRating: this.minRating,
      };
    },
    applyFilters(filters) {
      this.setFilters(filters);
      this.setCurrentPage(1);
      this.fetchBooks(1, BOOKS_PER_PAGE);
      this.closeFilters();
      this.scrollToTop();
    },
    resetFilters() {
      this.clearFilters();
      this.setCurrentPage(1);
      this.fetchBooks(1, BOOKS_PER_PAGE);
      this.closeFilters();
      this.scrollToTop();
    },
    resetEverything() {
      this.clearFilters();
      this.setSearchQuery('');
      this.setCurrentPage(1);
      this.fetchBooks(1, BOOKS_PER_PAGE);
      this.closeFilters();
      this.scrollToTop();
    },
    removeFilter(chip) {
      const filters = this.currentFilters();

      switch (chip.type) {
        case 'category': {
          const category = this.categories.find((item) => item.name === chip.value);
          filters.categoryIds = filters.categoryIds.filter((id) => Number(id) !== Number(category?.id));
          break;
        }
        case 'author':
          filters.authorName = '';
          break;
        case 'dates':
          filters.startDate = '';
          filters.endDate = '';
          break;
        case 'rating':
          filters.minRating = 0;
          break;
        default:
          break;
      }

      this.setFilters(filters);
      this.setCurrentPage(1);
      this.fetchBooks(1, BOOKS_PER_PAGE);
      this.scrollToTop();
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.setCurrentPage(page);
      this.fetchBooks(page, BOOKS_PER_PAGE);
      this.scrollToTop();
    },
    retry() {
      this.fetchBooks(this.currentPage, BOOKS_PER_PAGE);
    },
    scrollToTop() {
      this.$nextTick(() => {
        const anchor = this.$refs.topAnchor;
        const top = anchor ? anchor.getBoundingClientRect().top + window.scrollY - 96 : 0;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    },
    formatDate(value) {
      if (!value) return '…';
      const date = new Date(`${value}T00:00:00`);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    bookWord(count) {
      const value = Number(count) || 0;
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'книга';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'книги';
      return 'книг';
    },
  },
};
</script>

<style scoped>
.books-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 326px;
  align-items: start;
  gap: 28px;
}

.books-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.books-main__top {
  scroll-margin-top: 96px;
}

.books-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0 2px;
}

.books-chips__label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
}

.books-chips__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 10px;
  cursor: pointer;
}

.books-chips__chip:hover {
  color: var(--danger);
  border-color: var(--danger);
  background: rgba(145, 32, 22, 0.04);
}

.books-chips__chip span {
  font-size: 9px;
}

.books-chips__clear {
  padding: 0;
  color: var(--accent);
  background: transparent;
  border: 0;
  border-bottom: 1px solid transparent;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
}

.books-chips__clear:hover {
  border-color: var(--accent);
}

.books-results-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 0 2px;
}

.books-results-head__kicker {
  display: block;
  margin-bottom: 2px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.books-results-head__title {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
}

.books-results-head__title b {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
}

.books-results-head__pages {
  flex-shrink: 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  white-space: nowrap;
}

.books-loading-line {
  position: relative;
  height: 2px;
  margin: -6px 0 -2px;
  overflow: hidden;
  background: rgba(231, 165, 74, 0.14);
  border-radius: 999px;
}

.books-loading-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -30%;
  width: 30%;
  height: 100%;
  background: var(--accent);
  border-radius: inherit;
  animation: books-loading 1.1s ease-in-out infinite;
}

@keyframes books-loading {
  from { left: -30%; }
  to { left: 100%; }
}

.books-sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--space-5));
  min-width: 0;
  align-self: start;
}

.books-sidebar-backdrop {
  display: none;
}

.books-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-12) var(--space-6);
  text-align: center;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
}

.books-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  color: var(--text-muted);
  background: var(--paper);
  border-radius: 50%;
  font-size: var(--text-lg);
}

.books-state--error {
  flex-direction: row;
  justify-content: flex-start;
  gap: var(--space-4);
  padding: var(--space-5);
  text-align: left;
  color: var(--danger);
  background: rgba(145, 32, 22, 0.05);
  border-color: rgba(145, 32, 22, 0.16);
}

.books-state--error .books-state__icon {
  color: var(--danger);
  background: rgba(145, 32, 22, 0.08);
}

.books-state__copy {
  flex: 1;
  min-width: 0;
}

.books-state--error strong {
  display: block;
  color: var(--danger);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
}

.books-state--error p {
  margin: 3px 0 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
}

.books-state--empty strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
}

.books-state--empty p {
  max-width: 460px;
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.books-state__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 var(--space-4);
  color: var(--text-on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.books-state__action:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.books-state--error .books-state__action {
  flex-shrink: 0;
  color: var(--danger);
  background: transparent;
  border-color: rgba(145, 32, 22, 0.3);
}

.books-state--error .books-state__action:hover {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
}

.books-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.books-skeleton__featured,
.books-skeleton__card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
}

.books-skeleton__featured {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
}

.books-skeleton__featured span,
.books-skeleton__card span {
  display: block;
  height: 12px;
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: books-shimmer 1.25s linear infinite;
}

.books-skeleton__featured span:nth-child(1) { width: 22%; height: 9px; }
.books-skeleton__featured span:nth-child(2) { width: 64%; height: 24px; }
.books-skeleton__featured span:nth-child(3) { width: 92%; }
.books-skeleton__featured span:nth-child(4) { width: 42%; }

.books-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.books-skeleton__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

.books-skeleton__card span:nth-child(1) {
  height: 180px;
  margin: calc(var(--space-4) * -1) calc(var(--space-4) * -1) var(--space-1);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.books-skeleton__card span:nth-child(2) { width: 80%; height: 18px; }
.books-skeleton__card span:nth-child(3) { width: 52%; }

@keyframes books-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.books-pagination-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.books-pagination__summary {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.books-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.books-pagination__pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.books-pagination__page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 var(--space-2);
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.books-pagination__page:hover {
  color: var(--ink);
  border-color: var(--accent);
  background: rgba(231, 165, 74, 0.08);
}

.books-pagination__page.is-active {
  color: #fff;
  background: var(--ink);
  border-color: var(--ink);
  font-weight: 600;
  box-shadow: 0 6px 14px rgba(25, 27, 28, 0.16);
}

.books-pagination__dots {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 36px;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.books-pagination__nav {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 36px;
  padding: 0 var(--space-3);
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
}

.books-pagination__nav:hover:not(:disabled) {
  color: var(--ink);
  border-color: var(--accent);
  background: rgba(231, 165, 74, 0.08);
}

.books-pagination__nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.books-pagination__nav span {
  font-size: 9px;
}

@media (max-width: 1024px) {
  .books-container {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .books-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2100;
    width: min(386px, 94vw);
    height: 100%;
    background: #fff;
    border-left: 1px solid var(--line);
    box-shadow: -24px 0 60px rgba(20, 18, 14, 0.24);
    transform: translateX(102%);
    transition: transform var(--transition-base), visibility 0s linear var(--transition-base);
    visibility: hidden;
  }

  .books-sidebar.is-open {
    transform: translateX(0);
    visibility: visible;
    transition: transform var(--transition-base), visibility 0s linear 0s;
  }

  .books-sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 2050;
    background: rgba(20, 21, 22, 0.44);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
  }
}

.books-fade-enter-active,
.books-fade-leave-active {
  transition: opacity var(--transition-base);
}

.books-fade-enter-from,
.books-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .books-main {
    gap: var(--space-3);
  }

  .books-results-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .books-results-head__title {
    font-size: var(--text-xs);
  }

  .books-results-head__title b {
    font-size: var(--text-base);
  }

  .books-chips__label {
    width: 100%;
  }

  .books-state {
    padding: var(--space-8) var(--space-4);
  }

  .books-state--error {
    flex-direction: column;
    align-items: flex-start;
  }

  .books-state--empty {
    padding: var(--space-10) var(--space-4);
  }

  .books-skeleton__grid {
    grid-template-columns: 1fr;
  }

  .books-pagination {
    gap: 5px;
  }

  .books-pagination__nav {
    padding: 0 var(--space-2);
  }

  .books-pagination__nav span:not([class]) {
    display: none;
  }
}
</style>
