<template>
  <div class="posts">
    <header-vue />

    <main class="posts__main">
      <section class="posts-head">
        <div class="shell">
          <div class="posts-head__row">
            <div>
              <h1>Посты сообщества</h1>
              <p>Мысли, разборы и рецензии от читателей Libraria.</p>
            </div>

            <div class="posts-head__actions">
              <div class="posts-view" role="group" aria-label="Вид списка постов">
              <button
                type="button"
                class="posts-view__btn"
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
                class="posts-view__btn"
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

              <router-link
                :to="user ? { name: 'PostCreate' } : { name: 'Login', query: { redirect: $route.fullPath } }"
                class="posts-new"
              >
                <span aria-hidden="true">+</span>
                Написать пост
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <section class="posts-body">
        <div class="shell posts-layout">
          <aside class="posts-side">
            <p class="posts-side__label">Категории</p>

            <button
              type="button"
              class="posts-side__item"
              :class="{ 'is-active': !selectedCategoryIds.length }"
              @click="selectCategory(null)"
            >
              Все посты
            </button>

            <button
              v-for="category in visibleCategories"
              :key="category.id"
              type="button"
              class="posts-side__item"
              :class="{ 'is-active': selectedCategoryIds.includes(category.id) }"
              @click="selectCategory(category.id)"
            >
              {{ category.name }}
            </button>

            <button
              v-if="categories.length > CATEGORY_LIMIT"
              type="button"
              class="posts-side__more"
              @click="showAllCategories = !showAllCategories"
            >
              {{ showAllCategories ? 'Свернуть' : `Показать все ${categories.length}` }}
            </button>

            <template v-if="popularTags.length">
              <p class="posts-side__label posts-side__label--spaced">Подборки</p>
              <div class="posts-side__tags">
                <button
                  v-for="tag in popularTags"
                  :key="tag"
                  type="button"
                  class="posts-side__tag"
                  :class="{ 'is-active': selectedTags.includes(tag) }"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </template>

            <aside class="posts-promo">
              <h2>Ваш голос важен</h2>
              <p>
                Прочитали главу? Поделитесь своими мыслями с сообществом. Ваш отзыв
                поможет другим узнать книгу ближе.
              </p>
              <span class="posts-promo__link">Правила сообщества</span>
            </aside>
          </aside>

          <div class="posts-main">
            <div class="posts-tools">
              <label class="posts-search">
                <span class="icon-search" aria-hidden="true"></span>
                <input
                  v-model="searchInput"
                  type="search"
                  placeholder="Поиск по постам…"
                  @keyup.enter="applySearch"
                />
              </label>

              <label class="posts-sort">
                <span>Сортировать:</span>
                <select v-model="sortValue" @change="applySort">
                  <option value="date_desc">Новые</option>
                  <option value="likes_desc">Популярные</option>
                  <option value="rating_desc">По рейтингу</option>
                </select>
              </label>
            </div>

            <div v-if="loading" class="posts-list" :class="{ 'posts-list--grid': viewMode === 'grid' }" aria-hidden="true">
              <div v-for="n in 3" :key="`sk-${n}`" class="post-card">
                <div class="sk" style="flex: 0 0 240px; width: 240px; height: 250px; border-radius: 12px;"></div>
                <div class="post-card__body">
                  <div class="sk sk-line sk-line--sm" style="width: 30%"></div>
                  <div class="sk sk-line" style="height: 20px; width: 80%; margin-top: 16px;"></div>
                  <div class="sk sk-line sk-line--md"></div>
                  <div class="sk sk-line sk-line--sm" style="margin-top: 22px;"></div>
                </div>
              </div>
            </div>

            <p v-else-if="error" class="posts-state posts-state--error">{{ error }}</p>

            <div v-else-if="posts.length" class="posts-list" :class="{ 'posts-list--grid': viewMode === 'grid' }">
              <router-link
                v-for="(post, index) in posts"
                :key="post.id"
                :to="{ name: 'Post', params: { id: post.id } }"
                class="post-card"
              >
                <div class="post-card__media" :style="mediaStyle(post, index)">
                  <img
                    v-if="post.image && !isBroken(`post-${post.id}`)"
                    :src="post.image"
                    :alt="post.title"
                    loading="lazy"
                    @error="markBroken(`post-${post.id}`)"
                  />
                  <span v-else class="post-card__letter" aria-hidden="true">{{ initialOf(post.title) }}</span>
                </div>

                <div class="post-card__body">
                  <div class="post-card__meta">
                    <span v-if="tagOf(post)" class="post-chip">{{ tagOf(post) }}</span>
                    <time>{{ dateLabel(post) }}</time>
                  </div>

                  <h2>{{ post.title }}</h2>
                  <p class="post-card__excerpt">{{ excerptOf(post, 150) }}</p>

                  <footer class="post-card__foot">
                    <span class="post-card__author">
                      <span class="post-card__avatar">
                        <img
                          v-if="post.user?.avatar && !isBroken(`avatar-${post.user.id}`)"
                          :src="post.user.avatar"
                          :alt="post.user?.name"
                          loading="lazy"
                          @error="markBroken(`avatar-${post.user.id}`)"
                        />
                        <span v-else>{{ initialsOf(post.user?.name) }}</span>
                      </span>
                      <span class="post-card__name">{{ post.user?.name || 'Читатель' }}</span>
                    </span>

                    <span class="post-card__stats">
                      <span><span class="icon-heart" aria-hidden="true"></span>{{ compactNumber(post.likes_count) }}</span>
                      <span><span class="icon-comment" aria-hidden="true"></span>{{ compactNumber(post.comments_count) }}</span>
                    </span>
                  </footer>
                </div>

                <span class="post-card__bookmark icon-bookmark" aria-hidden="true"></span>
              </router-link>
            </div>

            <div v-else class="posts-state">
              <p>Постов пока нет.</p>
              <button type="button" class="btn btn--outline" @click="resetAll">Сбросить фильтры</button>
            </div>

            <nav v-if="totalPages > 1 && !loading" class="posts-pager" aria-label="Страницы постов">
              <button type="button" class="posts-pager__arrow" :disabled="currentPage === 1" @click="goTo(currentPage - 1)">
                <span class="icon-left-open" aria-hidden="true"></span>
              </button>

              <button
                v-for="page in pageList"
                :key="page.key"
                type="button"
                class="posts-pager__page"
                :class="{ 'is-active': page.value === currentPage, 'is-gap': page.gap }"
                :disabled="page.gap"
                @click="!page.gap && goTo(page.value)"
              >
                {{ page.gap ? '…' : page.value }}
              </button>

              <button
                type="button"
                class="posts-pager__arrow"
                :disabled="currentPage === totalPages"
                @click="goTo(currentPage + 1)"
              >
                <span class="icon-right-open" aria-hidden="true"></span>
              </button>
            </nav>
          </div>
        </div>
      </section>
    </main>

    <footer-vue />
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

const MEDIA_COLORS = ['#36513F', '#24324A', '#A8843F', '#2B2B2B', '#7C8F74', '#6B2E2E'];
const PER_PAGE = 3;

export default {
  name: 'PostsPage',
  data() {
    return {
      searchInput: '',
      sortValue: 'date_desc',
      viewMode: 'list',
      popularTags: [],
      showAllCategories: false,
      CATEGORY_LIMIT: 7,
      broken: {},
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('posts', [
      'posts',
      'totalPosts',
      'totalPages',
      'currentPage',
      'loading',
      'error',
      'searchQuery',
      'sort',
      'selectedCategoryIds',
      'selectedTags',
      'categories',
    ]),

    visibleCategories() {
      return this.showAllCategories
        ? this.categories
        : this.categories.slice(0, this.CATEGORY_LIMIT);
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
  async mounted() {
    try {
      const saved = localStorage.getItem('libraria:posts-view');
      if (saved === 'grid' || saved === 'list') this.viewMode = saved;
    } catch (error) {
      /* приватный режим */
    }

    this.searchInput = this.searchQuery || '';
    this.sortValue = this.sort || 'date_desc';

    await Promise.all([
      this.$store.dispatch('posts/fetchFilterOptions'),
      this.reload(1),
    ]);

    this.loadPopularTags();
  },
  methods: {
    ...mapActions('posts', ['fetchPosts']),

    async reload(page = 1) {
      // Vuex-действие принимает только один аргумент (страницу),
      // поэтому размер страницы выставляем мутацией
      this.$store.commit('posts/setPerPage', PER_PAGE);
      await this.fetchPosts(page);
    },

    async loadPopularTags() {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/posts`, {
          params: { per_page: 20, sort: 'likes_desc' },
          headers: { Accept: 'application/json' },
        });
        const tags = new Set();
        (data.posts || []).forEach((post) => {
          (post.tags || []).forEach((tag) => tags.add(tag.name));
        });
        this.popularTags = [...tags].slice(0, 4);
      } catch (error) {
        this.popularTags = [];
      }
    },

    applySearch() {
      this.$store.commit('posts/setSearchQuery', this.searchInput.trim());
      this.reload(1);
    },

    setView(mode) {
      this.viewMode = mode === 'grid' ? 'grid' : 'list';
      try {
        localStorage.setItem('libraria:posts-view', this.viewMode);
      } catch (error) {
        /* приватный режим */
      }
    },

    applySort() {
      this.$store.commit('posts/setSort', this.sortValue);
      this.reload(1);
    },

    selectCategory(id) {
      this.$store.commit('posts/setSelectedCategoryIds', id ? [id] : []);
      this.reload(1);
    },

    toggleTag(tag) {
      const next = this.selectedTags.includes(tag)
        ? this.selectedTags.filter((item) => item !== tag)
        : [...this.selectedTags, tag];
      this.$store.commit('posts/setSelectedTags', next);
      this.reload(1);
    },

    resetAll() {
      this.searchInput = '';
      this.sortValue = 'date_desc';
      this.$store.commit('posts/setSearchQuery', '');
      this.$store.commit('posts/setSelectedCategoryIds', []);
      this.$store.commit('posts/setSelectedTags', []);
      this.$store.commit('posts/setSort', 'date_desc');
      this.reload(1);
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

    mediaStyle(post, index) {
      const seed = Number(post?.id ?? index) || index;
      return { '--media-color': MEDIA_COLORS[seed % MEDIA_COLORS.length] };
    },

    tagOf(post) {
      return post?.tags?.[0]?.name || post?.categories?.[0]?.name || '';
    },

    dateLabel(post) {
      const raw = post?.created_at;
      if (!raw) return '';
      const date = new Date(raw);
      return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    },

    excerptOf(post, limit = 150) {
      const text = String(post?.content || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text.length > limit ? `${text.slice(0, limit).replace(/\s+\S*$/, '')}…` : text;
    },

    initialOf(title) {
      return String(title || 'L').trim().slice(0, 1).toUpperCase();
    },

    initialsOf(name) {
      return String(name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },

    compactNumber(value) {
      const number = Number(value) || 0;
      if (number < 1000) return String(number);
      const thousands = number / 1000;
      const rounded = thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
      return `${String(rounded).replace('.', ',')} тыс.`;
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

.posts {
  background: var(--paper);
}

.shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Head */
.posts-head {
  padding: 45px 0 80px;
}

.posts-head__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}


/* Кнопка «Написать пост» — как в макете */
.posts-head__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.posts-new {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 24px;
  font-size: 13px;
  color: var(--text-on-accent);
  text-decoration: none;
  white-space: nowrap;
  background: var(--accent);
  border-radius: 999px;
  transition: background-color 0.2s ease;
}

.posts-new:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
}

.posts-new span {
  margin-top: -1px;
  font-size: 16px;
  line-height: 1;
}

.posts-head__row .posts-view {
  margin-bottom: 4px;
}

.posts-head h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
}

.posts-head p {
  margin: 10px 0 0;
  font-size: 15px;
  color: var(--text-secondary);
}



/* ---------- Переключатель вида ---------- */
.posts-view {
  display: inline-flex;
  flex: 0 0 auto;
  gap: 2px;
  padding: 2px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 999px;
}

.posts-view__btn {
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

.posts-view__btn:hover {
  color: var(--ink);
}

.posts-view__btn.is-active {
  color: var(--ink);
  background: #fff;
  box-shadow: 0 1px 3px rgba(30, 33, 36, 0.1);
}

/* ---------- Сеточный вид ---------- */
/* специфичность выше, чем у базового .posts-list (flex) */
.posts-list.posts-list--grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.posts-list--grid .post-card {
  flex-direction: column;
  gap: 0;
  padding: 14px;
}

.posts-list--grid .post-card__media {
  flex: 0 0 auto;
  width: 100%;
  height: 168px;
}

.posts-list--grid .post-card__body {
  padding: 14px 6px 4px;
}

.posts-list--grid .post-card h2 {
  margin-top: 10px;
  font-size: 18px;
  line-height: 1.3;
}

.posts-list--grid .post-card__excerpt {
  margin-top: 8px;
  -webkit-line-clamp: 3;
}

.posts-list--grid .post-card__foot {
  margin-top: 14px;
  padding-top: 12px;
}

.posts-list--grid .post-card__bookmark {
  top: 24px;
  right: 24px;
}

/* Layout */
.posts-layout {
  display: grid;
  grid-template-columns: 274px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
  padding-bottom: 88px;
}

/* Sidebar */
.posts-side__label {
  margin: 0 0 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.posts-side__label--spaced {
  margin-top: 26px;
}

.posts-side__item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 41px;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-secondary);
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.posts-side__item:hover {
  background: var(--surface-hover);
}

.posts-side__item.is-active {
  color: var(--ink);
  background: var(--accent-light);
}

.posts-side__more {
  padding: 6px 14px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-secondary);
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.posts-side__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.posts-side__tag {
  height: 24px;
  padding: 0 12px;
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.posts-side__tag.is-active {
  color: var(--accent);
  background: var(--accent-light);
  border-color: transparent;
}

.posts-promo {
  margin-top: 32px;
  padding: 24px 22px;
  color: var(--cream);
  background: var(--accent);
  border-radius: 18px;
}

.posts-promo h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 500;
  color: var(--cream);
}

.posts-promo p {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: rgba(251, 248, 242, 0.78);
}

.posts-promo__link {
  display: inline-block;
  margin-top: 16px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
}

/* Tools */
.posts-main {
  min-width: 0;
}

.posts-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
}

.posts-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 384px;
  max-width: 100%;
}

.posts-search .icon-search {
  position: absolute;
  left: 18px;
  font-size: 13px;
  color: var(--text-muted);
}

.posts-search input {
  width: 100%;
  height: 53px;
  padding: 0 18px 0 44px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 12px;
  outline: none;
}

.posts-search input:focus {
  border-color: var(--line-strong);
}

.posts-sort {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

.posts-sort select {
  height: 34px;
  padding: 0 10px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--line-strong);
  outline: none;
}

/* Cards */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.post-card {
  position: relative;
  display: flex;
  gap: 28px;
  padding: 16px;
  text-decoration: none;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(30, 33, 36, 0.08);
}

.post-card__media {
  display: flex;
  flex: 0 0 240px;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 250px;
  overflow: hidden;
  border-radius: 12px;
  background-color: var(--media-color, var(--accent));
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.045) 0 2px, transparent 2px 10px);
}

.post-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card__letter {
  font-family: var(--font-display);
  font-size: 72px;
  color: rgba(251, 248, 242, 0.3);
}

.post-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 6px 40px 6px 0;
}

.post-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--text-muted);
}

.post-chip {
  display: inline-flex;
  align-items: center;
  height: 25px;
  padding: 0 12px;
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 999px;
}

.post-card h2 {
  margin: 14px 0 0;
  font-family: var(--font-display);
  font-size: 25px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.post-card__excerpt {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 16px;
}

.post-card__author {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.post-card__avatar {
  display: inline-flex;
  flex: 0 0 26px;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  overflow: hidden;
  font-size: 10px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 50%;
}

.post-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card__name {
  font-size: 12px;
  color: var(--text-secondary);
}

.post-card__stats {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: var(--text-muted);
}

.post-card__stats span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.post-card__bookmark {
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 14px;
  color: var(--text-muted);
}

.posts-state {
  padding: 40px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.posts-state--error {
  color: var(--danger);
}

/* Pager */
.posts-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-top: 44px;
}

.posts-pager__page,
.posts-pager__arrow {
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

.posts-pager__page:hover,
.posts-pager__arrow:hover:not(:disabled) {
  background: var(--surface-hover);
}

.posts-pager__page.is-active {
  color: var(--text-on-accent);
  background: #202426;
  border-color: #202426;
}

.posts-pager__page.is-gap {
  color: var(--text-muted);
  cursor: default;
}

.posts-pager__page.is-gap:hover {
  background: var(--cream);
}

.posts-pager__arrow:disabled {
  opacity: 0.45;
  cursor: default;
}

/* Responsive */
@media (max-width: 900px) {
  .posts-head {
    padding: 22px 0 18px;
  }

  .posts-head h1 {
    font-size: 32px;
  }

  .posts-head p {
    font-size: 13px;
  }


  .posts-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
    padding-bottom: 56px;
  }

  .posts-side {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .posts-side__label {
    display: none;
  }

  .posts-side__item {
    width: auto;
    height: 34px;
    padding: 0 14px;
    font-size: 12px;
    background: var(--cream);
    border: 1px solid var(--line);
    border-radius: 999px;
  }

  .posts-side__item.is-active {
    background: var(--accent-light);
    border-color: transparent;
  }

  .posts-side__more {
    width: auto;
    margin-top: 0;
  }

  .posts-side__tags {
    width: 100%;
  }

  .posts-side__tag {
    height: 28px;
    font-size: 11px;
  }

  .posts-promo {
    display: none;
  }

  .posts-tools {
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 12px;
    margin-bottom: 18px;
  }

  .posts-search {
    flex: 1 1 100%;
  }

  .posts-sort {
    margin-left: auto;
    justify-content: flex-end;
  }

  .posts-search {
    width: 100%;
  }

  .posts-search input {
    height: 46px;
  }

  .posts-sort {
    justify-content: flex-end;
  }

  .posts-list {
    gap: 16px;
  }

  .posts-list.posts-list--grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .posts-list--grid .post-card__media {
    height: 180px;
  }



  .post-card {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .post-card__media {
    flex-basis: auto;
    width: 100%;
    height: 170px;
  }

  .post-card__body {
    padding: 0 4px 4px;
  }

  .post-card h2 {
    margin-top: 8px;
    font-size: 19px;
  }

  .post-card__excerpt {
    font-size: 12.5px;
    -webkit-line-clamp: 3;
  }

  .post-card__foot {
    padding-top: 12px;
  }

  .post-card__bookmark {
    top: 22px;
    right: 20px;
  }
}

@media (max-width: 1024px) {
  .posts-head {
    padding-bottom: 40px;
  }

  .posts-head h1 {
    font-size: 38px;
  }

  .posts-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .post-card__media {
    flex-basis: 180px;
    width: 180px;
    height: 200px;
  }
}

@media (max-width: 760px) {
  .posts-head__row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .posts-head h1 {
    font-size: 32px;
  }

  .posts-tools {
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .posts-search {
    flex: 1 1 100%;
    width: 100%;
  }

  .posts-head__actions {
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }

  .posts-new {
    height: 42px;
    padding: 0 18px;
    font-size: 12.5px;
  }

  .posts-head__row .posts-view {
    margin-bottom: 0;
  }

  .posts-sort {
    margin-left: auto;
  }

  .post-card {
    flex-direction: column;
    gap: 14px;
  }

  .post-card__media {
    flex-basis: auto;
    width: 100%;
    height: 180px;
  }

  .post-card__body {
    padding: 0;
  }

  .post-card h2 {
    font-size: 20px;
  }
}
</style>
