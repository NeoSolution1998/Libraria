<template>
  <div class="post-page">
    <!-- Breadcrumbs / back -->
    <div class="post-page__top">
      <div class="container-wide post-page__top-inner">
        <nav class="post-breadcrumbs" aria-label="Хлебные крошки">
          <router-link :to="{ name: 'Posts' }">Посты</router-link>
          <span aria-hidden="true">/</span>
          <span class="post-breadcrumbs__current">{{ post?.title || 'Публикация' }}</span>
        </nav>

        <router-link :to="{ name: 'Posts' }" class="post-back">
          <span class="icon-left-open" aria-hidden="true"></span>
          Все посты
        </router-link>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="container-wide post-page__inner" aria-hidden="true">
      <div class="post-skeleton">
        <div class="post-skeleton__head">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="post-skeleton__cover"></div>
        <div class="post-skeleton__body">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="errorType" class="container-wide post-page__inner">
      <div class="post-error">
        <span class="post-error__icon icon-attention-alt" aria-hidden="true"></span>
        <span class="post-error__kicker">ПУБЛИКАЦИЯ</span>
        <h1>{{ errorTitle }}</h1>
        <p>{{ errorText }}</p>
        <div class="post-error__actions">
          <router-link
            v-if="errorType === 'auth'"
            :to="{ name: 'Login', query: { redirect: $route.fullPath } }"
            class="post-error__btn"
          >
            Войти в библиотеку
          </router-link>
          <button v-else type="button" class="post-error__btn" @click="fetchPost">
            Повторить
          </button>
          <router-link :to="{ name: 'Posts' }" class="post-error__btn post-error__btn--ghost">
            Все посты
          </router-link>
        </div>
      </div>
    </div>

    <!-- Article -->
    <div v-else-if="post" class="container-wide post-page__inner">
      <div class="post-layout">
        <article class="post-article">
          <header class="post-article__head">
            <div v-if="postTags.length" class="post-article__tags">
              <span v-for="tag in postTags" :key="tag.id || tag.name" class="post-article__tag">
                #{{ tag.name }}
              </span>
            </div>

            <h1 class="post-article__title">{{ post.title }}</h1>

            <p v-if="lead" class="post-article__lead">{{ lead }}</p>

            <div class="post-article__meta">
              <div class="post-author">
                <img
                  class="post-author__avatar"
                  :src="authorAvatar"
                  :alt="authorName"
                  loading="eager"
                />
                <div class="post-author__info">
                  <span class="post-author__name">{{ authorName }}</span>
                  <span class="post-author__role">автор публикации</span>
                </div>
              </div>

              <span class="post-article__meta-divider" aria-hidden="true"></span>

              <time class="post-article__date" :datetime="formattedDateTime">
                {{ formattedDate }}
              </time>

              <span class="post-article__meta-divider" aria-hidden="true"></span>

              <span class="post-article__reading">
                <span class="icon-hourglass-1" aria-hidden="true"></span>
                {{ readingTime }} мин чтения
              </span>
            </div>
          </header>

          <div v-if="post.image" class="post-article__cover">
            <img :src="post.image" :alt="post.title" loading="eager" />
          </div>

          <div v-else class="post-article__art" :style="coverStyle">
            <span class="post-article__art-quote" aria-hidden="true">“</span>
            <span class="post-article__art-initial">{{ initialLetter }}</span>
            <span v-if="firstTag" class="post-article__art-tag">{{ firstTag }}</span>
          </div>

          <div class="post-body">
            <template v-if="contentIsHtml">
              <div class="post-body__html" v-html="safeContent"></div>
            </template>
            <template v-else>
              <p v-for="(paragraph, index) in plainParagraphs" :key="index">{{ paragraph }}</p>
            </template>
          </div>

          <footer class="post-article__footer">
            <div class="post-actions">
              <button
                type="button"
                class="post-action"
                :class="{ 'is-liked': post.is_liked }"
                :aria-label="post.is_liked ? 'Убрать лайк' : 'Поставить лайк'"
                :aria-pressed="post.is_liked"
                @click="handleLikeClick"
              >
                <span :class="post.is_liked ? 'icon-heart' : 'icon-heart-empty'" aria-hidden="true"></span>
                <span>{{ post.likes_count || 0 }}</span>
              </button>

              <button type="button" class="post-action" aria-label="Перейти к комментариям" @click="scrollToComments">
                <span class="icon-chat" aria-hidden="true"></span>
                <span>{{ post.comments_count || 0 }}</span>
              </button>

              <span class="post-action post-action--static" aria-label="Просмотры">
                <span class="icon-eye" aria-hidden="true"></span>
                <span>{{ post.views_count || 0 }}</span>
              </span>

              <span class="post-actions__divider" aria-hidden="true"></span>

              <button type="button" class="post-action" aria-label="Поделиться" @click="sharePost">
                <span class="icon-share" aria-hidden="true"></span>
                <span>Поделиться</span>
              </button>

              <button
                type="button"
                class="post-action"
                :class="{ 'is-saved': isSaved }"
                :aria-label="isSaved ? 'Убрать из закладок' : 'Сохранить в закладки'"
                :aria-pressed="isSaved"
                @click="toggleSave"
              >
                <span :class="isSaved ? 'icon-bookmark' : 'icon-bookmark-empty'" aria-hidden="true"></span>
                <span>{{ isSaved ? 'Сохранено' : 'Сохранить' }}</span>
              </button>
            </div>
          </footer>

          <section id="post-comments" class="post-comments">
            <header class="post-comments__head">
              <span class="post-comments__kicker">ОБСУЖДЕНИЕ</span>
              <h2 class="post-comments__title">
                Комментарии
                <span v-if="post.comments_count">{{ post.comments_count }}</span>
              </h2>
            </header>

            <comments-vue
              :commentable-type="'App\\Models\\Post'"
              :commentable-id="post.id"
              @login-required="handleLoginRequired"
            />
          </section>
        </article>

        <aside class="post-side">
          <div class="post-side__sticky">
            <section class="post-side-card post-side-card--author">
              <span class="post-side-card__kicker">АВТОР ПУБЛИКАЦИИ</span>
              <div class="post-side-author">
                <img :src="authorAvatar" :alt="authorName" class="post-side-author__avatar" />
                <div>
                  <strong class="post-side-author__name">{{ authorName }}</strong>
                  <span class="post-side-author__caption">делится книжными находками</span>
                </div>
              </div>
              <p class="post-side-author__text">
                Материалы автора помогают читателям находить новые книги и обсуждать прочитанное.
              </p>
            </section>

            <section class="post-side-card">
              <span class="post-side-card__kicker">О ПУБЛИКАЦИИ</span>
              <ul class="post-side-meta">
                <li>
                  <span class="icon-calendar" aria-hidden="true"></span>
                  <span>Опубликовано</span>
                  <b>{{ formattedDate }}</b>
                </li>
                <li>
                  <span class="icon-hourglass-1" aria-hidden="true"></span>
                  <span>Чтение</span>
                  <b>{{ readingTime }} мин</b>
                </li>
                <li>
                  <span class="icon-eye" aria-hidden="true"></span>
                  <span>Просмотры</span>
                  <b>{{ post.views_count || 0 }}</b>
                </li>
                <li>
                  <span class="icon-heart" aria-hidden="true"></span>
                  <span>Лайки</span>
                  <b>{{ post.likes_count || 0 }}</b>
                </li>
                <li>
                  <span class="icon-chat" aria-hidden="true"></span>
                  <span>Комментарии</span>
                  <b>{{ post.comments_count || 0 }}</b>
                </li>
              </ul>
            </section>

            <section class="post-side-card post-side-card--share">
              <span class="post-side-card__kicker">ПОДЕЛИТЬСЯ</span>
              <p>Отправьте публикацию друзьям или сохраните ссылку на неё.</p>
              <div class="post-side-share">
                <button type="button" class="post-side-share__btn" @click="sharePost">
                  <span class="icon-share" aria-hidden="true"></span>
                  Поделиться
                </button>
                <button type="button" class="post-side-share__icon" aria-label="Скопировать ссылку" @click="copyLink">
                  <span class="icon-share-1" aria-hidden="true"></span>
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>

      <!-- Related posts -->
      <section v-if="related.length" class="post-related">
        <header class="post-related__head">
          <div>
            <span class="post-related__kicker">ЧИТАТЬ ДАЛЬШЕ</span>
            <h2>Похожие посты</h2>
          </div>
          <router-link :to="{ name: 'Posts' }" class="post-related__all">
            Все публикации
            <span class="icon-right-open" aria-hidden="true"></span>
          </router-link>
        </header>

        <div class="post-related__grid">
          <article v-for="item in related" :key="item.id" class="related-card">
            <router-link
              :to="{ name: 'Post', params: { id: item.id } }"
              class="related-card__cover"
              :style="coverStyleFor(item)"
              :aria-label="`Читать: ${item.title}`"
            >
              <img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" />
              <template v-else>
                <span class="related-card__quote" aria-hidden="true">“</span>
                <span class="related-card__initial">{{ initialOf(item.title) }}</span>
              </template>
              <span v-if="tagOf(item)" class="related-card__tag">{{ tagOf(item) }}</span>
            </router-link>

            <div class="related-card__body">
              <span class="related-card__date">{{ formatRelatedDate(item.created_at) }}</span>
              <h3>
                <router-link :to="{ name: 'Post', params: { id: item.id } }">
                  {{ item.title }}
                </router-link>
              </h3>
              <span class="related-card__author">{{ item.user?.name || 'Автор' }}</span>
            </div>
          </article>
        </div>
      </section>
    </div>

    <transition name="post-toast">
      <div v-if="toastMessage" class="post-toast" role="status">
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

const ART_GRADIENTS = [
  'linear-gradient(135deg, #20262b 0%, #3a3025 58%, #a97436 140%)',
  'linear-gradient(135deg, #1e2a28 0%, #2e3a31 55%, #8b7a4a 140%)',
  'linear-gradient(135deg, #2a2024 0%, #3b2b2b 55%, #b8793d 140%)',
  'linear-gradient(135deg, #242a35 0%, #1e242c 55%, #6f7d64 140%)',
  'linear-gradient(135deg, #302a20 0%, #1f2326 55%, #c18a42 140%)',
];

export default {
  name: 'PostDetail',
  props: ['id'],
  data() {
    return {
      post: null,
      related: [],
      loading: true,
      errorType: null,
      toastMessage: '',
      toastTimer: null,
      isSaved: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    postTags() {
      if (!this.post) return [];
      if (Array.isArray(this.post.tags) && this.post.tags.length) return this.post.tags;
      if (Array.isArray(this.post.categories)) return this.post.categories;
      return [];
    },
    firstTag() {
      return this.postTags[0]?.name || '';
    },
    authorName() {
      return this.post?.user?.name || 'Неизвестный автор';
    },
    authorAvatar() {
      return this.post?.user?.avatar || '/images/user_default.jpg';
    },
    initialLetter() {
      return String(this.post?.title || 'L').trim().slice(0, 1).toUpperCase();
    },
    postText() {
      return this.stripHtml(this.post?.content || '');
    },
    lead() {
      if (!this.post) return '';
      const text = this.postText;

      if (text.length < 280) return '';
      return `${text.slice(0, 210).trim()}…`;
    },
    contentIsHtml() {
      return /<(p|h[1-6]|ul|ol|blockquote|div|br|pre|table)\b/i.test(String(this.post?.content || ''));
    },
    safeContent() {
      return this.sanitizeHtml(this.post?.content || '');
    },
    plainParagraphs() {
      return String(this.post?.content || '')
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
    },
    readingTime() {
      const words = this.postText.split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 180));
    },
    formattedDate() {
      if (!this.post?.created_at) return '';
      return this.formatDateValue(this.post.created_at, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formattedDateTime() {
      if (!this.post?.created_at) return '';
      const date = new Date(this.post.created_at);
      return Number.isNaN(date.getTime()) ? '' : date.toISOString();
    },
    coverStyle() {
      return { background: this.gradientFor(this.post) };
    },
    errorTitle() {
      if (this.errorType === 'auth') return 'Войдите, чтобы прочитать пост';
      if (this.errorType === 'notfound') return 'Пост не найден';
      return 'Не удалось загрузить пост';
    },
    errorText() {
      if (this.errorType === 'auth') {
        return 'Этот материал доступен авторизованным читателям. Войдите в аккаунт, и мы вернём вас на эту страницу.';
      }
      if (this.errorType === 'notfound') {
        return 'Возможно, публикация была удалена или ссылка устарела.';
      }
      return 'Проверьте подключение к библиотеке и попробуйте ещё раз.';
    },
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.fetchPost();
      },
    },
  },
  beforeUnmount() {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  },
  methods: {
    ...mapActions({
      getPost: 'posts/getPost',
      togglePostLike: 'posts/togglePostLike',
    }),

    async fetchPost() {
      this.loading = true;
      this.errorType = null;
      this.post = null;
      this.related = [];

      try {
        await this.getPost(this.id);
        this.post = this.$store.state.posts.post;

        if (!this.post) {
          this.errorType = 'notfound';
          return;
        }

        this.isSaved = this.readSavedPosts().includes(Number(this.post.id));
        this.fetchRelated();
      } catch (error) {
        const status = error?.response?.status;
        this.errorType = status === 401 ? 'auth' : status === 404 ? 'notfound' : 'network';
        console.error('Не удалось загрузить пост:', error);
      } finally {
        this.loading = false;
      }

      this.$nextTick(() => {
        if (this.$route.hash === '#post-comments') {
          this.scrollToComments();
        }
      });
    },

    async fetchRelated() {
      if (!this.post) return;

      const authToken = Cookies.get('auth_token') ?? '';
      const headers = { Authorization: `Bearer ${authToken}`, Accept: 'application/json' };
      const url = `${process.env.VUE_APP_API_URL}/api/v1/posts`;
      const tag = this.firstTag;
      let collected = [];

      try {
        if (tag) {
          const response = await axios.get(url, {
            params: { per_page: 5, sort: 'date_desc', tags: tag },
            headers,
          });
          collected = response.data?.posts || [];
        }

        collected = collected.filter((item) => Number(item.id) !== Number(this.post.id));

        if (collected.length < 3) {
          const response = await axios.get(url, {
            params: { per_page: 8, sort: 'date_desc' },
            headers,
          });
          const extra = (response.data?.posts || []).filter(
            (item) =>
              Number(item.id) !== Number(this.post.id) &&
              !collected.some((existing) => Number(existing.id) === Number(item.id))
          );
          collected = collected.concat(extra);
        }

        this.related = collected.slice(0, 3);
      } catch (error) {
        console.warn('Не удалось загрузить похожие посты:', error);
      }
    },

    async handleLikeClick() {
      if (!this.post) return;

      if (!this.user) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }

      try {
        await this.togglePostLike(this.post.id);
        this.post = this.$store.state.posts.post;
      } catch (error) {
        console.error('Не удалось изменить лайк:', error);
        this.showToast('Не удалось изменить лайк');
      }
    },

    handleLoginRequired() {
      this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
    },

    scrollToComments() {
      document.getElementById('post-comments')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    },

    async sharePost() {
      const url = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({
            title: this.post?.title || 'Пост Libraria',
            text: this.lead || 'Интересный пост в книжном блоге Libraria',
            url,
          });
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }

      await this.copyLink();
    },

    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.showToast('Ссылка на пост скопирована');
      } catch (error) {
        this.showToast('Не удалось скопировать ссылку');
      }
    },

    toggleSave() {
      if (!this.post) return;

      const saved = this.readSavedPosts();
      const id = Number(this.post.id);
      const index = saved.indexOf(id);

      if (index === -1) {
        saved.push(id);
        this.isSaved = true;
        this.showToast('Пост сохранён в закладки');
      } else {
        saved.splice(index, 1);
        this.isSaved = false;
        this.showToast('Пост убран из закладок');
      }

      localStorage.setItem('libraria-saved-posts', JSON.stringify(saved));
    },

    readSavedPosts() {
      try {
        const raw = JSON.parse(localStorage.getItem('libraria-saved-posts') || '[]');
        return Array.isArray(raw) ? raw.map(Number) : [];
      } catch (error) {
        return [];
      }
    },

    showToast(message) {
      this.toastMessage = message;

      if (this.toastTimer) window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.toastMessage = '';
      }, 2600);
    },

    sanitizeHtml(html) {
      if (!html) return '';

      if (typeof DOMParser === 'undefined') {
        return String(html);
      }

      const doc = new DOMParser().parseFromString(String(html), 'text/html');

      doc.querySelectorAll('script, style, iframe, object, embed, form').forEach((node) => node.remove());

      doc.querySelectorAll('*').forEach((node) => {
        Array.from(node.attributes).forEach((attribute) => {
          const name = attribute.name.toLowerCase();
          const value = attribute.value.trim();

          if (name.startsWith('on') || (['href', 'src'].includes(name) && /^javascript:/i.test(value))) {
            node.removeAttribute(attribute.name);
          }
        });
      });

      return doc.body.innerHTML;
    },

    stripHtml(html) {
      if (!html) return '';

      if (typeof DOMParser === 'undefined') {
        return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }

      const doc = new DOMParser().parseFromString(String(html), 'text/html');
      return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    },

    gradientFor(item) {
      const index = Math.abs(Number(item?.id) || 0) % ART_GRADIENTS.length;
      return ART_GRADIENTS[index];
    },

    coverStyleFor(item) {
      return { background: this.gradientFor(item) };
    },

    initialOf(title) {
      return String(title || 'L').trim().slice(0, 1).toUpperCase();
    },

    tagOf(item) {
      if (Array.isArray(item?.tags) && item.tags.length) return item.tags[0].name;
      if (Array.isArray(item?.categories) && item.categories.length) return item.categories[0].name;
      return '';
    },

    formatDateValue(value, options) {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ru-RU', options);
    },

    formatRelatedDate(value) {
      return this.formatDateValue(value, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
  },
};
</script>

<style scoped>
.post-page {
  min-height: 100vh;
  background:
    radial-gradient(900px 400px at 92% -10%, rgba(231, 165, 74, 0.08), transparent 60%),
    var(--paper);
}

.post-page__top {
  padding: var(--space-4) 0 var(--space-2);
}

.post-page__top-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.post-breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.post-breadcrumbs a {
  color: #9d6d33;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.post-breadcrumbs a:hover {
  color: var(--accent-hover);
}

.post-breadcrumbs span[aria-hidden] {
  color: var(--line-strong);
}

.post-breadcrumbs__current {
  max-width: 420px;
  overflow: hidden;
  color: var(--text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-back {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 6px 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.post-back:hover {
  color: var(--accent-hover);
}

.post-back span {
  font-size: 8px;
}

.post-page__inner {
  padding-top: var(--space-4);
  padding-bottom: var(--space-16);
}

/* Layout */
.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 286px;
  align-items: start;
  gap: var(--space-6);
}

.post-article {
  min-width: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.post-article__head {
  padding: var(--space-8) var(--space-10) var(--space-6);
}

.post-article__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--space-4);
}

.post-article__tag {
  padding: 4px 9px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.1);
  border: 1px solid rgba(231, 165, 74, 0.26);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 500;
}

.post-article__title {
  margin: 0 0 var(--space-4);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(32px, 3.8vw, 48px);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.08;
  overflow-wrap: anywhere;
}

.post-article__lead {
  margin: 0 0 var(--space-5);
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
  line-height: 1.65;
}

.post-article__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.post-author {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.post-author__avatar {
  width: 38px;
  height: 38px;
  object-fit: cover;
  background: var(--surface-hover);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
}

.post-author__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.post-author__name {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
}

.post-author__role {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
}

.post-article__meta-divider {
  width: 1px;
  height: 24px;
  background: var(--line);
}

.post-article__date,
.post-article__reading {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.post-article__reading span {
  font-size: 10px;
}

/* Cover / art */
.post-article__cover {
  width: 100%;
  aspect-ratio: 16 / 8.5;
  overflow: hidden;
  background: var(--line);
}

.post-article__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-article__art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  overflow: hidden;
  color: #f6efe2;
}

.post-article__art::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(300px 200px at 80% 10%, rgba(255, 255, 255, 0.12), transparent 70%),
    linear-gradient(180deg, rgba(10, 12, 13, 0.02), rgba(10, 12, 13, 0.32));
}

.post-article__art-quote {
  position: relative;
  z-index: 1;
  color: rgba(231, 165, 74, 0.85);
  font-family: var(--font-serif);
  font-size: 168px;
  line-height: 0.7;
  transform: translateY(15px);
}

.post-article__art-initial {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  color: rgba(255, 255, 255, 0.08);
  font-family: var(--font-display);
  font-size: 230px;
  font-weight: 700;
  line-height: 1;
  transform: translate(-50%, -54%);
}

.post-article__art-tag {
  position: absolute;
  bottom: var(--space-4);
  left: var(--space-5);
  z-index: 2;
  color: rgba(246, 239, 226, 0.7);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

/* Body */
.post-body {
  padding: var(--space-6) var(--space-10) var(--space-8);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.82;
}

.post-body p {
  margin: 0 0 var(--space-4);
  overflow-wrap: anywhere;
}

.post-body__html :deep(*) {
  overflow-wrap: anywhere;
}

.post-body__html :deep(p) {
  margin: 0 0 var(--space-4);
}

.post-body__html :deep(h1),
.post-body__html :deep(h2),
.post-body__html :deep(h3) {
  margin: var(--space-6) 0 var(--space-3);
  color: var(--ink);
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.25;
}

.post-body__html :deep(h1) { font-size: var(--text-2xl); }
.post-body__html :deep(h2) { font-size: var(--text-xl); }
.post-body__html :deep(h3) { font-size: var(--text-lg); }

.post-body__html :deep(ul),
.post-body__html :deep(ol) {
  margin: 0 0 var(--space-4);
  padding-left: var(--space-6);
}

.post-body__html :deep(blockquote) {
  margin: var(--space-5) 0;
  padding: var(--space-2) 0 var(--space-2) var(--space-5);
  border-left: 3px solid var(--accent);
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-style: italic;
}

.post-body__html :deep(img) {
  max-width: 100%;
  height: auto;
  margin: var(--space-4) 0;
  border-radius: var(--radius-lg);
}

.post-body__html :deep(a) {
  color: #9d6d33;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.post-body__html :deep(pre) {
  padding: var(--space-4);
  overflow-x: auto;
  color: var(--text-on-dark);
  background: var(--ink);
  border-radius: var(--radius-lg);
}

.post-body__html :deep(code) {
  padding: 2px 5px;
  background: var(--surface-hover);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.post-body__html :deep(pre code) {
  padding: 0;
  background: transparent;
}

/* Actions */
.post-article__footer {
  padding: var(--space-3) var(--space-10) var(--space-4);
  border-top: 1px solid var(--line);
}

.post-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.post-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 34px;
  padding: 0 10px;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
}

.post-action:hover {
  color: var(--ink);
  background: var(--paper);
  border-color: var(--line);
}

.post-action.is-liked {
  color: var(--danger);
}

.post-action.is-saved {
  color: #9d6d33;
}

.post-action--static {
  cursor: default;
}

.post-action--static:hover {
  color: var(--text-muted);
  background: transparent;
  border-color: transparent;
}

.post-actions__divider {
  width: 1px;
  height: 18px;
  margin: 0 var(--space-1);
  background: var(--line);
}

/* Comments */
.post-comments {
  padding: var(--space-6) var(--space-10) var(--space-8);
  border-top: 1px solid var(--line);
  background: #fdfbf7;
}

.post-comments__head {
  margin-bottom: var(--space-4);
}

.post-comments__kicker {
  display: block;
  margin-bottom: 2px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.post-comments__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
}

.post-comments__title span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.12);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 10px;
}

.post-comments :deep(.comments-header) {
  display: none;
}

.post-comments :deep(.btn-primary) {
  background: var(--ink);
  color: #fff;
}

.post-comments :deep(.btn-primary:hover) {
  background: var(--accent);
  color: var(--text-on-accent);
}

.post-comments :deep(.comment__new-textarea) {
  color: var(--ink);
  background: #fff;
  border-color: var(--line);
}

/* Sidebar */
.post-side {
  min-width: 0;
}

.post-side__sticky {
  position: sticky;
  top: calc(var(--header-height) + var(--space-5));
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.post-side-card {
  padding: var(--space-5);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.post-side-card__kicker {
  display: block;
  margin-bottom: var(--space-3);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.post-side-author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.post-side-author__avatar {
  width: 48px;
  height: 48px;
  object-fit: cover;
  background: var(--surface-hover);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
}

.post-side-author__name {
  display: block;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
}

.post-side-author__caption {
  display: block;
  margin-top: 1px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.post-side-author__text {
  margin: var(--space-3) 0 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 10.5px;
  line-height: 1.55;
}

.post-side-meta {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-side-meta li {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.post-side-meta li span:nth-child(2) {
  flex: 1;
}

.post-side-meta li b {
  color: var(--ink);
  font-weight: 600;
  text-align: right;
}

.post-side-meta li span:first-child {
  color: #b08a55;
  font-size: 10px;
}

.post-side-card--share p {
  margin: 0 0 var(--space-3);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 10.5px;
  line-height: 1.5;
}

.post-side-share {
  display: flex;
  gap: var(--space-2);
}

.post-side-share__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  height: 36px;
  color: var(--text-on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}

.post-side-share__btn:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.post-side-share__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--text-secondary);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.post-side-share__icon:hover {
  color: var(--ink);
  border-color: var(--accent);
}

/* Related */
.post-related {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--line);
}

.post-related__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.post-related__kicker {
  display: block;
  margin-bottom: 2px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.post-related__head h2 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.post-related__all {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid var(--line);
  padding-bottom: 2px;
}

.post-related__all:hover {
  color: var(--accent-hover);
  border-color: var(--accent);
}

.post-related__all span {
  font-size: 8px;
}

.post-related__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.related-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
}

.related-card:hover {
  border-color: rgba(231, 165, 74, 0.55);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.related-card__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 130px;
  overflow: hidden;
  color: #f6efe2;
  text-decoration: none;
}

.related-card__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(10, 12, 13, 0.4));
}

.related-card__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-card__quote {
  position: relative;
  z-index: 1;
  color: rgba(231, 165, 74, 0.85);
  font-family: var(--font-serif);
  font-size: 100px;
  line-height: 0.7;
  transform: translateY(8px);
}

.related-card__initial {
  position: absolute;
  top: 50%;
  left: 50%;
  color: rgba(255, 255, 255, 0.08);
  font-family: var(--font-display);
  font-size: 130px;
  font-weight: 700;
  line-height: 1;
  transform: translate(-50%, -54%);
}

.related-card__tag {
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
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-card__body {
  padding: var(--space-3) var(--space-4) var(--space-4);
}

.related-card__date {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

.related-card__body h3 {
  display: -webkit-box;
  margin: 4px 0 var(--space-2);
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-card__body h3 a {
  color: inherit;
  text-decoration: none;
}

.related-card__body h3 a:hover {
  color: var(--accent-hover);
}

.related-card__author {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
}

/* Skeleton */
.post-skeleton {
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
}

.post-skeleton__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-10) var(--space-6);
}

.post-skeleton__head span,
.post-skeleton__body span {
  display: block;
  height: 12px;
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: post-shimmer 1.25s linear infinite;
}

.post-skeleton__head span:nth-child(1) { width: 18%; height: 9px; }
.post-skeleton__head span:nth-child(2) { width: 72%; height: 32px; }
.post-skeleton__head span:nth-child(3) { width: 50%; }
.post-skeleton__head span:nth-child(4) { width: 30%; }

.post-skeleton__cover {
  height: 260px;
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  animation: post-shimmer 1.25s linear infinite;
}

.post-skeleton__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-10);
}

.post-skeleton__body span:nth-child(1),
.post-skeleton__body span:nth-child(2) { width: 100%; }
.post-skeleton__body span:nth-child(3) { width: 94%; }
.post-skeleton__body span:nth-child(4) { width: 97%; }
.post-skeleton__body span:nth-child(5) { width: 62%; }

@keyframes post-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Error */
.post-error {
  max-width: 560px;
  margin: var(--space-10) auto;
  padding: var(--space-10) var(--space-8);
  text-align: center;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
}

.post-error__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: var(--space-4);
  color: #fff;
  background: var(--danger);
  border-radius: var(--radius-full);
  font-size: var(--text-xl);
}

.post-error__kicker {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.post-error h1 {
  margin: 0 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
}

.post-error p {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.post-error__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.post-error__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
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

.post-error__btn:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.post-error__btn--ghost {
  color: var(--text-secondary);
  background: transparent;
  border-color: var(--line);
}

.post-error__btn--ghost:hover {
  color: var(--ink);
  background: var(--paper);
  border-color: var(--ink);
}

/* Toast */
.post-toast {
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
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-xl);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  transform: translateX(-50%);
}

.post-toast span {
  color: var(--accent);
  font-size: 10px;
}

.post-toast-enter-active,
.post-toast-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.post-toast-enter-from,
.post-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

@media (max-width: 1180px) {
  .post-layout {
    grid-template-columns: minmax(0, 1fr) 250px;
  }

  .post-article__head,
  .post-body,
  .post-comments {
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }

  .post-article__footer {
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}

@media (max-width: 1024px) {
  .post-layout {
    grid-template-columns: 1fr;
  }

  .post-side {
    order: 2;
  }

  .post-side__sticky {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .post-side-card--share {
    grid-column: 1 / -1;
  }

  .post-related__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .post-page__top-inner {
    gap: var(--space-2);
  }

  .post-breadcrumbs__current {
    max-width: 180px;
  }

  .post-article__head {
    padding: var(--space-5) var(--space-5) var(--space-4);
  }

  .post-article__title {
    font-size: clamp(28px, 8vw, 38px);
  }

  .post-article__lead {
    font-size: var(--text-base);
  }

  .post-article__meta {
    gap: var(--space-2);
  }

  .post-article__meta-divider {
    display: none;
  }

  .post-article__art {
    height: 190px;
  }

  .post-article__art-quote {
    font-size: 130px;
  }

  .post-article__art-initial {
    font-size: 170px;
  }

  .post-body {
    padding: var(--space-5);
    font-size: 15px;
  }

  .post-article__footer {
    padding: var(--space-2) var(--space-5) var(--space-3);
  }

  .post-comments {
    padding: var(--space-5);
  }

  .post-side__sticky {
    grid-template-columns: 1fr;
  }

  .post-side-card--share {
    grid-column: auto;
  }

  .post-related__head {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-2);
  }

  .post-related__grid {
    grid-template-columns: 1fr;
  }

  .related-card__cover {
    height: 160px;
  }

  .post-skeleton__head,
  .post-skeleton__body {
    padding: var(--space-5);
  }
}

@media (max-width: 440px) {
  .post-article__title {
    font-size: 26px;
  }

  .post-breadcrumbs {
    font-size: 9px;
  }

  .post-breadcrumbs__current {
    max-width: 92px;
  }

  .post-action span:last-child {
    display: none;
  }

  .post-action {
    padding: 0 8px;
  }

  .post-actions__divider {
    display: none;
  }

  .post-toast {
    width: max-content;
    max-width: calc(100vw - 32px);
    font-size: 10px;
  }
}
</style>
