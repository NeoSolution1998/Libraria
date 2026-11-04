<template>
  <div class="manage">
    <header-vue />

    <main class="manage-main">
      <div class="shell">
        <router-link :to="{ name: 'Profile' }" class="manage-back">
          <span class="icon-left-open" aria-hidden="true"></span>
          Профиль
        </router-link>

        <header class="manage-head">
          <div>
            <h1>Мои посты</h1>
            <p>Ваши публикации: рецензии, заметки и разборы глав.</p>
          </div>

          <router-link :to="{ name: 'PostCreate' }" class="manage-add">
            <span aria-hidden="true">+</span>
            Написать пост
          </router-link>
        </header>

        <nav class="manage-tabs" aria-label="Управление">
          <router-link :to="{ name: 'ProfileBooks' }" class="manage-tab">Книги</router-link>
          <span class="manage-tab is-active">Посты</span>
          <router-link :to="{ name: 'ProfileWishlist' }" class="manage-tab">Хочу прочитать</router-link>
        </nav>

        <div v-if="loading" class="manage-state">Загружаем посты…</div>

        <p v-else-if="error" class="manage-state manage-state--error">{{ error }}</p>

        <div v-else-if="posts.length" class="manage-list">
          <article v-for="post in posts" :key="post.id" class="row">
            <div class="row__body">
              <div class="row__meta-top">
                <span v-if="tagOf(post)" class="row__chip">{{ tagOf(post) }}</span>
                <time>{{ dateLabel(post) }}</time>
              </div>

              <h2>
                <router-link :to="{ name: 'Post', params: { id: post.id } }">{{ post.title }}</router-link>
              </h2>
              <p class="row__excerpt">{{ excerptOf(post, 140) }}</p>

              <div class="row__meta">
                <span><span class="icon-heart" aria-hidden="true"></span> {{ compactNumber(post.likes_count) }}</span>
                <span><span class="icon-comment" aria-hidden="true"></span> {{ compactNumber(post.comments_count) }}</span>
                <span><span class="icon-eye" aria-hidden="true"></span> {{ compactNumber(post.views_count) }}</span>
              </div>
            </div>

            <div class="row__actions">
              <router-link :to="{ name: 'PostEdit', params: { id: post.id } }" class="row__btn row__btn--primary">
                Редактировать
              </router-link>
              <router-link :to="{ name: 'Post', params: { id: post.id } }" class="row__btn">
                Открыть
              </router-link>
              <button type="button" class="row__btn row__btn--danger" :disabled="deletingId === post.id" @click="removePost(post)">
                {{ deletingId === post.id ? 'Удаляем…' : 'Удалить' }}
              </button>
            </div>
          </article>
        </div>

        <div v-else class="manage-empty">
          <p>Вы ещё не написали ни одного поста.</p>
          <router-link :to="{ name: 'PostCreate' }" class="manage-add">
            <span aria-hidden="true">+</span>
            Написать пост
          </router-link>
        </div>
      </div>
    </main>

    <footer-vue />
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapGetters } from 'vuex';

export default {
  name: 'ProfilePostsPage',
  data() {
    return {
      posts: [],
      loading: true,
      error: '',
      deletingId: null,
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  mounted() {
    if (!this.user) {
      this.$router.replace({ name: 'Login', query: { redirect: this.$route.fullPath } });
      return;
    }
    this.load();
  },
  methods: {
    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    async load() {
      this.loading = true;
      this.error = '';

      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/posts`, {
          params: { author_id: this.user.id, per_page: 20, sort: 'date_desc' },
          headers: this.authHeaders(),
        });
        this.posts = data.posts || [];
      } catch (e) {
        this.error = 'Не удалось загрузить посты.';
      } finally {
        this.loading = false;
      }
    },

    async removePost(post) {
      if (this.deletingId) return;
      if (!window.confirm(`Удалить пост «${post.title}»?`)) return;

      this.deletingId = post.id;
      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/v1/posts/${post.id}`, {
          headers: this.authHeaders(),
        });
        this.posts = this.posts.filter((item) => item.id !== post.id);
      } catch (e) {
        this.error = 'Не удалось удалить пост.';
      } finally {
        this.deletingId = null;
      }
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

    excerptOf(post, limit = 140) {
      const text = String(post?.content || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text.length > limit ? `${text.slice(0, limit).replace(/\s+\S*$/, '')}…` : text;
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
.manage {
  background: var(--paper);
}

.shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

.manage-main {
  padding: 32px 0 80px;
}

.manage-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
}

.manage-back:hover {
  color: var(--accent);
}

.manage-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  margin-top: 18px;
}

.manage-head h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--ink);
}

.manage-head p {
  max-width: 560px;
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.manage-add {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 22px;
  font-size: 13px;
  color: var(--text-on-accent);
  text-decoration: none;
  background: var(--accent);
  border-radius: 999px;
  white-space: nowrap;
}

.manage-add:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
}

.manage-tabs {
  display: flex;
  gap: 8px;
  margin: 28px 0 22px;
}

.manage-tab {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 999px;
}

.manage-tab.is-active {
  color: var(--ink);
  background: var(--accent-light);
  border-color: transparent;
}

.manage-state {
  padding: 40px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.manage-state--error {
  color: var(--danger);
}

.manage-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 20px 22px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.row__body {
  flex: 1;
  min-width: 0;
}

.row__meta-top {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--text-muted);
}

.row__chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  font-size: 10px;
  color: var(--accent);
  background: var(--accent-light);
  border-radius: 999px;
}

.row__body h2 {
  margin: 10px 0 0;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--ink);
}

.row__body h2 a {
  color: inherit;
  text-decoration: none;
}

.row__body h2 a:hover {
  color: var(--accent);
}

.row__excerpt {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.row__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.row__meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.row__actions {
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 auto;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}

.row__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 0 16px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  text-decoration: none;
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.row__btn:hover {
  background: var(--surface-hover);
}

.row__btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.row__btn--primary:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
}

.row__btn--danger {
  color: var(--danger);
  border-color: rgba(154, 59, 50, 0.35);
}

.row__btn--danger:hover {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
}

.row__btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.manage-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 40px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.manage-empty p {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 1100px) {
  .row {
    flex-direction: column;
    align-items: stretch;
  }

  .row__actions {
    justify-content: flex-start;
  }
}

@media (max-width: 900px) {
  .manage-head {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 560px) {
  .manage-head h1 {
    font-size: 32px;
  }
}
</style>
