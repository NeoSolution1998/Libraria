<template>
  <div class="catalog">
    <header-vue />

    <main class="catalog__main">
      <section class="cat-head">
        <div class="shell">
          <div class="cat-head__row">
            <div class="cat-head__intro">
              <h1>Каталог книг</h1>
              <p>
                {{ formatNumber(totalBooks) }} {{ bookWord(totalBooks) }} — классика и новые авторы.
                Ищите по названию или автору.
              </p>
            </div>

          </div>

          <form class="cat-search" @submit.prevent="applySearch">
            <span class="icon-search" aria-hidden="true"></span>
            <input
              v-model="searchInput"
              type="search"
              placeholder="Название книги или автор"
              aria-label="Поиск по каталогу"
            />
            <button type="submit" class="cat-search__btn">Найти</button>
          </form>
        </div>
      </section>

      <section class="cat-body">
        <div class="shell cat-layout">
          <button
            type="button"
            class="cat-filters-toggle"
            :aria-expanded="filtersOpen"
            @click="filtersOpen = !filtersOpen"
          >
            <span class="icon-filter" aria-hidden="true"></span>
            Фильтры
            <span v-if="selectedCategoryIds.length || authorName || minRating" class="cat-filters-toggle__count">
              {{ selectedCategoryIds.length + (authorName ? 1 : 0) + (minRating ? 1 : 0) }}
            </span>
            <span class="icon-down-open cat-filters-toggle__chevron" :class="{ 'is-open': filtersOpen }" aria-hidden="true"></span>
          </button>

          <div class="filters-col" :class="{ 'is-open': filtersOpen }">
            <div class="filters-head">
              <h2>Фильтры</h2>
              <button type="button" class="filters-head__reset" @click="resetAll">Сбросить</button>
            </div>

            <aside class="filters">
            <div class="fblock">
              <button type="button" class="fblock__title" @click="toggle('categories')">
                <span class="fblock__name">
                  Категории
                  <span class="fblock__info" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zM8 6.6a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8zm.75 1.4h-1.5v4.2h1.5V8z"/>
                    </svg>
                  </span>
                </span>
                <span class="icon-up-open" :class="{ 'is-closed': !open.categories }" aria-hidden="true"></span>
              </button>

              <ul v-if="open.categories" class="fblock__list">
                <li v-for="category in visibleCategories" :key="category.id">
                  <label class="fcheck">
                    <input
                      type="checkbox"
                      :checked="selectedCategoryIds.includes(category.id)"
                      @change="toggleCategory(category.id)"
                    />
                    <span class="fcheck__box" aria-hidden="true"></span>
                    <span class="fcheck__label">{{ category.name }}</span>
                  </label>
                </li>
                <li v-if="categories.length > CATEGORY_LIMIT">
                  <button type="button" class="fblock__more" @click="showAllCategories = !showAllCategories">
                    {{ showAllCategories ? 'Свернуть' : `Показать все ${categories.length}` }}
                  </button>
                </li>
              </ul>
            </div>

            <div class="fblock">
              <button type="button" class="fblock__title" @click="toggle('authors')">
                <span>Авторы</span>
                <span class="icon-up-open" :class="{ 'is-closed': !open.authors }" aria-hidden="true"></span>
              </button>

              <div v-if="open.authors">
                <label class="fsearch">
                  <span class="icon-search" aria-hidden="true"></span>
                  <input v-model="authorQuery" type="search" placeholder="Имя автора" />
                </label>

                <ul class="fblock__list">
                  <li v-for="author in filteredAuthors" :key="author.name">
                    <label class="fcheck">
                      <input
                        type="checkbox"
                        :checked="authorName === author.name"
                        @change="toggleAuthor(author.name)"
                      />
                      <span class="fcheck__box" aria-hidden="true"></span>
                      <span class="fcheck__label">{{ author.name }}</span>
                      <small v-if="author.books_count" class="fcheck__count">{{ author.books_count }}</small>
                    </label>
                  </li>
                  <li v-if="!filteredAuthors.length" class="fblock__empty">Авторы не найдены</li>
                </ul>
              </div>
            </div>

            <div class="fblock">
              <button type="button" class="fblock__title" @click="toggle('dates')">
                <span>Дата добавления</span>
                <span class="icon-up-open" :class="{ 'is-closed': !open.dates }" aria-hidden="true"></span>
              </button>

              <div v-if="open.dates" class="fdates">
                <label>
                  <span>С</span>
                  <input v-model="fromDate" type="date" placeholder="01.01.2024" />
                </label>
                <label>
                  <span>По</span>
                  <input v-model="toDate" type="date" placeholder="14.03.2025" />
                </label>
              </div>
            </div>

            <div class="fblock">
              <button type="button" class="fblock__title" @click="toggle('rating')">
                <span>Оценка не ниже</span>
                <span class="icon-up-open" :class="{ 'is-closed': !open.rating }" aria-hidden="true"></span>
              </button>

              <div v-if="open.rating" class="frating">
                <button
                  v-for="option in ratingOptions"
                  :key="option"
                  type="button"
                  class="frating__item"
                  :class="{ 'is-active': minRating === option }"
                  @click="updateRating(option)"
                >
                  {{ ratingOptionLabel(option) }}
                </button>
              </div>
            </div>
            </aside>
          </div>

          <div class="cat-main">
            <div class="cat-results">
              <div class="cat-results__summary">
                <h2 v-if="!loading">
                  Найдено {{ formatNumber(totalBooks) }} {{ bookWord(totalBooks) }}
                  <template v-if="searchQuery"> по запросу «{{ searchQuery }}»</template>
                </h2>
                <h2 v-else class="cat-results__loading">Подбираем книги…</h2>
                <p v-if="dateRangeLabel" class="cat-results__dates">
                  Даты: {{ dateRangeLabel }}
                  <button v-if="hasFilters" type="button" @click="resetAll">Сбросить всё</button>
                </p>
              </div>

              <div class="cat-results__tools">
                <div class="cat-chips">
                  <button
                    v-for="chip in activeChips"
                    :key="chip.key"
                    type="button"
                    class="cat-chip"
                    @click="chip.clear()"
                  >
                    {{ chip.label }}
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <div class="cat-view" role="group" aria-label="Вид каталога">
                  <button
                    type="button"
                    class="cat-view__btn"
                    :class="{ 'is-active': viewMode === 'grid' }"
                    aria-label="Сетка"
                    @click="setView('grid')"
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
                      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
                      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
                      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="cat-view__btn"
                    :class="{ 'is-active': viewMode === 'list' }"
                    aria-label="Список"
                    @click="setView('list')"
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <rect x="1" y="2" width="14" height="2.4" rx="1.2" fill="currentColor" />
                      <rect x="1" y="6.8" width="14" height="2.4" rx="1.2" fill="currentColor" />
                      <rect x="1" y="11.6" width="14" height="2.4" rx="1.2" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                <label class="cat-sort">
                  <span class="cat-sort__label">Сортировка</span>
                  <select v-model="sortValue" @change="applySort">
                    <option value="date_desc">Сначала новые</option>
                    <option value="likes_desc">Сначала популярные</option>
                    <option value="rating_desc">По рейтингу</option>
                    <option value="title_asc">По названию</option>
                  </select>
                </label>
              </div>
            </div>

            <div v-if="loading" class="cat-grid" aria-hidden="true">
              <div v-for="n in 8" :key="`sk-${n}`" class="cat-card">
                <div class="sk sk-cover"></div>
                <div class="sk sk-line sk-line--md"></div>
                <div class="sk sk-line sk-line--sm"></div>
              </div>
            </div>

            <p v-else-if="error" class="cat-state cat-state--error">{{ error }}</p>

            <div v-else-if="books.length" class="cat-grid" :class="{ 'cat-grid--list': viewMode === 'list' }">
              <article v-for="(book, index) in books" :key="book.id" class="cat-card">
                <router-link
                  :to="{ name: 'Book', params: { id: book.id } }"
                  class="cat-card__cover"
                  :style="coverStyle(book, index)"
                  :aria-label="`Открыть книгу: ${book.title}`"
                >
                  <img
                    v-if="book.cover_image && !isBroken(`book-${book.id}`)"
                    :src="book.cover_image"
                    :alt="book.title"
                    loading="lazy"
                    @error="markBroken(`book-${book.id}`)"
                  />
                  <span v-else class="cover-art cover-art--compact">
                    <span class="cover-art__frame" aria-hidden="true"></span>
                    <span class="cover-art__genre">{{ genreOf(book) }}</span>
                    <span class="cover-art__title">{{ book.title }}</span>
                  </span>
                </router-link>

                <button
                  type="button"
                  class="cat-card__wish"
                  :class="{ 'is-active': book.in_wishlist }"
                  :disabled="wishlistBusy === book.id"
                  :aria-label="book.in_wishlist ? 'Убрать из списка желаемого' : 'В список желаемого'"
                  :aria-pressed="Boolean(book.in_wishlist)"
                  @click.stop.prevent="toggleWishlist(book)"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                    <path
                      d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.2a.5.5 0 0 1-.77.42L12 16.9l-5.73 3.72a.5.5 0 0 1-.77-.42V5A1.5 1.5 0 0 1 7 3.5Z"
                      :fill="book.in_wishlist ? 'currentColor' : 'none'"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <div class="cat-card__body">
                <h3 class="cat-card__title">
                  <router-link :to="{ name: 'Book', params: { id: book.id } }">{{ book.title }}</router-link>
                </h3>
                <p class="cat-card__author">{{ book.author || 'Автор не указан' }}</p>
                <p v-if="excerptOf(book)" class="cat-card__desc">{{ excerptOf(book) }}</p>
                <div class="cat-card__stars" @click.stop.prevent>
                  <star-rating
                    size="sm"
                    :value="Number(book.average_rating || 0)"
                    :busy="ratingBusy === book.id"
                    editable
                    @rate="rateBook(book, $event)"
                  />
                  <span class="cat-card__avg">
                    {{ book.ratings_count ? ratingOf(book) : '—' }}
                    <template v-if="book.ratings_count">· {{ book.ratings_count }}</template>
                  </span>
                </div>
                <p class="cat-card__meta">
                  <span v-if="chaptersOf(book)" class="cat-card__chapters">{{ chaptersOf(book) }}</span>
                  <span class="cat-card__views">
                    <span class="icon-eye" aria-hidden="true"></span>
                    {{ compactNumber(book.views_count) }}
                  </span>
                </p>
                </div>

                <div class="cat-card__actions">
                  <button
                    type="button"
                    class="cat-card__wish-inline"
                    :class="{ 'is-active': book.in_wishlist }"
                    :disabled="wishlistBusy === book.id"
                    :aria-label="book.in_wishlist ? 'Убрать из списка желаемого' : 'В список желаемого'"
                    :aria-pressed="Boolean(book.in_wishlist)"
                    @click.stop.prevent="toggleWishlist(book)"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                      <path
                        d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.2a.5.5 0 0 1-.77.42L12 16.9l-5.73 3.72a.5.5 0 0 1-.77-.42V5A1.5 1.5 0 0 1 7 3.5Z"
                        :fill="book.in_wishlist ? 'currentColor' : 'none'"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <router-link :to="{ name: 'Book', params: { id: book.id } }" class="cat-card__read">
                    {{ hasProgress(book) ? 'Продолжить' : 'Читать' }}
                  </router-link>
                </div>
              </article>
            </div>

            <div v-else class="cat-state">
              <p>По этим условиям книг не нашлось.</p>
              <button type="button" class="btn btn--outline" @click="resetAll">Сбросить фильтры</button>
            </div>

            <div v-if="totalPages > 1 && !loading" class="cat-foot">
              <span class="cat-foot__label">Показано {{ rangeFrom }}–{{ rangeTo }} из {{ formatNumber(totalBooks) }}</span>

              <nav class="cat-pager" aria-label="Страницы каталога">
              <button type="button" class="cat-pager__arrow" :disabled="currentPage === 1" @click="goTo(currentPage - 1)">
                <span class="icon-left-open" aria-hidden="true"></span>
              </button>

              <button
                v-for="page in pageList"
                :key="page.key"
                type="button"
                class="cat-pager__page"
                :class="{ 'is-active': page.value === currentPage, 'is-gap': page.gap }"
                :disabled="page.gap"
                @click="!page.gap && goTo(page.value)"
              >
                {{ page.gap ? '…' : page.value }}
              </button>

                <button
                  type="button"
                  class="cat-pager__arrow"
                  :disabled="currentPage === totalPages"
                  @click="goTo(currentPage + 1)"
                >
                  <span class="icon-right-open" aria-hidden="true"></span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer-vue />
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapGetters } from 'vuex';
import StarRating from '@/components/Books/StarRating.vue';

const COVER_COLORS = ['#36513F', '#24324A', '#A8843F', '#2B2B2B', '#7C8F74', '#6B2E2E'];
const CATEGORY_LIMIT = 6;
const PER_PAGE = 8;

export default {
  name: 'BooksPage',
  components: { StarRating },
  data() {
    return {
      searchInput: '',
      authorQuery: '',
      fromDate: '',
      toDate: '',
      ratingValue: '0',
      ratingOptions: [0, 3, 4, 5],
      sortValue: 'date_desc',
      showAllCategories: false,
      filtersOpen: false,
      ratingBusy: null,
      wishlistBusy: null,
      viewMode: 'grid',
      open: { categories: true, authors: true, dates: true, rating: true },
      broken: {},
      CATEGORY_LIMIT,
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
      'sort',
      'categories',
      'authors',
    ]),
    ...mapGetters('auth', ['user']),

    hasFilters() {
      return Boolean(
        this.searchQuery
        || this.selectedCategoryIds.length
        || this.authorName
        || this.startDate
        || this.endDate
        || this.minRating > 0
      );
    },

    rangeFrom() {
      if (!this.books.length) return 0;
      return (this.currentPage - 1) * PER_PAGE + 1;
    },

    rangeTo() {
      return Math.min(this.totalBooks, (this.currentPage - 1) * PER_PAGE + this.books.length);
    },

    visibleCategories() {
      return this.showAllCategories ? this.categories : this.categories.slice(0, CATEGORY_LIMIT);
    },

    filteredAuthors() {
      const query = this.authorQuery.trim().toLowerCase();
      const list = query
        ? this.authors.filter((author) => String(author.name).toLowerCase().includes(query))
        : this.authors;
      // Свёрнутый список — как в макете; при поиске показываем больше совпадений
      return list.slice(0, query ? 8 : 4);
    },

    activeChips() {
      const chips = [];

      if (this.searchQuery) {
        chips.push({
          key: 'search',
          label: `«${this.searchQuery}»`,
          clear: () => this.resetSearch(),
        });
      }

      this.selectedCategoryIds.forEach((id) => {
        const category = this.categories.find((item) => item.id === id);
        chips.push({
          key: `cat-${id}`,
          label: category ? category.name : `Категория ${id}`,
          clear: () => this.toggleCategory(id),
        });
      });

      if (this.authorName) {
        chips.push({ key: 'author', label: this.authorName, clear: () => this.toggleAuthor(this.authorName) });
      }

      if (this.minRating > 0) {
        chips.push({
          key: 'rating',
          label: `Оценка ${this.minRating}+`,
          clear: () => this.updateRating(0),
        });
      }

      return chips;
    },

    dateRangeLabel() {
      const format = (value) => {
        if (!value) return '';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ru-RU');
      };
      const from = format(this.startDate);
      const to = format(this.endDate);
      if (!from && !to) return '';
      return `${from || '…'} – ${to || '…'}`;
    },

    pageList() {
      const total = this.totalPages;
      const current = this.currentPage;

      if (total <= 5) {
        return Array.from({ length: total }, (_, index) => ({ key: `p${index + 1}`, value: index + 1 }));
      }

      // Как в макете: всегда пять «номеров» и, при необходимости, многоточия
      if (current <= 3) {
        return [1, 2, 3].map((v) => ({ key: `p${v}`, value: v }))
          .concat([{ key: 'gap-end', gap: true }])
          .concat([{ key: `p${total}`, value: total }]);
      }

      if (current >= total - 2) {
        return [1].map((v) => ({ key: `p${v}`, value: v }))
          .concat([{ key: 'gap-start', gap: true }])
          .concat([total - 2, total - 1, total].map((v) => ({ key: `p${v}`, value: v })));
      }

      return [
        { key: 'p1', value: 1 },
        { key: 'gap-start', gap: true },
        { key: `p${current}`, value: current },
        { key: 'gap-end', gap: true },
        { key: `p${total}`, value: total },
      ];
    },
  },
  watch: {
    fromDate(value) {
      this.$store.commit('books/setStartDate', value || null);
      this.reload();
    },
    toDate(value) {
      this.$store.commit('books/setEndDate', value || null);
      this.reload();
    },
  },
  async mounted() {
    try {
      const saved = localStorage.getItem('libraria:catalog-view');
      if (saved === 'list' || saved === 'grid') this.viewMode = saved;
    } catch (error) {
      /* приватный режим */
    }

    this.syncFromStore();
    await Promise.all([
      this.$store.dispatch('books/fetchFilterOptions'),
      this.reload(),
    ]);
  },
  methods: {
    ...mapActions('books', ['fetchBooks']),

    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    setView(mode) {
      this.viewMode = mode === 'list' ? 'list' : 'grid';
      try {
        localStorage.setItem('libraria:catalog-view', this.viewMode);
      } catch (error) {
        /* приватный режим */
      }
    },

    excerptOf(book) {
      const text = String(book?.description || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (!text) return '';
      return text.length > 160 ? `${text.slice(0, 160).replace(/\s+\S*$/, '')}…` : text;
    },

    hasProgress(book) {
      try {
        return Boolean(localStorage.getItem(`libraria:last-chapter:${book?.id}`));
      } catch (error) {
        return false;
      }
    },

    async toggleWishlist(book) {
      if (!this.user?.id) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }
      if (this.wishlistBusy === book.id) return;

      this.wishlistBusy = book.id;
      const next = !book.in_wishlist;
      const url = `${process.env.VUE_APP_API_URL}/api/v1/books/${book.id}/wishlist`;
      const config = { headers: this.authHeaders() };

      try {
        // у axios.delete второй аргумент — это config, а не тело запроса
        await (next ? axios.post(url, {}, config) : axios.delete(url, config));
        const index = this.books.findIndex((item) => item.id === book.id);
        if (index !== -1) {
          this.books[index] = { ...this.books[index], in_wishlist: next };
        }
      } catch (error) {
        this.error = 'Не удалось обновить список желаемого.';
      } finally {
        this.wishlistBusy = null;
      }
    },

    async rateBook(book, value) {
      if (!this.user?.id) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }
      if (this.ratingBusy === book.id) return;

      this.ratingBusy = book.id;
      const url = `${process.env.VUE_APP_API_URL}/api/v1/books/${book.id}/rating`;
      const config = { headers: this.authHeaders() };

      try {
        // value = 0 → снимаем оценку
        const { data } = value
          ? await axios.post(url, { value }, { headers: { ...config.headers, 'Content-Type': 'application/json' } })
          : await axios.delete(url, config);

        const index = this.books.findIndex((item) => item.id === book.id);
        if (index !== -1) {
          this.books[index] = {
            ...this.books[index],
            user_rating: value || 0,
            average_rating: Number(data?.rating ?? 0),
            ratings_count: Number(data?.ratings_count ?? 0),
          };
        }
      } catch (e) {
        this.error = 'Не удалось сохранить оценку.';
      } finally {
        this.ratingBusy = null;
      }
    },

    syncFromStore() {
      this.searchInput = this.searchQuery || '';
      this.fromDate = this.startDate || '';
      this.toDate = this.endDate || '';
      this.ratingValue = String(this.minRating || 0);
      this.sortValue = this.sort || 'date_desc';
    },

    async reload(page = 1) {
      // Действие в сторе принимает только страницу — размер задаём мутацией
      this.$store.commit('books/setPerPage', PER_PAGE);
      await this.fetchBooks(page);
    },

    toggle(section) {
      this.open = { ...this.open, [section]: !this.open[section] };
    },

    applySearch() {
      this.$store.commit('books/setSearchQuery', this.searchInput.trim());
      this.reload();
    },

    resetSearch() {
      this.searchInput = '';
      this.$store.commit('books/setSearchQuery', '');
      this.reload();
    },

    toggleCategory(id) {
      const next = this.selectedCategoryIds.includes(id)
        ? this.selectedCategoryIds.filter((item) => item !== id)
        : [...this.selectedCategoryIds, id];
      this.$store.commit('books/setSelectedCategoryIds', next);
      this.reload();
    },

    toggleAuthor(name) {
      this.$store.commit('books/setAuthorName', this.authorName === name ? '' : name);
      this.reload();
    },

    applyRating() {
      this.updateRating(Number(this.ratingValue) || 0);
    },

    updateRating(value) {
      this.ratingValue = String(value);
      this.$store.commit('books/setMinRating', value);
      this.reload();
    },

    applySort() {
      this.$store.commit('books/setSort', this.sortValue);
      this.reload();
    },

    resetAll() {
      this.$store.commit('books/resetFilters');
      this.searchInput = '';
      this.authorQuery = '';
      this.fromDate = '';
      this.toDate = '';
      this.ratingValue = '0';
      this.sortValue = 'date_desc';
      this.reload();
    },

    goTo(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.reload(page);
      this.$nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    },

    /* presentation */
    markBroken(key) {
      this.broken = { ...this.broken, [key]: true };
    },

    isBroken(key) {
      return Boolean(this.broken[key]);
    },

    coverStyle(book, index) {
      const seed = Number(book?.id ?? index) || index;
      return { '--cover-color': COVER_COLORS[seed % COVER_COLORS.length] };
    },

    genreOf(book) {
      const categories = (book?.categories || []).slice(0, 2).map((item) => item.name);
      const tags = (book?.tags || []).slice(0, 2).map((item) => item.name);
      const names = categories.length ? categories : tags;
      return (names.length ? names.join(' · ') : 'Книга').toUpperCase();
    },

    chaptersOf(book) {
      const count = Number(book?.chapters_count || 0);
      if (!count) return '';
      return `${count} ${this.chapterWord(count)}`;
    },

    chapterWord(count) {
      const value = Math.abs(Number(count) || 0);
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'глава';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'главы';
      return 'глав';
    },

    ratingOptionLabel(value) {
      if (!value) return 'Любой';
      return Number(value) >= 5 ? '5' : `${value}+`;
    },

    ratingOf(book) {
      const value = Number(book?.average_rating || book?.rating || 0);
      return value ? value.toFixed(1).replace('.', ',') : '—';
    },

    formatNumber(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number.toLocaleString('ru-RU').replace(/\u00A0/g, ' ') : '—';
    },

    compactNumber(value) {
      const number = Number(value) || 0;
      if (number < 1000) return String(number);
      const thousands = number / 1000;
      const rounded = thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
      return `${String(rounded).replace('.', ',')} тыс.`;
    },

    bookWord(count) {
      const value = Math.abs(Number(count) || 0);
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
/* Кнопки в стиле редизайна (локально, чтобы не задеть старые компоненты) */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
}

.btn--primary:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
}

.btn--outline {
  color: var(--ink);
  background: var(--cream);
  border-color: var(--line);
}

.btn--outline:hover {
  color: var(--ink);
  background: var(--surface-hover);
}

.btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.catalog {
  background: var(--paper);
}

.shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ------------------------------------------------------------------
   Head
   ------------------------------------------------------------------ */
.cat-head {
  padding: 45px 0 81px;
}

.cat-head__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
}

.cat-head h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
}

.cat-head__intro p {
  max-width: 620px;
  margin: 10px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--text-secondary);
}


.cat-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 768px;
  max-width: 100%;
  margin-top: 34px;
}

.cat-search .icon-search {
  position: absolute;
  left: 20px;
  font-size: 15px;
  color: var(--text-muted);
  pointer-events: none;
}

.cat-search input {
  flex: 1;
  height: 52px;
  padding: 0 20px 0 48px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--ink);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 12px;
  outline: none;
}

.cat-search input:focus {
  border-color: var(--line-strong);
}

.cat-search input::placeholder {
  color: var(--text-muted);
}

.cat-search__btn {
  flex: 0 0 auto;
  height: 50px;
  padding: 0 26px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-on-accent);
  background: var(--accent);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cat-search__btn:hover {
  background: var(--accent-hover);
}

/* ------------------------------------------------------------------
   Layout
   ------------------------------------------------------------------ */
.cat-body {
  padding-bottom: 72px;
}

.cat-layout {
  display: grid;
  grid-template-columns: 274px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

/* Filters */
.filters-col {
  padding-top: 7px;
}

.filters-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.filters-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.filters-head__reset {
  padding: 0;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-secondary);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.filters-head__reset:hover {
  color: var(--ink);
}

.filters {
  padding: 6px 20px 10px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 18px;
}

.fblock {
  padding: 16px 0;
  border-top: 1px solid var(--line);
}

.fblock:first-child {
  border-top: 0;
}

.fblock__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  background: none;
  border: 0;
  cursor: pointer;
}

.fblock__name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.fblock__info {
  display: inline-flex;
  color: var(--text-muted);
}

.fblock__title .icon-up-open {
  font-size: 10px;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.fblock__title .icon-up-open.is-closed {
  transform: rotate(180deg);
}

.fblock__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

/* Custom checkbox, 22×22 as in the mock */
.fcheck {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
}

.fcheck input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.fcheck__box {
  position: relative;
  display: inline-flex;
  flex: 0 0 22px;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #fff;
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.fcheck input:checked + .fcheck__box {
  background: var(--accent);
  border-color: var(--accent);
}

.fcheck input:checked + .fcheck__box::after {
  width: 10px;
  height: 5px;
  margin-top: -2px;
  border-bottom: 2px solid #fff;
  border-left: 2px solid #fff;
  content: '';
  transform: rotate(-45deg);
}

.fcheck input:focus-visible + .fcheck__box {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.fcheck__label {
  flex: 1;
  min-width: 0;
  line-height: 1.3;
}

.fcheck__count {
  font-size: 12px;
  color: var(--text-muted);
}

.fblock__more {
  padding: 0;
  margin-top: 2px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-secondary);
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.fblock__more:hover {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.fblock__empty {
  font-size: 12px;
  color: var(--text-muted);
}

.fsearch {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 18px;
}

.fsearch .icon-search {
  position: absolute;
  left: 14px;
  font-size: 13px;
  color: var(--text-muted);
}

.fsearch input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 14px 0 38px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
}

.fsearch input:focus {
  border-color: var(--line-strong);
}

.fdates {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.fdates label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  font-size: 12px;
  color: var(--text-muted);
}

.fdates input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 10px;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
}

.fdates input::-webkit-calendar-picker-indicator {
  margin-left: 0;
  padding: 0;
  opacity: 0.55;
}

.fdates input:focus {
  border-color: var(--line-strong);
}

/* Rating pills */
.frating {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
}

.frating__item {
  height: 30px;
  padding: 0 13px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.frating__item:hover {
  background: var(--surface-hover);
}

.frating__item.is-active {
  color: var(--accent);
  background: var(--accent-light);
}

/* Results */
.cat-main {
  min-width: 0;
}

.cat-results {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  min-height: 68px;
  margin-bottom: 57px;
}

.cat-results__summary h2 {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}

.cat-results__dates {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0 0;
  font-size: 11px;
  color: var(--text-muted);
}

.cat-results__dates button {
  padding: 0;
  font-size: 11px;
  color: var(--text-secondary);
  background: none;
  border: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.cat-results__tools {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.cat-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 25px;
  padding: 0 10px;
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-light);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
}

.cat-chip span {
  font-size: 13px;
  line-height: 1;
}

.cat-sort {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 0;
}

.cat-sort__label {
  font-size: 11px;
  color: var(--text-muted);
}

.cat-sort select {
  width: 157px;
  height: 34px;
  padding: 0 12px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
}

/* Grid */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px 24px;
}

.cat-card {
  min-width: 0;
}

.cat-card__cover {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 207.5 / 310;
  overflow: hidden;
  border-radius: 8px;
  background: var(--cover-color, var(--accent));
  box-shadow: 0 10px 22px rgba(30, 33, 36, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cat-card__cover:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 32px rgba(30, 33, 36, 0.16);
}

.cat-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cat-card__cover .cover-art {
  box-shadow: none;
}

.cat-card__body {
  min-width: 0;
}

.cat-card__wish-inline {
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.cat-card__wish-inline:hover,
.cat-card__wish-inline.is-active {
  color: var(--accent);
  background: var(--accent-light);
  border-color: transparent;
}

.cat-card__title {
  margin: 14px 0 0;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
}

.cat-card__title a {
  color: inherit;
  text-decoration: none;
}

.cat-card__title a:hover {
  color: var(--accent);
}

.cat-card__author {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.cat-card__stars {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.cat-card__avg {
  font-size: 11.5px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.cat-card__stars :deep(.stars__star) {
  color: rgba(172, 135, 61, 0.32);
}

.cat-card__stars :deep(.stars__star.is-active) {
  color: var(--gold);
}

.cat-card__meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.cat-card__rating,
.cat-card__views {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.cat-card__meta b {
  font-weight: 500;
  color: var(--text-secondary);
}

.cat-card__meta .icon-star {
  font-size: 11px;
  color: var(--gold);
}

.cat-card__meta .icon-eye {
  font-size: 12px;
}

/* States + pager */
.cat-state {
  padding: 48px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.cat-state--error {
  color: var(--danger);
}

.cat-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 46px;
}

.cat-foot__label {
  font-size: 12px;
  color: var(--text-muted);
}

.cat-pager {
  display: flex;
  align-items: center;
  gap: 9px;
}

.cat-pager__page,
.cat-pager__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 39px;
  height: 39px;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.cat-pager__page:hover,
.cat-pager__arrow:hover:not(:disabled) {
  background: var(--surface-hover);
}

.cat-pager__page.is-active {
  color: var(--text-on-accent);
  background: #202426;
  border-color: #202426;
}

.cat-pager__page.is-gap {
  color: var(--text-muted);
  cursor: default;
}

.cat-pager__page.is-gap:hover {
  background: var(--cream);
}

.cat-pager__arrow:disabled {
  opacity: 0.45;
  cursor: default;
}

.cat-pager__arrow [class^='icon-'] {
  font-size: 10px;
}

/* ------------------------------------------------------------------
   Responsive
   ------------------------------------------------------------------ */


/* ---------- View switch ---------- */
.cat-view {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 999px;
}

.cat-view__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--text-muted);
  background: none;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.cat-view__btn:hover {
  color: var(--ink);
}

.cat-view__btn.is-active {
  color: var(--ink);
  background: #fff;
  box-shadow: 0 1px 3px rgba(30, 33, 36, 0.1);
}

/* ---------- Card extras ---------- */
.cat-card {
  position: relative;
}

.cat-card__cover {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cat-card:hover .cat-card__cover {
  transform: translateY(-4px);
  box-shadow: 0 22px 38px rgba(30, 33, 36, 0.22);
}

.cat-card__wish {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--ink);
  background: rgba(251, 248, 242, 0.92);
  border: 0;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(30, 33, 36, 0.16);
  cursor: pointer;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease, color 0.2s ease;
}

.cat-card:hover .cat-card__wish,
.cat-card__wish:focus-visible,
.cat-card__wish.is-active {
  opacity: 1;
  transform: translateY(0);
}

.cat-card__wish.is-active {
  color: var(--accent);
}

.cat-card__wish:hover {
  color: var(--accent);
}

.cat-card__wish:disabled {
  opacity: 0.5;
  cursor: default;
}

.cat-card__desc {
  display: none;
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.cat-card__actions {
  display: none;
}

/* ---------- List view ---------- */
.cat-grid--list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cat-grid--list .cat-card {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto;
  align-items: start;
  column-gap: 22px;
  row-gap: 0;
  padding: 16px 20px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.cat-grid--list .cat-card__cover {
  align-self: start;
  width: 96px;
  border-radius: 6px;
}

.cat-grid--list .cat-card:hover .cat-card__cover {
  transform: none;
  box-shadow: 0 14px 26px rgba(30, 33, 36, 0.16);
}

.cat-grid--list .cat-card__wish {
  display: none;
}

/* На маленькой обложке в списке подписи не влезают — уменьшаем */
.cat-grid--list .cover-art__genre {
  display: none;
}

.cat-grid--list .cover-art__title {
  font-size: 11px;
  line-height: 1.15;
}

.cat-grid--list .cover-art {
  padding: 12px;
}

.cat-grid--list .cover-art__frame {
  inset: 6px;
}

.cat-grid--list .cat-card__title {
  margin-top: 0;
  font-size: 19px;
  line-height: 1.25;
}

.cat-grid--list .cat-card__author {
  margin-top: 3px;
  font-size: 12.5px;
}

.cat-grid--list .cat-card__desc {
  display: block;
}

.cat-grid--list .cat-card__stars {
  margin-top: 10px;
}

.cat-grid--list .cat-card__meta {
  margin-top: 8px;
}

.cat-grid--list .cat-card__actions {
  display: flex;
  align-items: center;
  align-self: end;      /* кнопки в правом нижнем углу карточки */
  gap: 10px;
  padding-bottom: 2px;
}

/* Закладка — в правом верхнем углу карточки, «Читать» остаётся внизу */
.cat-grid--list .cat-card__wish-inline {
  position: absolute;
  top: 16px;
  right: 20px;
  display: inline-flex;
}

.cat-card__read {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 18px;
  font-size: 12.5px;
  color: var(--text-on-accent);
  text-decoration: none;
  white-space: nowrap;
  background: var(--accent);
  border-radius: 999px;
}

.cat-card__read:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
}

/* ---------- Sticky results bar ---------- */
.cat-results {
  position: sticky;
  top: 64px;
  z-index: 4;
  background: var(--paper);
}

/* ------------------------------------------------------------------
   Mobile
   ------------------------------------------------------------------ */
.cat-filters-toggle {
  display: none;
}

@media (max-width: 900px) {
  .cat-head {
    padding: 22px 0 18px;
  }

  .cat-head h1 {
    font-size: 34px;
  }

  .cat-head__intro p {
    font-size: 13.5px;
  }


  .cat-search {
    width: 100%;
    margin-top: 20px;
  }

  .cat-search input {
    min-width: 0;
    height: 48px;
    font-size: 13.5px;
  }

  .cat-search__btn {
    height: 48px;
    padding: 0 20px;
  }

  .cat-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }

  .cat-filters-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 46px;
    padding: 0 16px;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--ink);
    background: var(--cream);
    border: 1px solid var(--line);
    border-radius: 12px;
    cursor: pointer;
  }

  .cat-filters-toggle [class^='icon-'] {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .cat-filters-toggle__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    font-size: 11px;
    color: var(--accent);
    background: var(--accent-light);
    border-radius: 999px;
  }

  .cat-filters-toggle__chevron {
    margin-left: auto;
    transition: transform 0.2s ease;
  }

  .cat-filters-toggle__chevron.is-open {
    transform: rotate(180deg);
  }

  .filters-col {
    display: none;
    padding-top: 0;
  }

  .filters-col.is-open {
    display: block;
  }

  .filters-head {
    margin-bottom: 10px;
  }

  .filters-head h2 {
    font-size: 22px;
  }

  .filters {
    padding: 4px 16px 8px;
  }

  .cat-results {
    flex-direction: column;
    gap: 12px;
    min-height: 0;
    margin-bottom: 18px;
  }

  .cat-results__tools {
    justify-content: space-between;
    width: 100%;
  }

  .cat-sort {
    margin-left: auto;
  }

  .cat-sort select {
    width: 150px;
    height: 36px;
  }

  .cat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 14px;
  }

  .cat-grid--list .cat-card {
    grid-template-columns: 72px minmax(0, 1fr) auto;
    column-gap: 14px;
    row-gap: 0;
    padding: 14px;
  }

  .cat-grid--list .cat-card__cover {
    width: 72px;
  }

  .cat-grid--list .cat-card__wish-inline {
    top: 14px;
    right: 14px;
    width: 30px;
    height: 30px;
    display: inline-flex;
  }

  .cat-grid--list .cat-card__read {
    height: 32px;
    padding: 0 12px;
    font-size: 11.5px;
  }

  .cat-grid--list .cat-card__desc {
    display: none;
  }

  .cat-grid--list .cat-card__actions {
    align-self: end;
  }

  .cat-results {
    position: static;
  }

  .cat-view {
    margin-left: auto;
  }

  /* совпадаем по высоте с мобильным селектом (36px) */
  .cat-view__btn {
    width: 30px;
    height: 30px;
  }

  .cat-card__title {
    margin-top: 10px;
    font-size: 15px;
  }

  .cat-card__author {
    font-size: 12px;
  }

  .cat-card__meta {
    gap: 10px;
    margin-top: 6px;
    font-size: 11px;
  }

  .cat-foot {
    flex-direction: column;
    gap: 14px;
    margin-top: 28px;
  }

  .cat-foot__label {
    order: 2;
    font-size: 11px;
  }

  .cat-pager {
    order: 1;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
  }

  .cat-pager__page,
  .cat-pager__arrow {
    width: 34px;
    height: 34px;
    font-size: 11px;
  }
}

@media (max-width: 1279px) {
  .cat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .cat-head {
    padding-top: 32px;
    padding-bottom: 32px;
  }

  .filters {
    margin-top: 0;
  }

  .cat-results {
    margin-bottom: 26px;
  }

  .cat-head h1 {
    font-size: 40px;
  }

  .cat-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .filters {
    order: 2;
  }

  .cat-results {
    flex-direction: column;
    gap: 14px;
  }

  .cat-results__tools {
    justify-content: flex-start;
  }
}

@media (max-width: 760px) {
  .cat-head__row {
    flex-direction: column;
    gap: 16px;
  }

  .cat-search {
    width: 100%;
  }

  .cat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .cat-head h1 {
    font-size: 34px;
  }
}

@media (max-width: 420px) {
  .cat-grid {
    gap: 14px;
  }
}
</style>
