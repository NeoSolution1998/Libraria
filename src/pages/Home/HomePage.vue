<template>
  <div class="hm-page">
    <header-vue />

    <main class="hm-main">
      <section class="hm-hero">
        <div class="container-wide hm-hero__inner">
          <div class="hm-hero__copy">
            <span class="hm-kicker">
              <i aria-hidden="true"></i>
              ГЛАВНАЯ · LIBRARIA
            </span>

            <h1 v-if="user" class="hm-hero__title">
              С возвращением,<br />
              <em>{{ user.name }}</em>
            </h1>
            <h1 v-else class="hm-hero__title">
              Читайте. <em>Обсуждайте.</em><br />
              Возвращайтесь.
            </h1>

            <p class="hm-hero__text">
              {{ user
                ? 'Ваша лента, подписки и новые книги — всё, что стоит открыть сегодня.'
                : 'Личное пространство для книг, заметок и разговоров о прочитанном.' }}
            </p>

            <div class="hm-hero__actions">
              <router-link :to="{ name: 'Books' }" class="hm-btn hm-btn--primary">
                Открыть каталог
                <span class="icon-right-open" aria-hidden="true"></span>
              </router-link>

              <router-link v-if="user" :to="{ name: 'PostCreate' }" class="hm-btn hm-btn--ghost">
                <span class="icon-pencil" aria-hidden="true"></span>
                Написать пост
              </router-link>

              <template v-else>
                <router-link :to="{ name: 'Registration' }" class="hm-btn hm-btn--ghost">
                  Создать аккаунт
                </router-link>
              </template>
            </div>

            <div class="hm-hero__stats">
              <div class="hm-hero__stat">
                <b>{{ user ? heroStats.following : publicAuthors.length }}</b>
                <span>
                  {{ user
                    ? plural(heroStats.following, ['подписка', 'подписки', 'подписок'])
                    : plural(publicAuthors.length, ['автор', 'автора', 'авторов']) }}
                </span>
              </div>
              <div class="hm-hero__stat">
                <b>{{ heroStats.posts }}</b>
                <span>{{ plural(heroStats.posts, ['публикация', 'публикации', 'публикаций']) }}</span>
              </div>
              <div class="hm-hero__stat">
                <b>{{ heroStats.books }}</b>
                <span>
                  {{ plural(heroStats.books, ['книга', 'книги', 'книг']) }}
                  {{ user ? 'в профиле' : 'в каталоге' }}
                </span>
              </div>
            </div>
          </div>

          <aside class="hm-hero__aside">
            <div class="hm-today">
              <span class="hm-today__label">СЕГОДНЯ</span>
              <strong>{{ todayLabel }}</strong>
            </div>

            <div class="hm-quote">
              <span class="hm-quote__mark" aria-hidden="true">“</span>
              <p>
                Книга — это разговор, который начинается с автора
                и продолжается с читателем.
              </p>
              <span class="hm-quote__author">Libraria</span>
            </div>
          </aside>
        </div>
      </section>

      <div class="container-wide hm-content">
        <div v-if="error" class="hm-error" role="alert">
          <span class="icon-attention-alt" aria-hidden="true"></span>
          {{ error }}
        </div>

        <div class="hm-grid">
          <div class="hm-main-column">
            <!-- Subscriptions / authors -->
            <section class="hm-section">
              <header class="hm-section__head">
                <div>
                  <span class="hm-kicker">СООБЩЕСТВО</span>
                  <h2>{{ authorsSectionTitle }}</h2>
                </div>
                <router-link v-if="user" :to="{ name: 'Profile' }" class="hm-link">
                  Мой профиль
                  <span class="icon-right-open" aria-hidden="true"></span>
                </router-link>
              </header>

              <div v-if="authorsToShow.length" class="hm-authors">
                <article v-for="author in authorsToShow" :key="author.id" class="hm-author">
                  <router-link :to="{ name: 'Profile', params: { id: author.id } }" class="hm-author__main">
                    <span class="hm-author__avatar">
                      <img v-if="author.avatar" :src="author.avatar" :alt="author.name" />
                      <span v-else>{{ initialsOf(author.name) }}</span>
                    </span>
                    <span class="hm-author__info">
                      <strong>{{ author.name }}</strong>
                      <small>{{ author.city || authorRole(author) }}</small>
                    </span>
                  </router-link>

                  <button
                    v-if="user && !isFollowing(author)"
                    type="button"
                    class="hm-author__follow"
                    :disabled="followingId === author.id"
                    @click="followAuthor(author)"
                  >
                    <span class="icon-user-plus" aria-hidden="true"></span>
                    Подписаться
                  </button>
                  <span v-else-if="user" class="hm-author__following">вы подписаны</span>
                  <span v-else class="hm-author__posts">
                    {{ author.posts_count || 0 }}
                    {{ plural(author.posts_count || 0, ['публикация', 'публикации', 'публикаций']) }}
                  </span>
                </article>
              </div>

              <div v-else class="hm-empty hm-empty--compact">
                <span class="icon-users" aria-hidden="true"></span>
                <p>Пока здесь нет авторов. Откройте каталог и найдите первые книги.</p>
              </div>
            </section>

            <!-- Feed -->
            <section class="hm-section">
              <header class="hm-section__head">
                <div>
                  <span class="hm-kicker">ЧИТАТЬ СЕЙЧАС</span>
                  <h2>{{ feedTitle }}</h2>
                </div>
                <router-link :to="{ name: 'Posts' }" class="hm-link">
                  Все посты
                  <span class="icon-right-open" aria-hidden="true"></span>
                </router-link>
              </header>

              <div v-if="feedPosts.length" class="hm-posts">
                <article v-for="post in feedPosts" :key="post.id" class="hm-post">
                  <router-link
                    :to="{ name: 'Post', params: { id: post.id } }"
                    class="hm-post__cover"
                    :style="postGradient(post)"
                    :aria-label="`Читать: ${post.title}`"
                  >
                    <img v-if="post.image" :src="post.image" :alt="post.title" loading="lazy" />
                    <template v-else>
                      <span class="hm-post__initial" aria-hidden="true">{{ initialOf(post.title) }}</span>
                      <span class="hm-post__quote" aria-hidden="true">“</span>
                    </template>
                    <span v-if="firstTag(post)" class="hm-post__tag">{{ firstTag(post) }}</span>
                  </router-link>

                  <div class="hm-post__body">
                    <div class="hm-post__meta">
                      <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
                      <span aria-hidden="true">·</span>
                      <span>{{ readingTime(post.content) }} мин</span>
                      <template v-if="post.user">
                        <span aria-hidden="true">·</span>
                        <span>{{ post.user.name }}</span>
                      </template>
                    </div>
                    <h3>
                      <router-link :to="{ name: 'Post', params: { id: post.id } }">{{ post.title }}</router-link>
                    </h3>
                    <p>{{ excerpt(post.content, 130) }}</p>
                    <footer>
                      <span><span class="icon-heart" aria-hidden="true"></span> {{ post.likes_count || 0 }}</span>
                      <span><span class="icon-chat" aria-hidden="true"></span> {{ post.comments_count || 0 }}</span>
                      <span><span class="icon-eye" aria-hidden="true"></span> {{ post.views_count || 0 }}</span>
                    </footer>
                  </div>
                </article>
              </div>

              <div v-else class="hm-empty">
                <span class="icon-chat" aria-hidden="true"></span>
                <h3>Здесь пока тихо</h3>
                <p>Подпишитесь на авторов или начните разговор первым.</p>
                <router-link v-if="user" :to="{ name: 'PostCreate' }" class="hm-btn hm-btn--primary">
                  Написать пост
                </router-link>
              </div>
            </section>

            <!-- New books -->
            <section class="hm-section">
              <header class="hm-section__head">
                <div>
                  <span class="hm-kicker">КАТАЛОГ</span>
                  <h2>Новые книги</h2>
                </div>
                <router-link :to="{ name: 'Books' }" class="hm-link">
                  Все книги
                  <span class="icon-right-open" aria-hidden="true"></span>
                </router-link>
              </header>

              <div v-if="newBooks.length" class="hm-books">
                <article v-for="book in newBooks" :key="book.id" class="hm-book">
                  <router-link
                    :to="{ name: 'Book', params: { id: book.id } }"
                    class="hm-book__cover"
                    :style="bookGradient(book)"
                    :aria-label="`Открыть книгу: ${book.title}`"
                  >
                    <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" loading="lazy" />
                    <span v-else class="hm-book__initial" aria-hidden="true">{{ initialOf(book.title) }}</span>
                  </router-link>
                  <div class="hm-book__body">
                    <h3><router-link :to="{ name: 'Book', params: { id: book.id } }">{{ book.title }}</router-link></h3>
                    <p>{{ book.author || 'Автор не указан' }}</p>
                    <span class="hm-book__meta">
                      <span class="icon-star" aria-hidden="true"></span>
                      {{ book.rating || book.average_rating || '—' }}
                    </span>
                  </div>
                </article>
              </div>
            </section>
          </div>

          <aside class="hm-aside">
            <section v-if="user" class="hm-side">
              <header class="hm-side__head">
                <span class="hm-kicker">ВАША АКТИВНОСТЬ</span>
                <h3>Читательская сводка</h3>
              </header>
              <ul class="hm-side-stats">
                <li>
                  <span>Подписки</span>
                  <b>{{ heroStats.following }}</b>
                </li>
                <li>
                  <span>Публикации</span>
                  <b>{{ heroStats.posts }}</b>
                </li>
                <li>
                  <span>Книги</span>
                  <b>{{ heroStats.books }}</b>
                </li>
              </ul>
              <router-link :to="{ name: 'Profile' }" class="hm-side-link">
                Открыть профиль
                <span class="icon-right-open" aria-hidden="true"></span>
              </router-link>
            </section>

            <section v-if="plans.length" class="hm-side">
              <header class="hm-side__head">
                <span class="hm-kicker">ПОДПИСКИ</span>
                <h3>Тарифы библиотеки</h3>
              </header>
              <div class="hm-plans">
                <div v-for="plan in plans" :key="plan.id" class="hm-plan">
                  <div>
                    <strong>{{ plan.name }}</strong>
                    <small>{{ plan.duration_months }} мес · {{ plan.access_level === 'premium' ? 'премиум' : 'базовый' }}</small>
                  </div>
                  <b>{{ formatPrice(plan.price) }}</b>
                </div>
              </div>
              <p class="hm-side-note">Доступ к библиотеке на выбранный срок.</p>
            </section>

            <section v-if="popularBooks.length" class="hm-side">
              <header class="hm-side__head">
                <span class="hm-kicker">ВЫБОР ЧИТАТЕЛЕЙ</span>
                <h3>Популярные книги</h3>
              </header>
              <div class="hm-mini-books">
                <router-link
                  v-for="book in popularBooks"
                  :key="book.id"
                  :to="{ name: 'Book', params: { id: book.id } }"
                  class="hm-mini-book"
                >
                  <span class="hm-mini-book__cover" :style="bookGradient(book)">
                    <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" loading="lazy" />
                    <span v-else>{{ initialOf(book.title) }}</span>
                  </span>
                  <span class="hm-mini-book__info">
                    <strong>{{ book.title }}</strong>
                    <small>{{ book.author || 'Автор не указан' }}</small>
                  </span>
                  <span class="icon-right-open" aria-hidden="true"></span>
                </router-link>
              </div>
            </section>

            <section class="hm-side hm-side--note">
              <span class="hm-quote__mark" aria-hidden="true">“</span>
              <p>Хорошая книга не заканчивается на последней странице — она продолжается в разговоре.</p>
              <span class="hm-side-note">Libraria</span>
            </section>
          </aside>
        </div>
      </div>
    </main>

    <footer-vue />

    <transition name="hm-toast">
      <div v-if="toastMessage" class="hm-toast" role="status">
        <span class="icon-ok" aria-hidden="true"></span>
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapGetters } from 'vuex';

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #20262b 0%, #3a3025 58%, #a97436 140%)',
  'linear-gradient(135deg, #1e2a28 0%, #2e3a31 55%, #8b7a4a 140%)',
  'linear-gradient(135deg, #2a2024 0%, #3b2b2b 55%, #b8793d 140%)',
  'linear-gradient(135deg, #242a35 0%, #1e242c 55%, #6f7d64 140%)',
  'linear-gradient(135deg, #302a20 0%, #1f2326 55%, #c18a42 140%)',
];

export default {
  name: 'HomePage',
  data() {
    return {
      feed: null,
      publicBooks: [],
      publicPosts: [],
      publicAuthors: [],
      publicTotalBooks: 0,
      publicTotalPosts: 0,
      loading: true,
      error: '',
      followingId: null,
      toastMessage: '',
      toastTimer: null,
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    todayLabel() {
      const date = new Date();
      return date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    },
    authorIdsFollowing() {
      return (this.feed?.following || []).map((author) => Number(author.id));
    },
    authorsToShow() {
      if (this.feed?.following?.length) return this.feed.following;
      if (this.feed?.suggested_authors?.length) return this.feed.suggested_authors;
      return this.publicAuthors;
    },
    authorsSectionTitle() {
      if (this.feed?.following?.length) return 'Мои подписки';
      if (this.user) return 'Кого почитать';
      return 'Авторы библиотеки';
    },
    feedPosts() {
      if (this.feed?.posts?.length) return this.feed.posts;
      if (this.feed?.recommended_posts?.length) return this.feed.recommended_posts;
      return this.publicPosts;
    },
    feedTitle() {
      if (this.feed?.posts?.length) return 'Из ваших подписок';
      if (this.feed?.recommended_posts?.length) return 'Рекомендуем к прочтению';
      return 'Свежие публикации';
    },
    newBooks() {
      return this.feed?.new_books?.length ? this.feed.new_books : this.publicBooks;
    },
    popularBooks() {
      return this.feed?.popular_books?.length ? this.feed.popular_books : this.publicBooks.slice(0, 4);
    },
    plans() {
      return this.feed?.plans || [];
    },
    heroStats() {
      return {
        following: this.feed?.stats?.following_count ?? (this.feed?.following?.length || 0),
        posts: this.feed?.stats?.posts_count ?? this.publicTotalPosts ?? 0,
        books: this.feed?.stats?.books_count ?? (this.publicTotalBooks || '—'),
      };
    },
  },
  async mounted() {
    await this.loadPage();
  },
  beforeUnmount() {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  },
  methods: {
    ...mapActions('auth', ['fetchUser']),

    async loadPage() {
      this.loading = true;
      this.error = '';

      if (!this.user && Cookies.get('auth_token')) {
        await this.fetchUser();
      }

      if (this.user) {
        try {
          this.feed = await this.fetchFeed();
        } catch (error) {
          this.error = 'Не удалось загрузить ленту.';
        }
      }

      if (!this.feed) {
        await this.loadPublic();
      }

      this.loading = false;
    },
    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },
    async fetchFeed() {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/feed`, {
        headers: this.authHeaders(),
      });
      return response.data;
    },
    async loadPublic() {
      const apiUrl = process.env.VUE_APP_API_URL;

      try {
        const [booksResponse, postsResponse, authorsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/v1/books`, {
            params: { per_page: 4, sort: 'date_desc' },
            headers: { Accept: 'application/json' },
          }),
          axios.get(`${apiUrl}/api/v1/posts`, {
            params: { per_page: 6, sort: 'date_desc' },
            headers: { Accept: 'application/json' },
          }),
          axios.get(`${apiUrl}/api/v1/posts/authors`, {
            params: { limit: 4 },
            headers: { Accept: 'application/json' },
          }),
        ]);

        this.publicBooks = booksResponse.data?.books || [];
        this.publicTotalBooks = booksResponse.data?.total_books || 0;
        this.publicPosts = postsResponse.data?.posts || [];
        this.publicTotalPosts = postsResponse.data?.total_posts || 0;
        this.publicAuthors = authorsResponse.data?.authors || [];
      } catch (error) {
        this.error = 'Не удалось загрузить материалы библиотеки.';
      }
    },
    async followAuthor(author) {
      if (!this.user || this.followingId) return;

      this.followingId = author.id;

      try {
        await axios.post(
          `${process.env.VUE_APP_API_URL}/api/v1/users/${author.id}/follow`,
          {},
          { headers: this.authHeaders() }
        );
        this.feed = await this.fetchFeed();
        this.showToast(`Вы подписались на ${author.name}`);
      } catch (error) {
        this.showToast('Не удалось оформить подписку');
      } finally {
        this.followingId = null;
      }
    },
    showToast(message) {
      this.toastMessage = message;
      if (this.toastTimer) window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.toastMessage = '';
      }, 2600);
    },
    initialsOf(name) {
      return String(name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },
    initialOf(title) {
      return String(title || 'L').trim().slice(0, 1).toUpperCase();
    },
    isFollowing(author) {
      return this.authorIdsFollowing.includes(Number(author.id));
    },
    plural(value, forms) {
      const number = Math.abs(Number(value) || 0);
      const mod10 = number % 10;
      const mod100 = number % 100;

      if (mod10 === 1 && mod100 !== 11) return forms[0];
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return forms[1];
      return forms[2];
    },
    authorRole(author) {
      return author.city || 'читатель библиотеки';
    },
    postTags(post) {
      if (Array.isArray(post.tags) && post.tags.length) return post.tags;
      if (Array.isArray(post.categories)) return post.categories;
      return [];
    },
    firstTag(post) {
      return this.postTags(post)[0]?.name || '';
    },
    stripHtml(html) {
      if (!html) return '';
      if (typeof DOMParser === 'undefined') {
        return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      const doc = new DOMParser().parseFromString(String(html), 'text/html');
      return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    },
    excerpt(html, maxLength) {
      const text = this.stripHtml(html);
      if (text.length <= maxLength) return text;
      return `${text.slice(0, maxLength).trim()}…`;
    },
    readingTime(html) {
      const words = this.stripHtml(html).split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 180));
    },
    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      });
    },
    formatPrice(value) {
      const price = Number(value) || 0;
      return `${price.toLocaleString('ru-RU')} ₽`;
    },
    postGradient(post) {
      const index = Math.abs(Number(post.id) || 0) % CARD_GRADIENTS.length;
      return { background: CARD_GRADIENTS[index] };
    },
    bookGradient(book) {
      const index = Math.abs(Number(book.id) || 0) % CARD_GRADIENTS.length;
      return { background: CARD_GRADIENTS[index] };
    },
  },
};
</script>

<style scoped>
.hm-page {
  min-height: 100vh;
  background:
    radial-gradient(900px 380px at 90% -6%, rgba(231, 165, 74, 0.08), transparent 60%),
    var(--paper);
}

.hm-main {
  padding-bottom: var(--space-10);
}

/* Hero */
.hm-hero {
  padding: var(--space-10) 0 var(--space-8);
  border-bottom: 1px solid var(--line);
  background:
    radial-gradient(680px 300px at 92% 0%, rgba(231, 165, 74, 0.12), transparent 65%),
    var(--paper);
}

.hm-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(260px, 0.65fr);
  align-items: end;
  gap: var(--space-10);
}

.hm-kicker {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hm-kicker i {
  width: 22px;
  height: 1px;
  background: var(--accent);
}

.hm-hero__title {
  overflow-wrap: anywhere;
  margin: var(--space-4) 0 var(--space-4);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(38px, 5vw, 64px);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: 0.99;
}

.hm-hero__title em {
  color: var(--accent);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.hm-hero__text {
  max-width: 540px;
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.hm-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.hm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}

.hm-btn span {
  font-size: 9px;
}

.hm-btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
}

.hm-btn--primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  transform: translateY(-1px);
}

.hm-btn--ghost {
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
}

.hm-btn--ghost:hover {
  color: var(--ink);
  border-color: var(--ink);
  background: #fff;
}

.hm-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  margin-top: var(--space-6);
}

.hm-hero__stat {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 88px;
}

.hm-hero__stat b {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
}

.hm-hero__stat span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.hm-hero__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.hm-today {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 0 2px;
}

.hm-today__label {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.hm-today strong {
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: 11px;
  font-style: italic;
  font-weight: 400;
}

.hm-quote {
  position: relative;
  overflow: hidden;
  padding: var(--space-5);
  color: #f5efe3;
  background:
    radial-gradient(220px 160px at 90% 0%, rgba(231, 165, 74, 0.22), transparent 70%),
    var(--ink);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.hm-quote__mark {
  display: block;
  height: 28px;
  color: var(--accent);
  font-family: var(--font-serif);
  font-size: 54px;
  line-height: 0.8;
}

.hm-quote p {
  margin: 0 0 var(--space-3);
  color: var(--text-on-dark);
  font-family: var(--font-serif);
  font-size: 11.5px;
  font-style: italic;
  line-height: 1.6;
}

.hm-quote__author {
  color: rgba(232, 225, 213, 0.48);
  font-family: var(--font-sans);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

/* Layout */
.hm-content {
  padding-top: var(--space-6);
}

.hm-error {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  color: var(--danger);
  background: rgba(145, 32, 22, 0.05);
  border: 1px solid rgba(145, 32, 22, 0.16);
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
  font-size: 10.5px;
}

.hm-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  gap: var(--space-5);
}

.hm-main-column,
.hm-aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.hm-section {
  padding: var(--space-5);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.hm-section__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.hm-section__head h2 {
  margin: 3px 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.hm-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  padding-bottom: 2px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--line);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.hm-link:hover {
  color: var(--accent-hover);
  border-color: var(--accent);
}

.hm-link span {
  font-size: 8px;
}

/* Authors */
.hm-authors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
}

.hm-author {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.hm-author:hover {
  background: var(--paper);
  border-color: var(--line);
}

.hm-author__main {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.hm-author__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  overflow: hidden;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.14);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
}

.hm-author__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hm-author__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.hm-author__info strong {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hm-author__info small {
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hm-author__follow {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 5px 8px;
  color: var(--text-on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 600;
  cursor: pointer;
}

.hm-author__follow:disabled {
  opacity: 0.6;
  cursor: wait;
}

.hm-author__following {
  flex-shrink: 0;
  color: #9d6d33;
  font-family: var(--font-sans);
  font-size: 8.5px;
}

.hm-author__posts {
  flex-shrink: 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

/* Posts */
.hm-posts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.hm-post {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.hm-post:hover {
  border-color: rgba(231, 165, 74, 0.5);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.hm-post__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 132px;
  overflow: hidden;
  color: #f6efe2;
  text-decoration: none;
}

.hm-post__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(10, 12, 13, 0.4));
}

.hm-post__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hm-post__initial {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.1);
  font-family: var(--font-display);
  font-size: 110px;
  font-weight: 700;
  line-height: 1;
}

.hm-post__quote {
  position: absolute;
  z-index: 1;
  bottom: 10px;
  right: 12px;
  color: rgba(231, 165, 74, 0.75);
  font-family: var(--font-serif);
  font-size: 34px;
  line-height: 1;
}

.hm-post__tag {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 2;
  max-width: calc(100% - 16px);
  padding: 3px 7px;
  overflow: hidden;
  color: #f6efe2;
  background: rgba(15, 17, 18, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hm-post__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-3);
}

.hm-post__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

.hm-post__body h3 {
  display: -webkit-box;
  margin: 0 0 5px;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hm-post__body h3 a {
  color: inherit;
  text-decoration: none;
}

.hm-post__body h3 a:hover {
  color: var(--accent-hover);
}

.hm-post__body > p {
  display: -webkit-box;
  margin: 0 0 var(--space-2);
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 9.5px;
  line-height: 1.55;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hm-post__body footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
  padding-top: var(--space-2);
  border-top: 1px solid var(--line);
}

.hm-post__body footer span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

/* Books */
.hm-books {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-3);
}

.hm-book {
  min-width: 0;
}

.hm-book__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4.1;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.13);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 20px rgba(25, 27, 28, 0.14);
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.hm-book:hover .hm-book__cover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(25, 27, 28, 0.2);
}

.hm-book__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hm-book__initial {
  font-family: var(--font-display);
  font-size: 54px;
  font-weight: 700;
  line-height: 1;
}

.hm-book__body {
  padding-top: var(--space-2);
}

.hm-book__body h3 {
  display: -webkit-box;
  margin: 0 0 2px;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hm-book__body h3 a {
  color: inherit;
  text-decoration: none;
}

.hm-book__body h3 a:hover {
  color: var(--accent-hover);
}

.hm-book__body p {
  margin: 0 0 4px;
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hm-book__meta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #9d6d33;
  font-family: var(--font-sans);
  font-size: 8.5px;
}

/* Aside */
.hm-side {
  padding: var(--space-4);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.hm-side__head {
  margin-bottom: var(--space-3);
}

.hm-side__head h3 {
  margin: 2px 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.hm-side-stats {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hm-side-stats li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.hm-side-stats li b {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
}

.hm-side-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  height: 34px;
  margin-top: var(--space-3);
  padding: 0 var(--space-3);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
  text-decoration: none;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.hm-side-link:hover {
  color: var(--ink);
  border-color: var(--accent);
}

.hm-side-link span {
  margin-left: auto;
  font-size: 8px;
}

.hm-plans {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hm-plan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: 7px 8px;
  background: var(--paper);
  border-radius: var(--radius-md);
}

.hm-plan > div {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.hm-plan strong {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hm-plan small {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8px;
}

.hm-plan > b {
  color: #9d6d33;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.hm-side-note {
  margin: var(--space-2) 0 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  line-height: 1.5;
}

.hm-mini-books {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.hm-mini-book {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 5px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.hm-mini-book:hover {
  background: var(--paper);
}

.hm-mini-book__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 44px;
  flex-shrink: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.18);
  border-radius: 4px;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
}

.hm-mini-book__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hm-mini-book__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.hm-mini-book__info strong {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hm-mini-book__info small {
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hm-mini-book > span:last-child {
  color: var(--line-strong);
  font-size: 8px;
}

.hm-side--note {
  background:
    radial-gradient(220px 130px at 100% 0%, rgba(231, 165, 74, 0.1), transparent 70%),
    #fff;
}

.hm-side--note p {
  margin: 0 0 var(--space-2);
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: 11px;
  font-style: italic;
  line-height: 1.6;
}

.hm-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.hm-empty > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: var(--text-muted);
  background: var(--paper);
  border-radius: 50%;
  font-size: var(--text-base);
}

.hm-empty h3 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
}

.hm-empty p {
  max-width: 360px;
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 10px;
  line-height: 1.5;
}

.hm-empty--compact {
  padding: var(--space-5);
}

/* Toast */
.hm-toast {
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

.hm-toast span {
  color: var(--accent);
  font-size: 10px;
}

.hm-toast-enter-active,
.hm-toast-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.hm-toast-enter-from,
.hm-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

/* Responsive */
@media (max-width: 1080px) {
  .hm-hero__inner {
    grid-template-columns: minmax(0, 1.3fr) minmax(240px, 0.7fr);
    gap: var(--space-6);
  }

  .hm-grid {
    grid-template-columns: minmax(0, 1fr) 270px;
  }

  .hm-books {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .hm-hero__inner {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  .hm-hero__aside {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }

  .hm-today {
    display: none;
  }

  .hm-grid {
    grid-template-columns: 1fr;
  }

  .hm-aside {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hm-side--note {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .hm-hero {
    padding: var(--space-6) 0 var(--space-5);
  }

  .hm-hero__title {
  overflow-wrap: anywhere;
    font-size: clamp(32px, 10vw, 42px);
  }

  .hm-hero__aside {
    grid-template-columns: 1fr;
  }

  .hm-quote {
    display: none;
  }

  .hm-content {
    padding-top: var(--space-4);
  }

  .hm-section {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
  }

  .hm-section__head {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-2);
  }

  .hm-section__head h2 {
    font-size: var(--text-xl);
  }

  .hm-authors {
    grid-template-columns: 1fr;
  }

  .hm-posts {
    grid-template-columns: 1fr;
  }

  .hm-books {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .hm-aside {
    grid-template-columns: 1fr;
  }

  .hm-side--note {
    grid-column: auto;
  }

  .hm-hero__stats {
    gap: var(--space-4);
  }

  .hm-hero__stat {
    min-width: 74px;
  }

  .hm-hero__stat b {
    font-size: var(--text-xl);
  }
}
</style>
