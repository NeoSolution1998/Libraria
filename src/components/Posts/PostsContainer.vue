<template>
  <div class="posts-container">
    <div class="posts-main">
      <div ref="topAnchor" class="posts-main__top">
        <SearchBarFilterPosts
          :filters-open="filtersOpen"
          @toggle-filters="toggleFilters"
        />
      </div>

      <div v-if="activeFilterChips.length" class="posts-chips">
        <span class="posts-chips__label">
          <span class="icon-filter-1" aria-hidden="true"></span>
          Активные фильтры
        </span>

        <button
          v-for="chip in activeFilterChips"
          :key="chip.key"
          type="button"
          class="posts-chips__chip"
          :aria-label="`Убрать фильтр: ${chip.label}`"
          @click="removeFilter(chip)"
        >
          {{ chip.label }}
          <span class="icon-cancel-1" aria-hidden="true"></span>
        </button>

        <button type="button" class="posts-chips__clear" @click="resetFilters">
          Сбросить всё
        </button>
      </div>

      <div class="posts-results-head">
        <div class="posts-results-head__left">
          <span class="posts-results-head__kicker">
            {{ hasQueryOrFilters ? 'РЕЗУЛЬТАТЫ ПОДБОРА' : 'ЛЕНТА ПУБЛИКАЦИЙ' }}
          </span>
          <p class="posts-results-head__title">
            <template v-if="hasQueryOrFilters">
              Найдено <b>{{ totalPosts }}</b> {{ postWord(totalPosts) }}
              <template v-if="searchQuery">по запросу «{{ searchQuery }}»</template>
            </template>
            <template v-else>
              Читайте и обсуждайте <b>{{ totalPosts }}</b> {{ postWord(totalPosts) }}
            </template>
          </p>
        </div>
        <span v-if="totalPages > 1" class="posts-results-head__pages">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>
      </div>

      <div v-if="loading" class="posts-loading-line" role="status" aria-label="Обновляем результаты"></div>

      <div v-if="error" class="posts-state posts-state--error" role="alert">
        <div class="posts-state__icon-wrap">
          <span class="icon-attention-alt" aria-hidden="true"></span>
        </div>
        <div class="posts-state__copy">
          <strong>Не удалось загрузить посты</strong>
          <p>{{ error }}</p>
        </div>
        <button type="button" class="posts-state__action" @click="retry">
          Повторить
        </button>
      </div>

      <div v-else-if="loading && !posts.length" class="posts-skeleton" aria-hidden="true">
        <div class="posts-skeleton__featured">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="posts-skeleton__grid">
          <div v-for="item in 4" :key="item" class="posts-skeleton__card">
            <span class="posts-skeleton__media"></span>
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <template v-else-if="posts.length">
        <PostsListComponent />

        <div v-if="totalPages > 1" class="posts-pagination-wrap">
          <div class="posts-pagination__summary">
            Показано {{ rangeStart }}–{{ rangeEnd }} из {{ totalPosts }}
          </div>

          <nav class="posts-pagination" aria-label="Пагинация постов">
            <button
              type="button"
              class="posts-pagination__nav"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <span class="icon-left-open" aria-hidden="true"></span>
              <span>Назад</span>
            </button>

            <div class="posts-pagination__pages">
              <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
                <span v-if="item === '…'" class="posts-pagination__dots" aria-hidden="true">…</span>
                <button
                  v-else
                  type="button"
                  class="posts-pagination__page"
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
              class="posts-pagination__nav"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <span>Вперёд</span>
              <span class="icon-right-open" aria-hidden="true"></span>
            </button>
          </nav>
        </div>
      </template>

      <div v-else-if="!error" class="posts-state posts-state--empty">
        <div class="posts-state__icon-wrap">
          <span class="icon-search" aria-hidden="true"></span>
        </div>
        <strong>{{ hasQueryOrFilters ? 'Ничего не найдено' : 'Постов пока нет' }}</strong>
        <p v-if="hasQueryOrFilters">
          Попробуйте изменить запрос или сбросить фильтры — возможно, подходящие посты есть в другой категории.
        </p>
        <p v-else>
          Как только читатели опубликуют первые посты, они появятся здесь.
        </p>
        <button
          v-if="hasQueryOrFilters"
          type="button"
          class="posts-state__action"
          @click="resetEverything"
        >
          Сбросить поиск и фильтры
        </button>
        <router-link v-else :to="{ name: 'Posts' }" class="posts-state__action">
          Обновить ленту
        </router-link>
      </div>
    </div>

    <transition name="posts-fade">
      <div
        v-if="filtersOpen"
        class="posts-sidebar-backdrop"
        aria-hidden="true"
        @click="closeFilters"
      ></div>
    </transition>

    <aside
      class="posts-sidebar"
      :class="{ 'is-open': filtersOpen }"
      aria-label="Фильтры постов"
    >
      <PostsFilterPanel
        @close="closeFilters"
        @apply="applyFilters"
        @reset="resetFilters"
      />
    </aside>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SearchBarFilterPosts from '@/components/Filters/Search/SearchBarFilterPosts.vue';
import PostsFilterPanel from '@/components/Posts/PostsFilterPanel.vue';

const POSTS_PER_PAGE = 6;

export default {
  name: 'PostsContainer',
  components: {
    SearchBarFilterPosts,
    PostsFilterPanel,
  },
  data() {
    return {
      filtersOpen: false,
      isMobile: false,
      previousBodyOverflow: '',
    };
  },
  computed: {
    ...mapGetters('posts', [
      'posts',
      'totalPosts',
      'totalPages',
      'currentPage',
      'loading',
      'error',
      'selectedCategoryIds',
      'authorId',
      'authorName',
      'startDate',
      'endDate',
      'minLikes',
      'maxLikes',
      'minRating',
      'selectedTags',
      'categories',
      'searchQuery',
      'hasActiveFilters',
      'hasActiveSearch',
    ]),
    hasQueryOrFilters() {
      return this.hasActiveFilters || this.hasActiveSearch;
    },
    categoryNames() {
      const map = new Map(this.categories.map((category) => [Number(category.id), category.name]));

      return this.selectedCategoryIds
        .map((id) => map.get(Number(id)))
        .filter(Boolean);
    },
    activeFilterChips() {
      const chips = [];

      this.categoryNames.forEach((name) => {
        chips.push({
          key: `category-${name}`,
          type: 'category',
          value: name,
          label: `Категория: ${name}`,
        });
      });

      if (this.authorId) {
        chips.push({
          key: 'author',
          type: 'author',
          label: `Автор: ${this.authorName || 'выбран'}`,
        });
      }

      if (this.startDate || this.endDate) {
        chips.push({
          key: 'dates',
          type: 'dates',
          label: `Дата: ${this.formatDate(this.startDate)} — ${this.formatDate(this.endDate)}`,
        });
      }

      if (this.minLikes > 0) {
        chips.push({
          key: 'min-likes',
          type: 'min-likes',
          label: `Лайков от ${this.minLikes}`,
        });
      }

      if (this.maxLikes > 0) {
        chips.push({
          key: 'max-likes',
          type: 'max-likes',
          label: `Лайков до ${this.maxLikes}`,
        });
      }

      if (this.minRating > 0) {
        chips.push({
          key: 'rating',
          type: 'rating',
          label: `Рейтинг от ${this.minRating} ★`,
        });
      }

      this.selectedTags.forEach((tag) => {
        chips.push({
          key: `tag-${tag}`,
          type: 'tag',
          value: tag,
          label: `#${tag}`,
        });
      });

      return chips;
    },
    rangeStart() {
      if (!this.totalPosts) return 0;
      return (this.currentPage - 1) * POSTS_PER_PAGE + 1;
    },
    rangeEnd() {
      return Math.min(this.currentPage * POSTS_PER_PAGE, this.totalPosts);
    },
    pageItems() {
      const total = this.totalPages;
      const current = this.currentPage;

      if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
      }

      const items = [1];

      if (current > 3) items.push('…');

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let page = start; page <= end; page += 1) {
        items.push(page);
      }

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
    this.updateIsMobile();
    window.addEventListener('resize', this.updateIsMobile);

    await Promise.allSettled([
      this.fetchPosts(1, POSTS_PER_PAGE),
      this.fetchFilterOptions(),
    ]);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateIsMobile);
    if (this.filtersOpen) {
      document.body.style.overflow = this.previousBodyOverflow || '';
    }
  },
  methods: {
    ...mapActions('posts', [
      'fetchPosts',
      'fetchFilterOptions',
    ]),
    ...mapMutations('posts', [
      'setFilters',
      'clearFilters',
      'setSearchQuery',
      'setCurrentPage',
    ]),
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 1024;

      if (!this.isMobile && this.filtersOpen) {
        this.closeFilters();
      }
    },
    currentFilters() {
      return {
        categoryIds: [...this.selectedCategoryIds],
        authorId: this.authorId,
        authorName: this.authorName,
        startDate: this.startDate,
        endDate: this.endDate,
        minLikes: this.minLikes,
        maxLikes: this.maxLikes,
        minRating: this.minRating,
        maxRating: 5,
        tags: [...this.selectedTags],
      };
    },
    toggleFilters() {
      this.filtersOpen = !this.filtersOpen;
    },
    closeFilters() {
      this.filtersOpen = false;
    },
    applyFilters(filters) {
      this.setFilters(filters);
      this.setCurrentPage(1);
      this.fetchPosts(1, POSTS_PER_PAGE);
      this.closeFilters();
      this.scrollToTop();
    },
    resetFilters() {
      this.clearFilters();
      this.setCurrentPage(1);
      this.fetchPosts(1, POSTS_PER_PAGE);
      this.closeFilters();
      this.scrollToTop();
    },
    resetEverything() {
      this.clearFilters();
      this.setSearchQuery('');
      this.setCurrentPage(1);
      this.fetchPosts(1, POSTS_PER_PAGE);
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
          filters.authorId = null;
          filters.authorName = '';
          break;
        case 'dates':
          filters.startDate = '';
          filters.endDate = '';
          break;
        case 'min-likes':
          filters.minLikes = 0;
          break;
        case 'max-likes':
          filters.maxLikes = 0;
          break;
        case 'rating':
          filters.minRating = 0;
          break;
        case 'tag':
          filters.tags = filters.tags.filter((tag) => tag !== chip.value);
          break;
        default:
          break;
      }

      this.setFilters(filters);
      this.setCurrentPage(1);
      this.fetchPosts(1, POSTS_PER_PAGE);
      this.scrollToTop();
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return;

      this.setCurrentPage(page);
      this.fetchPosts(page, POSTS_PER_PAGE);
      this.scrollToTop();
    },
    retry() {
      this.fetchPosts(this.currentPage, POSTS_PER_PAGE);
    },
    scrollToTop() {
      this.$nextTick(() => {
        const anchor = this.$refs.topAnchor;
        const top = anchor
          ? anchor.getBoundingClientRect().top + window.scrollY - 96
          : 0;

        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    },
    formatDate(value) {
      if (!value) return '…';

      const date = new Date(`${value}T00:00:00`);

      if (Number.isNaN(date.getTime())) return value;

      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
    postWord(count) {
      const value = Number(count) || 0;
      const mod10 = value % 10;
      const mod100 = value % 100;

      if (mod10 === 1 && mod100 !== 11) return 'пост';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'поста';
      return 'постов';
    },
  },
};
</script>

<style scoped>
.posts-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 326px;
  align-items: start;
  gap: var(--space-7, 28px);
}

.posts-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.posts-main__top {
  scroll-margin-top: 96px;
}

.posts-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0 2px;
}

.posts-chips__label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.posts-chips__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 10px;
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-fast);
}

.posts-chips__chip:hover {
  color: var(--danger);
  border-color: var(--danger);
  background: rgba(145, 32, 22, 0.04);
}

.posts-chips__chip span {
  font-size: 9px;
}

.posts-chips__clear {
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

.posts-chips__clear:hover {
  border-color: var(--accent);
}

.posts-results-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 0 2px;
}

.posts-results-head__left {
  min-width: 0;
}

.posts-results-head__kicker {
  display: block;
  margin-bottom: 2px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.posts-results-head__title {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
}

.posts-results-head__title b {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
}

.posts-results-head__pages {
  flex-shrink: 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  white-space: nowrap;
}

.posts-loading-line {
  position: relative;
  height: 2px;
  margin: -6px 0 -2px;
  overflow: hidden;
  background: rgba(231, 165, 74, 0.14);
  border-radius: 999px;
}

.posts-loading-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -30%;
  width: 30%;
  height: 100%;
  background: var(--accent);
  border-radius: inherit;
  animation: posts-loading 1.1s ease-in-out infinite;
}

@keyframes posts-loading {
  from { left: -30%; }
  to { left: 100%; }
}

/* Active sidebar / backdrop on mobile */
.posts-sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--space-5));
  min-width: 0;
  align-self: start;
}

.posts-sidebar-backdrop {
  display: none;
}

/* States */
.posts-state {
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

.posts-state__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  color: var(--text-muted);
  background: var(--paper);
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
}

.posts-state--error {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-4);
  padding: var(--space-5);
  text-align: left;
  color: var(--danger);
  background: rgba(145, 32, 22, 0.05);
  border-color: rgba(145, 32, 22, 0.16);
}

.posts-state--error .posts-state__icon-wrap {
  color: var(--danger);
  background: rgba(145, 32, 22, 0.08);
}

.posts-state__copy {
  flex: 1;
  min-width: 0;
}

.posts-state--error strong {
  display: block;
  color: var(--danger);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
}

.posts-state--error p {
  margin: 3px 0 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
}

.posts-state--empty {
  gap: var(--space-3);
  padding: var(--space-16) var(--space-6);
}

.posts-state--empty strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
}

.posts-state--empty p {
  max-width: 460px;
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.posts-state__action {
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
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
}

.posts-state__action:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.posts-state--error .posts-state__action {
  flex-shrink: 0;
  color: var(--danger);
  background: transparent;
  border-color: rgba(145, 32, 22, 0.3);
}

.posts-state--error .posts-state__action:hover {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
}

/* Skeleton */
.posts-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.posts-skeleton__featured,
.posts-skeleton__card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
}

.posts-skeleton__featured {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
}

.posts-skeleton__featured span,
.posts-skeleton__card span {
  display: block;
  height: 12px;
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: posts-shimmer 1.25s linear infinite;
}

.posts-skeleton__featured span:nth-child(1) { width: 22%; height: 9px; }
.posts-skeleton__featured span:nth-child(2) { width: 64%; height: 24px; }
.posts-skeleton__featured span:nth-child(3) { width: 92%; }
.posts-skeleton__featured span:nth-child(4) { width: 42%; }

.posts-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.posts-skeleton__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

.posts-skeleton__media {
  height: 150px;
  margin: calc(var(--space-4) * -1) calc(var(--space-4) * -1) var(--space-1);
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  animation: posts-shimmer 1.25s linear infinite;
}

.posts-skeleton__card span:nth-child(2) { width: 80%; height: 18px; }
.posts-skeleton__card span:nth-child(3) { width: 96%; }
.posts-skeleton__card span:nth-child(4) { width: 55%; }

@keyframes posts-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Pagination */
.posts-pagination-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.posts-pagination__summary {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.posts-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.posts-pagination__pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.posts-pagination__page {
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

.posts-pagination__page:hover {
  color: var(--ink);
  border-color: var(--accent);
  background: rgba(231, 165, 74, 0.08);
}

.posts-pagination__page.is-active {
  color: #fff;
  background: var(--ink);
  border-color: var(--ink);
  font-weight: 600;
  box-shadow: 0 6px 14px rgba(25, 27, 28, 0.16);
}

.posts-pagination__dots {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 36px;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.posts-pagination__nav {
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
  transition: all var(--transition-fast);
}

.posts-pagination__nav:hover:not(:disabled) {
  color: var(--ink);
  border-color: var(--accent);
  background: rgba(231, 165, 74, 0.08);
}

.posts-pagination__nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.posts-pagination__nav span {
  font-size: 9px;
}

/* Mobile drawer */
@media (max-width: 1024px) {
  .posts-container {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .posts-sidebar {
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

  .posts-sidebar.is-open {
    transform: translateX(0);
    visibility: visible;
    transition: transform var(--transition-base), visibility 0s linear 0s;
  }

  .posts-sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 2050;
    background: rgba(20, 21, 22, 0.44);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
  }
}

.posts-fade-enter-active,
.posts-fade-leave-active {
  transition: opacity var(--transition-base);
}

.posts-fade-enter-from,
.posts-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .posts-main {
    gap: var(--space-3);
  }

  .posts-results-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .posts-results-head__title {
    font-size: var(--text-xs);
  }

  .posts-results-head__title b {
    font-size: var(--text-base);
  }

  .posts-chips__label {
    width: 100%;
  }

  .posts-state {
    padding: var(--space-8) var(--space-4);
  }

  .posts-state--error {
    flex-direction: column;
    align-items: flex-start;
  }

  .posts-state--empty {
    padding: var(--space-10) var(--space-4);
  }

  .posts-skeleton__grid {
    grid-template-columns: 1fr;
  }

  .posts-pagination {
    gap: 5px;
  }

  .posts-pagination__nav span:not([class]) {
    display: none;
  }

  .posts-pagination__nav {
    padding: 0 var(--space-2);
  }
}

/* ── Redesign: filters on the left ── */
@media (min-width: 1025px) {
  .posts-container { grid-template-columns: 300px minmax(0, 1fr); gap: 30px; }
  .posts-main { order: 2; }
  .posts-sidebar { order: 1; }
}
@media (max-width: 1024px) { .posts-main { order: 1; } }
</style>
