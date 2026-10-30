<template>
  <div class="bc-page">
    <header-vue />

    <main class="bc-main">
      <div class="container-wide">
        <header class="bc-head">
          <div class="bc-head__copy">
            <router-link :to="{ name: 'Books' }" class="bc-back">
              <span class="icon-left-open" aria-hidden="true"></span>
              Каталог книг
            </router-link>
            <span class="bc-kicker"><i aria-hidden="true"></i> СОЗДАНИЕ КНИГИ</span>
            <h1>Добавить книгу</h1>
            <p>Расскажите о книге так, чтобы её захотелось открыть.</p>
          </div>
          <div class="bc-head__aside">
            <span class="bc-head__note">Обложка, описание и категории помогут читателям найти книгу.</span>
          </div>
        </header>

        <div v-if="!authReady" class="bc-auth bc-auth--loading">
          <span class="bc-spinner bc-spinner--dark" aria-hidden="true"></span>
          <p>Готовим форму…</p>
        </div>

        <div v-else-if="!user" class="bc-auth">
          <span class="bc-auth__icon icon-lock" aria-hidden="true"></span>
          <h2>Войдите, чтобы добавить книгу</h2>
          <p>Создавать книги могут зарегистрированные читатели.</p>
          <div class="bc-auth__actions">
            <router-link :to="{ name: 'Login', query: { redirect: $route.fullPath } }" class="bc-btn bc-btn--primary">
              Войти
            </router-link>
            <router-link :to="{ name: 'Registration' }" class="bc-btn">Регистрация</router-link>
          </div>
        </div>

        <div v-else-if="success" class="bc-success">
          <span class="bc-success__icon icon-ok" aria-hidden="true"></span>
          <span class="bc-kicker">КНИГА ДОБАВЛЕНА</span>
          <h2>{{ createdBook?.title || 'Книга готова' }}</h2>
          <p>Она уже в каталоге. Можно открыть карточку или добавить ещё одну.</p>
          <div class="bc-success__actions">
            <router-link
              v-if="createdBook?.id"
              :to="{ name: 'Book', params: { id: createdBook.id } }"
              class="bc-btn bc-btn--primary"
            >
              Открыть книгу
              <span class="icon-right-open" aria-hidden="true"></span>
            </router-link>
            <button type="button" class="bc-btn" @click="resetForm">Добавить ещё</button>
            <router-link :to="{ name: 'Books' }" class="bc-btn">В каталог</router-link>
          </div>
        </div>

        <form v-else class="bc-layout" @submit.prevent="submitBook">
          <div class="bc-form">
            <div v-if="errors._server" class="bc-server-error" role="alert">
              <span class="icon-attention-alt" aria-hidden="true"></span>
              {{ errors._server }}
            </div>

            <section class="bc-card">
              <header class="bc-card__head">
                <span class="bc-card__number">01</span>
                <div>
                  <span class="bc-kicker">ГЛАВНОЕ</span>
                  <h2>О книге</h2>
                </div>
              </header>

              <div class="bc-field">
                <label for="book-title">Название <span>*</span></label>
                <input
                  id="book-title"
                  v-model="form.title"
                  type="text"
                  maxlength="50"
                  placeholder="Например, «Мастер и Маргарита»"
                  :class="{ 'is-error': errors.title }"
                />
                <div class="bc-field__meta">
                  <span v-if="errors.title" class="bc-field__error">{{ errors.title }}</span>
                  <span v-else>От 5 до 50 символов</span>
                  <span>{{ form.title.length }}/50</span>
                </div>
              </div>

              <div class="bc-field">
                <label for="book-author">Автор <span>*</span></label>
                <input
                  id="book-author"
                  v-model="form.author"
                  type="text"
                  maxlength="50"
                  placeholder="Имя автора"
                  :class="{ 'is-error': errors.author }"
                />
                <div class="bc-field__meta">
                  <span v-if="errors.author" class="bc-field__error">{{ errors.author }}</span>
                  <span v-else>От 5 до 50 символов</span>
                  <span>{{ form.author.length }}/50</span>
                </div>
              </div>

              <div class="bc-field">
                <label for="book-description">Описание <span>*</span></label>
                <textarea
                  id="book-description"
                  v-model="form.description"
                  rows="7"
                  maxlength="10000"
                  placeholder="О чём эта книга, кому она может понравиться, почему её стоит открыть…"
                  :class="{ 'is-error': errors.description }"
                ></textarea>
                <div class="bc-field__meta">
                  <span v-if="errors.description" class="bc-field__error">{{ errors.description }}</span>
                  <span v-else>Не меньше 10 символов</span>
                  <span>{{ form.description.length }}/10000</span>
                </div>
              </div>
            </section>

            <section class="bc-card">
              <header class="bc-card__head">
                <span class="bc-card__number">02</span>
                <div>
                  <span class="bc-kicker">ВИЗУАЛЬНОЕ</span>
                  <h2>Обложка</h2>
                </div>
              </header>

              <div
                class="bc-dropzone"
                :class="{ 'is-dragging': dragActive, 'has-file': !!coverPreview }"
                @click="openFileDialog"
                @dragover.prevent="dragActive = true"
                @dragleave.prevent="dragActive = false"
                @drop.prevent="handleDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  class="bc-dropzone__input"
                  @change="onFileChange"
                />

                <div v-if="coverPreview" class="bc-dropzone__preview">
                  <img :src="coverPreview" :alt="form.title || 'Обложка книги'" />
                  <div class="bc-dropzone__overlay">
                    <span class="icon-pencil" aria-hidden="true"></span>
                    Изменить
                  </div>
                </div>

                <div v-else class="bc-dropzone__empty">
                  <span class="bc-dropzone__icon icon-upload-cloud" aria-hidden="true"></span>
                  <strong>Перетащите обложку сюда</strong>
                  <span>или нажмите, чтобы выбрать файл</span>
                  <small>JPG, PNG, GIF · до 2 МБ</small>
                </div>
              </div>

              <div v-if="errors.cover_image" class="bc-field__error bc-field__error--standalone">
                {{ errors.cover_image }}
              </div>

              <button v-if="coverFile" type="button" class="bc-remove-file" @click="removeCover">
                <span class="icon-cancel-1" aria-hidden="true"></span>
                Убрать обложку
              </button>
            </section>

            <section class="bc-card">
              <header class="bc-card__head">
                <span class="bc-card__number">03</span>
                <div>
                  <span class="bc-kicker">ДЕТАЛИ</span>
                  <h2>Оформление карточки</h2>
                </div>
              </header>

              <div class="bc-grid">
                <div class="bc-field">
                  <label for="book-language">Язык</label>
                  <span class="bc-select-wrap">
                    <select id="book-language" v-model="form.language">
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="es">Español</option>
                    </select>
                    <span class="icon-down-open" aria-hidden="true"></span>
                  </span>
                </div>

                <div class="bc-field">
                  <label for="book-pages">Страниц</label>
                  <input
                    id="book-pages"
                    v-model.number="form.number_of_pages"
                    type="number"
                    min="1"
                    max="20000"
                    placeholder="Например, 384"
                  />
                </div>

                <div class="bc-field">
                  <label for="book-rating">Рейтинг <small>0–10</small></label>
                  <input
                    id="book-rating"
                    v-model.number="form.rating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="Необязательно"
                  />
                </div>
              </div>

              <div class="bc-field">
                <label for="book-bio">Об авторе</label>
                <textarea
                  id="book-bio"
                  v-model="form.author_bio"
                  rows="3"
                  maxlength="255"
                  placeholder="Коротко об авторе книги"
                  :class="{ 'is-error': errors.author_bio }"
                ></textarea>
                <div class="bc-field__meta">
                  <span v-if="errors.author_bio" class="bc-field__error">{{ errors.author_bio }}</span>
                  <span v-else>До 255 символов</span>
                  <span>{{ form.author_bio.length }}/255</span>
                </div>
              </div>

              <div class="bc-field">
                <label>Категории <small>до 5</small></label>
                <div v-if="categoriesLoading" class="bc-categories-skeleton">
                  <span v-for="item in 6" :key="item"></span>
                </div>
                <div v-else class="bc-categories">
                  <button
                    v-for="category in categories"
                    :key="category.id"
                    type="button"
                    class="bc-category"
                    :class="{ 'is-selected': form.categories.includes(Number(category.id)) }"
                    @click="toggleCategory(category.id)"
                  >
                    <span class="icon-ok" aria-hidden="true"></span>
                    {{ category.name }}
                  </button>
                </div>
                <div v-if="errors.categories" class="bc-field__error">{{ errors.categories }}</div>
              </div>
            </section>

            <section class="bc-card">
              <header class="bc-card__head">
                <span class="bc-card__number">04</span>
                <div>
                  <span class="bc-kicker">СТАТУС</span>
                  <h2>Публикация</h2>
                </div>
              </header>

              <label class="bc-toggle">
                <input v-model="form.is_published" type="checkbox" />
                <span class="bc-toggle__track"><span></span></span>
                <span class="bc-toggle__copy">
                  <strong>Опубликовать сразу</strong>
                  <small>Книга появится в каталоге и станет доступна читателям.</small>
                </span>
              </label>

              <div class="bc-form__actions">
                <button type="button" class="bc-btn" :disabled="submitting" @click="goBack">Отмена</button>
                <button type="submit" class="bc-btn bc-btn--primary bc-btn--submit" :disabled="submitting">
                  <span v-if="submitting" class="bc-spinner" aria-hidden="true"></span>
                  <span v-else class="icon-ok" aria-hidden="true"></span>
                  {{ submitting ? 'Создаём…' : 'Создать книгу' }}
                </button>
              </div>
            </section>
          </div>

          <aside class="bc-aside">
            <section class="bc-publish">
              <span class="bc-kicker">ПУБЛИКАЦИЯ</span>
              <h3>Готовы добавить книгу?</h3>
              <p>Проверьте карточку — потом её можно будет отредактировать.</p>
              <button type="submit" class="bc-btn bc-btn--primary bc-btn--submit" :disabled="submitting">
                <span v-if="submitting" class="bc-spinner" aria-hidden="true"></span>
                <span v-else class="icon-ok" aria-hidden="true"></span>
                {{ submitting ? 'Создаём…' : 'Создать книгу' }}
              </button>
              <button type="button" class="bc-btn" :disabled="submitting" @click="goBack">Отмена</button>
              <small><span>*</span> обязательные поля</small>
            </section>

            <div class="bc-preview">
              <div class="bc-preview__head">
                <span>ПРЕДПРОСМОТР</span>
                <span class="icon-eye" aria-hidden="true"></span>
              </div>

              <div class="bc-preview__cover" :style="previewGradient">
                <img v-if="coverPreview" :src="coverPreview" :alt="form.title || 'Обложка'" />
                <template v-else>
                  <span class="bc-preview__initial">{{ initialOf(form.title) }}</span>
                  <span class="bc-preview__quote" aria-hidden="true">“</span>
                </template>
                <span v-if="selectedCategoryNames[0]" class="bc-preview__tag">{{ selectedCategoryNames[0] }}</span>
              </div>

              <div class="bc-preview__body">
                <h3>{{ form.title || 'Название книги' }}</h3>
                <p>{{ form.author || 'Автор' }}</p>
                <div class="bc-preview__meta">
                  <span><span class="icon-star" aria-hidden="true"></span> {{ form.rating || '—' }}</span>
                  <span><span class="icon-th-list" aria-hidden="true"></span> {{ form.number_of_pages || '—' }} стр.</span>
                </div>
                <div v-if="selectedCategoryNames.length" class="bc-preview__tags">
                  <span v-for="name in selectedCategoryNames" :key="name">#{{ name }}</span>
                </div>
              </div>
            </div>

            <div class="bc-tips">
              <span class="bc-kicker">СОВЕТ</span>
              <p>Хорошая обложка и честное описание важнее громких слов. Добавьте детали, которые помогут узнать книгу.</p>
            </div>

          </aside>
        </form>
      </div>
    </main>

    <footer-vue />
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapActions, mapGetters } from 'vuex';

const MAX_COVER_SIZE = 2 * 1024 * 1024;

const emptyForm = () => ({
  title: '',
  author: '',
  description: '',
  author_bio: '',
  language: 'ru',
  rating: null,
  number_of_pages: null,
  is_published: true,
  categories: [],
});

export default {
  name: 'BookCreatePage',
  data() {
    return {
      form: emptyForm(),
      categories: [],
      categoriesLoading: true,
      coverFile: null,
      coverPreview: '',
      dragActive: false,
      submitting: false,
      errors: {},
      success: false,
      createdBook: null,
      authReady: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    selectedCategoryNames() {
      return this.form.categories
        .map((id) => this.categories.find((category) => Number(category.id) === Number(id))?.name)
        .filter(Boolean);
    },
    previewGradient() {
      const index = Math.abs(this.form.title.length + this.form.categories.length) % 5;
      const gradients = [
        'linear-gradient(135deg, #20262b 0%, #3a3025 58%, #a97436 140%)',
        'linear-gradient(135deg, #1e2a28 0%, #2e3a31 55%, #8b7a4a 140%)',
        'linear-gradient(135deg, #2a2024 0%, #3b2b2b 55%, #b8793d 140%)',
        'linear-gradient(135deg, #242a35 0%, #1e242c 55%, #6f7d64 140%)',
        'linear-gradient(135deg, #302a20 0%, #1f2326 55%, #c18a42 140%)',
      ];
      return { background: gradients[index] };
    },
  },
  async mounted() {
    await Promise.all([
      this.loadCategories(),
      !this.user && Cookies.get('auth_token') ? this.fetchUser() : Promise.resolve(),
    ]);
    this.authReady = true;
  },
  beforeUnmount() {
    this.revokePreview();
  },
  methods: {
    ...mapActions('auth', ['fetchUser']),
    authHeaders() {
      return {
        Authorization: `Bearer ${Cookies.get('auth_token') ?? ''}`,
        Accept: 'application/json',
      };
    },
    async loadCategories() {
      this.categoriesLoading = true;

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/categories`, {
          headers: { Accept: 'application/json' },
        });
        this.categories = response.data?.categories ?? response.data ?? [];
      } catch (e) {
        this.categories = [];
      } finally {
        this.categoriesLoading = false;
      }
    },
    openFileDialog() {
      this.$refs.fileInput?.click();
    },
    onFileChange(event) {
      const file = event.target.files?.[0];
      if (file) this.setCover(file);
      event.target.value = '';
    },
    handleDrop(event) {
      this.dragActive = false;
      const file = event.dataTransfer?.files?.[0];
      if (file) this.setCover(file);
    },
    setCover(file) {
      if (!file.type.startsWith('image/')) {
        this.errors = { ...this.errors, cover_image: 'Выберите файл изображения.' };
        return;
      }

      if (file.size > MAX_COVER_SIZE) {
        this.errors = { ...this.errors, cover_image: 'Обложка должна быть не больше 2 МБ.' };
        return;
      }

      this.revokePreview();
      this.coverFile = file;
      this.coverPreview = URL.createObjectURL(file);
      this.errors = { ...this.errors, cover_image: null };
    },
    removeCover() {
      this.revokePreview();
      this.coverFile = null;
    },
    revokePreview() {
      if (this.coverPreview) {
        URL.revokeObjectURL(this.coverPreview);
        this.coverPreview = '';
      }
    },
    toggleCategory(id) {
      const value = Number(id);
      const index = this.form.categories.indexOf(value);

      if (index >= 0) {
        this.form.categories.splice(index, 1);
      } else if (this.form.categories.length < 5) {
        this.form.categories.push(value);
      }
    },
    validate() {
      const errors = {};

      if (this.form.title.trim().length < 5) {
        errors.title = 'Название должно быть не короче 5 символов.';
      }
      if (this.form.author.trim().length < 5) {
        errors.author = 'Имя автора должно быть не короче 5 символов.';
      }
      if (this.form.description.trim().length < 10) {
        errors.description = 'Описание должно быть не короче 10 символов.';
      }
      if (this.form.author_bio.length > 255) {
        errors.author_bio = 'Биография должна быть не длиннее 255 символов.';
      }
      if (this.form.rating !== null && this.form.rating !== '' && (Number(this.form.rating) < 0 || Number(this.form.rating) > 10)) {
        errors.rating = 'Рейтинг должен быть от 0 до 10.';
      }
      if (this.form.number_of_pages !== null && this.form.number_of_pages !== '' && Number(this.form.number_of_pages) < 1) {
        errors.number_of_pages = 'Количество страниц должно быть положительным.';
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async submitBook() {
      if (this.submitting || !this.validate()) return;

      this.submitting = true;
      this.errors = {};

      try {
        const formData = new FormData();
        formData.append('title', this.form.title.trim());
        formData.append('author', this.form.author.trim());
        formData.append('description', this.form.description.trim());
        formData.append('language', this.form.language || 'ru');

        if (this.form.author_bio.trim()) formData.append('author_bio', this.form.author_bio.trim());
        if (this.form.rating !== null && this.form.rating !== '') formData.append('rating', this.form.rating);
        if (this.form.number_of_pages !== null && this.form.number_of_pages !== '') {
          formData.append('number_of_pages', this.form.number_of_pages);
        }
        if (this.form.is_published) formData.append('is_published', '1');
        if (this.coverFile) formData.append('cover_image', this.coverFile);

        this.form.categories.forEach((categoryId, index) => {
          formData.append(`categories[${index}]`, categoryId);
        });

        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/v1/books`,
          formData,
          { headers: this.authHeaders() }
        );

        this.createdBook = response.data?.data || response.data;
        this.success = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        const serverErrors = error.response?.data?.errors;

        if (serverErrors) {
          this.errors = Object.fromEntries(
            Object.entries(serverErrors).map(([key, messages]) => [
              key,
              Array.isArray(messages) ? messages[0] : messages,
            ])
          );
        } else {
          this.errors = {
            _server: error.response?.data?.message || 'Не удалось создать книгу. Попробуйте ещё раз.',
          };
        }
      } finally {
        this.submitting = false;
      }
    },
    resetForm() {
      this.form = emptyForm();
      this.coverFile = null;
      this.revokePreview();
      this.errors = {};
      this.success = false;
      this.createdBook = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    goBack() {
      this.$router.push({ name: 'Books' });
    },
    initialOf(value) {
      return String(value || 'L').trim().slice(0, 1).toUpperCase();
    },
  },
};
</script>

<style scoped>
.bc-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background:
    radial-gradient(900px 380px at 90% -6%, rgba(231, 165, 74, 0.08), transparent 60%),
    var(--paper);
}

.bc-main {
  flex: 1;
  padding: var(--space-6) 0 var(--space-12);
}

.bc-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  margin-bottom: var(--space-5);
}

.bc-head__copy {
  min-width: 0;
}

.bc-back {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 5px;
  margin-bottom: var(--space-4);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  text-decoration: none;
}

.bc-back:hover {
  color: var(--ink);
}

.bc-back span {
  font-size: 8px;
}

.bc-kicker {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bc-kicker i {
  width: 20px;
  height: 1px;
  background: var(--accent);
}

.bc-head h1 {
  margin: var(--space-3) 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(34px, 4vw, 48px);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.02;
}

.bc-head p {
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
}

.bc-head__aside {
  max-width: 300px;
  padding-bottom: 4px;
}

.bc-head__note {
  color: var(--text-muted);
  font-family: var(--font-serif);
  font-size: 11px;
  font-style: italic;
  line-height: 1.6;
}

.bc-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  gap: var(--space-5);
}

.bc-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.bc-card {
  padding: var(--space-5);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.bc-card__head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--line);
}

.bc-card__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.14);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
}

.bc-card__head h2 {
  margin: 2px 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.bc-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: var(--space-4);
}

.bc-field:last-child {
  margin-bottom: 0;
}

.bc-field > label {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 600;
}

.bc-field > label span {
  color: var(--danger);
}

.bc-field > label small {
  color: var(--text-muted);
  font-size: 9px;
  font-weight: 400;
}

.bc-field input,
.bc-field textarea,
.bc-field select {
  width: 100%;
  padding: 10px 12px;
  color: var(--ink);
  background: #f7f5ef;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  outline: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.5;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.bc-field input {
  height: 42px;
}

.bc-field textarea {
  resize: vertical;
  min-height: 90px;
}

.bc-field input:focus,
.bc-field textarea:focus,
.bc-field select:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.14);
}

.bc-field input.is-error,
.bc-field textarea.is-error {
  border-color: var(--danger);
  background: rgba(145, 32, 22, 0.03);
}

.bc-field__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
}

.bc-field__error {
  color: var(--danger);
}

.bc-field__error--standalone {
  margin-top: var(--space-2);
  font-family: var(--font-sans);
  font-size: 10px;
}

.bc-select-wrap {
  position: relative;
  display: block;
}

.bc-select-wrap select {
  padding-right: 34px;
  appearance: none;
  -webkit-appearance: none;
}

.bc-select-wrap .icon-down-open {
  position: absolute;
  top: 50%;
  right: 12px;
  color: var(--text-muted);
  font-size: 8px;
  transform: translateY(-50%);
  pointer-events: none;
}

.bc-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
}

.bc-grid .bc-field {
  margin-bottom: 0;
}

/* Cover */
.bc-dropzone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 190px;
  overflow: hidden;
  background:
    radial-gradient(280px 180px at 80% 0%, rgba(231, 165, 74, 0.1), transparent 70%),
    #faf8f3;
  border: 1.5px dashed var(--line-strong);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.bc-dropzone:hover,
.bc-dropzone.is-dragging {
  border-color: var(--accent);
  background-color: rgba(231, 165, 74, 0.04);
}

.bc-dropzone.has-file {
  min-height: 260px;
  border-style: solid;
  border-color: var(--line);
  background: #f4f1ea;
}

.bc-dropzone__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.bc-dropzone__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-5);
  text-align: center;
}

.bc-dropzone__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--space-2);
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.13);
  border-radius: 50%;
  font-size: var(--text-lg);
}

.bc-dropzone__empty strong {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
}

.bc-dropzone__empty span:not(.bc-dropzone__icon) {
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 10px;
}

.bc-dropzone__empty small {
  margin-top: 3px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
}

.bc-dropzone__preview {
  position: relative;
  width: 100%;
  height: 260px;
}

.bc-dropzone__preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.bc-dropzone__overlay {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  color: #fff;
  background: rgba(15, 17, 18, 0.55);
  font-family: var(--font-sans);
  font-size: 10px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.bc-dropzone__preview:hover .bc-dropzone__overlay {
  opacity: 1;
}

.bc-remove-file {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: var(--space-2);
  padding: 0;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  font-family: var(--font-sans);
  font-size: 9.5px;
  cursor: pointer;
}

.bc-remove-file:hover {
  color: var(--danger);
}

/* Categories */
.bc-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bc-category {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  color: var(--text-secondary);
  background: #f7f5ef;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 10px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.bc-category span {
  display: none;
  font-size: 8px;
}

.bc-category:hover {
  color: var(--ink);
  border-color: var(--line);
}

.bc-category.is-selected {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.bc-category.is-selected span {
  display: inline-flex;
}

.bc-categories-skeleton {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bc-categories-skeleton span {
  width: 80px;
  height: 28px;
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  border-radius: 999px;
  animation: bc-shimmer 1.2s linear infinite;
}

@keyframes bc-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Toggle */
.bc-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: #faf8f3;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  cursor: pointer;
}

.bc-toggle input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.bc-toggle__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 38px;
  height: 22px;
  flex-shrink: 0;
  padding: 2px;
  background: var(--line-strong);
  border-radius: 999px;
  transition: background-color var(--transition-fast);
}

.bc-toggle__track span {
  display: block;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(25, 27, 28, 0.2);
  transition: transform var(--transition-fast);
}

.bc-toggle input:checked + .bc-toggle__track {
  background: var(--accent);
}

.bc-toggle input:checked + .bc-toggle__track span {
  transform: translateX(16px);
}

.bc-toggle__copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.bc-toggle__copy strong {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 600;
}

.bc-toggle__copy small {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
}

.bc-form__actions {
  display: none;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.bc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  padding: 0 var(--space-4);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast);
}

.bc-btn:hover {
  color: var(--ink);
  border-color: var(--ink);
  background: #fff;
}

.bc-btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 600;
}

.bc-btn--primary:hover {
  color: var(--text-on-accent);
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.bc-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.bc-btn--submit {
  min-width: 160px;
}

.bc-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(25, 27, 28, 0.2);
  border-top-color: var(--text-on-accent);
  border-radius: 50%;
  animation: bc-spin 0.7s linear infinite;
}

@keyframes bc-spin {
  to { transform: rotate(360deg); }
}

.bc-server-error {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3);
  color: var(--danger);
  background: rgba(145, 32, 22, 0.06);
  border: 1px solid rgba(145, 32, 22, 0.18);
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
  font-size: 10.5px;
}

/* Aside */
.bc-aside {
  position: sticky;
  top: calc(var(--header-height) + var(--space-5));
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}

.bc-preview {
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.bc-preview__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4) 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bc-preview__head span:last-child {
  font-size: 10px;
}

.bc-preview__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4.1;
  margin: var(--space-3) var(--space-4) 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.13);
  border-radius: var(--radius-md);
  box-shadow: 0 12px 24px rgba(25, 27, 28, 0.18);
}

.bc-preview__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bc-preview__initial {
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
}

.bc-preview__quote {
  position: absolute;
  right: 10px;
  bottom: 8px;
  color: rgba(231, 165, 74, 0.7);
  font-family: var(--font-serif);
  font-size: 34px;
  line-height: 0.7;
}

.bc-preview__tag {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
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

.bc-preview__body {
  padding: var(--space-3) var(--space-4) var(--space-4);
}

.bc-preview__body h3 {
  display: -webkit-box;
  margin: 0 0 2px;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bc-preview__body p {
  margin: 0 0 var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.bc-preview__meta {
  display: flex;
  gap: var(--space-3);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
}

.bc-preview__meta span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.bc-preview__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: var(--space-2);
}

.bc-preview__tags span {
  padding: 2px 6px;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.1);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8px;
}

.bc-publish {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.bc-publish h3 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.bc-publish p {
  margin: 0 0 var(--space-1);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
  line-height: 1.5;
}

.bc-publish .bc-btn--submit {
  width: 100%;
}

.bc-publish .bc-btn:not(.bc-btn--primary) {
  width: 100%;
  height: 36px;
}

.bc-publish > small {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  text-align: center;
}

.bc-publish > small span {
  color: var(--danger);
}

.bc-tips {
  padding: var(--space-4);
  background:
    radial-gradient(200px 120px at 100% 0%, rgba(231, 165, 74, 0.12), transparent 70%),
    #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
}

.bc-tips p {
  margin: var(--space-2) 0 0;
  color: var(--text-secondary);
  font-family: var(--font-serif);
  font-size: 11px;
  font-style: italic;
  line-height: 1.6;
}

/* Success/Auth */
.bc-success,
.bc-auth {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-8);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.bc-success__icon,
.bc-auth__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  margin-bottom: var(--space-3);
  color: #2f7247;
  background: #eaf4ee;
  border-radius: 50%;
  font-size: var(--text-xl);
}

.bc-auth__icon {
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.13);
}

.bc-auth--loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  min-height: 220px;
  justify-content: center;
}

.bc-auth--loading p {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
}

.bc-spinner--dark {
  width: 22px;
  height: 22px;
  border-color: var(--line);
  border-top-color: var(--accent);
}

.bc-success h2,
.bc-auth h2 {
  margin: var(--space-2) 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
}

.bc-success p,
.bc-auth p {
  max-width: 420px;
  margin: 0 auto var(--space-5);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.bc-success__actions,
.bc-auth__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

@media (max-width: 1024px) {
  .bc-layout {
    grid-template-columns: 1fr;
  }

  .bc-aside {
    position: static;
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    align-items: start;
    order: -1;
  }

  .bc-publish {
    grid-column: 1 / -1;
  }

  .bc-preview {
    max-width: 220px;
  }

  .bc-head__aside {
    display: none;
  }
}

@media (max-width: 700px) {
  .bc-main {
    padding-top: var(--space-4);
  }

  .bc-head h1 {
    font-size: clamp(30px, 9vw, 38px);
  }

  .bc-aside {
    display: none;
  }

  .bc-card {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
  }

  .bc-grid {
    grid-template-columns: 1fr 1fr;
  }

  .bc-form__actions {
    display: flex;
    position: sticky;
    bottom: 0;
    z-index: 4;
    margin: var(--space-4) calc(var(--space-4) * -1) calc(var(--space-4) * -1);
    padding: var(--space-3) var(--space-4) max(var(--space-3), env(safe-area-inset-bottom));
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-top: 1px solid var(--line);
  }

  .bc-form__actions .bc-btn {
    flex: 1;
  }
}

@media (max-width: 420px) {
  .bc-grid {
    grid-template-columns: 1fr;
  }

  .bc-field__meta {
    font-size: 8.5px;
  }
}
</style>
