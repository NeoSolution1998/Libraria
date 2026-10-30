<template>
  <div
    id="posts-filters-panel"
    class="filter-panel"
    role="region"
    aria-labelledby="posts-filters-title"
  >
    <header class="filter-panel__head">
      <div class="filter-panel__title-wrap">
        <span class="filter-panel__kicker">ПОДБОР ПОСТОВ</span>
        <h2 id="posts-filters-title" class="filter-panel__title">
          Фильтры
          <span v-if="draftFiltersCount" class="filter-panel__count">{{ draftFiltersCount }}</span>
        </h2>
      </div>
      <button
        type="button"
        class="filter-panel__close"
        aria-label="Закрыть фильтры"
        @click="$emit('close')"
      >
        <span class="icon-cancel-1" aria-hidden="true"></span>
      </button>
    </header>

    <div class="filter-panel__body">
      <p v-if="filterOptionsError" class="filter-panel__notice">
        {{ filterOptionsError }}
      </p>

      <section class="filter-section">
        <div class="filter-section__head">
          <div>
            <span class="filter-section__kicker">КАТЕГОРИИ</span>
            <h3>О чём пост</h3>
          </div>
          <button
            v-if="categoryIds.length"
            type="button"
            class="filter-section__reset"
            @click="categoryIds = []"
          >
            Сбросить
          </button>
        </div>
        <p class="filter-section__hint">
          Категории берутся из книги, к которой привязан пост.
        </p>

        <div v-if="categoriesLoading" class="filter-skeleton">
          <span></span><span></span><span></span>
        </div>
        <div v-else-if="!categories.length" class="filter-empty">
          Категории не найдены.
        </div>
        <div v-else class="filter-chips">
          <label
            v-for="category in categories"
            :key="category.id"
            class="filter-chip"
            :class="{ 'is-selected': categoryIds.includes(category.id) }"
          >
            <input v-model="categoryIds" type="checkbox" :value="category.id" />
            <span class="filter-chip__dot" aria-hidden="true"></span>
            <span>{{ category.name }}</span>
          </label>
        </div>
      </section>

      <section class="filter-section">
        <div class="filter-section__head">
          <div>
            <span class="filter-section__kicker">АВТОР</span>
            <h3>Кто написал</h3>
          </div>
          <button
            v-if="authorId"
            type="button"
            class="filter-section__reset"
            @click="clearAuthor"
          >
            Сбросить
          </button>
        </div>

        <div v-if="authorId" class="filter-author-selected">
          <span class="filter-author-selected__avatar">
            {{ (authorName || 'А').slice(0, 1).toUpperCase() }}
          </span>
          <span class="filter-author-selected__name">{{ authorName }}</span>
          <button type="button" aria-label="Убрать автора" @click="clearAuthor">
            <span class="icon-cancel-1" aria-hidden="true"></span>
          </button>
        </div>

        <template v-else>
          <div class="filter-author-search">
            <span class="icon-search" aria-hidden="true"></span>
            <input
              v-model="authorQuery"
              type="text"
              placeholder="Найти автора по имени"
              aria-label="Найти автора"
              autocomplete="off"
            />
          </div>

          <div v-if="authorsLoading" class="filter-skeleton filter-skeleton--author">
            <span></span><span></span><span></span>
          </div>
          <div v-else-if="!filteredAuthors.length" class="filter-empty">
            Авторы не найдены.
          </div>
          <div v-else class="filter-author-list">
            <button
              v-for="author in filteredAuthors"
              :key="author.id"
              type="button"
              class="filter-author-option"
              @click="selectAuthor(author)"
            >
              <span class="filter-author-option__avatar">
                {{ author.name.slice(0, 1).toUpperCase() }}
              </span>
              <span class="filter-author-option__name">{{ author.name }}</span>
              <small>{{ author.posts_count }} {{ postWord(author.posts_count) }}</small>
            </button>
          </div>
        </template>
      </section>

      <section class="filter-section">
        <div class="filter-section__head">
          <div>
            <span class="filter-section__kicker">ДАТА</span>
            <h3>Когда опубликован</h3>
          </div>
          <button
            v-if="startDate || endDate"
            type="button"
            class="filter-section__reset"
            @click="clearDates"
          >
            Сбросить
          </button>
        </div>

        <div class="filter-dates">
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

      <section class="filter-section">
        <div class="filter-section__head">
          <div>
            <span class="filter-section__kicker">ПОПУЛЯРНОСТЬ</span>
            <h3>Лайки</h3>
          </div>
          <button
            v-if="minLikes !== '' || maxLikes !== ''"
            type="button"
            class="filter-section__reset"
            @click="clearLikes"
          >
            Сбросить
          </button>
        </div>

        <div class="filter-dates">
          <label>
            <span>От</span>
            <input v-model.number="minLikes" type="number" min="0" placeholder="0" />
          </label>
          <label>
            <span>До</span>
            <input v-model.number="maxLikes" type="number" min="0" placeholder="∞" />
          </label>
        </div>

        <div class="filter-presets">
          <button
            v-for="preset in likePresets"
            :key="preset"
            type="button"
            :class="{ 'is-active': Number(minLikes) === preset && !Number(maxLikes) }"
            @click="applyLikePreset(preset)"
          >
            от {{ preset }}
          </button>
        </div>
      </section>

      <section class="filter-section filter-section--last">
        <div class="filter-section__head">
          <div>
            <span class="filter-section__kicker">РЕЙТИНГ</span>
            <h3>Средняя оценка</h3>
          </div>
          <button
            v-if="minRating > 0"
            type="button"
            class="filter-section__reset"
            @click="minRating = 0"
          >
            Сбросить
          </button>
        </div>

        <div class="filter-stars" role="group" aria-label="Минимальный рейтинг поста">
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

    <footer class="filter-panel__footer">
      <p v-if="validationError" class="filter-panel__notice filter-panel__notice--error">
        {{ validationError }}
      </p>
      <div class="filter-panel__actions">
        <button type="button" class="filter-panel__reset" @click="resetDraft">
          Сбросить
        </button>
        <button type="button" class="filter-panel__apply" @click="applyDraft">
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

const defaultFilters = () => ({
  categoryIds: [],
  authorId: null,
  authorName: '',
  startDate: '',
  endDate: '',
  minLikes: '',
  maxLikes: '',
  minRating: 0,
});

export default {
  name: 'PostsFilterPanel',
  components: {
    IconVue,
  },
  emits: ['close', 'apply', 'reset'],
  data() {
    const state = this.$store.state.posts;

    return {
      categoryIds: [...(state.selectedCategoryIds || [])],
      authorId: state.authorId || null,
      authorName: state.authorName || '',
      authorQuery: '',
      startDate: state.startDate || '',
      endDate: state.endDate || '',
      minLikes: state.minLikes || '',
      maxLikes: state.maxLikes || '',
      minRating: state.minRating || 0,
      validationError: '',
      likePresets: [1, 5, 10, 50],
    };
  },
  computed: {
    ...mapGetters('posts', [
      'categories',
      'categoriesLoading',
      'authors',
      'authorsLoading',
      'filterOptionsError',
    ]),
    storeFiltersSignature() {
      const state = this.$store.state.posts;
      return JSON.stringify([
        state.selectedCategoryIds,
        state.authorId,
        state.authorName,
        state.startDate,
        state.endDate,
        state.minLikes,
        state.maxLikes,
        state.minRating,
      ]);
    },
    filteredAuthors() {
      const query = this.authorQuery.trim().toLocaleLowerCase('ru-RU');

      return this.authors
        .filter((author) => !query || String(author.name).toLocaleLowerCase('ru-RU').includes(query))
        .slice(0, 100);
    },
    draftFiltersCount() {
      return [
        this.categoryIds.length > 0,
        Boolean(this.authorId),
        Boolean(this.startDate || this.endDate),
        Number(this.minLikes) > 0 || Number(this.maxLikes) > 0,
        this.minRating > 0,
      ].filter(Boolean).length;
    },
  },
  watch: {
    storeFiltersSignature() {
      this.syncFromStore();
      this.validationError = '';
    },
  },
  methods: {
    syncFromStore() {
      const state = this.$store.state.posts;

      this.categoryIds = [...(state.selectedCategoryIds || [])];
      this.authorId = state.authorId || null;
      this.authorName = state.authorName || '';
      this.authorQuery = '';
      this.startDate = state.startDate || '';
      this.endDate = state.endDate || '';
      this.minLikes = state.minLikes || '';
      this.maxLikes = state.maxLikes || '';
      this.minRating = state.minRating || 0;
    },
    postWord(count) {
      const value = Number(count) || 0;
      const mod10 = value % 10;
      const mod100 = value % 100;

      if (mod10 === 1 && mod100 !== 11) return 'пост';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'поста';
      return 'постов';
    },
    selectAuthor(author) {
      this.authorId = author.id;
      this.authorName = author.name;
      this.authorQuery = '';
    },
    clearAuthor() {
      this.authorId = null;
      this.authorName = '';
      this.authorQuery = '';
    },
    clearDates() {
      this.startDate = '';
      this.endDate = '';
    },
    clearLikes() {
      this.minLikes = '';
      this.maxLikes = '';
    },
    applyLikePreset(preset) {
      this.minLikes = preset;
      this.maxLikes = '';
    },
    resetDraft() {
      Object.assign(this, defaultFilters());
      this.authorQuery = '';
      this.validationError = '';
      this.$emit('reset');
    },
    applyDraft() {
      this.validationError = '';

      if (this.startDate && this.endDate && this.startDate > this.endDate) {
        this.validationError = 'Дата окончания не может быть раньше даты начала.';
        return;
      }

      const minLikes = Math.max(0, Number(this.minLikes) || 0);
      const maxLikes = Math.max(0, Number(this.maxLikes) || 0);

      if (maxLikes > 0 && minLikes > maxLikes) {
        this.validationError = 'Максимальное количество лайков не может быть меньше минимального.';
        return;
      }

      this.$emit('apply', {
        categoryIds: [...this.categoryIds],
        authorId: this.authorId,
        authorName: this.authorName,
        startDate: this.startDate || '',
        endDate: this.endDate || '',
        minLikes,
        maxLikes,
        minRating: Math.min(5, Math.max(0, Number(this.minRating) || 0)),
        maxRating: 5,
        tags: [],
      });
    },
  },
};
</script>

<style scoped>
.filter-panel {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 110px);
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: 0 18px 44px rgba(25, 27, 28, 0.08);
  overflow: hidden;
}

.filter-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-shrink: 0;
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--line);
  background:
    radial-gradient(280px 140px at 0% 0%, rgba(231, 165, 74, 0.12), transparent 70%),
    #ffffff;
}

.filter-panel__title-wrap {
  min-width: 0;
}

.filter-panel__kicker {
  display: block;
  margin-bottom: 3px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.filter-panel__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.filter-panel__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
}

.filter-panel__close {
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
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  cursor: pointer;
}

.filter-panel__close:hover {
  color: #fff;
  background: var(--danger);
}

.filter-panel__body {
  flex: 1;
  min-height: 0;
  padding: 0 var(--space-5);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
}

.filter-panel__body::-webkit-scrollbar {
  width: 5px;
}

.filter-panel__body::-webkit-scrollbar-thumb {
  background: var(--line-strong);
  border-radius: 999px;
}

.filter-panel__notice {
  margin: var(--space-3) 0 0;
  padding: var(--space-2) var(--space-3);
  color: var(--danger);
  background: rgba(145, 32, 22, 0.06);
  border: 1px solid rgba(145, 32, 22, 0.16);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: 1.45;
}

.filter-section {
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--line);
}

.filter-section--last {
  border-bottom: 0;
}

.filter-section__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.filter-section__kicker {
  display: block;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.filter-section__head h3 {
  margin: 2px 0 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.3;
}

.filter-section__reset {
  padding: 0;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  border-bottom: 1px solid transparent;
  font-family: var(--font-sans);
  font-size: 10px;
  cursor: pointer;
  white-space: nowrap;
}

.filter-section__reset:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.filter-section__hint {
  margin: var(--space-2) 0 0;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10.5px;
  line-height: 1.45;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-3);
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  color: var(--text-secondary);
  background: #f7f5ef;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 10.5px;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
}

.filter-chip:hover {
  color: var(--ink);
  background: var(--surface-hover);
}

.filter-chip input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.filter-chip__dot {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  background: var(--line-strong);
  border-radius: 50%;
  transition: background-color var(--transition-fast);
}

.filter-chip.is-selected {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.filter-chip.is-selected .filter-chip__dot {
  background: var(--text-on-accent);
}

.filter-chip:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.filter-empty {
  margin-top: var(--space-3);
  padding: var(--space-3);
  color: var(--text-muted);
  background: #f8f7f3;
  border: 1px dashed var(--line);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10.5px;
}

.filter-skeleton {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-3);
}

.filter-skeleton span {
  width: 74px;
  height: 26px;
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, #f1eee6 25%, #faf8f3 50%, #f1eee6 75%);
  background-size: 200% 100%;
  animation: filter-shimmer 1.2s linear infinite;
}

.filter-skeleton--author span {
  width: 100%;
  height: 34px;
  border-radius: var(--radius-md);
}

@keyframes filter-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.filter-author-search {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: var(--space-3);
}

.filter-author-search .icon-search {
  position: absolute;
  left: var(--space-3);
  color: var(--text-muted);
  font-size: var(--text-xs);
  pointer-events: none;
}

.filter-author-search input {
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

.filter-author-search input:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.13);
}

.filter-author-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 172px;
  margin-top: var(--space-2);
  overflow-y: auto;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.filter-author-option {
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

.filter-author-option:last-child {
  border-bottom: 0;
}

.filter-author-option:hover {
  color: var(--ink);
  background: #faf8f2;
}

.filter-author-option__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #9d6d33;
  background: rgba(231, 165, 74, 0.14);
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: 600;
}

.filter-author-option__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-author-option small {
  color: var(--text-muted);
  font-size: 9px;
  white-space: nowrap;
}

.filter-author-selected {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding: 6px var(--space-2);
  background: rgba(231, 165, 74, 0.1);
  border: 1px solid rgba(231, 165, 74, 0.4);
  border-radius: var(--radius-md);
}

.filter-author-selected__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
}

.filter-author-selected__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-author-selected button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: var(--radius-full);
  cursor: pointer;
}

.filter-author-selected button:hover {
  color: var(--danger);
  background: #fff;
}

.filter-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.filter-dates label {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
}

.filter-dates label > span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filter-dates input {
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

.filter-dates input:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.13);
}

.filter-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: var(--space-2);
}

.filter-presets button {
  padding: 4px 8px;
  color: var(--text-secondary);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: 9.5px;
  cursor: pointer;
}

.filter-presets button:hover,
.filter-presets button.is-active {
  color: var(--text-on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.filter-stars {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: var(--space-2);
}

.filter-stars button {
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
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.filter-stars button:hover {
  transform: translateY(-1px);
}

.filter-stars button.is-filled {
  color: var(--warning);
}

.filter-stars > span {
  margin-left: var(--space-2);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.filter-panel__footer {
  flex-shrink: 0;
  padding: var(--space-3) var(--space-5) var(--space-4);
  background: #fff;
  border-top: 1px solid var(--line);
}

.filter-panel__notice--error {
  margin: 0 0 var(--space-2);
  padding: var(--space-2);
  color: var(--danger);
  background: rgba(145, 32, 22, 0.06);
  border: 1px solid rgba(145, 32, 22, 0.16);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
}

.filter-panel__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.filter-panel__reset {
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

.filter-panel__reset:hover {
  color: var(--danger);
  border-color: var(--danger);
}

.filter-panel__apply {
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
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.filter-panel__apply:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.filter-panel__apply span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  color: var(--accent);
  background: var(--text-on-accent);
  border-radius: var(--radius-full);
  font-size: 9px;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .filter-panel {
    max-height: none;
    height: 100%;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .filter-panel__close {
    display: inline-flex;
  }

  .filter-panel__head {
    padding: var(--space-4) var(--space-4) var(--space-3);
  }

  .filter-panel__body {
    padding: 0 var(--space-4);
  }

  .filter-panel__footer {
    padding: var(--space-3) var(--space-4) max(var(--space-4), env(safe-area-inset-bottom));
  }

  .filter-section {
    padding: var(--space-4) 0;
  }
}
</style>
