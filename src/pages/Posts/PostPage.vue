<template>
  <div class="post">
    <header-vue />

    <main class="post-main">
      <div v-if="loading" class="shell post-state">Загружаем пост…</div>

      <div v-else-if="error" class="shell post-state">
        <h1>Пост не найден</h1>
        <p>Возможно, публикацию удалили или ссылка устарела.</p>
        <router-link :to="{ name: 'Posts' }" class="btn btn--outline">Все посты</router-link>
      </div>

      <article v-else class="post-article">
        <header class="post-head">
          <div class="post-head__meta">
            <span v-if="tagOf(post)" class="post-chip">{{ tagOf(post) }}</span>
            <time>{{ longDate(post) }}</time>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>

          <router-link
            v-if="post.user"
            :to="{ name: 'Profile', params: { id: post.user.id } }"
            class="post-author"
          >
            <span class="post-author__avatar">
              <img
                v-if="post.user.avatar && !isBroken(`avatar-${post.user.id}`)"
                :src="post.user.avatar"
                :alt="post.user.name"
                @error="markBroken(`avatar-${post.user.id}`)"
              />
              <span v-else>{{ initialsOf(post.user.name) }}</span>
            </span>
            <span class="post-author__info">
              <strong>{{ post.user.name }}</strong>
              <small>к книге «{{ bookTitle }}»</small>
            </span>
          </router-link>
        </header>

        <div class="post-media" :style="mediaStyle">
          <img
            v-if="post.image && !isBroken('cover')"
            :src="post.image"
            :alt="post.title"
            @error="markBroken('cover')"
          />
          <span v-else class="post-media__letter" aria-hidden="true">{{ initialOf(post.title) }}</span>
        </div>

        <div class="post-prose" v-html="renderedContent"></div>

        <div v-if="tags.length" class="post-tags">
          <span v-for="tag in tags" :key="tag" class="post-tags__item">{{ tag }}</span>
        </div>

        <footer class="post-actions">
          <div class="post-actions__left">
            <button
              type="button"
              class="post-action"
              :class="{ 'is-active': post.is_liked }"
              :disabled="liking"
              @click="toggleLike"
            >
              <span class="icon-heart" aria-hidden="true"></span>
              {{ compactNumber(post.likes_count) }}
            </button>

            <a class="post-action" href="#comments">
              <span class="icon-comment" aria-hidden="true"></span>
              {{ compactNumber(post.comments_count) }}
            </a>

            <button type="button" class="post-action" @click="sharePost">
              <span class="icon-share" aria-hidden="true"></span>
              Поделиться
            </button>
          </div>

          <button
            type="button"
            class="post-action post-action--bookmark"
            :class="{ 'is-active': saved }"
            @click="toggleSaved"
          >
            <span class="icon-bookmark" aria-hidden="true"></span>
            {{ saved ? 'Сохранено' : 'Сохранить' }}
          </button>
        </footer>

      </article>

      <section v-if="post" id="comments" class="shell post-comments">
        <editorial-comments
          commentable-type="App\Models\Post"
          :commentable-id="post.id"
        />
      </section>
    </main>

    <footer-vue />
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapGetters, mapState } from 'vuex';
import EditorialComments from '@/components/Comments/EditorialComments.vue';

const MEDIA_COLORS = ['#36513F', '#24324A', '#A8843F', '#2B2B2B', '#7C8F74', '#6B2E2E'];
const COMMENTS_PER_PAGE = 4;

export default {
  name: 'PostPage',
  components: { EditorialComments },
  data() {
    return {
      post: null,
      loading: true,
      error: false,
      liking: false,
      actionError: '',
      saved: false,
      broken: {},
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),

    tagOf() {
      return (post) => post?.tags?.[0]?.name || post?.categories?.[0]?.name || '';
    },

    tags() {
      return (this.post?.tags || []).map((tag) => tag.name).slice(0, 6);
    },

    bookTitle() {
      return this.post?.book?.title || this.post?.title || '';
    },

    mediaStyle() {
      const seed = Number(this.post?.id || 0);
      return { '--media-color': MEDIA_COLORS[seed % MEDIA_COLORS.length] };
    },

    renderedContent() {
      return this.post?.content || '';
    },
  },
  watch: {
    '$route.params.id': 'loadAll',
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    async loadAll() {
      this.loading = true;
      this.error = false;

      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/posts/${this.$route.params.id}`, {
          headers: this.authHeaders(),
        });
        this.post = data?.data || data;
        this.saved = this.isSaved();
      } catch (e) {
        this.error = true;
        this.post = null;
      } finally {
        this.loading = false;
      }
    },

    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    async toggleLike() {
      if (!this.user) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }
      if (this.liking) return;

      this.liking = true;
      const liked = Boolean(this.post.is_liked);
      const url = `${process.env.VUE_APP_API_URL}/api/v1/posts/${this.post.id}/like`;
      const config = { headers: this.authHeaders() };

      try {
        // У axios.delete второй аргумент — это config, а не тело запроса
        const { data } = liked
          ? await axios.delete(url, config)
          : await axios.post(url, {}, config);

        this.post = {
          ...this.post,
          is_liked: typeof data?.liked === 'boolean' ? data.liked : !liked,
          likes_count: Number(data?.likes_count ?? (Number(this.post.likes_count || 0) + (liked ? -1 : 1))),
        };
      } catch (e) {
        this.actionError = liked ? 'Не удалось убрать лайк.' : 'Не удалось поставить лайк.';
      } finally {
        this.liking = false;
      }
    },

    async sharePost() {
      const url = window.location.href;
      try {
        if (navigator.share) {
          await navigator.share({ title: this.post?.title, url });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        }
      } catch (e) {
        /* пользователь отменил */
      }
    },

    isSaved() {
      try {
        const list = JSON.parse(localStorage.getItem('libraria:saved-posts') || '[]');
        return (list || []).map(Number).includes(Number(this.$route.params.id));
      } catch (e) {
        return false;
      }
    },

    toggleSaved() {
      let list = [];
      try {
        list = JSON.parse(localStorage.getItem('libraria:saved-posts') || '[]');
      } catch (e) {
        list = [];
      }
      list = Array.isArray(list) ? list.map(Number) : [];
      const id = Number(this.$route.params.id);

      if (list.includes(id)) {
        list = list.filter((item) => item !== id);
        this.saved = false;
      } else {
        list.push(id);
        this.saved = true;
      }

      try {
        localStorage.setItem('libraria:saved-posts', JSON.stringify(list));
      } catch (e) {
        /* приватный режим */
      }
    },

    /* presentation */
    markBroken(key) {
      this.broken = { ...this.broken, [key]: true };
    },

    isBroken(key) {
      return Boolean(this.broken[key]);
    },

    longDate(item) {
      const raw = item?.created_at;
      if (!raw) return '';
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(' г.', '');
    },

    shortDate(item) {
      const raw = item?.created_at;
      if (!raw) return '';
      const date = new Date(raw);
      return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
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

.post {
  background: var(--paper);
}

.shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

.post-state {
  padding: 90px 24px 120px;
}

.post-state h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 500;
  color: var(--ink);
}

.post-state p {
  margin: 10px 0 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Article */
.post-article {
  width: 850px;
  max-width: calc(100% - 48px);
  margin: 0 auto;
  padding-top: 65px;
}

.post-head {
  text-align: center;
}

.post-head__meta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
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

.post-title {
  max-width: 760px;
  margin: 20px auto 0;
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 500;
  line-height: 1.16;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.post-author {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  color: inherit;
  text-decoration: none;
}

.post-author__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  overflow: hidden;
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 50%;
}

.post-author__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-author__info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.post-author__info strong {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}

.post-author__info small {
  font-size: 11px;
  color: var(--text-muted);
}

.post-media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 360px;
  margin-top: 36px;
  overflow: hidden;
  border-radius: 12px;
  background-color: var(--media-color, var(--accent));
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.045) 0 2px, transparent 2px 10px);
}

.post-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-media__letter {
  font-family: var(--font-display);
  font-size: 120px;
  color: rgba(251, 248, 242, 0.3);
}

/* Prose */
.post-prose {
  width: 680px;
  max-width: 100%;
  margin: 44px auto 0;
  font-size: 16px;
  line-height: 1.75;
  color: var(--text-secondary);
}

.post-prose :deep(p) {
  margin: 0 0 20px;
}

.post-prose :deep(h2) {
  margin: 32px 0 14px;
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  color: var(--ink);
}

.post-prose :deep(h3) {
  margin: 26px 0 12px;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  color: var(--ink);
}

.post-prose :deep(blockquote) {
  margin: 28px 0;
  padding: 4px 0 4px 20px;
  font-family: var(--font-display);
  font-size: 19px;
  font-style: italic;
  line-height: 1.5;
  color: var(--ink);
  border-left: 2px solid var(--gold);
}

.post-prose :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 24px 0;
  border-radius: 12px;
}

.post-prose :deep(a) {
  color: var(--accent);
}

.post-prose :deep(ul),
.post-prose :deep(ol) {
  margin: 0 0 20px;
  padding-left: 22px;
}

/* Actions */
.post-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 680px;
  max-width: 100%;
  margin: 22px auto 0;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.post-actions__left {
  display: flex;
  align-items: center;
  gap: 22px;
}

.post-action {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.post-action:hover {
  color: var(--ink);
}

.post-action.is-active {
  color: var(--danger);
}

.post-action--bookmark.is-active {
  color: var(--accent);
}

.post-action [class^='icon-'] {
  font-size: 14px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 680px;
  max-width: 100%;
  margin: 30px auto 0;
}

.post-tags__item {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 12px;
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 999px;
}

/* Comments */
.post-comments {
  width: 760px;
  max-width: calc(100% - 48px);
  margin: 0 auto;
  padding-top: 40px;
  padding-bottom: 92px;
}


/* Responsive */
@media (max-width: 1024px) {
  .post-article {
    padding-top: 40px;
  }

  .post-title {
    font-size: 34px;
  }

  .post-media {
    height: 280px;
  }
}

@media (max-width: 760px) {
  .post-article {
    width: 100%;
    max-width: calc(100% - 32px);
  }

  .post-title {
    font-size: 27px;
  }

  .post-media {
    height: 200px;
    margin-top: 24px;
  }

  .post-prose {
    margin-top: 28px;
    font-size: 15px;
  }

  .post-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .post-comments {
    width: 100%;
    max-width: calc(100% - 32px);
  }
}
</style>
