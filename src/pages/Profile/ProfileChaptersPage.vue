<template>
  <div class="chapters">
    <header-vue />

    <main class="chapters-main">
      <div class="shell">
        <router-link :to="{ name: 'ProfileBooks' }" class="chapters-back">
          <span class="icon-left-open" aria-hidden="true"></span>
          Мои книги
        </router-link>

        <header class="chapters-head">
          <div>
            <h1>{{ bookTitle }}</h1>
            <p>Главы книги — здесь их можно добавить, отредактировать и удалить.</p>
          </div>

          <button type="button" class="chapters-add" @click="openCreate">
            <span aria-hidden="true">+</span>
            Добавить главу
          </button>
        </header>

        <form v-if="formOpen" class="chapter-form" @submit.prevent="saveChapter">
          <h2>{{ editingId ? 'Редактирование главы' : 'Новая глава' }}</h2>

          <div class="chapter-form__row">
            <label class="field">
              <span>Название</span>
              <input v-model.trim="form.title" type="text" placeholder="Например, «Глава первая: Билет в один конец»" maxlength="50" required />
            </label>

            <label class="field field--num">
              <span>Номер</span>
              <input v-model.number="form.number" type="number" min="1" placeholder="1" />
            </label>

            <label class="field field--num">
              <span>Длительность</span>
              <input v-model.trim="form.duration" type="text" placeholder="12 мин" />
            </label>
          </div>

          <label class="field">
            <span>Текст главы</span>
            <textarea v-model="form.content" rows="10" placeholder="Текст главы…" required></textarea>
          </label>

          <p v-if="formError" class="chapter-form__error">{{ formError }}</p>

          <div class="chapter-form__actions">
            <button type="button" class="btn btn--outline" @click="closeForm">Отмена</button>
            <button type="submit" class="btn btn--primary" :disabled="saving">
              {{ saving ? 'Сохраняем…' : (editingId ? 'Сохранить' : 'Добавить главу') }}
            </button>
          </div>
        </form>

        <div v-if="loading" class="chapters-state">Загружаем главы…</div>

        <p v-else-if="error" class="chapters-state chapters-state--error">{{ error }}</p>

        <ol v-else-if="chapters.length" class="chapters-list">
          <li v-for="chapter in chapters" :key="chapter.id" class="chapter-row">
            <span class="chapter-row__num">{{ chapter.number || chapter.id }}</span>

            <div class="chapter-row__body">
              <h2>{{ chapter.title }}</h2>
              <p>
                <span v-if="chapter.duration">{{ chapter.duration }}</span>
                <span v-if="chapter.duration" class="chapter-row__dot">·</span>
                {{ chapterPreview(chapter) }}
              </p>
            </div>

            <div class="chapter-row__actions">
              <router-link
                v-if="bookId"
                :to="{ name: 'Chapter', params: { bookId, chapterId: chapter.id } }"
                class="row-btn"
              >
                Открыть
              </router-link>
              <button type="button" class="row-btn" @click="openEdit(chapter)">Изменить</button>
              <button
                type="button"
                class="row-btn row-btn--danger"
                :disabled="deletingId === chapter.id"
                @click="removeChapter(chapter)"
              >
                {{ deletingId === chapter.id ? 'Удаляем…' : 'Удалить' }}
              </button>
            </div>
          </li>
        </ol>

        <div v-else class="chapters-empty">
          <p>В книге пока нет глав.</p>
          <button type="button" class="chapters-add" @click="openCreate">
            <span aria-hidden="true">+</span>
            Добавить первую главу
          </button>
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
  name: 'ProfileChaptersPage',
  data() {
    return {
      book: null,
      chapters: [],
      loading: true,
      error: '',
      formOpen: false,
      editingId: null,
      saving: false,
      formError: '',
      deletingId: null,
      form: { title: '', number: '', duration: '', content: '' },
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),

    bookId() {
      return this.$route.params.id;
    },

    bookTitle() {
      return this.book?.title || 'Главы книги';
    },
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
        const [bookResponse, chaptersResponse] = await Promise.all([
          axios.get(`${process.env.VUE_APP_API_URL}/api/v1/books/${this.bookId}`, { headers: this.authHeaders() }),
          axios.get(`${process.env.VUE_APP_API_URL}/api/v1/books/${this.bookId}/chapters`, {
            params: { per_page: 100 },
            headers: this.authHeaders(),
          }),
        ]);

        this.book = bookResponse.data?.data || bookResponse.data;
        this.chapters = chaptersResponse.data?.chapters || [];
      } catch (e) {
        this.error = 'Не удалось загрузить главы книги.';
      } finally {
        this.loading = false;
      }
    },

    openCreate() {
      this.editingId = null;
      this.form = {
        title: '',
        number: this.chapters.length + 1,
        duration: '',
        content: '',
      };
      this.formError = '';
      this.formOpen = true;
      this.scrollToForm();
    },

    openEdit(chapter) {
      this.editingId = chapter.id;
      this.form = {
        title: chapter.title || '',
        number: chapter.number || '',
        duration: chapter.duration || '',
        content: chapter.content || '',
      };
      this.formError = '';
      this.formOpen = true;
      this.scrollToForm();
    },

    closeForm() {
      this.formOpen = false;
      this.editingId = null;
      this.formError = '';
    },

    scrollToForm() {
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    async saveChapter() {
      if (this.saving) return;

      if (this.form.title.trim().length < 5) {
        this.formError = 'Название главы — не короче 5 символов.';
        return;
      }
      if (!this.form.content.trim()) {
        this.formError = 'Добавьте текст главы.';
        return;
      }

      this.saving = true;
      this.formError = '';

      const payload = {
        title: this.form.title.trim(),
        content: this.form.content,
        number: Number(this.form.number) || undefined,
        duration: this.form.duration || undefined,
      };

      try {
        if (this.editingId) {
          await axios.patch(
            `${process.env.VUE_APP_API_URL}/api/v1/books/${this.bookId}/chapters/${this.editingId}`,
            payload,
            { headers: { ...this.authHeaders(), 'Content-Type': 'application/json' } }
          );
        } else {
          await axios.post(
            `${process.env.VUE_APP_API_URL}/api/v1/books/${this.bookId}/chapters`,
            payload,
            { headers: { ...this.authHeaders(), 'Content-Type': 'application/json' } }
          );
        }

        this.closeForm();
        await this.load();
      } catch (e) {
        const errors = e?.response?.data?.errors;
        this.formError = errors
          ? Object.values(errors).flat().join(' ')
          : (e?.response?.data?.message || 'Не удалось сохранить главу.');
      } finally {
        this.saving = false;
      }
    },

    async removeChapter(chapter) {
      if (this.deletingId) return;
      if (!window.confirm(`Удалить главу «${chapter.title}»?`)) return;

      this.deletingId = chapter.id;
      try {
        await axios.delete(
          `${process.env.VUE_APP_API_URL}/api/v1/books/${this.bookId}/chapters/${chapter.id}`,
          { headers: this.authHeaders() }
        );
        this.chapters = this.chapters.filter((item) => item.id !== chapter.id);
      } catch (e) {
        this.error = 'Не удалось удалить главу.';
      } finally {
        this.deletingId = null;
      }
    },

    chapterPreview(chapter) {
      const text = String(chapter?.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (!text) return 'Без текста';
      return text.length > 90 ? `${text.slice(0, 90)}…` : text;
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

.chapters {
  background: var(--paper);
}

.shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

.chapters-main {
  padding: 32px 0 80px;
}

.chapters-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: none;
}

.chapters-back:hover {
  color: var(--accent);
}

.chapters-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  margin-top: 18px;
}

.chapters-head h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 38px;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--ink);
}

.chapters-head p {
  max-width: 560px;
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.chapters-add {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 22px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-on-accent);
  background: var(--accent);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.chapters-add:hover {
  background: var(--accent-hover);
}

/* Form */
.chapter-form {
  margin-top: 26px;
  padding: 24px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 18px;
}

.chapter-form h2 {
  margin: 0 0 18px;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  color: var(--ink);
}

.chapter-form__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px 160px;
  gap: 16px;
}

.field {
  display: block;
  margin-bottom: 16px;
}

.field span {
  display: block;
  margin-bottom: 7px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.field input,
.field textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 11px 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--accent);
}

.chapter-form__error {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--danger);
}

.chapter-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.chapter-form__actions .btn {
  height: 42px;
  padding: 0 20px;
  font-size: 13px;
}

/* List */
.chapters-state {
  padding: 40px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.chapters-state--error {
  color: var(--danger);
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 26px 0 0;
  padding: 0;
  list-style: none;
}

.chapter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 14px;
}

.chapter-row__num {
  display: inline-flex;
  flex: 0 0 34px;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--paper);
  border-radius: 50%;
}

.chapter-row__body {
  flex: 1;
  min-width: 0;
}

.chapter-row__body h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  color: var(--ink);
}

.chapter-row__body p {
  margin: 5px 0 0;
  overflow: hidden;
  font-size: 12px;
  color: var(--text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-row__dot {
  margin: 0 4px;
}

.chapter-row__actions {
  display: flex;
  gap: 8px;
}

.row-btn {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  text-decoration: none;
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  cursor: pointer;
}

.row-btn:hover {
  background: var(--surface-hover);
}

.row-btn--danger {
  color: var(--danger);
  border-color: rgba(154, 59, 50, 0.35);
}

.row-btn--danger:hover {
  color: #fff;
  background: var(--danger);
  border-color: var(--danger);
}

.row-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.chapters-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-top: 26px;
  padding: 36px;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.chapters-empty p {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .chapters-head {
    flex-direction: column;
    gap: 16px;
  }

  .chapter-form__row {
    grid-template-columns: minmax(0, 1fr) 100px 120px;
  }

  .chapter-row {
    flex-wrap: wrap;
  }

  .chapter-row__actions {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .chapters-head h1 {
    font-size: 28px;
  }

  .chapter-form__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
}
</style>
