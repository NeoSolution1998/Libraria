<template>
  <div id="books-filters-panel" class="bflt-panel" role="region" aria-labelledby="books-filters-title">
    <header class="bflt-panel__head">
      <div>
        <span class="bflt-panel__kicker">ПОДБОР КНИГ</span>
        <h2 id="books-filters-title" class="bflt-panel__title">
          Фильтры
          <span v-if="draftFiltersCount" class="bflt-panel__count">{{ draftFiltersCount }}</span>
        </h2>
      </div>
      <button type="button" class="bflt-panel__close" aria-label="Закрыть фильтры" @click="$emit('close')">
        <span class="icon-cancel-1" aria-hidden="true"></span>
      </button>
    </header>

    <div class="bflt-panel__body">
      <p v-if="filterOptionsError" class="bflt-notice">{{ filterOptionsError }}</p>

      <section class="bflt-section">
        <div class="bflt-section__head">
          <div>
            <span class="bflt-section__kicker">КАТЕГОРИИ</span>
            <h3>Что почитать</h3>
          </div>
          <button v-if="categoryIds.length" type="button" class="bflt-section__reset" @click="categoryIds = []">
            Сбросить
          </button>
        </div>

        <div v-if="categoriesLoading" class="bflt-skeleton">
          <span></span><span></span><span></span>
        </div>
        <div v-else-if="!categories.length" class="bflt-empty">Категории не найдены.</div>
        <div v-else class="bflt-chips">
          <label
            v-for="category in categories"
            :key="category.id"
            class="bflt-chip"
            :class="{ 'is-selected': categoryIds.includes(Number(category.id)) }"
          >
            <input v-model="categoryIds" type="checkbox" :value="Number(category.id)" />
            <span class="bflt-chip__dot" aria-hidden="true"></span>
            <span>{{ category.name }}</span>
          </label>
        </div>
      </section>

      <section class="bflt-section">
        <div class="bflt-section__head">
          <div>
            <span class="bflt-section__kicker">АВТОР</span>
            <h3>Кто написал</h3>
          </div>
          <button v-if="authorName" type="button" class="bflt-section__reset" @click="clearAuthor">
            Сбросить
          </button>
        </div>

        <div v-if="authorName" class="bflt-author-selected">
          <span class="bflt-author-selected__avatar">{{ authorName.slice(0, 1).toUpperCase() }}</span>
          <span>{{ authorName }}</span>
          <button type="button" aria-label="Убрать автора" @click="clearAuthor">
            <span class="icon-cancel-1" aria-hidden="true"></span>
          </button>
        </div>

        <template v-else>
          <div class="bflt-author-search">
            <span class="icon-search" aria-hidden="true"></span>
            <input v-model="authorQuery" type="text" placeholder="Найти автора по имени" aria-label="Найти автора" />
          </div>

          <div v-if="authorsLoading" class="bflt-skeleton bflt-skeleton--author">
            <span></span><span></span><span></span>
          </div>
          <div v-else-if="!filteredAuthors.length" class="bflt-empty">Авторы не найдены.</div>
          <div v-else class="bflt-author-list">
            <button
              v-for="author in filteredAuthors"
              :key="author.name"
              type="button"
              class="bflt-author-option"
              @click="selectAuthor(author)"
            >
              <span class="bflt-author-option__avatar">{{ author.name.slice(0, 1).toUpperCase() }}</span>
              <span class="bflt-author-option__name">{{ author.name }}</span>
              <small>{{ author.books_count }} {{ bookWord(author.books_count) }}</small>
            </button>
          </div>
        </template>
      </section>

      <section class="bflt-section">
        <div class="bflt-section__head">
          <div>
            <span class="bflt-section__kicker">ДАТА</span>
            <h3>Когда добавлена</h3>
          </div>
          <button
            v-if="startDate || endDate"
            type="button"
            class="bflt-section__reset"
            @click="startDate = ''; endDate = ''"
          >
            Сбросить
          </button>
        </div>

        <div class="bflt-dates">
          <label>
            <span>От</span>
            <input v-model="startDate" type="date" :max="endDate || undefined" />
          </label>
          <label>
            <span>До</span>
            <input v-model="endDate" type="date" :min="startDate || undefined" />
          </label>
        </div>
      </section>

      <section class="bflt-section bflt-section--last">
        <div class="bflt-section__head">
          <div>
            <span class="bflt-section__kicker">РЕЙТИНГ</span>
            <h3>Высокая оценка</h3>
          </div>
          <button v-if="minRating > 0" type="button" class="bflt-section__reset" @click="minRating = 0">
            Сбросить
          </button>
        </div>

        <div class="bflt-stars" role="group" aria-label="Минимальный рейтинг книги">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            :class="{ 'is-filled': star <= minRating }"
            :aria-label="`Рейтинг от ${star} звёзд`"
            :aria-pressed="star === minRating"
            @click="minRating = star"
          >
            <IconVue name="star" />
          </button>
          <span>{{ minRating > 0 ? `от ${minRating} ★` : 'любой' }}</span>
        </div>
      </section>
    </div>

    <footer class="bflt-panel__footer">
      <p v-if="validationError" class="bflt-notice bflt-notice--error">{{ validationError }}</p>
      <div class="bflt-panel__actions">
        <button type="button" class="bflt-panel__reset" @click="resetDraft">Сбросить</button>
        <button type="button" class="bflt-panel__apply" @click="applyDraft">
          Применить
          <span v-if="draftFiltersCount">{{ draftFiltersCount }}</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import IconVue from '@/components/Icons/IconVue.vue';

const emptyDraft = () => ({
  categoryIds: [],
  authorName: '',
  authorQuery: '',
  startDate: '',
  endDate: '',
  minRating: 0,
});

export default {
  name: 'BooksFilterPanel',
  components: { IconVue },
  emits: ['close', 'apply', 'reset'],
  data() {
    const state = this.$store.state.books;

    return {
      categoryIds: [...(state.selectedCategoryIds || [])],
      authorName: state.authorName || '',
      authorQuery: '',
      startDate: state.startDate || '',
      endDate: state.endDate || '',
      minRating: state.minRating || 0,
      validationError: '',
    };
  },
  computed: {
    ...mapGetters('books', [
      'categories',
      'categoriesLoading',
      'authors',
      'authorsLoading',
      'filterOptionsError',
    ]),
    storeSignature() {
      const state = this.$store.state.books;
      return JSON.stringify([
        state.selectedCategoryIds,
        state.authorName,
        state.startDate,
        state.endDate,
        state.minRating,
      ]);
    },
    filteredAuthors() {
      const query = this.authorQuery.trim().toLocaleLowerCase('ru-RU');
      return this.authors
        .filter((author) => !query || author.name.toLocaleLowerCase('ru-RU').includes(query))
        .slice(0, 100);
    },
    draftFiltersCount() {
      return [
        this.categoryIds.length > 0,
        Boolean(this.authorName),
        Boolean(this.startDate || this.endDate),
        this.minRating > 0,
      ].filter(Boolean).length;
    },
  },
  watch: {
    storeSignature() {
      this.syncFromStore();
      this.validationError = '';
    },
  },
  methods: {
    syncFromStore() {
      const state = this.$store.state.books;
      this.categoryIds = [...(state.selectedCategoryIds || [])];
      this.authorName = state.authorName || '';
      this.authorQuery = '';
      this.startDate = state.startDate || '';
      this.endDate = state.endDate || '';
      this.minRating = state.minRating || 0;
    },
    bookWord(count) {
      const value = Number(count) || 0;
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'книга';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'книги';
      return 'книг';
    },
    selectAuthor(author) {
      this.authorName = author.name;
      this.authorQuery = '';
    },
    clearAuthor() {
      this.authorName = '';
      this.authorQuery = '';
    },
    resetDraft() {
      Object.assign(this, emptyDraft());
      this.validationError = '';
      this.$emit('reset');
    },
    applyDraft() {
      this.validationError = '';

      if (this.startDate && this.endDate && this.startDate > this.endDate) {
        this.validationError = 'Дата окончания не может быть раньше даты начала.';
        return;
      }

      this.$emit('apply', {
        categoryIds: [...this.categoryIds],
        authorName: this.authorName,
        startDate: this.startDate || '',
        endDate: this.endDate || '',
        minRating: Math.min(5, Math.max(0, Number(this.minRating) || 0)),
      });
    },
  },
};
</script>

<style scoped>
.bflt-panel {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 110px);
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: 0 18px 44px rgba(25, 27, 28, 0.08);
}

.bflt-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-shrink: 0;
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--line);
  background:
    radial-gradient(280px 140px at 0% 0%, rgba(231, 165, 74, 0.12), transparent 70%),
    #fff;
}

.bflt-panel__kicker {
  display: block;
  margin-bottom: 3px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bflt-panel__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.bflt-panel__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
}

.bflt-panel__close {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  padding: 0;
  color: var(--text-secondary);
  background: var(--surface-hover);
  border: 0;
  border-radius: 50%;
  font-size: var(--text-base);
  cursor: pointer;
}

.bflt-panel__close:hover {
  color: #fff;
  background: var(--danger);
}

.bflt-panel__body {
  flex: 1;
  min-height: 0;
  padding: 0 var(--space-5);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
}

.bflt-panel__body::-webkit-scrollbar {
  width: 5px;
}

.bflt-panel__body::-webkit-scrollbar-thumb {
  background: var(--line-strong);
  border-radius: 999px;
}

.bflt-section {
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--line);
}

.bflt-section--last {
  border-bottom: 0;
}

.bflt-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.bflt-section__kicker {
  display: block;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bflt-section__head h3 {
  margin: 2px 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.3;
}

.bflt-section__reset {
  padding: 0;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  font-family: var(--font-sans);
  font-size: 10px;
  cursor: pointer;
}

.bflt-section__reset:hover {
  color: var(--accent);
}

.bflt-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-3);
}

.bflt-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  color: var(--text-secondary);
  background: #f7f5ef;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 10.5px;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
}

.bflt-chip:hover {
  color: var(--ink);
  background: var(--surface-hover);
}

.bflt-chip input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.bflt-chip__dot {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  background: var(--line-strong);
  border-radius: 50%;
}

.bflt-chip.is-selected {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.bflt-chip.is-selected .bflt-chip__dot {
  background: var(--text-on-accent);
}

.bflt-chip:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.bflt-empty {
  margin-top: var(--space-3);
  padding: var(--space-3);
  color: var(--text-muted);
  background: #f8f7f3;
  border: 1px dashed var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10.5px;
}

.bflt-skeleton {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-3);
}

.bflt-skeleton span {
  width: 74px;
  height: 26px;
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  border-radius: 999px;
  animation: bflt-shimmer 1.2s linear infinite;
}

.bflt-skeleton--author span {
  width: 100%;
  height: 34px;
  border-radius: var(--radius-md);
}

@keyframes bflt-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.bflt-author-search {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: var(--space-3);
}

.bflt-author-search .icon-search {
  position: absolute;
  left: var(--space-3);
  color: var(--text-muted);
  font-size: var(--text-xs);
  pointer-events: none;
}

.bflt-author-search input {
  width: 100%;
  height: 38px;
  padding: 0 var(--space-3) 0 var(--space-8);
  color: var(--ink);
  background: #f7f5ef;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  outline: none;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
}

.bflt-author-search input:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.13);
}

.bflt-author-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 172px;
  margin-top: var(--space-2);
  overflow-y: auto;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.bflt-author-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: 7px var(--space-2);
  color: var(--text-secondary);
  background: #fff;
  border: 0;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  text-align: left;
  cursor: pointer;
}

.bflt-author-option:last-child {
  border-bottom: 0;
}

.bflt-author-option:hover {
  color: var(--ink);
  background: #faf8f2;
}

.bflt-author-option__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.14);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: 600;
}

.bflt-author-option__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bflt-author-option small {
  color: var(--text-muted);
  font-size: 9px;
  white-space: nowrap;
}

.bflt-author-selected {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding: 6px var(--space-2);
  background: rgba(231, 165, 74, 0.1);
  border: 1px solid rgba(231, 165, 74, 0.4);
  border-radius: var(--radius-md);
}

.bflt-author-selected__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
}

.bflt-author-selected > span:nth-child(2) {
  flex: 1;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bflt-author-selected button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}

.bflt-author-selected button:hover {
  color: var(--danger);
  background: #fff;
}

.bflt-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.bflt-dates label {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
}

.bflt-dates label > span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.bflt-dates input {
  width: 100%;
  height: 36px;
  padding: 0 var(--space-2);
  color: var(--ink);
  background: #f7f5ef;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  outline: none;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
}

.bflt-dates input:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.13);
}

.bflt-stars {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: var(--space-2);
}

.bflt-stars button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: var(--line-strong);
  background: transparent;
  border: 0;
  font-size: var(--text-base);
  cursor: pointer;
}

.bflt-stars button.is-filled {
  color: var(--warning);
}

.bflt-stars > span {
  margin-left: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.bflt-panel__footer {
  flex-shrink: 0;
  padding: var(--space-3) var(--space-5) var(--space-4);
  background: #fff;
  border-top: 1px solid var(--line);
}

.bflt-notice {
  margin: var(--space-3) 0 0;
  padding: var(--space-2);
  color: var(--danger);
  background: rgba(145, 32, 22, 0.06);
  border: 1px solid rgba(145, 32, 22, 0.16);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
}

.bflt-notice--error {
  margin: 0 0 var(--space-2);
}

.bflt-panel__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.bflt-panel__reset {
  height: 40px;
  padding: 0 var(--space-3);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
}

.bflt-panel__reset:hover {
  color: var(--danger);
  border-color: var(--danger);
}

.bflt-panel__apply {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex: 1;
  height: 40px;
  color: var(--text-on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
}

.bflt-panel__apply:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.bflt-panel__apply span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  color: var(--accent);
  background: var(--text-on-accent);
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .bflt-panel {
    max-height: none;
    height: 100%;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .bflt-panel__close {
    display: inline-flex;
  }

  .bflt-panel__head {
    padding: var(--space-4) var(--space-4) var(--space-3);
  }

  .bflt-panel__body {
    padding: 0 var(--space-4);
  }

  .bflt-panel__footer {
    padding: var(--space-3) var(--space-4) max(var(--space-4), env(safe-area-inset-bottom));
  }
}
</style>
