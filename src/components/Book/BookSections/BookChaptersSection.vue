<template>
  <section class="bd-chapters">
    <header class="bd-chapters__head">
      <div>
        <span class="bd-section__kicker">ОГЛАВЛЕНИЕ</span>
        <h2>Главы книги</h2>
      </div>
      <span v-if="totalChapters" class="bd-chapters__count">
        {{ totalChapters }} {{ chapterWord(totalChapters) }}
      </span>
    </header>

    <div v-if="loading" class="bd-chapters__skeleton" aria-hidden="true">
      <span v-for="item in 4" :key="item"></span>
    </div>

    <div v-else-if="error" class="bd-chapters__state bd-chapters__state--error">
      <span class="icon-attention-alt" aria-hidden="true"></span>
      <div>
        <strong>Не удалось загрузить главы</strong>
        <p>Проверьте подключение и попробуйте ещё раз.</p>
      </div>
      <button type="button" @click="loadChapters(currentPage)">Повторить</button>
    </div>

    <div v-else-if="!chapters.length" class="bd-chapters__state">
      <span class="icon-bookmark-empty" aria-hidden="true"></span>
      <div>
        <strong>Глав пока нет</strong>
        <p>Автор ещё не опубликовал ни одной главы.</p>
      </div>
    </div>

    <div v-else class="bd-chapters__list">
      <router-link
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        :to="{ name: 'Chapter', params: { bookId: bookId, chapterId: chapter.id } }"
        class="bd-chapter"
      >
        <span class="bd-chapter__number">{{ chapterPosition(index) }}</span>
        <span class="bd-chapter__body">
          <strong>{{ chapter.title }}</strong>
          <small v-if="chapter.duration">
            <span class="icon-hourglass-1" aria-hidden="true"></span>
            {{ formatDuration(chapter.duration) }}
          </small>
          <small v-else>Глава {{ chapterPosition(index) }}</small>
        </span>
        <span class="bd-chapter__action">
          Читать
          <span class="icon-right-open" aria-hidden="true"></span>
        </span>
      </router-link>
    </div>

    <div v-if="!loading && !error && lastPage > 1" class="bd-chapters__pagination">
      <button type="button" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        <span class="icon-left-open" aria-hidden="true"></span>
        Назад
      </button>
      <span>{{ currentPage }} / {{ lastPage }}</span>
      <button type="button" :disabled="currentPage === lastPage" @click="changePage(currentPage + 1)">
        Вперёд
        <span class="icon-right-open" aria-hidden="true"></span>
      </button>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'BookChaptersSection',
  props: {
    currentChapterId: { type: [Number, String], default: null },
    perPage: { type: Number, default: 8 },
  },
  data: () => ({
    chapters: [],
    loading: true,
    error: false,
    currentPage: 1,
    lastPage: 1,
    totalChapters: 0,
  }),
  computed: {
    bookId() {
      return this.$route.params.id;
    },
  },
  watch: {
    currentPage: {
      handler(page) {
        this.loadChapters(page);
      },
      immediate: true,
    },
  },
  methods: {
    async loadChapters(page = 1) {
      this.loading = true;
      this.error = false;

      try {
        const token = Cookies.get('auth_token') || '';
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/v1/books/${this.bookId}/chapters`,
          {
            params: { page, per_page: this.perPage },
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          }
        );

        this.chapters = response.data.chapters || [];
        this.currentPage = response.data.current_page || 1;
        this.lastPage = response.data.last_page || 1;
        this.totalChapters = response.data.total_chapters || 0;
      } catch (e) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page < 1 || page > this.lastPage) return;
      this.currentPage = page;
    },
    chapterPosition(index) {
      return (this.currentPage - 1) * this.perPage + index + 1;
    },
    chapterWord(count) {
      const value = Number(count) || 0;
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'глава';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'главы';
      return 'глав';
    },
    formatDuration(value) {
      if (!value) return '';
      const parts = String(value).split(':').map(Number);
      if (parts.length === 3 && !Number.isNaN(parts[0])) {
        const hours = parts[0];
        const minutes = parts[1];
        return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
      }
      return value;
    },
  },
};
</script>

<style scoped>
.bd-chapters {
  padding: var(--space-6);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.bd-chapters__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.bd-section__kicker {
  display: block;
  margin-bottom: 3px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bd-chapters__head h2 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.bd-chapters__count {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  white-space: nowrap;
}

.bd-chapters__list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.bd-chapter {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-2);
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  transition: background-color var(--transition-fast), padding-left var(--transition-fast);
}

.bd-chapter:hover {
  padding-left: var(--space-3);
  background: #faf8f2;
}

.bd-chapter__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: var(--text-muted);
  background: var(--paper);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
}

.bd-chapter:hover .bd-chapter__number {
  color: var(--text-on-accent);
  background: var(--accent);
}

.bd-chapter__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.bd-chapter__body strong {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bd-chapter__body small {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
}

.bd-chapter__action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.bd-chapter:hover .bd-chapter__action {
  color: var(--accent);
}

.bd-chapter__action span {
  font-size: 8px;
}

.bd-chapters__skeleton {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--line);
}

.bd-chapters__skeleton span {
  height: 56px;
  background: linear-gradient(90deg, #f7f4ed 25%, #fbfaf6 50%, #f7f4ed 75%);
  background-size: 200% 100%;
  border-bottom: 1px solid var(--line);
  animation: bd-shimmer 1.2s linear infinite;
}

@keyframes bd-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.bd-chapters__state {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--paper);
  border: 1px dashed var(--line);
  border-radius: var(--radius-lg);
}

.bd-chapters__state > span {
  color: var(--text-muted);
  font-size: var(--text-xl);
}

.bd-chapters__state strong {
  display: block;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
}

.bd-chapters__state p {
  margin: 2px 0 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.bd-chapters__state--error {
  flex-wrap: wrap;
  color: var(--danger);
}

.bd-chapters__state--error strong {
  color: var(--danger);
}

.bd-chapters__state button {
  margin-left: auto;
  height: 32px;
  padding: 0 var(--space-3);
  color: var(--danger);
  background: transparent;
  border: 1px solid rgba(145, 32, 22, 0.3);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  cursor: pointer;
}

.bd-chapters__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.bd-chapters__pagination button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 34px;
  padding: 0 var(--space-3);
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  cursor: pointer;
}

.bd-chapters__pagination button:hover:not(:disabled) {
  color: var(--ink);
  border-color: var(--accent);
}

.bd-chapters__pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bd-chapters__pagination span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

@media (max-width: 640px) {
  .bd-chapters {
    padding: var(--space-4);
  }

  .bd-chapters__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .bd-chapter {
    gap: var(--space-2);
    padding: var(--space-3) 0;
  }

  .bd-chapter__number {
    width: 28px;
    height: 28px;
  }

  .bd-chapter__action {
    display: none;
  }

  .bd-chapters__state button {
    margin-left: 0;
  }
}
</style>
