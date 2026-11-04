<template>
  <div class="bd-page">
    <div v-if="loading && !book?.id" class="container-wide bd-state-wrap">
      <div class="bd-skeleton">
        <div class="bd-skeleton__cover"></div>
        <div class="bd-skeleton__lines">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="container-wide bd-state-wrap">
      <div class="bd-error">
        <span class="bd-error__kicker">КНИГА</span>
        <h1>{{ errorTitle }}</h1>
        <p>{{ errorText }}</p>
        <div class="bd-error__actions">
          <router-link
            v-if="error === 'auth'"
            :to="{ name: 'Login', query: { redirect: $route.fullPath } }"
            class="bd-btn bd-btn--primary"
          >
            Войти в библиотеку
          </router-link>
          <button v-else type="button" class="bd-btn bd-btn--primary" @click="loadBook">
            Повторить
          </button>
          <router-link :to="{ name: 'Books' }" class="bd-btn">В каталог</router-link>
        </div>
      </div>
    </div>

    <template v-else-if="book?.id">
      <div class="bd-crumbs">
        <div class="container-wide bd-crumbs__inner">
          <router-link :to="{ name: 'Books' }">Книги</router-link>
          <span class="icon-right-open" aria-hidden="true"></span>
          <span>{{ book.title }}</span>
        </div>
      </div>

      <header class="bd-hero">
        <div class="container-wide bd-hero__grid">
          <div class="bd-cover" :style="coverGradient">
            <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" @error="book.cover_image = null" loading="eager" />
            <template v-else>
              <span class="bd-cover__initial" aria-hidden="true">{{ initialOf(book.title) }}</span>
              <span class="bd-cover__quote" aria-hidden="true">“</span>
            </template>
            <span v-if="firstCategory" class="bd-cover__category">{{ firstCategory }}</span>
          </div>

          <div class="bd-hero__content">
            <div class="bd-hero__top">
              <span class="bd-hero__kicker"><i aria-hidden="true"></i> КНИГА LIBRARIA</span>
              <span v-if="book.is_published" class="bd-hero__status">опубликована</span>
            </div>

            <div v-if="categories.length" class="bd-tags">
              <span v-for="category in categories" :key="category.id || category.name">
                #{{ category.name }}
              </span>
            </div>

            <h1 class="bd-title">{{ book.title }}</h1>
            <p class="bd-author">
              <span>Автор</span>
              {{ book.author || 'не указан' }}
            </p>

            <p class="bd-excerpt">{{ excerpt(book.description, 300) }}</p>

            <div class="bd-meta">
              <span v-if="rating" class="bd-meta__rating"><span class="icon-star" aria-hidden="true"></span> {{ rating }}</span>
              <span><span class="icon-eye" aria-hidden="true"></span> {{ formatNumber(book.views_count) }} просмотров</span>
              <span><span class="icon-th-list" aria-hidden="true"></span> {{ chaptersCount }} {{ chapterWord(chaptersCount) }}</span>
              <span><span class="icon-chat" aria-hidden="true"></span> {{ book.comments_count || 0 }}</span>
            </div>

            <div class="bd-actions">
              <router-link v-if="firstChapterId" :to="readLink" class="bd-btn bd-btn--primary bd-btn--lg">
                <span class="icon-play" aria-hidden="true"></span>
                Читать с начала
              </router-link>
              <span v-else class="bd-btn bd-btn--disabled bd-btn--lg" aria-disabled="true">
                <span class="icon-play" aria-hidden="true"></span>
                Глав пока нет
              </span>

              <router-link v-if="continueChapterId" :to="continueLink" class="bd-btn bd-btn--ghost bd-btn--lg">
                <span class="icon-bookmark-empty" aria-hidden="true"></span>
                Продолжить
              </router-link>

              <button type="button" class="bd-btn bd-btn--ghost bd-btn--lg bd-btn--icon" aria-label="Поделиться книгой" @click="shareBook">
                <span class="icon-share" aria-hidden="true"></span>
                <span class="bd-btn__label">Поделиться</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="container-wide bd-layout">
        <main class="bd-main">
          <section class="bd-section">
            <header class="bd-section__head">
              <div>
                <span class="bd-section__kicker">О ЧЁМ ЭТА КНИГА</span>
                <h2>Описание</h2>
              </div>
            </header>
            <div class="bd-description">
              <p v-for="(paragraph, index) in descriptionParagraphs" :key="index">{{ paragraph }}</p>
            </div>
          </section>

          <section v-if="book.author_bio || book.author" class="bd-section bd-author-card">
            <div class="bd-author-card__avatar">{{ initialOf(book.author) }}</div>
            <div class="bd-author-card__body">
              <span class="bd-section__kicker">АВТОР</span>
              <h2>{{ book.author || 'Автор не указан' }}</h2>
              <p>{{ book.author_bio || 'Информация об авторе пока не добавлена.' }}</p>
            </div>
            <span class="bd-author-card__mark" aria-hidden="true">“</span>
          </section>

          <BookChaptersSection :key="$route.params.id" />

          <section class="bd-section bd-comments">
            <header class="bd-section__head">
              <div>
                <span class="bd-section__kicker">РАЗГОВОР</span>
                <h2>Обсуждение книги</h2>
              </div>
            </header>
            <comments-vue
              commentable-type="App\Models\Book"
              :commentable-id="book.id"
              @login-required="handleLoginRequired"
            />
          </section>
        </main>

        <aside class="bd-aside">
          <section class="bd-side">
            <header class="bd-side__head">
              <span class="bd-section__kicker">ДЕТАЛИ</span>
              <h3>О книге</h3>
            </header>
            <dl class="bd-details">
              <div v-if="rating">
                <dt>Рейтинг</dt>
                <dd><span class="icon-star" aria-hidden="true"></span> {{ rating }}</dd>
              </div>
              <div>
                <dt>Глав</dt>
                <dd>{{ chaptersCount }}</dd>
              </div>
              <div v-if="book.number_of_pages">
                <dt>Страниц</dt>
                <dd>{{ book.number_of_pages }}</dd>
              </div>
              <div v-if="book.language">
                <dt>Язык</dt>
                <dd>{{ book.language }}</dd>
              </div>
              <div v-if="firstCategory">
                <dt>Категория</dt>
                <dd>{{ firstCategory }}</dd>
              </div>
              <div v-if="book.created_at">
                <dt>Добавлена</dt>
                <dd>{{ formatDate(book.created_at) }}</dd>
              </div>
              <div v-if="book.user?.name">
                <dt>Добавил</dt>
                <dd>{{ book.user.name }}</dd>
              </div>
            </dl>

            <div class="bd-side__stats">
              <span><span class="icon-heart" aria-hidden="true"></span> {{ book.likes_count || 0 }}</span>
              <span><span class="icon-chat" aria-hidden="true"></span> {{ book.comments_count || 0 }}</span>
              <span><span class="icon-eye" aria-hidden="true"></span> {{ formatNumber(book.views_count) }}</span>
            </div>
          </section>

          <section v-if="relatedBooks.length" class="bd-side">
            <header class="bd-side__head">
              <span class="bd-section__kicker">РЯДОМ НА ПОЛКЕ</span>
              <h3>Похожие книги</h3>
            </header>
            <div class="bd-related">
              <router-link
                v-for="item in relatedBooks"
                :key="item.id"
                :to="{ name: 'Book', params: { id: item.id } }"
                class="bd-related__item"
              >
                <span class="bd-related__cover" :style="gradientFor(item)">
                  <img v-if="item.cover_image" :src="item.cover_image" :alt="item.title" @error="item.cover_image = null" loading="lazy" />
                  <span v-else>{{ initialOf(item.title) }}</span>
                </span>
                <span class="bd-related__info">
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.author || 'Автор не указан' }}</small>
                </span>
                <span class="icon-right-open" aria-hidden="true"></span>
              </router-link>
            </div>
          </section>

          <section class="bd-side bd-side--note">
            <span class="bd-side__quote" aria-hidden="true">“</span>
            <p>Иногда одна книга меняет разговор с самим собой.</p>
            <span class="bd-section__kicker">LIBRARIA</span>
          </section>
        </aside>
      </div>
    </template>

    <transition name="bd-toast">
      <div v-if="toastMessage" class="bd-toast" role="status">
        <span class="icon-ok" aria-hidden="true"></span>
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapState } from 'vuex';
import BookChaptersSection from './BookSections/BookChaptersSection.vue';

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #20262b 0%, #3a3025 58%, #a97436 140%)',
  'linear-gradient(135deg, #1e2a28 0%, #2e3a31 55%, #8b7a4a 140%)',
  'linear-gradient(135deg, #2a2024 0%, #3b2b2b 55%, #b8793d 140%)',
  'linear-gradient(135deg, #242a35 0%, #1e242c 55%, #6f7d64 140%)',
  'linear-gradient(135deg, #302a20 0%, #1f2326 55%, #c18a42 140%)',
];

export default {
  name: 'BookContainer',
  components: {
    BookChaptersSection,
  },
  data() {
    return {
      relatedBooks: [],
      relatedLoading: false,
      continueChapterId: null,
      toastMessage: '',
      toastTimer: null,
    };
  },
  computed: {
    ...mapState('book', {
      book: (state) => state.book,
      loading: (state) => state.loading,
      error: (state) => state.error,
    }),
    errorTitle() {
      if (this.error === 'auth') return 'Войдите, чтобы открыть книгу';
      if (this.error === 'notfound') return 'Книга не найдена';
      return 'Не удалось загрузить книгу';
    },
    errorText() {
      if (this.error === 'auth') {
        return 'Карточки книг доступны авторизованным читателям. Войдите, и мы вернём вас на эту страницу.';
      }
      if (this.error === 'notfound') return 'Возможно, книга была удалена или ссылка устарела.';
      return 'Проверьте подключение и попробуйте ещё раз.';
    },
    categories() {
      return Array.isArray(this.book?.categories) ? this.book.categories : [];
    },
    firstCategory() {
      return this.categories[0]?.name || '';
    },
    chaptersCount() {
      return Number(this.book?.chapters_count) || (this.book?.chapters?.length || 0);
    },
    firstChapterId() {
      return this.book?.chapters?.[0]?.id || null;
    },
    readLink() {
      return {
        name: 'Chapter',
        params: { bookId: this.book.id, chapterId: this.firstChapterId },
      };
    },
    continueLink() {
      return {
        name: 'Chapter',
        params: { bookId: this.book.id, chapterId: this.continueChapterId },
      };
    },
    rating() {
      const value = Number(this.book?.average_rating) || Number(this.book?.rating) || 0;
      return value > 0 ? value.toFixed(1) : '';
    },
    descriptionParagraphs() {
      const text = String(this.book?.description || '').trim();
      return text ? text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean) : [];
    },
    coverGradient() {
      const index = Math.abs(Number(this.book?.id) || 0) % COVER_GRADIENTS.length;
      return { background: COVER_GRADIENTS[index] };
    },
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(bookId) {
        if (bookId) this.loadBook();
      },
    },
    'book.id'(value) {
      if (value) {
        this.relatedBooks = [];
        this.loadContinueChapter();
        this.loadRelated();
      }
    },
  },
  beforeUnmount() {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  },
  methods: {
    ...mapActions('book', ['getBook']),
    loadBook() {
      this.getBook(this.$route.params.id);
    },
    handleLoginRequired() {
      this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
    },
    loadContinueChapter() {
      try {
        const stored = window.localStorage.getItem(`libraria:last-chapter:${this.book.id}`);
        this.continueChapterId = stored && stored !== String(this.firstChapterId) ? stored : null;
      } catch (e) {
        this.continueChapterId = null;
      }
    },
    async loadRelated() {
      if (!this.book?.id) return;
      this.relatedLoading = true;

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/books`, {
          params: {
            per_page: 6,
            sort: 'date_desc',
            ...(this.firstCategory ? { category: this.firstCategory } : {}),
          },
          headers: { Accept: 'application/json' },
        });

        this.relatedBooks = (response.data?.books || [])
          .filter((item) => Number(item.id) !== Number(this.book.id))
          .slice(0, 4);
      } catch (e) {
        this.relatedBooks = [];
      } finally {
        this.relatedLoading = false;
      }
    },
    async shareBook() {
      const url = window.location.href;

      try {
        if (navigator.share) {
          await navigator.share({ title: this.book.title, text: this.book.author, url });
          return;
        }
        await navigator.clipboard.writeText(url);
        this.showToast('Ссылка на книгу скопирована');
      } catch (e) {
        this.showToast('Не удалось поделиться ссылкой');
      }
    },
    showToast(message) {
      this.toastMessage = message;
      if (this.toastTimer) window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.toastMessage = '';
      }, 2500);
    },
    initialOf(value) {
      return String(value || 'L').trim().slice(0, 1).toUpperCase();
    },
    excerpt(value, maxLength) {
      const text = String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (text.length <= maxLength) return text;
      return `${text.slice(0, maxLength).trim()}…`;
    },
    formatDate(value) {
      if (!value) return '—';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
    },
    formatNumber(value) {
      const number = Number(value) || 0;
      if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
      if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
      return String(number);
    },
    chapterWord(count) {
      const value = Number(count) || 0;
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'глава';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'главы';
      return 'глав';
    },
    gradientFor(item) {
      const index = Math.abs(Number(item.id) || 0) % COVER_GRADIENTS.length;
      return { background: COVER_GRADIENTS[index] };
    },
  },
};
</script>

<style scoped>
.bd-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-bottom: var(--space-6);
  background: var(--paper);
}

.bd-state-wrap {
  padding-top: var(--space-8);
  padding-bottom: var(--space-12);
}

.bd-skeleton {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: var(--space-8);
  padding: var(--space-8);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
}

.bd-skeleton__cover {
  aspect-ratio: 2 / 3;
  background: linear-gradient(135deg, #eee9df, #f8f5ee);
  border-radius: var(--radius-lg);
}

.bd-skeleton__lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-4);
}

.bd-skeleton__lines span {
  height: 16px;
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: bd-shimmer 1.2s linear infinite;
}

.bd-skeleton__lines span:nth-child(1) { width: 28%; height: 10px; }
.bd-skeleton__lines span:nth-child(2) { width: 72%; height: 40px; }
.bd-skeleton__lines span:nth-child(3) { width: 34%; }
.bd-skeleton__lines span:nth-child(4) { width: 90%; }
.bd-skeleton__lines span:nth-child(5) { width: 48%; }

@keyframes bd-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.bd-error {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-8);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  text-align: center;
}

.bd-error__kicker {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bd-error h1 {
  margin: var(--space-2) 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
}

.bd-error p {
  margin: 0 auto var(--space-5);
  max-width: 420px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.bd-error__actions {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

/* Breadcrumbs */
.bd-crumbs {
  margin-top: var(--space-4);
}

.bd-crumbs__inner {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.bd-crumbs__inner a {
  color: var(--text-muted);
  text-decoration: none;
}

.bd-crumbs__inner a:hover {
  color: var(--accent);
}

.bd-crumbs__inner span:last-child {
  overflow: hidden;
  color: var(--text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bd-crumbs__inner .icon-right-open {
  font-size: 7px;
}

/* Hero */
.bd-hero {
  padding-bottom: var(--space-2);
}

.bd-hero__grid {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  align-items: start;
  gap: var(--space-8);
  padding: var(--space-6);
  background:
    radial-gradient(600px 300px at 100% 0%, rgba(231, 165, 74, 0.1), transparent 65%),
    #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.bd-cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.13);
  border-radius: var(--radius-lg);
  box-shadow: 0 22px 44px rgba(25, 27, 28, 0.24);
}

.bd-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 40%, rgba(10, 12, 13, 0.45)),
    radial-gradient(240px 180px at 80% 10%, rgba(255, 255, 255, 0.12), transparent 70%);
}

.bd-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bd-cover__initial {
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: 170px;
  font-weight: 700;
  line-height: 1;
}

.bd-cover__quote {
  position: absolute;
  right: var(--space-4);
  bottom: var(--space-5);
  z-index: 1;
  color: rgba(231, 165, 74, 0.72);
  font-family: var(--font-serif);
  font-size: 72px;
  line-height: 0.7;
}

.bd-cover__category {
  position: absolute;
  bottom: var(--space-4);
  left: var(--space-4);
  z-index: 2;
  max-width: calc(100% - 32px);
  padding: 4px 8px;
  overflow: hidden;
  color: rgba(246, 239, 226, 0.8);
  background: rgba(15, 17, 18, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bd-hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.bd-hero__top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-3);
}

.bd-hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bd-hero__kicker i {
  width: 18px;
  height: 1px;
  background: var(--accent);
}

.bd-hero__status {
  padding: 2px 7px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.12);
  border: 1px solid rgba(231, 165, 74, 0.3);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8px;
}

.bd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: var(--space-2);
}

.bd-tags span {
  padding: 3px 8px;
  color: var(--text-secondary);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 9px;
}

.bd-title {
  overflow-wrap: anywhere;
  margin: 0 0 4px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(30px, 4vw, 50px);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.02;
}

.bd-author {
  margin: 0 0 var(--space-3);
  color: #9d6d33;
  font-family: var(--font-serif);
  font-size: var(--text-base);
  font-style: italic;
}

.bd-author span {
  margin-right: 4px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.bd-excerpt {
  display: -webkit-box;
  max-width: 720px;
  margin: 0 0 var(--space-4);
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.7;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.bd-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.bd-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.bd-meta__rating {
  color: #9d6d33 !important;
  font-weight: 600;
}

.bd-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.bd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 var(--space-4);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}

.bd-btn:hover {
  color: var(--ink);
  border-color: var(--ink);
  background: #fff;
}

.bd-btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 600;
}

.bd-btn--primary:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
}

.bd-btn--lg {
  height: 44px;
  padding: 0 var(--space-5);
}

.bd-btn--icon {
  padding: 0 var(--space-3);
}

.bd-btn--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.bd-btn span {
  font-size: 9px;
}

/* Layout */
.bd-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  gap: var(--space-5);
}

.bd-main,
.bd-aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.bd-section,
.bd-side {
  padding: var(--space-6);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.bd-section__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.bd-section__kicker {
  display: block;
  margin-bottom: 3px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bd-section__head h2,
.bd-side__head h3 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.bd-side__head h3 {
  font-size: var(--text-xl);
}

.bd-description p {
  margin: 0 0 var(--space-3);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.8;
}

.bd-description p:last-child {
  margin-bottom: 0;
}

/* Author */
.bd-author-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  position: relative;
  overflow: hidden;
}

.bd-author-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
}

.bd-author-card__body {
  flex: 1;
  min-width: 0;
}

.bd-author-card__body h2 {
  margin: 0 0 4px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
}

.bd-author-card__body p {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: 1.65;
}

.bd-author-card__mark {
  position: absolute;
  right: var(--space-4);
  top: -4px;
  color: rgba(231, 165, 74, 0.18);
  font-family: var(--font-serif);
  font-size: 80px;
  line-height: 1;
  pointer-events: none;
}

/* Comments */
.bd-comments {
  padding-bottom: var(--space-4);
}

/* Aside */
.bd-side {
  padding: var(--space-4);
}

.bd-side__head {
  margin-bottom: var(--space-3);
}

.bd-details {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
}

.bd-details > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 7px 0;
  border-bottom: 1px solid var(--line);
}

.bd-details > div:last-child {
  border-bottom: 0;
}

.bd-details dt {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.bd-details dd {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  text-align: right;
}

.bd-details dd span {
  color: #9d6d33;
  font-size: 8px;
}

.bd-side__stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--line);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.bd-side__stats span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.bd-related {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bd-related__item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 5px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.bd-related__item:hover {
  background: var(--paper);
}

.bd-related__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 42px;
  flex-shrink: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.18);
  border-radius: 3px;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
}

.bd-related__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bd-related__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.bd-related__info strong {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bd-related__info small {
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bd-related__item > span:last-child {
  color: var(--line-strong);
  font-size: 8px;
}

.bd-side--note {
  background:
    radial-gradient(200px 130px at 100% 0%, rgba(231, 165, 74, 0.12), transparent 70%),
    #fff;
}

.bd-side--note p {
  margin: 0 0 var(--space-2);
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: 12px;
  font-style: italic;
  line-height: 1.6;
}

.bd-side__quote {
  display: block;
  height: 26px;
  color: var(--accent);
  font-family: var(--font-serif);
  font-size: 48px;
  line-height: 0.8;
}

/* Toast */
.bd-toast {
  position: fixed;
  bottom: max(var(--space-6), env(safe-area-inset-bottom));
  left: 50%;
  z-index: 2200;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  color: var(--text-on-dark);
  background: var(--ink);
  border-radius: 999px;
  box-shadow: var(--shadow-xl);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  transform: translateX(-50%);
}

.bd-toast span {
  color: var(--accent);
  font-size: 10px;
}

.bd-toast-enter-active,
.bd-toast-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.bd-toast-enter-from,
.bd-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

@media (max-width: 1024px) {
  .bd-hero__grid {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: var(--space-5);
  }

  .bd-layout {
    grid-template-columns: 1fr;
  }

  .bd-aside {
    order: -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .bd-side--note {
    grid-column: 1 / -1;
  }
}

@media (max-width: 700px) {
  .bd-hero__grid {
    grid-template-columns: 1fr;
    padding: var(--space-4);
    gap: var(--space-5);
  }

  .bd-cover {
    width: min(220px, 64%);
    margin: 0 auto;
  }

  .bd-title {
  overflow-wrap: anywhere;
    font-size: clamp(28px, 8vw, 38px);
  }

  .bd-actions {
    width: 100%;
  }

  .bd-actions .bd-btn {
    flex: 1;
  }

  .bd-section,
  .bd-side {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
  }

  .bd-aside {
    grid-template-columns: 1fr;
  }

  .bd-side--note {
    grid-column: auto;
  }

  .bd-author-card__mark {
    display: none;
  }
}

@media (max-width: 420px) {
  .bd-actions .bd-btn {
    flex: 1 1 100%;
  }

  .bd-cover {
    width: min(190px, 70%);
  }
}

/* ── Redesign: clean book editorial ── */
.bd-hero { padding: 28px 0 14px; }
.bd-hero__grid { grid-template-columns: 300px minmax(0, 1fr); gap: 52px; padding: 0; background: transparent; border: 0; border-radius: 0; box-shadow: none; }
.bd-cover { border-radius: 6px; box-shadow: 0 20px 40px rgba(30,33,36,.18); }
.bd-title { font-family: var(--font-display); font-size: clamp(38px, 4.6vw, 58px); line-height: 1.02; }
.bd-author { color: var(--text-secondary); }
.bd-hero__kicker i { background: var(--accent); }
.bd-hero__status { display: none; }
.bd-actions .bd-btn--ghost { border-color: var(--line); }
.bd-layout { grid-template-columns: minmax(0, 1fr) 280px; gap: 44px; padding-top: 18px; }
.bd-section, .bd-side { padding: 20px 0; background: transparent; border: 0; border-top: 1px solid var(--line); border-radius: 0; box-shadow: none; }
.bd-section:first-child { border-top: 0; padding-top: 0; }
.bd-section__head h2 { font-family: var(--font-display); font-size: 27px; }
.bd-section__kicker { color: var(--text-muted); }
.bd-side { padding-top: 0; }
.bd-side__head h3 { font-family: var(--font-display); font-size: 23px; }
.bd-comments, .bd-author-card { background: transparent; }
.bd-author-card { border: 1px solid var(--line); border-radius: 12px; padding: 18px; }
@media (max-width: 900px) {
  .bd-hero__grid { grid-template-columns: 1fr; gap: 24px; }
  .bd-cover { width: 270px; max-width: 100%; }
  .bd-layout { grid-template-columns: 1fr; }
  .bd-aside { display: none; }
}
</style>
