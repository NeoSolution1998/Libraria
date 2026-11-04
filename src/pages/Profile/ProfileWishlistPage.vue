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
            <h1>Хочу прочитать</h1>
            <p>Книги, которые вы отложили на потом. Список хранится в аккаунте и синхронизируется между устройствами.</p>
          </div>

          <router-link :to="{ name: 'Books' }" class="manage-add">
            Найти книгу
          </router-link>
        </header>

        <nav class="manage-tabs" aria-label="Управление">
          <router-link :to="{ name: 'ProfileBooks' }" class="manage-tab">Книги</router-link>
          <router-link :to="{ name: 'ProfilePosts' }" class="manage-tab">Посты</router-link>
          <span class="manage-tab is-active">Хочу прочитать</span>
        </nav>

        <p v-if="actionError" class="manage-state manage-state--error">{{ actionError }}</p>

        <div v-if="loading" class="manage-state">Загружаем список…</div>

        <p v-else-if="error" class="manage-state manage-state--error">{{ error }}</p>

        <div v-else-if="books.length" class="manage-list">
          <article v-for="(book, index) in books" :key="book.id" class="row">
            <router-link
              :to="{ name: 'Book', params: { id: book.id } }"
              class="row__cover"
              :style="coverStyle(book, index)"
            >
              <img
                v-if="book.cover_image && !isBroken(`cover-${book.id}`)"
                :src="book.cover_image"
                :alt="book.title"
                loading="lazy"
                @error="markBroken(`cover-${book.id}`)"
              />
              <span v-else class="row__cover-text">{{ book.title }}</span>
            </router-link>

            <div class="row__body">
              <h2>
                <router-link :to="{ name: 'Book', params: { id: book.id } }">{{ book.title }}</router-link>
              </h2>
              <p class="row__author">{{ book.author || 'Автор не указан' }}</p>

              <div class="row__rating">
                <star-rating
                  size="sm"
                  readonly
                  :value="Number(book.average_rating || 0)"
                  :count="Number(book.ratings_count || 0)"
                  show-value
                />
              </div>

              <p class="row__meta">
                <span>{{ chaptersOf(book) }}</span>
                <span class="row__dot">·</span>
                <span>{{ compactNumber(book.views_count) }} просмотров</span>
              </p>
            </div>

            <div class="row__actions">
              <router-link :to="{ name: 'Book', params: { id: book.id } }" class="row__btn row__btn--primary">
                Открыть
              </router-link>
              <button
                type="button"
                class="row__btn row__btn--danger"
                :disabled="removingId === book.id"
                @click="remove(book)"
              >
                {{ removingId === book.id ? 'Убираем…' : 'Убрать' }}
              </button>
            </div>
          </article>
        </div>

        <div v-else class="manage-empty">
          <p>В списке желаемого пока пусто.</p>
          <router-link :to="{ name: 'Books' }" class="manage-add">
            Перейти в каталог
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
import StarRating from '@/components/Books/StarRating.vue';

const COVER_COLORS = ['#36513F', '#24324A', '#A8843F', '#2B2B2B', '#7C8F74', '#6B2E2E'];

export default {
  name: 'ProfileWishlistPage',
  components: { StarRating },
  data() {
    return {
      books: [],
      loading: true,
      error: '',
      removingId: null,
      actionError: '',
      broken: {},
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
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/wishlist`, {
          headers: this.authHeaders(),
        });
        const list = data?.data ?? data;
        this.books = Array.isArray(list) ? list : [];
      } catch (e) {
        this.error = 'Не удалось загрузить список желаемого.';
      } finally {
        this.loading = false;
      }
    },

    async remove(book) {
      if (this.removingId) return;

      this.removingId = book.id;
      this.actionError = '';

      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/v1/books/${book.id}/wishlist`, {
          headers: this.authHeaders(),
        });
        this.books = this.books.filter((item) => item.id !== book.id);
      } catch (e) {
        // Ошибку показываем отдельно, список при этом не пропадает
        this.actionError = 'Не удалось убрать книгу из списка. Попробуйте ещё раз.';
      } finally {
        this.removingId = null;
      }
    },

    coverStyle(book, index) {
      const seed = Number(book?.id ?? index) || index;
      return { '--cover-color': COVER_COLORS[seed % COVER_COLORS.length] };
    },

    markBroken(key) {
      this.broken = { ...this.broken, [key]: true };
    },

    isBroken(key) {
      return Boolean(this.broken[key]);
    },

    chaptersOf(book) {
      const count = Number(book?.chapters_count || 0);
      if (!count) return 'Нет глав';
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
  flex-wrap: wrap;
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
  gap: 18px;
  padding: 16px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.row__cover {
  display: flex;
  flex: 0 0 56px;
  align-items: flex-end;
  width: 56px;
  height: 84px;
  padding: 6px;
  overflow: hidden;
  border-radius: 6px;
  background-color: var(--cover-color, var(--accent));
  background-image: linear-gradient(168deg, rgba(255, 255, 255, 0.07), transparent 45%, rgba(0, 0, 0, 0.18));
}

.row__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.row__cover-text {
  font-family: var(--font-display);
  font-size: 8px;
  line-height: 1.15;
  color: rgba(251, 248, 242, 0.9);
}

.row__body {
  flex: 1;
  min-width: 0;
}

.row__body h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 19px;
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

.row__author {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.row__rating {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.row__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--text-muted);
}

.row__dot {
  color: var(--line-strong);
}

.row__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.row__btn {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  text-decoration: none;
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
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

@media (max-width: 900px) {
  .manage-head {
    flex-direction: column;
    gap: 16px;
  }

  .row {
    flex-wrap: wrap;
  }

  .row__actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .manage-head h1 {
    font-size: 32px;
  }
}
</style>
