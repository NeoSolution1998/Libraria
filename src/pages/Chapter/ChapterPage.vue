<template>
  <div class="cr-reader" :data-theme="theme">
    <!-- ================= Loading ================= -->
    <div v-if="(loading || !chapter?.id) && !error" class="cr-state">
      <div class="cr-state__card">
        <span class="cr-state__mark">L</span>
        <h1 class="cr-state__title">Открываем главу</h1>
        <p class="cr-state__text">Подготавливаем текст и содержание книги…</p>
        <span class="cr-spinner" aria-hidden="true"></span>
      </div>
    </div>

    <!-- ================= Error ================= -->
    <div v-else-if="error" class="cr-state">
      <div class="cr-state__card">
        <span class="cr-state__mark cr-state__mark--error">!</span>
        <span class="cr-state__kicker">ЧИТАЛКА</span>
        <h1 class="cr-state__title">{{ errorTitle }}</h1>
        <p class="cr-state__text">{{ errorText }}</p>
        <div class="cr-state__actions">
          <router-link
            v-if="error === 'auth'"
            :to="{ name: 'Login', query: { redirect: $route.fullPath } }"
            class="cr-state__btn"
          >
            Войти в библиотеку
          </router-link>
          <button v-else type="button" class="cr-state__btn" @click="loadChapter">
            Повторить
          </button>
          <router-link :to="bookLink" class="cr-state__btn cr-state__btn--ghost">
            К книге
          </router-link>
        </div>
      </div>
    </div>

    <!-- ================= Reader ================= -->
    <template v-else-if="chapter?.id">
      <header class="cr-bar" :class="{ 'is-scrolled': scrolled }">
        <div class="cr-bar__inner">
          <div class="cr-bar__left">
            <router-link :to="bookLink" class="cr-bar__back" aria-label="Вернуться к книге">
              <span class="icon-left-open" aria-hidden="true"></span>
            </router-link>

            <div class="cr-bar__book">
              <img :src="coverImage" :alt="bookTitle" class="cr-bar__cover" />
              <div class="cr-bar__titles">
                <span class="cr-bar__book-title">{{ bookTitle }}</span>
                <span class="cr-bar__chapter">{{ chapterLabel }} · {{ chapter.title }}</span>
              </div>
            </div>
          </div>

          <div class="cr-bar__actions">
            <button
              type="button"
              class="cr-bar__btn cr-bar__btn--toc"
              aria-label="Открыть содержание"
              title="Содержание"
              @click="openToc"
            >
              <span class="icon-th-list" aria-hidden="true"></span>
            </button>
            <button
              type="button"
              class="cr-bar__btn cr-bar__btn--aa"
              aria-label="Настройки чтения"
              title="Настройки чтения"
              @click="openPanel(true)"
            >
              Aa
            </button>
            <user-avatar :user="user" class="cr-bar__avatar" />
          </div>
        </div>

        <div class="cr-bar__progress" aria-hidden="true">
          <span :style="{ width: scrollPercent + '%' }"></span>
        </div>
      </header>

      <main class="cr-main" @click="handleReaderClick">
        <article
          ref="article"
          class="cr-article"
          :style="articleStyle"
        >
          <header class="cr-chapter-head">
            <div class="cr-chapter-head__ornament" aria-hidden="true"><span></span><i>✦</i><span></span></div>
            <p class="cr-chapter-head__eyebrow">{{ bookTitle }} · {{ chapterLabel }}</p>
            <h1 class="cr-chapter-head__title">{{ chapter.title }}</h1>
            <div class="cr-chapter-head__meta">
              <span>{{ readingTime }} мин чтения</span>
              <i aria-hidden="true"></i>
              <span>{{ progress }}% книги</span>
              <template v-if="book.author">
                <i aria-hidden="true"></i>
                <span>{{ book.author }}</span>
              </template>
            </div>
          </header>

          <div class="cr-copy">
            <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
          </div>

          <div class="cr-end" aria-hidden="true"><span>Конец главы</span></div>

          <nav class="cr-chapter-nav" aria-label="Навигация по главам">
            <button
              type="button"
              class="cr-nav-btn cr-nav-btn--prev"
              :disabled="!canGoToPreviousChapter"
              @click="goToPreviousChapter"
            >
              <span class="cr-nav-btn__hint">
                <span class="icon-left-open" aria-hidden="true"></span> Предыдущая
              </span>
              <strong class="cr-nav-btn__title">{{ prevChapterTitle }}</strong>
            </button>

            <button
              type="button"
              class="cr-nav-btn cr-nav-btn--toc"
              aria-label="Открыть список глав"
              @click="openToc"
            >
              <span class="cr-bars" aria-hidden="true"><i></i><i></i><i></i></span>
              <span class="cr-nav-btn__toc-label">Все главы</span>
            </button>

            <button
              type="button"
              class="cr-nav-btn cr-nav-btn--next"
              :disabled="!canGoToNextChapter"
              @click="goToNextChapter"
            >
              <span class="cr-nav-btn__hint">
                Следующая <span class="icon-right-open" aria-hidden="true"></span>
              </span>
              <strong class="cr-nav-btn__title">{{ nextChapterTitle }}</strong>
            </button>
          </nav>
        </article>

        <section class="cr-comments">
          <comments-vue
            commentable-type="App\Models\Chapter"
            :commentable-id="chapter.id"
            @login-required="handleLoginRequired"
          />
        </section>

        <footer class="cr-footer">
          <router-link :to="bookLink" class="cr-footer__link">
            <span class="icon-left-open" aria-hidden="true"></span>
            Все главы книги «{{ bookTitle }}»
          </router-link>
          <span class="cr-footer__brand">Libraria<span>.</span></span>
        </footer>
      </main>

      <!-- ================= Bottom reading panel ================= -->
      <transition name="cr-fade">
        <div v-if="showPanel" class="cr-overlay" @click.self="closePanel">
          <section
            ref="sheet"
            class="cr-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Панель чтения"
            tabindex="-1"
          >
            <span class="cr-sheet__grabber" aria-hidden="true"></span>

            <div class="cr-sheet__body">
              <div class="cr-sheet__head">
                <img :src="coverImage" :alt="bookTitle" class="cr-sheet__cover" />
                <div class="cr-sheet__info">
                  <span class="cr-sheet__kicker">{{ chapterLabel }} из {{ totalChapters || '—' }}</span>
                  <strong class="cr-sheet__title">{{ chapter.title }}</strong>
                  <span class="cr-sheet__book">{{ bookTitle }}</span>
                </div>
                <button type="button" class="cr-sheet__close" aria-label="Закрыть панель" @click="closePanel">
                  <span class="icon-cancel" aria-hidden="true"></span>
                </button>
              </div>

              <div class="cr-progress">
                <div class="cr-progress__top">
                  <span>Прогресс книги</span>
                  <b>{{ progress }}%</b>
                </div>
                <input
                  v-model.number="currentChapterIndex"
                  class="cr-range"
                  type="range"
                  min="0"
                  :max="Math.max(totalChapters - 1, 0)"
                  step="1"
                  :disabled="totalChapters < 2"
                  :style="{ '--cr-range-fill': sliderFill + '%' }"
                  aria-label="Перейти к главе"
                  @change="onProgressChange"
                />
                <div class="cr-progress__bottom">
                  <span>{{ currentChapterIndex + 1 }} / {{ totalChapters || 1 }}</span>
                  <span>{{ currentChapterTitle }}</span>
                </div>
              </div>

              <div class="cr-actions">
                <button type="button" class="cr-action" @click="openToc">
                  <span class="cr-action__icon">
                    <span class="cr-bars" aria-hidden="true"><i></i><i></i><i></i></span>
                  </span>
                  <span class="cr-action__label">Главы</span>
                </button>

                <button
                  type="button"
                  class="cr-action"
                  :class="{ 'is-active': showSettings }"
                  @click="showSettings = !showSettings"
                >
                  <span class="cr-action__icon cr-action__icon--aa">Aa</span>
                  <span class="cr-action__label">Настройки</span>
                </button>

                <button type="button" class="cr-action" @click="cycleTheme">
                  <span class="cr-action__icon"><span class="icon-adjust" aria-hidden="true"></span></span>
                  <span class="cr-action__label">{{ themeLabel }}</span>
                </button>
              </div>

              <transition name="cr-expand">
                <div v-if="showSettings" class="cr-settings">
                  <div class="cr-setting">
                    <span class="cr-setting__label">Размер текста</span>
                    <div class="cr-stepper">
                      <button
                        type="button"
                        aria-label="Уменьшить текст"
                        :disabled="textSize <= 15"
                        @click="changeFontSize(-1)"
                      >−</button>
                      <span>{{ textSize }} px</span>
                      <button
                        type="button"
                        aria-label="Увеличить текст"
                        :disabled="textSize >= 28"
                        @click="changeFontSize(1)"
                      >+</button>
                    </div>
                  </div>

                  <div class="cr-setting">
                    <span class="cr-setting__label">Интервал</span>
                    <div class="cr-segmented">
                      <button
                        v-for="option in lineHeights"
                        :key="option.value"
                        type="button"
                        :class="{ 'is-active': lineHeight === option.value }"
                        @click="lineHeight = option.value"
                      >{{ option.label }}</button>
                    </div>
                  </div>

                  <div class="cr-setting">
                    <span class="cr-setting__label">Шрифт</span>
                    <div class="cr-segmented">
                      <button
                        v-for="font in fonts"
                        :key="font.label"
                        type="button"
                        :style="{ fontFamily: font.value }"
                        :class="{ 'is-active': fontFamily === font.value }"
                        @click="fontFamily = font.value"
                      >{{ font.label }}</button>
                    </div>
                  </div>

                  <div class="cr-setting cr-setting--themes">
                    <span class="cr-setting__label">Тема</span>
                    <div class="cr-themes">
                      <button
                        v-for="item in themes"
                        :key="item.id"
                        type="button"
                        class="cr-theme"
                        :class="{ 'is-active': theme === item.id }"
                        @click="theme = item.id"
                      >
                        <i :style="{ background: item.swatch }" aria-hidden="true"></i>
                        {{ item.label }}
                      </button>
                    </div>
                  </div>

                  <button type="button" class="cr-reset" @click="resetSettings">
                    Сбросить настройки
                  </button>
                </div>
              </transition>
            </div>
          </section>
        </div>
      </transition>

      <!-- ================= Chapter list drawer ================= -->
      <transition name="cr-fade">
        <div v-if="showToc" class="cr-drawer-overlay" @click.self="closeToc">
          <aside
            ref="drawer"
            class="cr-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Содержание книги"
            tabindex="-1"
          >
            <header class="cr-drawer__head">
              <div class="cr-drawer__book">
                <img :src="coverImage" :alt="bookTitle" class="cr-drawer__cover" />
                <div class="cr-drawer__info">
                  <span class="cr-drawer__kicker">Содержание</span>
                  <strong class="cr-drawer__title">{{ bookTitle }}</strong>
                  <span class="cr-drawer__author">{{ book.author || 'Автор не указан' }}</span>
                </div>
                <button type="button" class="cr-drawer__close" aria-label="Закрыть содержание" @click="closeToc">
                  <span class="icon-cancel" aria-hidden="true"></span>
                </button>
              </div>

              <div class="cr-drawer__meta">
                <span>Глава {{ chapterNumberValue }} из {{ totalChapters || '—' }}</span>
                <b>{{ progress }}%</b>
              </div>
              <div class="cr-drawer__progress" aria-hidden="true">
                <span :style="{ width: progress + '%' }"></span>
              </div>
            </header>

            <div ref="tocList" class="cr-drawer__list">
              <button
                v-for="(item, index) in allChapters"
                :key="item.id"
                type="button"
                class="cr-drawer__item"
                :class="{
                  'is-current': item.id === chapter.id,
                  'is-read': item.id !== chapter.id && index < currentIndex
                }"
                @click="selectChapter(item.id)"
              >
                <span class="cr-drawer__num">{{ chapterNumber(index) }}</span>
                <span class="cr-drawer__name">{{ item.title || 'Без названия' }}</span>
                <span v-if="item.id === chapter.id" class="cr-drawer__state">читаю</span>
                <span v-else-if="index < currentIndex" class="cr-drawer__state cr-drawer__state--read">
                  <span class="icon-ok" aria-hidden="true"></span>
                </span>
              </button>

              <p v-if="!allChapters.length" class="cr-drawer__empty">
                Список глав пока пуст.
              </p>
            </div>

            <footer class="cr-drawer__footer">
              <router-link :to="bookLink" class="cr-drawer__book-link">
                <span class="icon-left-open" aria-hidden="true"></span>
                Страница книги
              </router-link>
            </footer>
          </aside>
        </div>
      </transition>

      <!-- First-visit hint -->
      <transition name="cr-fade">
        <div v-if="showHint" class="cr-hint" @click="showHint = false">
          <span class="cr-hint__bars" aria-hidden="true"><span class="cr-bars"><i></i><i></i><i></i></span></span>
          Нажмите для меню чтения
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UserAvatar from '@/components/Header/User/UserAvatar.vue';

const FALLBACK_COVERS = [
  '/images/books/books_default1.jpg',
  '/images/books/books_default3.jpg',
  '/images/books/books_default4.jpg',
  '/images/books/books_default5.jpg',
  '/images/books/books_default6.jpg',
  '/images/books/books_default7.jpg',
];

const DEFAULT_SETTINGS = {
  textSize: 19,
  fontFamily: "Georgia, 'Times New Roman', serif",
  lineHeight: 1.85,
  theme: 'paper',
};

const THEME_ORDER = ['paper', 'sepia', 'night'];

export default {
  name: 'ChapterPage',
  components: {
    UserAvatar,
  },
  data() {
    const storedTheme = localStorage.getItem('libraria-theme');
    const storedFont = localStorage.getItem('libraria-font-family');
    const storedSize = Number(localStorage.getItem('libraria-text-size'));
    const storedLineHeight = Number(localStorage.getItem('libraria-line-height'));

    return {
      showPanel: false,
      showSettings: false,
      showToc: false,
      showHint: false,
      scrolled: false,
      scrollPercent: 0,
      currentChapterIndex: 0,
      textSize: storedSize >= 15 && storedSize <= 28 ? storedSize : DEFAULT_SETTINGS.textSize,
      fontFamily: storedFont || DEFAULT_SETTINGS.fontFamily,
      lineHeight: storedLineHeight >= 1.4 && storedLineHeight <= 2.4
        ? storedLineHeight
        : DEFAULT_SETTINGS.lineHeight,
      theme: THEME_ORDER.includes(storedTheme) ? storedTheme : DEFAULT_SETTINGS.theme,
      hintTimer: null,
      fonts: [
        { label: 'Serif', value: "Georgia, 'Times New Roman', serif" },
        { label: 'Sans', value: "'Ubuntu', -apple-system, sans-serif" },
        { label: 'Display', value: "'Rubik', sans-serif" },
      ],
      lineHeights: [
        { label: 'Плотный', value: 1.65 },
        { label: 'Обычный', value: 1.85 },
        { label: 'Свободный', value: 2.05 },
      ],
      themes: [
        { id: 'paper', label: 'Бумага', swatch: '#f7f3ea' },
        { id: 'sepia', label: 'Сепия', swatch: '#f1e6d2' },
        { id: 'night', label: 'Ночь', swatch: '#1d2226' },
      ],
    };
  },
  computed: {
    ...mapState('chapters', {
      chapter: state => state.chapter,
      allChapters: state => state.allChapter || [],
      loading: state => state.loading,
      error: state => state.error,
    }),
    ...mapState('book', {
      book: state => state.book || {},
    }),
    ...mapState('auth', ['user']),

    bookTitle() {
      return this.book?.title || 'Книга';
    },
    bookLink() {
      return { name: 'Book', params: { id: this.$route.params.bookId } };
    },
    coverImage() {
      if (this.book?.cover_image) return this.book.cover_image;
      const index = Math.abs(Number(this.$route.params.bookId) || 0) % FALLBACK_COVERS.length;
      return FALLBACK_COVERS[index];
    },
    paragraphs() {
      return String(this.chapter?.content || '')
        .split(/\n+/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean);
    },
    currentIndex() {
      return this.allChapters.findIndex(item => item.id === this.chapter?.id);
    },
    chapterNumberValue() {
      if (this.currentIndex >= 0) return this.currentIndex + 1;
      return 1;
    },
    chapterLabel() {
      return `Глава ${this.chapterNumberValue}`;
    },
    totalChapters() {
      return this.allChapters.length;
    },
    progress() {
      if (!this.totalChapters || this.currentIndex < 0) return 0;
      return Math.round(((this.currentIndex + 1) / this.totalChapters) * 100);
    },
    sliderFill() {
      if (this.totalChapters < 2) return 100;
      return Math.max(0, Math.min(100, (this.currentChapterIndex / (this.totalChapters - 1)) * 100));
    },
    readingTime() {
      const words = this.paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 180));
    },
    canGoToPreviousChapter() {
      return this.currentIndex > 0;
    },
    canGoToNextChapter() {
      return this.currentIndex >= 0 && this.currentIndex < this.totalChapters - 1;
    },
    prevChapterTitle() {
      return this.canGoToPreviousChapter
        ? (this.allChapters[this.currentIndex - 1]?.title || 'Предыдущая глава')
        : 'Вы в начале книги';
    },
    nextChapterTitle() {
      return this.canGoToNextChapter
        ? (this.allChapters[this.currentIndex + 1]?.title || 'Следующая глава')
        : 'Вы в конце книги';
    },
    currentChapterTitle() {
      return this.allChapters[this.currentChapterIndex]?.title || '—';
    },
    articleStyle() {
      return {
        fontSize: `${this.textSize}px`,
        lineHeight: this.lineHeight,
        fontFamily: this.fontFamily,
      };
    },
    themeLabel() {
      return this.themes.find(item => item.id === this.theme)?.label || 'Тема';
    },
    isOverlayOpen() {
      return this.showPanel || this.showToc;
    },
    errorTitle() {
      if (this.error === 'auth') return 'Войдите, чтобы читать';
      if (this.error === 'notfound') return 'Глава не найдена';
      return 'Не удалось загрузить главу';
    },
    errorText() {
      if (this.error === 'auth') {
        return 'Главы доступны авторизованным читателям. Войдите, и мы вернём вас на эту страницу.';
      }
      if (this.error === 'notfound') {
        return 'Возможно, глава была удалена или ссылка устарела.';
      }
      return 'Проверьте подключение к интернету и попробуйте ещё раз.';
    },
  },
  watch: {
    textSize(value) {
      localStorage.setItem('libraria-text-size', value);
    },
    theme(value) {
      localStorage.setItem('libraria-theme', value);
    },
    fontFamily(value) {
      localStorage.setItem('libraria-font-family', value);
    },
    lineHeight(value) {
      localStorage.setItem('libraria-line-height', value);
    },
    currentIndex(value) {
      if (value >= 0) this.currentChapterIndex = value;
    },
    isOverlayOpen(value) {
      document.body.style.overflow = value ? 'hidden' : '';
    },
    async '$route.params.chapterId'(newId, oldId) {
      if (!newId || newId === oldId) return;

      this.showPanel = false;
      this.showToc = false;
      this.showSettings = false;
      window.scrollTo({ top: 0, behavior: 'auto' });

      const { bookId } = this.$route.params;
      try {
        await this.fetchChapter({ bookId, chapterId: newId });
      } catch (e) {
        // Состояние ошибки уже сохранено в store.
      }
      this.currentChapterIndex = Math.max(this.currentIndex, 0);
      this.$nextTick(this.updateScrollProgress);
    },
    async '$route.params.bookId'(newId, oldId) {
      if (!newId || newId === oldId) return;
      this.currentChapterIndex = 0;
      this.fetchAllChapters(newId).catch(() => {});
      this.getBook(newId);
    },
  },
  async mounted() {
    document.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleScroll);

    await this.bootstrap();

    if (!localStorage.getItem('libraria-reader-hint-seen')) {
      this.showHint = true;
      this.hintTimer = window.setTimeout(() => {
        this.showHint = false;
        localStorage.setItem('libraria-reader-hint-seen', 'true');
      }, 5200);
    }
  },
  beforeUnmount() {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
    if (this.hintTimer) window.clearTimeout(this.hintTimer);
  },
  methods: {
    ...mapActions('chapters', {
      fetchChapter: 'fetchChapter',
      fetchAllChapters: 'fetchAllChapters',
    }),
    ...mapActions('book', {
      getBook: 'getBook',
    }),
    ...mapActions('auth', {
      fetchUser: 'fetchUser',
    }),

    async bootstrap() {
      const { bookId, chapterId } = this.$route.params;

      await Promise.allSettled([
        this.fetchUser(),
        this.fetchAllChapters(bookId),
        this.getBook(bookId),
        this.fetchChapter({ bookId, chapterId }),
      ]);

      this.currentChapterIndex = Math.max(this.currentIndex, 0);
      this.rememberChapterPosition();
      this.$nextTick(this.updateScrollProgress);
    },

    async loadChapter() {
      const { bookId, chapterId } = this.$route.params;
      try {
        await this.fetchChapter({ bookId, chapterId });
        this.currentChapterIndex = Math.max(this.currentIndex, 0);
        this.rememberChapterPosition();
      } catch (e) {
        // Ошибка отображена в шаблоне.
      }
    },

    rememberChapterPosition() {
      const { bookId } = this.$route.params;
      const chapterId = this.chapter?.id;

      if (!bookId || !chapterId) return;

      try {
        localStorage.setItem(`libraria:last-chapter:${bookId}`, String(chapterId));
      } catch (e) {
        // Приватный режим браузера может запрещать localStorage.
      }
    },

    chapterNumber(index) {
      return String(index + 1).padStart(2, '0');
    },

    handleReaderClick(event) {
      this.hideHint();

      if (this.showPanel || this.showToc) return;
      if (event.target.closest('.cr-comments, .cr-footer, a, button, input, textarea, select, label')) return;

      const selection = window.getSelection ? String(window.getSelection()).trim() : '';
      if (selection) return;

      this.openPanel();
    },

    hideHint() {
      if (!this.showHint) return;
      this.showHint = false;
      localStorage.setItem('libraria-reader-hint-seen', 'true');
      if (this.hintTimer) window.clearTimeout(this.hintTimer);
    },

    openPanel(settings = false) {
      this.hideHint();
      this.showToc = false;
      this.showPanel = true;
      this.showSettings = Boolean(settings);

      this.$nextTick(() => {
        this.$refs.sheet?.focus?.({ preventScroll: true });
      });
    },

    closePanel() {
      this.showPanel = false;
      this.showSettings = false;
    },

    openToc() {
      this.hideHint();
      this.showPanel = false;
      this.showSettings = false;
      this.showToc = true;

      this.$nextTick(() => {
        this.scrollCurrentChapterIntoView();
        this.$refs.drawer?.focus?.({ preventScroll: true });
      });
    },

    closeToc() {
      this.showToc = false;
    },

    scrollCurrentChapterIntoView() {
      const list = this.$refs.tocList;
      if (!list) return;
      const current = list.querySelector('.cr-drawer__item.is-current');
      if (!current) return;

      const listRect = list.getBoundingClientRect();
      const currentRect = current.getBoundingClientRect();
      list.scrollTop += currentRect.top - listRect.top - list.clientHeight / 2 + currentRect.height / 2;
    },

    async selectChapter(chapterId) {
      if (!chapterId) return;

      this.showPanel = false;
      this.showSettings = false;
      this.showToc = false;

      if (Number(chapterId) === Number(this.chapter?.id)) return;

      await this.$router.push({
        name: 'Chapter',
        params: { bookId: this.$route.params.bookId, chapterId },
      });

      window.scrollTo({ top: 0, behavior: 'auto' });
    },

    onProgressChange() {
      const target = this.allChapters[this.currentChapterIndex];
      if (target && Number(target.id) !== Number(this.chapter?.id)) {
        this.selectChapter(target.id);
      }
    },

    goToPreviousChapter() {
      if (this.canGoToPreviousChapter) {
        this.selectChapter(this.allChapters[this.currentIndex - 1].id);
      }
    },

    goToNextChapter() {
      if (this.canGoToNextChapter) {
        this.selectChapter(this.allChapters[this.currentIndex + 1].id);
      }
    },

    changeFontSize(delta) {
      const next = this.textSize + delta;
      this.textSize = Math.max(15, Math.min(28, next));
    },

    cycleTheme() {
      const nextIndex = (THEME_ORDER.indexOf(this.theme) + 1) % THEME_ORDER.length;
      this.theme = THEME_ORDER[nextIndex];
    },

    resetSettings() {
      this.textSize = DEFAULT_SETTINGS.textSize;
      this.fontFamily = DEFAULT_SETTINGS.fontFamily;
      this.lineHeight = DEFAULT_SETTINGS.lineHeight;
      this.theme = DEFAULT_SETTINGS.theme;

      localStorage.removeItem('libraria-text-size');
      localStorage.removeItem('libraria-font-family');
      localStorage.removeItem('libraria-line-height');
      localStorage.removeItem('libraria-theme');
    },

    handleLoginRequired() {
      this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
    },

    handleScroll() {
      this.scrolled = window.scrollY > 8;

      const article = this.$refs.article;
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;

      if (rect.height <= window.innerHeight) {
        this.scrollPercent = 100;
        return;
      }

      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const ratio = (window.scrollY - articleTop) / scrollable;
      this.scrollPercent = Math.max(0, Math.min(100, Math.round(ratio * 100)));
    },

    updateScrollProgress() {
      this.handleScroll();
    },

    handleKeydown(event) {
      const tag = (event.target?.tagName || '').toLowerCase();
      const isTyping = ['input', 'textarea', 'select'].includes(tag) || event.target?.isContentEditable;

      if (event.key === 'Escape') {
        if (this.showToc) {
          this.closeToc();
        } else if (this.showPanel) {
          this.closePanel();
        }
        return;
      }

      if (isTyping || this.showPanel || this.showToc) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.goToPreviousChapter();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.goToNextChapter();
      }
    },
  },
};
</script>

<style scoped>
/* ============================================================
   Theme tokens
   ============================================================ */
.cr-reader {
  --cr-bg: #f7f3ea;
  --cr-bg-soft: #efe9dc;
  --cr-surface: #fbf8f2;
  --cr-surface-2: #fffdf8;
  --cr-text: #26282a;
  --cr-title: #15181a;
  --cr-muted: #7d776d;
  --cr-border: rgba(31, 34, 36, 0.12);
  --cr-border-strong: rgba(31, 34, 36, 0.22);
  --cr-accent: #c68935;
  --cr-accent-soft: rgba(198, 137, 53, 0.12);
  --cr-shadow: 0 16px 40px rgba(32, 27, 18, 0.12);
  --cr-sheet-shadow: 0 -28px 80px rgba(20, 16, 10, 0.28);

  min-height: 100vh;
  color: var(--cr-text);
  background:
    radial-gradient(1100px 560px at 88% -8%, rgba(231, 165, 74, 0.09), transparent 62%),
    radial-gradient(900px 500px at -10% 30%, rgba(231, 165, 74, 0.05), transparent 55%),
    var(--cr-bg);
  font-family: var(--font-sans);
  color-scheme: light;
  transition: background-color var(--transition-base), color var(--transition-base);
}

.cr-reader[data-theme="sepia"] {
  --cr-bg: #f1e6d2;
  --cr-bg-soft: #e9dcc4;
  --cr-surface: #f7edd9;
  --cr-surface-2: #fbf4e6;
  --cr-text: #332f28;
  --cr-title: #211d17;
  --cr-muted: #7c7161;
  --cr-border: rgba(60, 48, 30, 0.14);
  --cr-border-strong: rgba(60, 48, 30, 0.24);
  --cr-accent: #ad7527;
  --cr-accent-soft: rgba(173, 117, 39, 0.13);
}

.cr-reader[data-theme="night"] {
  --cr-bg: #14171a;
  --cr-bg-soft: #1b2024;
  --cr-surface: #1e2429;
  --cr-surface-2: #242b31;
  --cr-text: #d9d1c3;
  --cr-title: #f2ebdf;
  --cr-muted: #938c80;
  --cr-border: rgba(255, 255, 255, 0.09);
  --cr-border-strong: rgba(255, 255, 255, 0.17);
  --cr-accent: #e2aa5e;
  --cr-accent-soft: rgba(226, 170, 94, 0.14);
  --cr-shadow: 0 18px 44px rgba(0, 0, 0, 0.4);
  --cr-sheet-shadow: 0 -28px 80px rgba(0, 0, 0, 0.55);

  color-scheme: dark;
  background:
    radial-gradient(1000px 500px at 85% -10%, rgba(226, 170, 94, 0.07), transparent 60%),
    var(--cr-bg);
}

.cr-reader ::selection {
  background: var(--cr-accent-soft);
  color: var(--cr-title);
}

/* ============================================================
   Loading / error states
   ============================================================ */
.cr-state {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--space-6);
}

.cr-state__card {
  width: 100%;
  max-width: 460px;
  padding: var(--space-12) var(--space-8);
  text-align: center;
  background: var(--cr-surface);
  border: 1px solid var(--cr-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--cr-shadow);
}

.cr-state__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-5);
  border-radius: 50%;
  background: var(--cr-accent);
  color: #17191b;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  box-shadow: 0 12px 28px rgba(198, 137, 53, 0.32);
}

.cr-state__mark--error {
  background: var(--danger);
  color: #fff;
  box-shadow: 0 12px 28px rgba(145, 32, 22, 0.28);
}

.cr-state__kicker {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--cr-muted);
}

.cr-state__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: 1.1;
  color: var(--cr-title);
  margin-bottom: var(--space-3);
}

.cr-state__text {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--cr-muted);
}

.cr-state__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
}

.cr-state__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-5);
  border: 1px solid var(--cr-accent);
  border-radius: var(--radius-full);
  background: var(--cr-accent);
  color: #17191b;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.cr-state__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(198, 137, 53, 0.28);
}

.cr-state__btn--ghost {
  background: transparent;
  border-color: var(--cr-border-strong);
  color: var(--cr-text);
}

.cr-spinner {
  display: block;
  width: 34px;
  height: 34px;
  margin: var(--space-6) auto 0;
  border: 3px solid var(--cr-border);
  border-top-color: var(--cr-accent);
  border-radius: 50%;
  animation: cr-spin 0.9s linear infinite;
}

@keyframes cr-spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   Header
   ============================================================ */
.cr-bar {
  position: sticky;
  top: 0;
  z-index: 900;
  background: var(--cr-surface);
  background: color-mix(in srgb, var(--cr-surface) 88%, transparent);
  border-bottom: 1px solid var(--cr-border);
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  transition: box-shadow var(--transition-base), background var(--transition-base);
}

.cr-bar.is-scrolled {
  box-shadow: 0 10px 30px rgba(24, 20, 12, 0.09);
}

.cr-bar::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--cr-accent), transparent);
  opacity: 0.65;
  pointer-events: none;
}

.cr-bar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 11px var(--space-6);
}

.cr-bar__left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.cr-bar__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border: 1px solid var(--cr-border);
  border-radius: 50%;
  background: var(--cr-surface-2);
  color: var(--cr-text);
  font-size: 13px;
  transition: all var(--transition-fast);
}

.cr-bar__back:hover {
  background: var(--cr-accent);
  border-color: var(--cr-accent);
  color: #17191b;
  transform: translateX(-2px);
}

.cr-bar__book {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.cr-bar__cover {
  width: 32px;
  height: 44px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid var(--cr-border);
  border-radius: 5px;
  background: var(--cr-bg-soft);
  box-shadow: 0 4px 10px rgba(24, 20, 12, 0.14);
}

.cr-bar__titles {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.cr-bar__book-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--cr-title);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 340px;
}

.cr-bar__chapter {
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--cr-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 340px;
}

.cr-bar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.cr-bar__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid transparent;
  border-radius: 50%;
  background: transparent;
  color: var(--cr-text);
  font-size: var(--text-base);
  transition: all var(--transition-fast);
}

.cr-bar__btn:hover {
  border-color: var(--cr-border);
  background: var(--cr-accent-soft);
  color: var(--cr-accent);
}

.cr-bar__btn--aa {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.cr-bar__avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  margin-left: var(--space-1);
}

.cr-bar__avatar :deep(.ua__trigger) {
  width: 36px;
  height: 36px;
}

.cr-bar__avatar :deep(.ua__avatar) {
  width: 32px;
  height: 32px;
  border-width: 2px;
  border-color: var(--cr-accent);
  font-size: 10px;
}

.cr-bar__avatar :deep(.ua__online) {
  display: none;
}

.cr-bar__progress {
  height: 2px;
  background: transparent;
}

.cr-bar__progress > span {
  display: block;
  height: 100%;
  border-radius: 0 999px 999px 0;
  background: linear-gradient(90deg, var(--cr-accent), #f0c886);
  box-shadow: 0 0 10px rgba(231, 165, 74, 0.55);
  transition: width 0.12s linear;
}

/* ============================================================
   Reading column
   ============================================================ */
.cr-main {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-6) 0;
}

.cr-article {
  position: relative;
  outline: none;
}

.cr-chapter-head {
  margin: var(--space-4) 0 var(--space-10);
  text-align: center;
}

.cr-chapter-head__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  color: var(--cr-accent);
}

.cr-chapter-head__ornament span {
  width: 54px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--cr-accent));
}

.cr-chapter-head__ornament span:last-child {
  background: linear-gradient(90deg, var(--cr-accent), transparent);
}

.cr-chapter-head__ornament i {
  font-style: normal;
  font-size: 12px;
  line-height: 1;
  opacity: 0.9;
}

.cr-chapter-head__eyebrow {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cr-muted);
}

.cr-chapter-head__title {
  margin: var(--space-3) 0 var(--space-4);
  font-family: var(--font-display);
  font-size: clamp(30px, 5.2vw, 44px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: var(--cr-title);
}

.cr-chapter-head__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  font-size: 11.5px;
  letter-spacing: 0.03em;
  color: var(--cr-muted);
}

.cr-chapter-head__meta i {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.55;
}

.cr-copy {
  font-family: var(--font-serif);
  color: var(--cr-text);
  text-align: left;
  hyphens: auto;
  -webkit-hyphens: auto;
  text-wrap: pretty;
}

.cr-copy p {
  margin: 0 0 1.35em;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.cr-copy p:first-child::first-letter {
  float: left;
  padding: 0.04em var(--space-2) 0 0;
  font-family: var(--font-serif);
  font-size: 4.2em;
  font-weight: 600;
  line-height: 0.82;
  color: var(--cr-accent);
}

.cr-end {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin: var(--space-12) 0 var(--space-8);
  color: var(--cr-muted);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.cr-end::before,
.cr-end::after {
  content: '';
  width: 46px;
  height: 1px;
  background: var(--cr-border-strong);
}

/* ============================================================
   Previous / next navigation
   ============================================================ */
.cr-chapter-nav {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-10);
}

.cr-nav-btn {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--cr-border);
  border-radius: var(--radius-xl);
  background: var(--cr-surface);
  color: var(--cr-text);
  text-align: left;
  transition: all var(--transition-fast);
}

.cr-nav-btn:hover:not(:disabled) {
  border-color: var(--cr-accent);
  background: var(--cr-surface-2);
  box-shadow: var(--cr-shadow);
  transform: translateY(-2px);
}

.cr-nav-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.cr-nav-btn__hint {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cr-muted);
}

.cr-nav-btn__title {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--cr-title);
}

.cr-nav-btn--next {
  align-items: flex-end;
  text-align: right;
}

.cr-nav-btn--toc {
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 58px;
  padding: 0;
  background: var(--cr-accent-soft);
  border-color: var(--cr-accent-soft);
}

.cr-nav-btn--toc:hover:not(:disabled) {
  background: var(--cr-accent);
  border-color: var(--cr-accent);
  color: #17191b;
}

.cr-nav-btn__toc-label {
  display: none;
  font-size: 11px;
  font-weight: 600;
  color: inherit;
  white-space: nowrap;
}

/* Three-stripe "chapters" glyph */
.cr-bars {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 19px;
  height: 16px;
}

.cr-bars i {
  display: block;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transform-origin: center;
  transition: transform var(--transition-fast);
}

.cr-nav-btn--toc:hover .cr-bars i:nth-child(1),
.cr-action:hover .cr-bars i:nth-child(1) {
  transform: translateX(1px);
}

.cr-nav-btn--toc:hover .cr-bars i:nth-child(3),
.cr-action:hover .cr-bars i:nth-child(3) {
  transform: translateX(-1px);
}

/* ============================================================
   Comments / footer
   ============================================================ */
.cr-comments {
  --surface: var(--cr-surface);
  --surface-hover: var(--cr-bg-soft);
  --line: var(--cr-border);
  --line-strong: var(--cr-border-strong);
  --ink: var(--cr-title);
  --ink-muted: var(--cr-text);
  --text-muted: var(--cr-muted);
  --accent: var(--cr-accent);
  --reader-text: var(--cr-text);
  --reader-border: var(--cr-border);

  margin-top: var(--space-8);
  padding-top: var(--space-8);
  border-top: 1px solid var(--cr-border);
}

.cr-comments :deep(.btn-primary) {
  background: var(--cr-title);
  color: var(--cr-bg);
}

.cr-comments :deep(.btn-primary:hover) {
  background: var(--cr-accent);
  color: #17191b;
  box-shadow: 0 8px 18px rgba(198, 137, 53, 0.28);
}

.cr-comments :deep(.btn-ghost) {
  color: var(--cr-text);
}

.cr-comments :deep(.btn-ghost:hover) {
  color: var(--cr-accent);
}

.cr-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin: var(--space-12) 0 0;
  padding: var(--space-6) 0 var(--space-10);
  border-top: 1px solid var(--cr-border);
}

.cr-footer__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--cr-muted);
  transition: color var(--transition-fast);
}

.cr-footer__link:hover {
  color: var(--cr-accent);
}

.cr-footer__link span {
  font-size: 10px;
}

.cr-footer__brand {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--cr-title);
}

.cr-footer__brand span {
  color: var(--cr-accent);
}

/* ============================================================
   Bottom panel
   ============================================================ */
.cr-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: var(--space-6);
  background: rgba(12, 13, 14, 0.42);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.cr-sheet {
  width: min(600px, 100%);
  max-height: min(88vh, 780px);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--cr-border);
  border-radius: var(--radius-2xl);
  background: var(--cr-surface);
  box-shadow: var(--cr-sheet-shadow);
  outline: none;
  animation: cr-sheet-in 0.36s cubic-bezier(0.22, 0.9, 0.26, 1) both;
}

@keyframes cr-sheet-in {
  from {
    opacity: 0;
    transform: translateY(44px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cr-sheet__grabber {
  display: block;
  flex-shrink: 0;
  width: 42px;
  height: 4px;
  margin: 10px auto 2px;
  border-radius: 999px;
  background: var(--cr-border-strong);
}

.cr-sheet__body {
  overflow-y: auto;
  padding: var(--space-4) var(--space-6) var(--space-6);
  overscroll-behavior: contain;
}

.cr-sheet__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-bottom: var(--space-4);
}

.cr-sheet__cover {
  width: 46px;
  height: 62px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid var(--cr-border);
  border-radius: var(--radius-md);
  box-shadow: 0 6px 14px rgba(20, 16, 10, 0.18);
}

.cr-sheet__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cr-sheet__kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--cr-accent);
}

.cr-sheet__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--cr-title);
}

.cr-sheet__book {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: var(--cr-muted);
}

.cr-sheet__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  margin-left: auto;
  border-radius: 50%;
  background: var(--cr-bg-soft);
  color: var(--cr-muted);
  transition: all var(--transition-fast);
}

.cr-sheet__close:hover {
  background: var(--cr-accent);
  color: #17191b;
}

.cr-progress {
  padding: var(--space-4) var(--space-4) var(--space-3);
  border: 1px solid var(--cr-border);
  border-radius: var(--radius-lg);
  background: var(--cr-bg-soft);
}

.cr-progress__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--cr-muted);
}

.cr-progress__top b {
  font-family: var(--font-display);
  font-size: var(--text-base);
  letter-spacing: -0.02em;
  color: var(--cr-accent);
}

.cr-range {
  display: block;
  width: 100%;
  height: 4px;
  margin: var(--space-4) 0 var(--space-3);
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--cr-accent) 0 var(--cr-range-fill, 0%),
    var(--cr-border-strong) var(--cr-range-fill, 0%) 100%
  );
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.cr-range:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.cr-range::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  border: 3px solid var(--cr-accent);
  border-radius: 50%;
  background: var(--cr-surface-2);
  box-shadow: 0 3px 10px rgba(20, 16, 10, 0.25);
  appearance: none;
  -webkit-appearance: none;
  cursor: grab;
}

.cr-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: 3px solid var(--cr-accent);
  border-radius: 50%;
  background: var(--cr-surface-2);
  box-shadow: 0 3px 10px rgba(20, 16, 10, 0.25);
  cursor: grab;
}

.cr-range::-moz-range-track {
  height: 4px;
  border-radius: 999px;
  background: transparent;
}

.cr-progress__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: 11px;
  color: var(--cr-muted);
}

.cr-progress__bottom span:first-child {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--cr-title);
}

.cr-progress__bottom span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.cr-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
  margin: var(--space-3) 0 0;
}

.cr-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: transparent;
  color: var(--cr-text);
  transition: all var(--transition-fast);
}

.cr-action:hover {
  background: var(--cr-bg-soft);
  border-color: var(--cr-border);
}

.cr-action.is-active {
  background: var(--cr-accent-soft);
  border-color: var(--cr-accent-soft);
}

.cr-action__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--cr-border);
  border-radius: 50%;
  background: var(--cr-bg-soft);
  color: var(--cr-text);
  font-size: var(--text-base);
  transition: all var(--transition-fast);
}

.cr-action__icon--aa {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.cr-action:hover .cr-action__icon,
.cr-action.is-active .cr-action__icon {
  border-color: var(--cr-accent);
  background: var(--cr-accent);
  color: #17191b;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(198, 137, 53, 0.28);
}

.cr-action__label {
  font-size: 11px;
  font-weight: 500;
  color: var(--cr-muted);
}

.cr-action.is-active .cr-action__label {
  color: var(--cr-accent);
}

/* Settings inside the panel */
.cr-settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px dashed var(--cr-border-strong);
}

.cr-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.cr-setting__label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--cr-muted);
}

.cr-setting--themes {
  align-items: flex-start;
}

.cr-stepper {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--cr-border);
  border-radius: 999px;
  background: var(--cr-bg-soft);
}

.cr-stepper button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--cr-text);
  font-size: 17px;
  line-height: 1;
  transition: all var(--transition-fast);
}

.cr-stepper button:hover:not(:disabled) {
  background: var(--cr-accent);
  color: #17191b;
}

.cr-stepper button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.cr-stepper span {
  min-width: 54px;
  text-align: center;
  font-family: var(--font-display);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--cr-title);
}

.cr-segmented {
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--cr-border);
  border-radius: 999px;
  background: var(--cr-bg-soft);
}

.cr-segmented button {
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--cr-muted);
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.cr-segmented button:hover {
  color: var(--cr-title);
}

.cr-segmented button.is-active {
  background: var(--cr-surface-2);
  color: var(--cr-title);
  box-shadow: var(--shadow-sm);
}

.cr-themes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.cr-theme {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 10px;
  border: 1px solid var(--cr-border);
  border-radius: 999px;
  background: transparent;
  color: var(--cr-muted);
  font-size: 11.5px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.cr-theme i {
  display: block;
  width: 14px;
  height: 14px;
  border: 1px solid var(--cr-border-strong);
  border-radius: 50%;
}

.cr-theme:hover {
  border-color: var(--cr-accent);
  color: var(--cr-title);
}

.cr-theme.is-active {
  border-color: var(--cr-accent);
  background: var(--cr-accent-soft);
  color: var(--cr-title);
}

.cr-reset {
  align-self: flex-start;
  padding: 0 0 2px;
  border-bottom: 1px dashed currentColor;
  color: var(--cr-accent);
  font-size: 11.5px;
  font-weight: 500;
  transition: opacity var(--transition-fast);
}

.cr-reset:hover {
  opacity: 0.7;
}

/* Expander transition */
.cr-expand-enter-active,
.cr-expand-leave-active {
  transition: opacity 0.2s ease, transform 0.24s ease;
}

.cr-expand-enter-from,
.cr-expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Fade + sheet exit */
.cr-fade-enter-active,
.cr-fade-leave-active {
  transition: opacity 0.24s ease;
}

.cr-fade-enter-from,
.cr-fade-leave-to {
  opacity: 0;
}

.cr-fade-leave-active .cr-sheet {
  transform: translateY(100%);
  transition: transform 0.24s ease;
}

/* ============================================================
   Chapters drawer (left)
   ============================================================ */
.cr-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  justify-content: flex-start;
  background: rgba(10, 12, 13, 0.56);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.cr-drawer {
  display: flex;
  flex-direction: column;
  width: min(370px, 88vw);
  height: 100%;
  background: var(--cr-surface);
  border-right: 1px solid var(--cr-border);
  box-shadow: 24px 0 70px rgba(0, 0, 0, 0.3);
  outline: none;
  animation: cr-drawer-in 0.34s cubic-bezier(0.22, 0.9, 0.26, 1) both;
}

@keyframes cr-drawer-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.cr-fade-leave-active .cr-drawer {
  transform: translateX(-100%);
  transition: transform 0.24s ease;
}

.cr-drawer__head {
  flex-shrink: 0;
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--cr-border);
  background:
    radial-gradient(340px 180px at 0% 0%, var(--cr-accent-soft), transparent 70%),
    var(--cr-bg-soft);
}

.cr-drawer__book {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.cr-drawer__cover {
  width: 46px;
  height: 62px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid var(--cr-border);
  border-radius: var(--radius-md);
  box-shadow: 0 6px 14px rgba(20, 16, 10, 0.2);
}

.cr-drawer__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding-top: 1px;
}

.cr-drawer__kicker {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cr-accent);
}

.cr-drawer__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--cr-title);
}

.cr-drawer__author {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: var(--cr-muted);
}

.cr-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin-left: auto;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.24);
  color: var(--cr-text);
  transition: all var(--transition-fast);
}

.cr-reader[data-theme="night"] .cr-drawer__close {
  background: rgba(255, 255, 255, 0.07);
}

.cr-drawer__close:hover {
  background: var(--cr-accent);
  color: #17191b;
}

.cr-drawer__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-4);
  font-size: 11px;
  color: var(--cr-muted);
}

.cr-drawer__meta b {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--cr-accent);
}

.cr-drawer__progress {
  height: 3px;
  margin-top: var(--space-2);
  overflow: hidden;
  border-radius: 999px;
  background: var(--cr-border);
}

.cr-drawer__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--cr-accent), #f0c886);
  transition: width var(--transition-base);
}

.cr-drawer__list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2) var(--space-3) var(--space-6);
  overscroll-behavior: contain;
}

.cr-drawer__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: 12px var(--space-3);
  border-radius: var(--radius-md);
  color: var(--cr-text);
  text-align: left;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.cr-drawer__item + .cr-drawer__item {
  margin-top: 2px;
}

.cr-drawer__item:hover {
  background: var(--cr-bg-soft);
}

.cr-drawer__item.is-current {
  background: var(--cr-accent-soft);
  color: var(--cr-title);
}

.cr-drawer__item.is-current::before {
  content: '';
  position: absolute;
  top: 22%;
  bottom: 22%;
  left: 0;
  width: 3px;
  border-radius: 999px;
  background: var(--cr-accent);
}

.cr-drawer__item.is-read .cr-drawer__name {
  color: var(--cr-muted);
}

.cr-drawer__num {
  flex-shrink: 0;
  min-width: 26px;
  font-family: var(--font-display);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--cr-muted);
}

.cr-drawer__item.is-current .cr-drawer__num {
  color: var(--cr-accent);
}

.cr-drawer__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--cr-text);
}

.cr-drawer__state {
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cr-accent);
}

.cr-drawer__state--read {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--cr-accent-soft);
  color: var(--cr-accent);
  font-size: 9px;
  letter-spacing: 0;
}

.cr-drawer__empty {
  padding: var(--space-10) var(--space-4);
  text-align: center;
  color: var(--cr-muted);
  font-size: var(--text-sm);
}

.cr-drawer__footer {
  flex-shrink: 0;
  padding: var(--space-3) var(--space-4) max(var(--space-4), env(safe-area-inset-bottom));
  border-top: 1px solid var(--cr-border);
  background: var(--cr-surface);
}

.cr-drawer__book-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-2);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--cr-muted);
  transition: color var(--transition-fast);
}

.cr-drawer__book-link:hover {
  color: var(--cr-accent);
}

.cr-drawer__book-link span {
  font-size: 9px;
}

/* ============================================================
   Hint toast
   ============================================================ */
.cr-hint {
  position: fixed;
  bottom: max(var(--space-6), env(safe-area-inset-bottom));
  left: 50%;
  z-index: 800;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  border: 1px solid var(--cr-border);
  border-radius: 999px;
  background: var(--cr-surface);
  color: var(--cr-text);
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: var(--cr-shadow);
  transform: translateX(-50%);
  cursor: pointer;
  animation: cr-hint-in 0.4s ease both;
}

@keyframes cr-hint-in {
  from { opacity: 0; transform: translate(-50%, 12px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.cr-hint__bars {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--cr-accent);
  color: #17191b;
}

.cr-hint .cr-bars {
  width: 14px;
  height: 11px;
  gap: 3px;
}

.cr-hint .cr-bars i {
  height: 1.5px;
}

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 1024px) {
  .cr-main {
    padding: var(--space-8) var(--space-5) 0;
  }

  .cr-bar__book-title,
  .cr-bar__chapter {
    max-width: 260px;
  }
}

@media (max-width: 768px) {
  .cr-bar__inner {
    padding: 9px var(--space-4);
    gap: var(--space-3);
  }

  .cr-bar__cover {
    display: none;
  }

  .cr-bar__book-title {
    font-size: 12.5px;
    max-width: 180px;
  }

  .cr-bar__chapter {
    max-width: 180px;
    font-size: 10px;
  }

  .cr-bar__btn {
    width: 34px;
    height: 34px;
  }

  .cr-bar__avatar,
  .cr-bar__avatar :deep(.ua__trigger) {
    width: 32px;
    height: 32px;
  }

  .cr-bar__avatar :deep(.ua__avatar) {
    width: 28px;
    height: 28px;
    font-size: 9px;
  }

  .cr-main {
    padding: var(--space-6) var(--space-4) 0;
  }

  .cr-chapter-head {
    margin: var(--space-2) 0 var(--space-8);
  }

  .cr-chapter-head__title {
    font-size: clamp(27px, 7.2vw, 36px);
    margin: var(--space-3) 0;
  }

  .cr-chapter-head__ornament span {
    width: 38px;
  }

  .cr-copy p:first-child::first-letter {
    font-size: 3.5em;
  }

  .cr-chapter-nav {
    grid-template-columns: 1fr 1fr;
  }

  .cr-nav-btn--toc {
    grid-column: 1 / -1;
    grid-row: 1;
    flex-direction: row;
    width: 100%;
    height: 46px;
    padding: 0 var(--space-4);
  }

  .cr-nav-btn__toc-label {
    display: inline;
  }

  .cr-footer {
    margin-top: var(--space-8);
    padding-bottom: var(--space-8);
  }

  .cr-overlay {
    padding: 0;
  }

  .cr-sheet {
    width: 100%;
    max-height: 90vh;
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
    border-bottom: none;
  }

  .cr-sheet__body {
    padding: var(--space-3) var(--space-4) max(var(--space-5), env(safe-area-inset-bottom));
  }

  .cr-hint {
    max-width: calc(100vw - 24px);
    padding: var(--space-2) var(--space-3);
    white-space: nowrap;
    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .cr-bar__btn--toc {
    display: none;
  }

  .cr-bar__book-title {
    max-width: 42vw;
  }

  .cr-bar__chapter {
    max-width: 42vw;
  }
}

@media (max-width: 520px) {
  .cr-bar__book-title {
    max-width: 42vw;
  }

  .cr-bar__chapter {
    max-width: 42vw;
  }

  .cr-chapter-head__meta {
    gap: var(--space-2);
    font-size: 10.5px;
  }

  .cr-chapter-nav {
    gap: var(--space-2);
  }

  .cr-nav-btn {
    padding: var(--space-3);
  }

  .cr-nav-btn__title {
    font-size: 11.5px;
  }

  .cr-nav-btn__hint {
    font-size: 8.5px;
    letter-spacing: 0.1em;
  }

  .cr-setting {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }

  .cr-setting--themes {
    gap: var(--space-2);
  }

  .cr-stepper {
    align-self: flex-start;
  }

  .cr-segmented {
    align-self: flex-start;
    max-width: 100%;
  }

  .cr-themes {
    align-self: flex-start;
  }

  .cr-drawer {
    width: min(340px, 92vw);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cr-reader *,
  .cr-reader *::before,
  .cr-reader *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
</style>

<style>
html:has(.cr-reader[data-theme="night"]),
body:has(.cr-reader[data-theme="night"]) {
  background-color: #14171a;
}
</style>
