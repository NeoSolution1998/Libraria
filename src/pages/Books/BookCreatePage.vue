<template>
  <div class="book-editor">
    <header class="be-bar">
      <router-link :to="{ name: 'Books' }" class="be-bar__brand" aria-label="Каталог">
        <span class="be-bar__mark">
          <img src="/images/logo.svg" alt="" />
        </span>
      </router-link>

      <span class="be-bar__title">{{ isEdit ? 'Редактирование книги' : 'Новая книга' }}</span>

      <div class="be-bar__actions">
        <router-link :to="{ name: 'Books' }" class="be-bar__draft">Отмена</router-link>
        <button type="button" class="be-bar__publish" :disabled="saving" @click="save">
          {{ saving ? 'Сохраняем…' : (isEdit ? 'Сохранить' : 'Создать книгу') }}
        </button>
      </div>
    </header>

    <main class="be-main">
      <form class="be-form" @submit.prevent="save">
        <div class="be-cover">
          <div class="be-cover__preview" :style="coverStyle">
            <img v-if="coverPreview" :src="coverPreview" :alt="form.title || 'Обложка'" />
            <span v-else class="be-cover__empty">
              <span class="be-cover__genre">{{ genreLabel }}</span>
              <span class="be-cover__title">{{ form.title || 'Название книги' }}</span>
              <span class="be-cover__author">{{ form.author || 'Автор' }}</span>
            </span>
          </div>

          <label class="be-upload">
            Загрузить обложку
            <input type="file" accept="image/*" @change="pickCover" />
          </label>
          <p class="be-hint">PNG или JPG, до 2 МБ. Рекомендуем 2:3</p>
        </div>

        <div class="be-fields">
          <label class="be-field">
            <span class="be-label">Название</span>
            <input v-model.trim="form.title" type="text" placeholder="Например, «Тёплый дом на Садовой»" maxlength="50" required />
          </label>

          <div class="be-row">
            <label class="be-field">
              <span class="be-label">Автор</span>
              <input v-model.trim="form.author" type="text" placeholder="Имя автора" maxlength="50" required />
            </label>

            <label class="be-field">
              <span class="be-label">Страниц</span>
              <input v-model.number="form.pages" type="number" min="1" placeholder="320" />
            </label>
          </div>

          <div class="be-row">
            <label class="be-field">
              <span class="be-label">Язык</span>
              <select v-model="form.language" class="be-select">
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="other">Другой</option>
              </select>
            </label>

            <label class="be-field">
              <span class="be-label">Статус</span>
              <select v-model="form.published" class="be-select">
                <option :value="true">Опубликована</option>
                <option :value="false">Черновик</option>
              </select>
            </label>
          </div>

          <div class="be-field">
            <span class="be-label">Жанры</span>
            <div class="be-chips">
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                class="be-chip"
                :class="{ 'is-active': form.categoryIds.includes(category.id) }"
                @click="toggleCategory(category.id)"
              >
                {{ category.name }}
              </button>
            </div>
          </div>

          <label class="be-field">
            <span class="be-label">Описание</span>
            <textarea v-model.trim="form.description" rows="7" placeholder="О чём книга, для кого она и почему её стоит открыть…" required></textarea>
          </label>

          <p v-if="error" class="be-error">{{ error }}</p>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapGetters } from 'vuex';

const COVER_COLORS = ['#36513F', '#24324A', '#A8843F', '#2B2B2B', '#7C8F74', '#6B2E2E'];

export default {
  name: 'BookCreatePage',
  data() {
    return {
      form: {
        title: '',
        author: '',
        description: '',
        pages: '',
        language: 'ru',
        published: true,
        categoryIds: [],
      },
      categories: [],
      coverFile: null,
      coverPreview: '',
      saving: false,
      error: '',
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),

    isEdit() {
      return this.$route.name === 'BookEdit';
    },

    editId() {
      return this.isEdit ? this.$route.params.id : null;
    },

    coverStyle() {
      const seed = Number(this.editId || 4);
      return { '--cover-color': COVER_COLORS[seed % COVER_COLORS.length] };
    },

    genreLabel() {
      const first = this.categories.find((category) => this.form.categoryIds.includes(category.id));
      return first ? first.name.toUpperCase() : 'КНИГА';
    },
  },
  async mounted() {
    if (!this.user) {
      this.$router.replace({ name: 'Login', query: { redirect: this.$route.fullPath } });
      return;
    }

    await this.loadCategories();
    if (this.isEdit) await this.loadBook();
  },
  methods: {
    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    async loadCategories() {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/categories`, {
          headers: { Accept: 'application/json' },
        });
        this.categories = Array.isArray(data) ? data : (data.categories || []);
      } catch (e) {
        this.categories = [];
      }
    },

    async loadBook() {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/books/${this.editId}`, {
          headers: this.authHeaders(),
        });
        const book = data?.data || data;

        this.form.title = book.title || '';
        this.form.author = book.author || '';
        this.form.description = book.description || '';
        this.form.pages = book.number_of_pages || '';
        this.form.language = book.language || 'ru';
        this.form.published = Boolean(book.is_published);
        this.form.categoryIds = (book.categories || []).map((category) => category.id);
        this.coverPreview = book.cover_image || '';
      } catch (e) {
        this.error = 'Не удалось загрузить книгу.';
      }
    },

    toggleCategory(id) {
      this.form.categoryIds = this.form.categoryIds.includes(id)
        ? this.form.categoryIds.filter((item) => item !== id)
        : [...this.form.categoryIds, id];
    },

    pickCover(event) {
      const [file] = event.target.files || [];
      if (!file) return;

      this.coverFile = file;
      if (this.coverPreview && this.coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(this.coverPreview);
      }
      this.coverPreview = URL.createObjectURL(file);
    },

    validate() {
      if (this.form.title.length < 5) return 'Название должно быть не короче 5 символов.';
      if (this.form.author.length < 5) return 'Имя автора должно быть не короче 5 символов.';
      if (this.form.description.length < 10) return 'Добавьте описание — минимум 10 символов.';
      return '';
    },

    async save() {
      const problem = this.validate();
      if (problem) {
        this.error = problem;
        return;
      }
      if (this.saving) return;

      this.saving = true;
      this.error = '';

      try {
        const data = new FormData();
        data.append('title', this.form.title);
        data.append('author', this.form.author);
        data.append('description', this.form.description);
        if (this.form.pages) data.append('number_of_pages', this.form.pages);
        data.append('language', this.form.language);
        data.append('is_published', this.form.published ? '1' : '0');
        this.form.categoryIds.forEach((id) => data.append('categories[]', id));
        if (this.coverFile) data.append('cover_image', this.coverFile);

        const headers = { ...this.authHeaders(), 'Content-Type': 'multipart/form-data' };
        let response;

        if (this.isEdit) {
          data.append('_method', 'patch');
          response = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/books/${this.editId}`, data, { headers });
        } else {
          response = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/books`, data, { headers });
        }

        const book = response.data?.data || response.data;
        this.$router.push({ name: 'Book', params: { id: book.id || this.editId } });
      } catch (e) {
        const errors = e?.response?.data?.errors;
        this.error = errors
          ? Object.values(errors).flat().join(' ')
          : (e?.response?.data?.message || 'Не удалось сохранить книгу.');
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.book-editor {
  min-height: 100vh;
  background: var(--cream);
}

/* Bar */
.be-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 64px;
  padding: 0 32px;
  background: var(--cream);
  border-bottom: 1px solid var(--line);
}

.be-bar__brand {
  display: inline-flex;
  text-decoration: none;
}

.be-bar__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--accent);
  border-radius: 8px;
}

.be-bar__mark img {
  width: 18px;
  height: 18px;
}

.be-bar__title {
  font-size: 13px;
  color: var(--text-secondary);
}

.be-bar__actions {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
}

.be-bar__draft {
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
}

.be-bar__publish {
  height: 38px;
  padding: 0 20px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-on-accent);
  background: var(--accent);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.be-bar__publish:hover:not(:disabled) {
  background: var(--accent-hover);
}

.be-bar__publish:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Body */
.be-main {
  padding: 48px 24px 80px;
}

.be-form {
  display: grid;
  grid-template-columns: 300px minmax(0, 640px);
  gap: 48px;
  justify-content: center;
  align-items: start;
  max-width: 1100px;
  margin: 0 auto;
}

.be-cover {
  position: sticky;
  top: 96px;
  text-align: center;
}

.be-cover__preview {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 300px;
  height: 450px;
  margin: 0 auto;
  padding: 22px;
  overflow: hidden;
  text-align: left;
  background: var(--cover-color, var(--accent));
  border-radius: 8px;
  box-shadow: 0 18px 38px rgba(30, 33, 36, 0.16);
}

.be-cover__preview img {
  width: calc(100% + 44px);
  height: calc(100% + 44px);
  margin: -22px;
  object-fit: cover;
}

.be-cover__empty {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.be-cover__genre {
  margin-bottom: auto;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: rgba(251, 248, 242, 0.72);
}

.be-cover__title {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1.16;
  color: #fbf8f2;
}

.be-cover__author {
  font-size: 11px;
  color: rgba(251, 248, 242, 0.72);
}

.be-upload {
  display: inline-flex;
  align-items: center;
  height: 38px;
  margin-top: 20px;
  padding: 0 18px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  cursor: pointer;
}

.be-upload input {
  display: none;
}

.be-hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: var(--text-muted);
}

/* Fields */
.be-field {
  display: block;
  margin-bottom: 18px;
}

.be-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.be-label {
  display: block;
  margin-bottom: 8px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.be-field input,
.be-field textarea,
.be-select {
  width: 100%;
  padding: 12px 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
  resize: vertical;
}

.be-field input {
  height: 44px;
  padding: 0 14px;
}

.be-select {
  height: 44px;
  padding: 0 12px;
}

.be-field input:focus,
.be-field textarea:focus,
.be-select:focus {
  border-color: var(--accent);
}

.be-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.be-chip {
  height: 30px;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.be-chip.is-active {
  color: var(--accent);
  background: var(--accent-light);
  border-color: transparent;
}

.be-error {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--danger);
}

@media (max-width: 900px) {
  .be-form {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .be-cover {
    position: static;
  }

  .be-cover__preview {
    width: 220px;
    height: 330px;
  }
}

@media (max-width: 560px) {
  .be-bar {
    padding: 0 16px;
  }

  .be-main {
    padding: 28px 16px 60px;
  }

  .be-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
