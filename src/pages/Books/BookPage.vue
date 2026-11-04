<template>
  <div class="book-page">
    <header-vue />

    <main class="book-main">
      <div v-if="loading" class="shell book-state">Загружаем книгу…</div>

      <div v-else-if="error" class="shell book-state">
        <h1>{{ errorTitle }}</h1>
        <p>{{ errorText }}</p>
        <router-link v-if="error === 'auth'" :to="{ name: 'Login', query: { redirect: $route.fullPath } }" class="btn btn--primary">
          Войти
        </router-link>
        <router-link v-else :to="{ name: 'Books' }" class="btn btn--outline">В каталог</router-link>
      </div>

      <div v-else class="shell book-layout">
        <aside class="book-aside">
          <div class="book-aside__cover" :style="coverStyle">
            <img
              v-if="book.cover_image && !isBroken('cover')"
              :src="book.cover_image"
              :alt="book.title"
              @error="markBroken('cover')"
            />
            <span v-else class="cover-art">
              <span class="cover-art__frame" aria-hidden="true"></span>
              <span class="cover-art__genre">{{ genre }}</span>
              <span class="cover-art__title">{{ book.title }}</span>
              <span class="cover-art__author">{{ book.author }}</span>
            </span>
          </div>

          <router-link :to="readingLink" class="book-aside__btn book-aside__btn--primary">
            {{ hasProgress ? 'Продолжить чтение' : 'Начать читать' }}
          </router-link>

          <button type="button" class="book-aside__btn book-aside__btn--ghost" @click="toggleWishlist">
            <span class="icon-bookmark" aria-hidden="true"></span>
            {{ inWishlist ? 'В списке желаемого' : 'В список желаемого' }}
          </button>
        </aside>

        <div class="book-body">
          <div class="book-meta">
            <span class="book-meta__rating">
              <star-rating
                :value="userRating"
                :busy="ratingBusy"
                editable
                @rate="rateBook"
              />

              <span v-if="ratingsCount" class="book-meta__rating-value">
                <b>{{ ratingLabel }}</b>
                · {{ ratingsCount }} {{ ratingWord }}
              </span>
              <span v-else class="book-meta__rating-value">Пока без оценок</span>

              <span v-if="ratingHint" class="book-meta__rating-hint">{{ ratingHint }}</span>
              <span v-if="userRating" class="book-meta__rating-own">ваша: {{ userRating }}</span>
            </span>
            <span v-if="chaptersCount" class="book-meta__item">{{ chaptersCount }} {{ chapterWord(chaptersCount) }}</span>
            <span v-if="yearLabel" class="book-meta__item">{{ yearLabel }} год</span>
          </div>

          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">{{ book.author || 'Автор не указан' }}</p>

          <p class="book-label">О книге</p>
          <div class="book-desc">
            <p v-for="(paragraph, index) in descriptionParagraphs" :key="index">{{ paragraph }}</p>
            <p v-if="!descriptionParagraphs.length" class="book-desc__empty">Описание пока не добавлено.</p>
          </div>

          <dl class="book-stats">
            <div>
              <dd>{{ compactNumber(book.views_count) }}</dd>
              <dt>читают сейчас</dt>
            </div>
            <div>
              <dd>{{ bookPosts.length }}</dd>
              <dt>постов</dt>
            </div>
            <div>
              <dd>{{ formatNumber(book.ratings_count) }}</dd>
              <dt>оценок</dt>
            </div>
            <div>
              <dd class="book-stats__text">{{ genre }}</dd>
              <dt>жанр</dt>
            </div>
          </dl>

          <section class="book-section">
            <header class="book-section__head">
              <h2>Содержание</h2>
              <span v-if="chaptersCount">{{ chaptersCount }} {{ chapterWord(chaptersCount) }}</span>
            </header>

            <div v-if="chapters.length" class="chapters">
              <router-link
                v-for="(chapter, index) in chapters"
                :key="chapter.id"
                :to="{ name: 'Chapter', params: { bookId: book.id, chapterId: chapter.id } }"
                class="chapter"
              >
                <span class="chapter__num">{{ index + 1 }}</span>
                <span class="chapter__title">{{ chapter.title }}</span>
                <span v-if="chapter.is_read" class="chapter__state">/ Прочитано</span>
                <span v-if="chapter.is_premium" class="chapter__lock icon-lock" aria-hidden="true"></span>
                <span class="chapter__arrow icon-right-open" aria-hidden="true"></span>
              </router-link>

              <button
                v-if="chaptersTotal > chapters.length || allChaptersShown"
                type="button"
                class="chapter chapter--more"
                @click="toggleAllChapters"
              >
                {{ allChaptersShown ? 'Свернуть главы' : 'Показать все главы' }}
              </button>
            </div>

            <p v-else class="book-empty">Главы ещё не опубликованы.</p>
          </section>

          <section v-if="bookPosts.length" class="book-section">
            <header class="book-section__head">
              <h2>Посты о книге</h2>
              <router-link :to="{ name: 'Posts', query: { book: book.id } }" class="book-section__link">
                Все {{ bookPosts.length }} {{ postWord(bookPosts.length) }}
              </router-link>
            </header>

            <div class="book-posts">
              <router-link
                v-for="(post, index) in bookPosts.slice(0, 2)"
                :key="post.id"
                :to="{ name: 'Post', params: { id: post.id } }"
                class="book-post"
              >
                <div class="book-post__media" :style="postMediaStyle(post, index)">
                  <img
                    v-if="post.image && !isBroken(`post-${post.id}`)"
                    :src="post.image"
                    :alt="post.title"
                    loading="lazy"
                    @error="markBroken(`post-${post.id}`)"
                  />
                  <span v-else class="book-post__letter" aria-hidden="true">{{ initialOf(post.title) }}</span>
                </div>

                <div class="book-post__body">
                  <div class="book-post__meta">
                    <span v-if="tagOf(post)" class="book-chip">{{ tagOf(post) }}</span>
                    <time>{{ dateLabel(post) }}</time>
                  </div>
                  <h3>{{ post.title }}</h3>
                  <p>{{ excerptOf(post, 90) }}</p>
                  <span class="book-post__author">{{ post.user?.name || 'Читатель' }}</span>
                </div>
              </router-link>
            </div>
          </section>

          <!-- ==================== COMMENTS ==================== -->
          <section class="book-comments">
            <editorial-comments
              commentable-type="App\Models\Book"
              :commentable-id="book.id"
            />
          </section>
        </div>
      </div>
    </main>

    <footer-vue />
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapGetters, mapState } from 'vuex';
import EditorialComments from '@/components/Comments/EditorialComments.vue';
import StarRating from '@/components/Books/StarRating.vue';

const COVER_COLORS = ['#36513F', '#24324A', '#A8843F', '#2B2B2B', '#7C8F74', '#6B2E2E'];

export default {
  name: 'BookPage',
  components: { EditorialComments, StarRating },
  data() {
    return {
      chapters: [],
      chaptersTotal: 0,
      chaptersPage: 1,
      allChaptersShown: false,
      bookPosts: [],
      inWishlist: false,
      userRating: 0,
      ratingsCount: 0,
      ratingAverage: 0,
      ratingBusy: false,
      wishlistBusy: false,
      wishlistError: '',
      ratingError: '',
      broken: {},
    };
  },
  computed: {
    ...mapState('book', {
      book: (state) => state.book,
      loading: (state) => state.loading,
      error: (state) => state.error,
    }),
    ...mapGetters('auth', ['user']),

    errorTitle() {
      if (this.error === 'auth') return 'Войдите, чтобы открыть книгу';
      if (this.error === 'notfound') return 'Книга не найдена';
      return 'Не удалось загрузить книгу';
    },

    errorText() {
      if (this.error === 'auth') return 'Карточки книг открываются после входа в аккаунт.';
      if (this.error === 'notfound') return 'Возможно, книгу удалили или ссылка устарела.';
      return 'Попробуйте обновить страницу.';
    },

    genre() {
      return this.book?.categories?.[0]?.name || 'Книга';
    },

    coverStyle() {
      const seed = Number(this.book?.id || 0);
      return { '--cover-color': COVER_COLORS[seed % COVER_COLORS.length] };
    },

    ratingLabel() {
      const value = Number(this.ratingAverage || this.book?.average_rating || this.book?.rating || 0);
      return value ? value.toFixed(1).replace('.', ',') : '—';
    },

    ratingWord() {
      const count = this.ratingsCount;
      const mod10 = count % 10;
      const mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) return 'оценка';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'оценки';
      return 'оценок';
    },

    ratingHint() {
      if (this.ratingError) return this.ratingError;
      if (this.userRating) return '';
      if (!this.user?.id) return 'Войдите, чтобы оценить';
      return 'Оцените книгу';
    },

    chaptersCount() {
      return Number(this.chaptersTotal || this.book?.chapters_count || 0);
    },

    yearLabel() {
      const raw = this.book?.created_at;
      if (!raw) return '';
      const date = new Date(raw);
      return Number.isNaN(date.getTime()) ? '' : String(date.getFullYear());
    },

    descriptionParagraphs() {
      return String(this.book?.description || '')
        .split(/\n+/)
        .map((part) => part.trim())
        .filter(Boolean);
    },

    readingLink() {
      const first = this.chapters[0];
      if (!first) return { name: 'Book', params: { id: this.book?.id } };
      return { name: 'Chapter', params: { bookId: this.book?.id, chapterId: first.id } };
    },

    hasProgress() {
      try {
        return Boolean(localStorage.getItem(`libraria:last-chapter:${this.book?.id}`));
      } catch (error) {
        return false;
      }
    },
  },
  watch: {
    '$route.params.id': 'loadAll',
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    ...mapActions('book', ['getBook']),

    async loadAll() {
      const id = this.$route.params.id;
      this.restoreWishlist();

      await this.getBook(id);

      if (this.error) return;

      this.syncRating();
      this.inWishlist = Boolean(this.book?.in_wishlist);

      await Promise.all([
        this.loadChapters(),
        this.loadPosts(),
      ]);
    },

    async rateBook(value) {
      if (!this.user?.id) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }
      if (this.ratingBusy || !this.book?.id) return;

      this.ratingBusy = true;
      this.ratingError = '';

      const url = `${process.env.VUE_APP_API_URL}/api/v1/books/${this.book.id}/rating`;
      const config = { headers: this.authHeaders() };

      try {
        // value = 0 → снимаем оценку; иначе ставим/меняем
        const { data } = value
          ? await axios.post(url, { value }, { ...config, headers: { ...config.headers, 'Content-Type': 'application/json' } })
          : await axios.delete(url, config);

        this.userRating = value || 0;
        this.ratingAverage = Number(data?.rating ?? 0);
        this.ratingsCount = Number(data?.ratings_count ?? 0);
      } catch (e) {
        this.ratingError = 'Не удалось сохранить оценку';
      } finally {
        this.ratingBusy = false;
      }
    },

    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    syncRating() {
      this.userRating = Number(this.book?.user_rating || 0);
      this.ratingsCount = Number(this.book?.ratings_count || 0);
      this.ratingAverage = Number(this.book?.average_rating || this.book?.rating || 0);
    },

    async loadChapters() {
      try {
        const { data } = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/v1/books/${this.$route.params.id}/chapters`,
          { params: { per_page: this.allChaptersShown ? 100 : 4 }, headers: this.authHeaders() }
        );
        this.chapters = data.chapters || [];
        this.chaptersTotal = Number(data.total_chapters) || this.chapters.length;
      } catch (error) {
        this.chapters = [];
      }
    },

    async toggleAllChapters() {
      this.allChaptersShown = !this.allChaptersShown;
      await this.loadChapters();
    },

    async loadPosts() {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/posts`, {
          params: { per_page: 50, sort: 'date_desc' },
          headers: { Accept: 'application/json' },
        });
        const bookId = Number(this.$route.params.id);
        this.bookPosts = (data.posts || []).filter((post) => Number(post.book_id) === bookId);
      } catch (error) {
        this.bookPosts = [];
      }
    },

    /* Список желаемого хранится в БД (таблица wishlists) */
    restoreWishlist() {
      this.inWishlist = Boolean(this.book?.in_wishlist);
    },

    async toggleWishlist() {
      if (!this.user?.id) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }
      if (this.wishlistBusy || !this.book?.id) return;

      this.wishlistBusy = true;
      const next = !this.inWishlist;
      const url = `${process.env.VUE_APP_API_URL}/api/v1/books/${this.book.id}/wishlist`;
      const config = { headers: this.authHeaders() };

      try {
        // у axios.delete второй аргумент — это config, а не тело запроса
        await (next ? axios.post(url, {}, config) : axios.delete(url, config));
        this.inWishlist = next;
        this.wishlistError = '';
      } catch (error) {
        this.wishlistError = 'Не удалось обновить список желаемого.';
      } finally {
        this.wishlistBusy = false;
      }
    },

    /* presentation */
    markBroken(key) {
      this.broken = { ...this.broken, [key]: true };
    },

    isBroken(key) {
      return Boolean(this.broken[key]);
    },

    postMediaStyle(post, index) {
      const seed = Number(post?.id ?? index) || index;
      return { '--media-color': COVER_COLORS[seed % COVER_COLORS.length] };
    },

    tagOf(post) {
      return post?.tags?.[0]?.name || post?.categories?.[0]?.name || '';
    },

    dateLabel(item) {
      const raw = item?.created_at;
      if (!raw) return '';
      const date = new Date(raw);
      return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    },

    excerptOf(post, limit = 120) {
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

    postWord(count) {
      const value = Math.abs(Number(count) || 0);
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'пост';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'поста';
      return 'постов';
    },

    chapterWord(count) {
      const value = Math.abs(Number(count) || 0);
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'глава';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'главы';
      return 'глав';
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

.book-page {
  background: var(--paper);
}

.shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

.book-state {
  padding: 80px 24px 120px;
  text-align: left;
}

.book-state h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 500;
  color: var(--ink);
}

.book-state p {
  margin: 10px 0 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.book-layout {
  display: grid;
  grid-template-columns: 373px minmax(0, 1fr);
  gap: 48px;
  align-items: start;
  padding-top: 41px;
  padding-bottom: 88px;
}

/* Aside */
.book-aside {
  position: sticky;
  top: 88px;
}

.book-aside__cover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  height: 480px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 8px;
  background: var(--cover-color, var(--accent));
  box-shadow: 0 20px 40px rgba(30, 33, 36, 0.16);
}

.book-aside__cover > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-aside__cover .cover-art {
  height: 100%;
  border-radius: 8px;
}

.book-aside__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 373px;
  max-width: 100%;
  height: 50px;
  margin: 16px auto 0;
  font-family: var(--font-sans);
  font-size: 14px;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.book-aside__btn:first-of-type {
  margin-top: 16px;
}

.book-aside__btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
  border: 0;
}

.book-aside__btn--primary:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
}

.book-aside__btn--ghost {
  color: var(--ink);
  background: var(--cream);
  border: 1px solid var(--line);
}

.book-aside__btn--ghost:hover {
  background: var(--surface-hover);
}

.book-aside__btn .icon-bookmark {
  font-size: 12px;
}

/* Body */
.book-body {
  min-width: 0;
}

.book-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 12px;
  color: var(--text-muted);
}

.book-meta__rating-value {
  margin-left: 10px;
  font-size: 11px;
  color: var(--text-secondary);
}

.book-meta__rating-value b {
  font-weight: 600;
  color: var(--ink);
}

.book-meta__rating-own {
  margin-left: 10px;
  padding: 2px 8px;
  font-size: 10px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 999px;
}

.book-meta__rating-hint {
  margin-left: 10px;
  font-size: 11px;
  color: var(--text-muted);
}

.book-meta__rating {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.book-meta__rating b {
  font-weight: 500;
  color: var(--text-secondary);
}

.book-meta__rating .icon-star {
  font-size: 11px;
  color: var(--gold);
}

.book-meta__item {
  position: relative;
  padding-left: 18px;
}

.book-meta__item::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 1px;
  height: 12px;
  background: var(--line);
  content: '';
  transform: translateY(-50%);
}

.book-title {
  margin: 22px 0 0;
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--ink);
}

.book-author {
  margin: 8px 0 0;
  font-size: 15px;
  color: var(--text-secondary);
}

.book-label {
  margin: 30px 0 0;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.book-desc {
  margin-top: 12px;
}

.book-desc p {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.book-desc__empty {
  color: var(--text-muted);
}

.book-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 26px 0 0;
  padding: 18px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.book-stats > div {
  padding-left: 20px;
  border-left: 1px solid var(--line);
}

.book-stats > div:first-child {
  padding-left: 0;
  border-left: 0;
}

.book-stats dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--ink);
}

.book-stats dd.book-stats__text {
  font-size: 16px;
}

.book-stats dt {
  margin-top: 4px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Sections */
.book-section {
  margin-top: 42px;
}

.book-section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.book-section__head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.book-section__head > span {
  font-size: 12px;
  color: var(--text-muted);
}

.book-section__link {
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
}

.book-section__link:hover {
  color: var(--accent);
}

.book-section__more {
  display: block;
  width: 100%;
  padding: 12px 0;
  margin-top: 14px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 10px;
  cursor: pointer;
}

.book-empty {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}

.book-empty a {
  color: var(--accent);
}

/* Chapters */
.chapters {
  overflow: hidden;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 18px;
}

.chapter {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  color: var(--ink);
  text-decoration: none;
  border-top: 1px solid var(--line);
}

.chapter:first-child {
  border-top: 0;
}

.chapter:hover {
  background: var(--surface-hover);
}

.chapter--more {
  justify-content: center;
  width: 100%;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-top: 1px solid var(--line);
  cursor: pointer;
}

.chapter__num {
  display: inline-flex;
  flex: 0 0 24px;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--paper);
  border-radius: 50%;
}

.chapter__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter__state {
  font-size: 11px;
  color: var(--accent);
}

.chapter__lock,
.chapter__arrow {
  font-size: 11px;
  color: var(--text-muted);
}

/* Posts about */
.book-posts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.book-post {
  display: flex;
  gap: 14px;
  padding: 16px;
  text-decoration: none;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.book-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(30, 33, 36, 0.08);
}

.book-post__media {
  display: flex;
  flex: 0 0 64px;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 10px;
  background-color: var(--media-color, var(--accent));
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.045) 0 2px, transparent 2px 10px);
}

.book-post__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-post__letter {
  font-family: var(--font-display);
  font-size: 24px;
  color: rgba(251, 248, 242, 0.5);
}

.book-post__body {
  min-width: 0;
}

.book-post__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
}

.book-chip {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  font-size: 10px;
  color: var(--accent);
  background: #e6eddd;
  border-radius: 999px;
}

.book-post h3 {
  margin: 8px 0 0;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
}

.book-post p {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.book-post__author {
  display: block;
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-muted);
}

/* Comments */
.book-comments {
  margin-top: 46px;
  padding-top: 34px;
  border-top: 1px solid var(--line);
}


/* Responsive */
@media (max-width: 1024px) {
  .book-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    padding-top: 24px;
  }

  .book-aside {
    position: static;
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 20px;
    align-items: start;
  }

  .book-aside__cover {
    width: 200px;
    height: 300px;
    margin: 0;
    grid-row: span 2;
  }

  .book-aside__btn {
    width: 100%;
    margin: 0;
  }

  .book-title {
    font-size: 32px;
  }

  .book-posts {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 760px) {
  .book-aside__cover {
    width: 200px;
    height: 300px;
    margin: 0 auto;
  }

  .book-aside__btn {
    height: 46px;
    font-size: 13px;
  }

  .book-title {
    margin-top: 20px;
    font-size: 26px;
  }

  .book-meta {
    flex-wrap: wrap;
    gap: 10px;
    font-size: 11px;
  }

  .book-desc p {
    font-size: 13.5px;
  }

  .book-section__head h2 {
    font-size: 22px;
  }

  .chapter {
    padding: 13px 14px;
    gap: 10px;
  }

  .chapter__title {
    font-size: 13px;
  }

  .book-post {
    flex-direction: column;
    gap: 10px;
  }

  .book-post__media {
    flex-basis: auto;
    width: 100%;
    height: 140px;
  }
}

@media (max-width: 760px) {
  .book-aside {
    grid-template-columns: minmax(0, 1fr);
  }

  .book-aside__cover {
    width: 200px;
    height: 300px;
    margin: 0 auto;
    aspect-ratio: auto;
    grid-row: auto;
  }

  .book-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 0;
  }

  .book-stats > div:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }

  .book-title {
    font-size: 28px;
  }
}
</style>
