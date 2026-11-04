<template>
  <div class="editor">
    <!-- Minimal top bar, as in the mock -->
    <header class="editor-bar">
      <router-link :to="{ name: 'Home' }" class="editor-bar__brand" aria-label="Libraria">
        <span class="editor-bar__mark">
          <img src="/images/logo.svg" alt="" />
        </span>
      </router-link>

      <span class="editor-bar__title">{{ isEdit ? 'Редактирование поста' : 'Новый пост' }}</span>

      <div class="editor-bar__actions">
        <button type="button" class="editor-bar__draft" :disabled="saving" @click="saveDraft">
          Черновик
        </button>
        <button type="button" class="editor-bar__publish" :disabled="saving" @click="publish">
          {{ saving ? 'Публикуем…' : (isEdit ? 'Сохранить' : 'Опубликовать') }}
        </button>
      </div>
    </header>

    <main class="editor-main">
      <form class="editor-form" @submit.prevent="publish">
        <textarea
          v-model="form.title"
          class="editor-title"
          rows="1"
          placeholder="Заголовок поста"
          maxlength="255"
          @input="autoGrow"
        ></textarea>

        <div class="editor-row">
          <div class="editor-field">
            <span class="editor-label">О какой книге пишем?</span>
            <div class="editor-book">
              <span class="icon-search" aria-hidden="true"></span>
              <input
                v-model.trim="bookQuery"
                type="search"
                placeholder="Найти книгу в каталоге…"
                @input="searchBooks"
                @focus="bookListOpen = true"
              />

              <ul v-if="bookListOpen && bookResults.length" class="editor-book__list">
                <li v-for="book in bookResults" :key="book.id">
                  <button type="button" @click="selectBook(book)">
                    {{ book.title }}
                    <small>{{ book.author }}</small>
                  </button>
                </li>
              </ul>
            </div>

            <button v-if="form.book" type="button" class="editor-book__selected" @click="clearBook">
              {{ form.book.title }}
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <label class="editor-field">
            <span class="editor-label">Категория</span>
            <input v-model.trim="form.category" type="text" placeholder="Рецензии" />
          </label>
        </div>

        <div class="editor-body">
          <div class="editor-toolbar" role="toolbar" aria-label="Форматирование">
            <button type="button" class="editor-tool" title="Жирный" @click="format('bold')"><b>B</b></button>
            <button type="button" class="editor-tool" title="Курсив" @click="format('italic')"><i>I</i></button>
            <button type="button" class="editor-tool" title="Цитата" @click="format('quote')">❝</button>
            <button type="button" class="editor-tool" title="Список" @click="format('list')">≔</button>
            <button type="button" class="editor-tool" title="Ссылка" @click="format('link')">🔗</button>
          </div>

          <div
            ref="content"
            class="editor-content"
            contenteditable="true"
            role="textbox"
            aria-multiline="true"
            data-placeholder="Начните писать вашу историю здесь…"
            @input="syncContent"
          ></div>
        </div>

        <section class="editor-cover">
          <div>
            <p class="editor-label">Обложка поста</p>
            <p class="editor-hint">Рекомендуем использовать изображение 1200×630px</p>
            <p v-if="form.coverName" class="editor-hint editor-hint--file">{{ form.coverName }}</p>
          </div>

          <label class="editor-upload">
            Загрузить
            <input type="file" accept="image/*" @change="pickCover" />
          </label>
        </section>

        <label class="editor-tags">
          <span class="editor-label">Теги</span>
          <input v-model.trim="form.tags" type="text" placeholder="Добавьте теги через запятую (например: «Классика», «Мнение»)" />
        </label>

        <p v-if="error" class="editor-error">{{ error }}</p>
        <p v-if="notice" class="editor-notice">{{ notice }}</p>
      </form>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapGetters } from 'vuex';

export default {
  name: 'PostCreatePage',
  data() {
    return {
      form: {
        title: '',
        content: '',
        category: '',
        tags: '',
        book: null,
        cover: null,
        coverName: '',
      },
      bookQuery: '',
      bookResults: [],
      bookListOpen: false,
      searchTimer: null,
      saving: false,
      error: '',
      notice: '',
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    isEdit() {
      return this.$route.name === 'PostEdit';
    },
    editId() {
      return this.isEdit ? this.$route.params.id : null;
    },
  },
  mounted() {
    if (!this.user) {
      this.$router.replace({ name: 'Login', query: { redirect: this.$route.fullPath } });
      return;
    }
    if (this.isEdit) this.loadPost();
  },
  methods: {
    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },

    autoGrow(event) {
      const el = event.target;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    },

    async loadPost() {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/posts/${this.editId}`, {
          headers: this.authHeaders(),
        });
        const post = data?.data || data;
        this.form.title = post.title || '';
        this.form.content = post.content || '';
        this.form.book = post.book ? { id: post.book.id, title: post.book.title, author: post.book.author } : null;
        this.form.tags = (post.tags || []).map((tag) => tag.name).join(', ');
        this.form.category = post.categories?.[0]?.name || '';
        this.$nextTick(() => {
          if (this.$refs.content) this.$refs.content.innerHTML = this.form.content;
        });
      } catch (e) {
        this.error = 'Не удалось загрузить пост.';
      }
    },

    async searchBooks() {
      window.clearTimeout(this.searchTimer);
      const query = this.bookQuery.trim();
      if (!query) {
        this.bookResults = [];
        return;
      }

      this.searchTimer = window.setTimeout(async () => {
        try {
          const { data } = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/books`, {
            params: { search: query, per_page: 6 },
            headers: { Accept: 'application/json' },
          });
          this.bookResults = data.books || [];
        } catch (e) {
          this.bookResults = [];
        }
      }, 300);
    },

    selectBook(book) {
      this.form.book = { id: book.id, title: book.title, author: book.author };
      this.bookQuery = '';
      this.bookResults = [];
      this.bookListOpen = false;
    },

    clearBook() {
      this.form.book = null;
    },

    format(kind) {
      const el = this.$refs.content;
      if (!el) return;
      el.focus();

      if (kind === 'quote') {
        document.execCommand('formatBlock', false, 'blockquote');
      } else if (kind === 'list') {
        document.execCommand('insertUnorderedList');
      } else if (kind === 'link') {
        const url = window.prompt('Адрес ссылки', 'https://');
        if (url) document.execCommand('createLink', false, url);
      } else {
        document.execCommand(kind);
      }

      this.syncContent();
    },

    syncContent() {
      const el = this.$refs.content;
      this.form.content = el ? el.innerHTML : '';
    },

    pickCover(event) {
      const [file] = event.target.files || [];
      if (!file) return;
      this.form.cover = file;
      this.form.coverName = file.name;
    },

    buildPayload() {
      const tags = this.form.tags
        ? this.form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      return {
        title: this.form.title.trim(),
        content: this.form.content,
        book_id: this.form.book ? this.form.book.id : null,
        category: this.form.category || null,
        tags,
      };
    },

    validate() {
      if (this.form.title.trim().length < 5) return 'Заголовок должен быть не короче 5 символов.';
      const plain = String(this.form.content || '').replace(/<[^>]*>/g, '').trim();
      if (plain.length < 5) return 'Текст поста слишком короткий.';
      return '';
    },

    async publish() {
      const problem = this.validate();
      if (problem) {
        this.error = problem;
        this.notice = '';
        return;
      }
      if (this.saving) return;

      this.saving = true;
      this.error = '';

      try {
        const payload = this.buildPayload();
        const url = this.isEdit
          ? `${process.env.VUE_APP_API_URL}/api/v1/posts/${this.editId}`
          : `${process.env.VUE_APP_API_URL}/api/v1/posts`;

        const request = this.isEdit ? 'patch' : 'post';
        const { data } = await axios[request](url, payload, { headers: this.authHeaders() });
        const post = data?.data || data;

        localStorage.removeItem('libraria:post-draft');
        this.$router.push({ name: 'Post', params: { id: post.id || this.editId } });
      } catch (e) {
        this.error = e?.response?.data?.message || 'Не удалось сохранить пост.';
      } finally {
        this.saving = false;
      }
    },

    saveDraft() {
      try {
        localStorage.setItem('libraria:post-draft', JSON.stringify({
          title: this.form.title,
          content: this.form.content,
          bookId: this.form.book?.id || null,
          category: this.form.category,
          tags: this.form.tags,
          savedAt: Date.now(),
        }));
        this.notice = 'Черновик сохранён в этом браузере.';
        this.error = '';
      } catch (e) {
        this.error = 'Не удалось сохранить черновик.';
      }
    },
  },
};
</script>

<style scoped>
.editor {
  min-height: 100vh;
  background: var(--cream);
}

/* Top bar */
.editor-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 32px;
  height: 64px;
  background: var(--cream);
  border-bottom: 1px solid var(--line);
}

.editor-bar__brand {
  display: inline-flex;
  text-decoration: none;
}

.editor-bar__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--accent);
  border-radius: 8px;
}

.editor-bar__mark img {
  width: 18px;
  height: 18px;
}

.editor-bar__title {
  font-size: 13px;
  color: var(--text-secondary);
}

.editor-bar__actions {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
}

.editor-bar__draft {
  padding: 0;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--text-secondary);
  background: none;
  border: 0;
  cursor: pointer;
}

.editor-bar__publish {
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

.editor-bar__publish:hover:not(:disabled) {
  background: var(--accent-hover);
}

.editor-bar__publish:disabled,
.editor-bar__draft:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Form */
.editor-main {
  padding: 56px 24px 80px;
}

.editor-form {
  width: 640px;
  max-width: 100%;
  margin: 0 auto;
}

.editor-title {
  display: block;
  width: 100%;
  padding: 0;
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--ink);
  background: transparent;
  border: 0;
  outline: none;
  resize: none;
  overflow: hidden;
}

.editor-title::placeholder {
  color: var(--text-muted);
}

.editor-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 40px;
}

.editor-field {
  position: relative;
  display: block;
}

.editor-label {
  display: block;
  margin-bottom: 8px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.editor-field input,
.editor-tags input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
}

.editor-book {
  position: relative;
}

.editor-book .icon-search {
  position: absolute;
  top: 50%;
  left: 14px;
  font-size: 12px;
  color: var(--text-muted);
  transform: translateY(-50%);
}

.editor-book input {
  padding-left: 38px;
}

.editor-book__list {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  z-index: 20;
  max-height: 240px;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  list-style: none;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 16px 34px rgba(30, 33, 36, 0.1);
}

.editor-book__list button {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 10px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  text-align: left;
  background: none;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.editor-book__list button:hover {
  background: var(--paper);
}

.editor-book__list small {
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-muted);
}

.editor-book__selected {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 4px 10px;
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-light);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
}

/* Editor */
.editor-body {
  margin-top: 28px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--cream);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
}

.editor-tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-secondary);
  background: none;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}

.editor-tool:hover {
  background: var(--paper);
  color: var(--ink);
}

.editor-content {
  box-sizing: border-box;
  min-height: 340px;
  padding: 18px;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink);
  outline: none;
}

.editor-content:empty::before {
  font-size: 14px;
  color: var(--text-muted);
  content: attr(data-placeholder);
  pointer-events: none;
}

.editor-content :deep(blockquote) {
  margin: 12px 0;
  padding-left: 14px;
  font-family: var(--font-display);
  font-style: italic;
  border-left: 2px solid var(--gold);
}

/* Cover */
.editor-cover {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-top: 26px;
}

.editor-hint {
  margin: 0;
  font-size: 11px;
  color: var(--text-muted);
}

.editor-hint--file {
  margin-top: 4px;
  color: var(--accent);
}

.editor-upload {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 18px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.editor-upload input {
  display: none;
}

/* Tags */
.editor-tags {
  display: block;
  margin-top: 26px;
}

.editor-error {
  margin: 18px 0 0;
  font-size: 12px;
  color: var(--danger);
}

.editor-notice {
  margin: 18px 0 0;
  font-size: 12px;
  color: var(--accent);
}

@media (max-width: 760px) {
  .editor-bar {
    padding: 0 16px;
  }

  .editor-main {
    padding: 32px 16px 60px;
  }

  .editor-title {
    font-size: 28px;
  }

  .editor-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }

  .editor-cover {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
