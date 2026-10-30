<template>
  <header-vue />

  <main class="create-page">
    <div class="container-wide">
      <nav class="create-breadcrumbs" aria-label="Хлебные крошки">
        <router-link :to="{ name: 'Posts' }">Посты</router-link>
        <span aria-hidden="true">/</span>
        <span>Новый пост</span>
      </nav>

      <header class="create-hero">
        <div class="create-hero__copy">
          <span class="create-hero__eyebrow">
            <i aria-hidden="true"></i>
            НОВАЯ ПУБЛИКАЦИЯ
          </span>
          <h1 class="create-hero__title">
            Создать <em>пост</em>
          </h1>
          <p class="create-hero__text">
            Поделитесь мыслями о книге, авторе или читательском опыте.
            Хороший пост начинается с искреннего впечатления.
          </p>
        </div>

        <div class="create-hero__stats">
          <div class="create-hero__stat">
            <b>{{ wordCount }}</b>
            <span>слов</span>
          </div>
          <div class="create-hero__stat">
            <b>{{ readingTime }}</b>
            <span>мин чтения</span>
          </div>
          <div class="create-hero__stat">
            <b>{{ selectedBook ? '1' : '0' }}</b>
            <span>книг</span>
          </div>
        </div>
      </header>

      <!-- Auth loading -->
      <div v-if="!authChecked" class="create-state">
        <span class="create-spinner" aria-hidden="true"></span>
        <p>Проверяем доступ…</p>
      </div>

      <!-- Auth required -->
      <div v-else-if="!user" class="create-locked">
        <span class="create-locked__icon icon-lock" aria-hidden="true"></span>
        <span class="create-locked__kicker">ПУБЛИКАЦИЯ</span>
        <h2>Войдите, чтобы написать пост</h2>
        <p>
          Публиковать материалы могут авторизованные читатели. Войдите в аккаунт,
          и мы вернём вас на эту страницу.
        </p>
        <div class="create-locked__actions">
          <router-link
            :to="{ name: 'Login', query: { redirect: $route.fullPath } }"
            class="create-btn create-btn--primary"
          >
            Войти в библиотеку
          </router-link>
          <router-link :to="{ name: 'Posts' }" class="create-btn create-btn--ghost">
            Все посты
          </router-link>
        </div>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="create-success">
        <span class="create-success__icon icon-ok" aria-hidden="true"></span>
        <span class="create-success__kicker">ОПУБЛИКОВАНО</span>
        <h2>Пост отправлен в блог</h2>
        <p>Ваша публикация уже доступна читателям Libraria.</p>

        <div class="create-success__preview">
          <span v-if="previewTags.length" class="create-success__tag">#{{ previewTags[0].name }}</span>
          <h3>{{ publishedPost?.title || post.title }}</h3>
          <p>{{ previewText || 'Текст публикации' }}</p>
          <div class="create-success__meta">
            <span>{{ user?.name || 'Автор' }}</span>
            <span>·</span>
            <span>только что</span>
          </div>
        </div>

        <div class="create-success__actions">
          <router-link
            v-if="publishedPost?.id"
            :to="{ name: 'Post', params: { id: publishedPost.id } }"
            class="create-btn create-btn--primary"
          >
            Открыть пост
            <span class="icon-right-open" aria-hidden="true"></span>
          </router-link>
          <router-link :to="{ name: 'Posts' }" class="create-btn create-btn--ghost">
            К списку постов
          </router-link>
          <button type="button" class="create-btn create-btn--text" @click="startAnother">
            Создать ещё
          </button>
        </div>
      </div>

      <!-- Form -->
      <form v-else class="create-layout" @submit.prevent="submitPost">
        <div class="create-main">
          <div v-if="draftRestored" class="create-draft-banner">
            <span class="icon-arrows-cw" aria-hidden="true"></span>
            <p>Восстановлен сохранённый черновик. Можно продолжить с того же места.</p>
            <button type="button" @click="discardDraft">Начать заново</button>
          </div>

          <section class="create-card">
            <header class="create-card__head">
              <span class="create-card__step">01</span>
              <div>
                <span class="create-card__kicker">СОДЕРЖАНИЕ</span>
                <h2>О чём будет пост</h2>
              </div>
            </header>

            <div class="create-field">
              <label class="create-label" for="post-title">
                Заголовок
                <span class="create-label__required">*</span>
              </label>
              <div class="create-title-wrap">
                <input
                  id="post-title"
                  v-model="post.title"
                  type="text"
                  class="create-title"
                  :class="{ 'has-error': errors.title }"
                  placeholder="Дайте посту цепкий заголовок…"
                  maxlength="255"
                  autocomplete="off"
                  @input="scheduleDraft"
                />
                <span class="create-title__counter">{{ post.title.length }}/255</span>
              </div>
              <p v-if="errors.title" class="create-error">{{ errorText(errors.title) }}</p>
            </div>

            <div class="create-field">
              <label class="create-label">Текст поста <span class="create-label__required">*</span></label>
              <div class="create-editor">
                <div ref="editor" class="create-editor__canvas"></div>
              </div>
              <div class="create-editor__footer">
                <span>{{ wordCount }} слов · {{ textLength }} символов</span>
                <span class="create-editor__autosave" :class="draftStatusClass">
                  <i aria-hidden="true"></i>
                  {{ draftStatus || 'Автосохранение включено' }}
                </span>
              </div>
              <p v-if="errors.content" class="create-error">{{ errorText(errors.content) }}</p>
            </div>
          </section>

          <section ref="bookSection" class="create-card">
            <header class="create-card__head">
              <span class="create-card__step">02</span>
              <div>
                <span class="create-card__kicker">СВЯЗЬ С КНИГОЙ</span>
                <h2>Выберите книгу <span class="create-label__required">*</span></h2>
              </div>
            </header>

            <p class="create-card__hint">
              Книга обязательна: она определяет обложку поста и категории,
              по которым его смогут найти читатели.
            </p>

            <div ref="bookPicker" class="book-picker">
              <div v-if="selectedBook" class="book-selected">
                <img
                  class="book-selected__cover"
                  :src="selectedBook.cover_image || '/images/books/books_default1.jpg'"
                  :alt="selectedBook.title"
                />
                <div class="book-selected__info">
                  <strong>{{ selectedBook.title }}</strong>
                  <span>{{ selectedBook.author || 'Автор не указан' }}</span>
                  <div v-if="selectedBook.categories?.length" class="book-selected__tags">
                    <span v-for="category in selectedBook.categories.slice(0, 3)" :key="category.id">
                      #{{ category.name }}
                    </span>
                  </div>
                </div>
                <button type="button" class="book-selected__clear" aria-label="Убрать книгу" @click="clearBook">
                  <span class="icon-cancel-1" aria-hidden="true"></span>
                </button>
              </div>

              <template v-else>
                <div class="book-search" :class="{ 'is-open': bookOpen }">
                  <span class="icon-search" aria-hidden="true"></span>
                  <input
                    v-model="bookQuery"
                    type="text"
                    placeholder="Найти книгу по названию или автору…"
                    aria-label="Найти книгу"
                    autocomplete="off"
                    @focus="bookOpen = true"
                    @input="bookOpen = true"
                  />
                  <button
                    v-if="bookQuery"
                    type="button"
                    class="book-search__clear"
                    aria-label="Очистить поиск книги"
                    @click="bookQuery = ''"
                  >
                    <span class="icon-cancel-1" aria-hidden="true"></span>
                  </button>
                </div>

                <div v-if="bookOpen" class="book-options">
                  <div v-if="booksLoading" class="book-options__state">Загружаем книги…</div>
                  <div v-else-if="!filteredBooks.length" class="book-options__state">
                    Ничего не найдено.
                  </div>
                  <template v-else>
                    <button
                      v-for="book in filteredBooks"
                      :key="book.id"
                      type="button"
                      class="book-option"
                      @click="selectBook(book)"
                    >
                      <img
                        class="book-option__cover"
                        :src="book.cover_image || '/images/books/books_default1.jpg'"
                        :alt="book.title"
                        loading="lazy"
                      />
                      <span class="book-option__info">
                        <strong>{{ book.title }}</strong>
                        <small>{{ book.author || 'Автор не указан' }}</small>
                      </span>
                      <span class="icon-plus-squared book-option__plus" aria-hidden="true"></span>
                    </button>
                  </template>
                </div>
              </template>
            </div>

            <p v-if="errors.book_id" class="create-error">{{ errorText(errors.book_id) }}</p>
          </section>
        </div>

        <aside class="create-side">
          <div class="create-side__sticky">
            <section class="side-card">
              <span class="side-card__kicker">ПУБЛИКАЦИЯ</span>
              <h3 class="side-card__title">Готовы поделиться?</h3>

              <ul class="side-meta">
                <li>
                  <span>Автор</span>
                  <b>{{ user?.name || 'Вы' }}</b>
                </li>
                <li>
                  <span>Раздел</span>
                  <b>Книжный блог</b>
                </li>
                <li>
                  <span>Статус</span>
                  <b class="side-meta__draft">Черновик</b>
                </li>
              </ul>

              <p v-if="errors._server" class="create-error create-error--block">
                {{ errorText(errors._server) }}
              </p>

              <button type="submit" class="publish-btn" :disabled="submitting">
                <span v-if="submitting" class="create-spinner create-spinner--small" aria-hidden="true"></span>
                <span>{{ submitting ? 'Публикуем…' : 'Опубликовать пост' }}</span>
                <span v-if="!submitting" class="icon-paper-plane" aria-hidden="true"></span>
              </button>

              <button type="button" class="side-btn" @click="saveDraft(true)">
                Сохранить черновик
              </button>
              <button type="button" class="side-btn side-btn--muted" @click="resetForm">
                Очистить
              </button>

              <p class="side-card__note">
                Пост появится в ленте сразу после публикации. Черновик хранится
                в этом браузере.
              </p>
            </section>

            <section class="side-card side-card--preview">
              <span class="side-card__kicker">ПРЕДПРОСМОТР</span>
              <div class="preview-card">
                <div v-if="previewTags.length" class="preview-card__tags">
                  <span v-for="tag in previewTags.slice(0, 2)" :key="tag.id">#{{ tag.name }}</span>
                </div>
                <h3>{{ post.title || 'Заголовок появится здесь' }}</h3>
                <p>{{ previewText || 'Начните печатать — и здесь появится начало вашего текста.' }}</p>
                <div class="preview-card__footer">
                  <span>{{ user?.name || 'Автор' }}</span>
                  <span>·</span>
                  <span>{{ readingTime }} мин</span>
                </div>
              </div>
            </section>

            <section class="side-card">
              <span class="side-card__kicker">СОВЕТЫ</span>
              <ul class="create-tips">
                <li>Начните с личного впечатления о книге.</li>
                <li>Добавьте 2–3 конкретные детали или цитаты.</li>
                <li>Не бойтесь задать вопрос читателю в конце.</li>
              </ul>
            </section>
          </div>
        </aside>

        <div class="create-mobile-bar">
          <div class="create-mobile-bar__meta">
            <b>{{ wordCount }}</b> слов
            <span>·</span>
            <span>{{ readingTime }} мин</span>
          </div>
          <button type="button" class="create-mobile-bar__draft" @click="saveDraft(true)">
            Черновик
          </button>
          <button type="submit" class="create-mobile-bar__publish" :disabled="submitting">
            {{ submitting ? 'Публикуем…' : 'Опубликовать' }}
          </button>
        </div>
      </form>
    </div>
  </main>

  <footer-vue />
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { mapActions, mapGetters } from 'vuex';

const DRAFT_KEY = 'libraria-post-draft';
const MAX_CONTENT_LENGTH = 10000;

export default {
  name: 'PostCreatePage',
  data() {
    return {
      post: {
        title: '',
        content: '',
        book_id: null,
      },
      contentText: '',
      errors: {},
      submitting: false,
      success: false,
      publishedPost: null,
      books: [],
      booksLoading: false,
      bookQuery: '',
      bookOpen: false,
      selectedBook: null,
      authChecked: false,
      draftRestored: false,
      restoredContent: '',
      draftStatus: '',
      draftStatusClass: '',
      draftTimer: null,
      quill: null,
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    filteredBooks() {
      const query = this.bookQuery.trim().toLocaleLowerCase('ru-RU');

      const list = query
        ? this.books.filter((book) => {
            const haystack = `${book.title || ''} ${book.author || ''}`.toLocaleLowerCase('ru-RU');
            return haystack.includes(query);
          })
        : this.books;

      return list.slice(0, query ? 20 : 8);
    },
    wordCount() {
      const text = this.contentText.trim();
      return text ? text.split(/\s+/).length : 0;
    },
    textLength() {
      return this.contentText.length;
    },
    readingTime() {
      return this.wordCount ? Math.max(1, Math.round(this.wordCount / 180)) : 0;
    },
    previewText() {
      const text = this.contentText.trim();
      if (!text) return '';
      if (text.length <= 150) return text;
      return `${text.slice(0, 150).trim()}…`;
    },
    previewTags() {
      return this.selectedBook?.categories || [];
    },
  },
  watch: {
    'post.title'() {
      if (this.errors.title) this.errors = { ...this.errors, title: '' };
    },
  },
  async mounted() {
    document.addEventListener('mousedown', this.handleClickOutside);

    try {
      await this.fetchUser();
    } finally {
      this.authChecked = true;
    }

    if (!this.user) return;

    await this.fetchBooks();
    this.restoreDraft();
    await this.$nextTick();
    this.initEditor();
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);

    if (this.draftTimer) {
      window.clearTimeout(this.draftTimer);
      if (this.post.title || this.contentText) {
        this.saveDraft();
      }
    }

    this.quill = null;
  },
  methods: {
    ...mapActions('auth', {
      fetchUser: 'fetchUser',
    }),

    initEditor() {
      if (this.quill || !this.$refs.editor) return;

      if (this.restoredContent) {
        this.$refs.editor.innerHTML = this.restoredContent;
      }

      this.quill = new Quill(this.$refs.editor, {
        theme: 'snow',
        placeholder: 'Расскажите, что вас зацепило в книге…',
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'link'],
            ['clean'],
          ],
        },
      });

      this.quill.on('text-change', this.handleEditorChange);

      this.post.content = this.quill.root.innerHTML;
      this.contentText = this.quill.getText().trim();
      this.restoredContent = '';
    },
    handleEditorChange() {
      if (!this.quill) return;

      this.post.content = this.quill.root.innerHTML;
      this.contentText = this.quill.getText().trim();

      if (this.errors.content) this.errors = { ...this.errors, content: '' };
      this.scheduleDraft();
    },
    async fetchBooks() {
      this.booksLoading = true;

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/books`, {
          params: { per_page: 100 },
          headers: { Accept: 'application/json' },
        });

        this.books = Array.isArray(response.data?.books) ? response.data.books : [];
      } catch (error) {
        console.error('Не удалось загрузить книги:', error);
      } finally {
        this.booksLoading = false;
      }
    },
    handleClickOutside(event) {
      if (!this.$refs.bookPicker?.contains(event.target)) {
        this.bookOpen = false;
      }
    },
    selectBook(book) {
      this.selectedBook = book;
      this.post.book_id = book.id;
      this.bookOpen = false;
      this.bookQuery = '';
      this.scheduleDraft();
    },
    clearBook() {
      this.selectedBook = null;
      this.post.book_id = null;
      this.scheduleDraft();
    },
    scheduleDraft() {
      this.draftStatus = 'Сохраняем…';
      this.draftStatusClass = 'is-saving';

      if (this.draftTimer) window.clearTimeout(this.draftTimer);

      this.draftTimer = window.setTimeout(() => {
        this.saveDraft();
      }, 700);
    },
    saveDraft(manual = false) {
      if (this.draftTimer) {
        window.clearTimeout(this.draftTimer);
        this.draftTimer = null;
      }

      if (!this.post.title.trim() && !this.contentText) {
        this.draftStatus = '';
        this.draftStatusClass = '';
        if (manual) this.showDraftStatus('Нечего сохранять', 'is-empty');
        return;
      }

      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            title: this.post.title,
            content: this.post.content,
            book_id: this.post.book_id,
            savedAt: new Date().toISOString(),
          })
        );
        this.draftStatus = manual ? 'Черновик сохранён' : 'Сохранено';
        this.draftStatusClass = 'is-saved';
      } catch (error) {
        this.draftStatus = 'Не удалось сохранить';
        this.draftStatusClass = 'is-error';
      }
    },
    showDraftStatus(message, className) {
      this.draftStatus = message;
      this.draftStatusClass = className;
      window.setTimeout(() => {
        if (this.draftStatus === message) {
          this.draftStatus = 'Автосохранение включено';
          this.draftStatusClass = '';
        }
      }, 1800);
    },
    restoreDraft() {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;

        const draft = JSON.parse(raw);
        if (!draft || (!draft.title && !draft.content)) return;

        this.post.title = draft.title || '';
        this.post.book_id = draft.book_id || null;
        this.draftRestored = true;
        this.restoredContent = draft.content || '';
        this.draftStatus = 'Черновик восстановлен';
        this.draftStatusClass = 'is-saved';

        if (this.post.book_id) {
          this.selectedBook = this.books.find((book) => Number(book.id) === Number(this.post.book_id)) || null;
        }
      } catch (error) {
        localStorage.removeItem(DRAFT_KEY);
      }
    },
    clearDraft() {
      if (this.draftTimer) {
        window.clearTimeout(this.draftTimer);
        this.draftTimer = null;
      }
      localStorage.removeItem(DRAFT_KEY);
      this.draftRestored = false;
      this.draftStatus = 'Автосохранение включено';
      this.draftStatusClass = '';
    },
    discardDraft() {
      this.clearDraft();
      this.post = { title: '', content: '', book_id: null };
      this.selectedBook = null;
      this.contentText = '';
      this.errors = {};
      if (this.quill) this.quill.setText('');
    },
    errorText(value) {
      if (Array.isArray(value)) return value[0] || '';
      return value || '';
    },
    validate() {
      const errors = {};
      const title = this.post.title.trim();
      const contentText = this.contentText.trim();

      if (title.length < 5) {
        errors.title = 'Заголовок должен быть не короче 5 символов.';
      } else if (title.length > 255) {
        errors.title = 'Заголовок не должен превышать 255 символов.';
      }

      if (contentText.length < 5) {
        errors.content = 'Текст поста должен быть не короче 5 символов.';
      } else if (this.post.content.length > MAX_CONTENT_LENGTH) {
        errors.content = `Текст слишком длинный: максимум ${MAX_CONTENT_LENGTH} символов.`;
      }

      if (!this.post.book_id) {
        errors.book_id = 'Выберите книгу, к которой относится пост.';
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async submitPost() {
      if (this.submitting) return;

      this.errors = {};

      if (!this.user) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
        return;
      }

      if (!this.validate()) {
        if (this.errors.book_id) {
          this.scrollToBooks();
        } else {
          this.scrollToTop();
        }
        return;
      }

      this.submitting = true;

      const authToken = Cookies.get('auth_token') ?? '';
      const payload = {
        title: this.post.title.trim(),
        content: this.post.content || `<p>${this.contentText}</p>`,
      };
      if (this.post.book_id) payload.book_id = this.post.book_id;

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/v1/posts`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
              Accept: 'application/json',
            },
          }
        );

        this.publishedPost = response.data?.data || response.data;
        this.success = true;
        this.clearDraft();
        this.scrollToTop();
      } catch (error) {
        const data = error.response?.data;

        if (data?.errors) {
          this.errors = data.errors;
        } else if (error.response?.status === 401) {
          this.errors._server = 'Сессия истекла. Войдите снова, чтобы опубликовать пост.';
        } else {
          this.errors._server = data?.message || 'Не удалось опубликовать пост. Попробуйте ещё раз.';
        }

        this.scrollToTop();
      } finally {
        this.submitting = false;
      }
    },
    resetForm() {
      if (
        (this.post.title.trim() || this.contentText) &&
        !window.confirm('Очистить пост и удалить сохранённый черновик?')
      ) {
        return;
      }

      this.clearDraft();
      this.post = { title: '', content: '', book_id: null };
      this.selectedBook = null;
      this.contentText = '';
      this.errors = {};
      this.publishedPost = null;
      this.success = false;
      if (this.quill) this.quill.setText('');
      this.scrollToTop();
    },
    startAnother() {
      this.post = { title: '', content: '', book_id: null };
      this.selectedBook = null;
      this.contentText = '';
      this.errors = {};
      this.publishedPost = null;
      this.success = false;
      this.draftRestored = false;
      if (this.quill) this.quill.setText('');
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    scrollToBooks() {
      this.$refs.bookSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
  },
};
</script>

<style scoped>
.create-page {
  min-height: 100vh;
  padding: var(--space-6) 0 var(--space-16);
  background:
    radial-gradient(900px 320px at 92% -10%, rgba(231, 165, 74, 0.1), transparent 60%),
    var(--paper);
}

.create-breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.create-breadcrumbs a {
  color: #9d6d33;
  text-decoration: none;
}

.create-breadcrumbs a:hover {
  color: var(--accent-hover);
}

.create-breadcrumbs span[aria-hidden] {
  color: var(--line-strong);
}

.create-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--line);
}

.create-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.create-hero__eyebrow i {
  width: 20px;
  height: 1px;
  background: var(--accent);
}

.create-hero__title {
  margin: var(--space-3) 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(36px, 4.8vw, 56px);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1;
}

.create-hero__title em {
  color: var(--accent);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.create-hero__text {
  max-width: 560px;
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.create-hero__stats {
  display: flex;
  gap: var(--space-4);
  flex-shrink: 0;
}

.create-hero__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  min-width: 54px;
}

.create-hero__stat b {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.create-hero__stat span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  letter-spacing: 0.04em;
}

/* Layout */
.create-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 306px;
  align-items: start;
  gap: var(--space-5);
}

.create-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.create-side {
  min-width: 0;
}

.create-side__sticky {
  position: sticky;
  top: calc(var(--header-height) + var(--space-5));
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.create-card {
  overflow: visible;
  padding: var(--space-5);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.create-card__head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--line);
}

.create-card__step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.12);
  border: 1px solid rgba(231, 165, 74, 0.24);
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
}

.create-card__kicker {
  display: block;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.create-card__head h2 {
  margin: 2px 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.create-card__hint {
  margin: 0 0 var(--space-4);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: 1.55;
}

.create-field + .create-field {
  margin-top: var(--space-5);
}

.create-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: var(--space-2);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
}

.create-label__required {
  color: var(--danger);
}

.create-title-wrap {
  position: relative;
}

.create-title {
  width: 100%;
  padding: var(--space-3) 58px var(--space-3) var(--space-4);
  color: var(--ink);
  background: var(--paper);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  outline: none;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 500;
  letter-spacing: -0.02em;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.create-title::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}

.create-title:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.13);
}

.create-title.has-error {
  border-color: var(--danger);
}

.create-title__counter {
  position: absolute;
  top: 50%;
  right: var(--space-3);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  transform: translateY(-50%);
}

/* Editor */
.create-editor {
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.create-editor:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.1);
}

.create-editor :deep(.ql-toolbar.ql-snow) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 8px 10px;
  background: #faf8f3;
  border: 0;
  border-bottom: 1px solid var(--line);
}

.create-editor :deep(.ql-toolbar.ql-snow .ql-formats) {
  margin-right: 10px;
}

.create-editor :deep(.ql-toolbar.ql-snow button) {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
}

.create-editor :deep(.ql-toolbar.ql-snow button:hover) {
  background: rgba(231, 165, 74, 0.14);
}

.create-editor :deep(.ql-toolbar.ql-snow .ql-picker) {
  color: var(--text-secondary);
}

.create-editor :deep(.ql-toolbar.ql-snow .ql-picker-label) {
  border-radius: var(--radius-sm);
}

.create-editor :deep(.ql-container.ql-snow) {
  border: 0;
  font-family: var(--font-sans);
  font-size: 15px;
}

.create-editor :deep(.ql-editor) {
  min-height: 340px;
  padding: var(--space-4);
  color: var(--ink);
  line-height: 1.75;
}

.create-editor :deep(.ql-editor.ql-blank::before) {
  color: var(--text-muted);
  font-style: normal;
}

.create-editor :deep(.ql-editor h2) {
  font-size: var(--text-xl);
}

.create-editor :deep(.ql-editor h3) {
  font-size: var(--text-lg);
}

.create-editor :deep(.ql-editor blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: var(--space-4);
  color: var(--text-secondary);
  font-style: italic;
}

.create-editor__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.create-editor__autosave {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.create-editor__autosave i {
  width: 5px;
  height: 5px;
  background: var(--line-strong);
  border-radius: 50%;
}

.create-editor__autosave.is-saving i {
  background: var(--warning);
  animation: create-pulse 0.9s ease-in-out infinite;
}

.create-editor__autosave.is-saved i {
  background: var(--success);
}

.create-editor__autosave.is-error i {
  background: var(--danger);
}

.create-editor__autosave.is-empty i {
  background: var(--text-muted);
}

@keyframes create-pulse {
  50% { opacity: 0.35; }
}

.create-error {
  margin: var(--space-2) 0 0;
  color: var(--danger);
  font-family: var(--font-sans);
  font-size: 10.5px;
  line-height: 1.4;
}

.create-error--block {
  padding: var(--space-2) var(--space-3);
  background: rgba(145, 32, 22, 0.06);
  border: 1px solid rgba(145, 32, 22, 0.15);
  border-radius: var(--radius-md);
}

/* Book picker */
.book-picker {
  position: relative;
}

.book-selected {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: #faf8f3;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.book-selected__cover {
  width: 42px;
  height: 58px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 10px rgba(25, 27, 28, 0.15);
}

.book-selected__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.book-selected__info strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
}

.book-selected__info > span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.book-selected__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 3px;
}

.book-selected__tags span {
  padding: 2px 6px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.1);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

.book-selected__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: auto;
  flex-shrink: 0;
  color: var(--text-muted);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  cursor: pointer;
}

.book-selected__clear:hover {
  color: var(--danger);
  border-color: var(--danger);
}

.book-search {
  position: relative;
  display: flex;
  align-items: center;
}

.book-search .icon-search {
  position: absolute;
  left: var(--space-3);
  color: var(--text-muted);
  font-size: var(--text-xs);
  pointer-events: none;
}

.book-search input {
  width: 100%;
  height: 44px;
  padding: 0 var(--space-9, 36px) 0 var(--space-8);
  color: var(--ink);
  background: var(--paper);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  outline: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
}

.book-search input:focus,
.book-search.is-open input {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.1);
}

.book-search__clear {
  position: absolute;
  right: var(--space-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--text-muted);
  background: var(--surface-hover);
  border: 0;
  border-radius: var(--radius-full);
  cursor: pointer;
}

.book-options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 280px;
  overflow-y: auto;
  padding: 4px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}

.book-options__state {
  padding: var(--space-4);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  text-align: center;
}

.book-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: 7px 8px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: var(--radius-md);
  text-align: left;
  cursor: pointer;
}

.book-option:hover {
  background: #faf8f3;
}

.book-option__cover {
  width: 26px;
  height: 36px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 3px;
}

.book-option__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.book-option__info strong {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-option__info small {
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-option__plus {
  color: var(--text-muted);
  font-size: 10px;
}

/* Sidebar */
.side-card {
  padding: var(--space-4);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.side-card__kicker {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.side-card__title {
  margin: 0 0 var(--space-3);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.side-meta {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;
}

.side-meta li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.side-meta li b {
  color: var(--ink);
  font-weight: 500;
  text-align: right;
}

.side-meta__draft {
  color: #9d6d33 !important;
}

.publish-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  height: 44px;
  color: #fff;
  background: var(--ink);
  border: 1px solid var(--ink);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.publish-btn:hover:not(:disabled) {
  background: #000;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.publish-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

.publish-btn span:last-child {
  color: var(--accent);
  font-size: 12px;
}

.side-btn {
  width: 100%;
  height: 36px;
  margin-top: var(--space-2);
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.side-btn:hover {
  color: var(--ink);
  border-color: var(--accent);
}

.side-btn--muted {
  margin-top: 4px;
  color: var(--text-muted);
  border-color: transparent;
}

.side-btn--muted:hover {
  color: var(--danger);
  border-color: transparent;
}

.side-card__note {
  margin: var(--space-3) 0 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  line-height: 1.5;
}

/* Preview */
.preview-card {
  padding: var(--space-3);
  background: var(--paper);
  border-radius: var(--radius-md);
}

.preview-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}

.preview-card__tags span {
  padding: 2px 6px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.1);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 8px;
}

.preview-card h3 {
  display: -webkit-box;
  margin: 0 0 5px;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.preview-card p {
  display: -webkit-box;
  margin: 0 0 8px;
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 9.5px;
  line-height: 1.55;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.preview-card__footer {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

.create-tips {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.create-tips li {
  position: relative;
  padding-left: 12px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 9.5px;
  line-height: 1.5;
}

.create-tips li::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 0;
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
}

/* Draft banner */
.create-draft-banner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  color: var(--text-secondary);
  background: rgba(231, 165, 74, 0.09);
  border: 1px solid rgba(231, 165, 74, 0.3);
  border-radius: var(--radius-lg);
}

.create-draft-banner > span {
  color: #9d6d33;
  font-size: 12px;
}

.create-draft-banner p {
  flex: 1;
  margin: 0;
  font-family: var(--font-sans);
  font-size: 10px;
  line-height: 1.4;
}

.create-draft-banner button {
  color: #9d6d33;
  background: transparent;
  border: 0;
  border-bottom: 1px solid currentColor;
  font-family: var(--font-sans);
  font-size: 9px;
  cursor: pointer;
  white-space: nowrap;
}

/* States */
.create-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-16) var(--space-4);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
}

.create-spinner {
  width: 26px;
  height: 26px;
  border: 2px solid var(--line);
  border-top-color: var(--accent);
  border-radius: var(--radius-full);
  animation: create-spin 0.8s linear infinite;
}

.create-spinner--small {
  width: 14px;
  height: 14px;
  border-width: 2px;
  border-top-color: var(--accent);
}

@keyframes create-spin {
  to { transform: rotate(360deg); }
}

.create-locked {
  max-width: 560px;
  margin: var(--space-8) auto;
  padding: var(--space-10) var(--space-8);
  text-align: center;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
}

.create-locked__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: var(--space-4);
  color: #fff;
  background: var(--ink);
  border-radius: var(--radius-full);
  font-size: var(--text-xl);
}

.create-locked__kicker {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.create-locked h2 {
  margin: 0 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
}

.create-locked p {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.create-locked__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.create-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 42px;
  padding: 0 var(--space-5);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.create-btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
}

.create-btn--primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.create-btn--ghost {
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
}

.create-btn--ghost:hover {
  color: var(--ink);
  border-color: var(--ink);
}

.create-btn--text {
  color: var(--text-muted);
  background: transparent;
  border: 0;
  padding: 0 var(--space-2);
}

.create-btn--text:hover {
  color: var(--accent);
}

/* Success */
.create-success {
  max-width: 660px;
  margin: var(--space-6) auto;
  padding: var(--space-10) var(--space-8);
  text-align: center;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
}

.create-success__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-4);
  color: #fff;
  background: var(--success);
  border-radius: var(--radius-full);
  font-size: var(--text-2xl);
  box-shadow: 0 10px 28px rgba(6, 105, 108, 0.25);
}

.create-success__kicker {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.create-success h2 {
  margin: 0 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.create-success > p {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
}

.create-success__preview {
  margin: var(--space-5) 0;
  padding: var(--space-4);
  text-align: left;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.create-success__tag {
  display: inline-block;
  margin-bottom: 5px;
  padding: 3px 7px;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

.create-success__preview h3 {
  margin: 0 0 6px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
}

.create-success__preview p {
  margin: 0 0 8px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: 1.55;
}

.create-success__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
}

.create-success__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

/* Mobile publish bar */
.create-mobile-bar {
  display: none;
}

@media (max-width: 768px) {
  .create-page {
    padding-bottom: 96px;
  }

  .create-mobile-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1500;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 10px var(--space-3) max(10px, env(safe-area-inset-bottom));
    background: rgba(251, 248, 242, 0.96);
    border-top: 1px solid var(--line);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 -10px 30px rgba(25, 27, 28, 0.08);
  }

  .create-mobile-bar__meta {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    min-width: 0;
    color: var(--text-muted);
    font-family: var(--font-sans);
    font-size: 9px;
    white-space: nowrap;
  }

  .create-mobile-bar__meta b {
    color: var(--ink);
    font-family: var(--font-display);
    font-size: var(--text-sm);
  }

  .create-mobile-bar__draft {
    height: 40px;
    padding: 0 10px;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    font-family: var(--font-sans);
    font-size: 9px;
    font-weight: 500;
    cursor: pointer;
  }

  .create-mobile-bar__publish {
    height: 40px;
    padding: 0 14px;
    color: #fff;
    background: var(--ink);
    border: 1px solid var(--ink);
    border-radius: var(--radius-md);
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }

  .create-mobile-bar__publish:disabled {
    opacity: 0.65;
  }

  .create-side .side-card:first-child {
    display: none;
  }
}

@media (max-width: 1024px) {
  .create-layout {
    grid-template-columns: 1fr;
  }

  .create-side__sticky {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .side-card:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .create-hero {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-4);
  }

  .create-hero__stats {
    width: 100%;
    justify-content: space-between;
  }

  .create-hero__stat {
    align-items: flex-start;
  }

  .create-card {
    padding: var(--space-4);
  }

  .create-title {
    font-size: var(--text-lg);
    padding-right: 52px;
  }

  .create-editor :deep(.ql-editor) {
    min-height: 280px;
  }

  .create-editor__footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }

  .side-card:first-child {
    grid-column: auto;
  }

  .create-side__sticky {
    grid-template-columns: 1fr;
  }

  .create-success {
    padding: var(--space-8) var(--space-4);
  }

  .create-success h2 {
    font-size: var(--text-2xl);
  }
}

@media (max-width: 480px) {
  .create-page {
    padding-top: var(--space-4);
  }

  .create-hero__title {
    font-size: 36px;
  }

  .create-editor :deep(.ql-toolbar.ql-snow) {
    padding: 6px;
  }

  .create-editor :deep(.ql-editor) {
    min-height: 240px;
    padding: var(--space-3);
  }

  .create-draft-banner {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .create-draft-banner button {
    margin-left: 20px;
  }
}
</style>
