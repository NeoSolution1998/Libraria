<template>
  <div class="books-list">
    <!-- Featured book -->
    <article v-if="featuredBook" class="bf-book">
      <div class="bf-book__content">
        <div class="bf-book__top">
          <span class="bf-book__label"><i aria-hidden="true"></i> ВЫБОР LIBRARIA</span>
          <div v-if="bookCategories(featuredBook).length" class="bf-book__tags">
            <span v-for="category in bookCategories(featuredBook).slice(0, 2)" :key="category.id">
              #{{ category.name }}
            </span>
          </div>
        </div>

        <h2 class="bf-book__title">
          <router-link :to="bookLink(featuredBook)">{{ featuredBook.title }}</router-link>
        </h2>
        <p class="bf-book__author">{{ featuredBook.author || 'Автор не указан' }}</p>
        <p class="bf-book__excerpt">{{ excerpt(featuredBook.description, 260) }}</p>

        <div class="bf-book__meta">
          <span v-if="bookRating(featuredBook)" class="bf-book__rating">
            <span class="icon-star" aria-hidden="true"></span>
            {{ bookRating(featuredBook) }}
          </span>
          <span><span class="icon-eye" aria-hidden="true"></span> {{ formatNumber(featuredBook.views_count) }}</span>
          <span><span class="icon-th-list" aria-hidden="true"></span> {{ featuredBook.chapters_count || 0 }} глав</span>
        </div>

        <div class="bf-book__footer">
          <router-link :to="bookLink(featuredBook)" class="bf-book__read">
            Открыть книгу
            <span class="icon-right-open" aria-hidden="true"></span>
          </router-link>
        </div>
      </div>

      <router-link
        :to="bookLink(featuredBook)"
        class="bf-book__cover"
        :style="bookGradient(featuredBook)"
        :aria-label="`Открыть книгу: ${featuredBook.title}`"
      >
        <img v-if="featuredBook.cover_image" :src="featuredBook.cover_image" :alt="featuredBook.title" @error="featuredBook.cover_image = null" loading="eager" />
        <template v-else>
          <span class="bf-book__cover-initial" aria-hidden="true">{{ initialOf(featuredBook.title) }}</span>
          <span class="bf-book__cover-quote" aria-hidden="true">“</span>
        </template>
        <span v-if="firstCategory(featuredBook)" class="bf-book__cover-caption">{{ firstCategory(featuredBook) }}</span>
      </router-link>
    </article>

    <!-- Book grid -->
    <div v-if="gridBooks.length" class="books-grid">
      <article
        v-for="book in gridBooks"
        :key="book.id"
        class="book-card"
      >
        <router-link
          :to="bookLink(book)"
          class="book-card__cover"
          :style="bookGradient(book)"
          :aria-label="`Открыть книгу: ${book.title}`"
        >
          <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" @error="book.cover_image = null" loading="lazy" />
          <template v-else>
            <span class="book-card__initial" aria-hidden="true">{{ initialOf(book.title) }}</span>
            <span class="book-card__quote" aria-hidden="true">“</span>
          </template>
          <span v-if="firstCategory(book)" class="book-card__tag">{{ firstCategory(book) }}</span>
        </router-link>

        <div class="book-card__body">
          <h3><router-link :to="bookLink(book)">{{ book.title }}</router-link></h3>
          <p class="book-card__author">{{ book.author || 'Автор не указан' }}</p>
          <p class="book-card__excerpt">{{ excerpt(book.description, 90) }}</p>

          <div class="book-card__meta">
            <span v-if="bookRating(book)" class="book-card__rating">
              <span class="icon-star" aria-hidden="true"></span>
              {{ bookRating(book) }}
            </span>
            <span><span class="icon-eye" aria-hidden="true"></span> {{ formatNumber(book.views_count) }}</span>
            <span v-if="book.chapters_count"><span class="icon-th-list" aria-hidden="true"></span> {{ book.chapters_count }}</span>
          </div>

          <div v-if="bookCategories(book).length" class="book-card__tags">
            <span v-for="category in bookCategories(book).slice(0, 2)" :key="category.id || category.name">
              #{{ category.name }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #20262b 0%, #3a3025 58%, #a97436 140%)',
  'linear-gradient(135deg, #1e2a28 0%, #2e3a31 55%, #8b7a4a 140%)',
  'linear-gradient(135deg, #2a2024 0%, #3b2b2b 55%, #b8793d 140%)',
  'linear-gradient(135deg, #242a35 0%, #1e242c 55%, #6f7d64 140%)',
  'linear-gradient(135deg, #302a20 0%, #1f2326 55%, #c18a42 140%)',
];

export default {
  name: 'BooksListComponent',
  computed: {
    ...mapState('books', ['books', 'currentPage']),
    ...mapGetters('books', ['searchQuery', 'selectedCategoryIds', 'authorName', 'startDate', 'endDate', 'minRating']),
    hasFilters() {
      return Boolean(
        this.searchQuery ||
        this.selectedCategoryIds.length ||
        this.authorName ||
        this.startDate ||
        this.endDate ||
        this.minRating > 0
      );
    },
    showFeatured() {
      return false;
    },
    featuredBook() {
      if (!this.showFeatured) return null;

      const curated = this.books.find((book) => {
        const description = String(book.description || '').trim();
        return description.length >= 80 || Number(book.average_rating) > 0 || Number(book.rating) > 0;
      });

      return curated || this.books[0];
    },
    gridBooks() {
      if (!this.showFeatured || !this.featuredBook) return this.books;
      return this.books.filter((book) => Number(book.id) !== Number(this.featuredBook.id));
    },
  },
  methods: {
    bookLink(book) {
      return { name: 'Book', params: { id: book.id } };
    },
    bookCategories(book) {
      if (Array.isArray(book.categories)) return book.categories;
      if (Array.isArray(book.tags)) return book.tags;
      return [];
    },
    firstCategory(book) {
      return this.bookCategories(book)[0]?.name || '';
    },
    initialOf(title) {
      return String(title || 'L').trim().slice(0, 1).toUpperCase();
    },
    bookGradient(book) {
      const index = Math.abs(Number(book.id) || 0) % CARD_GRADIENTS.length;
      return { background: CARD_GRADIENTS[index] };
    },
    bookRating(book) {
      const rating = Number(book.average_rating) || Number(book.rating) || 0;
      return rating > 0 ? rating.toFixed(1) : '';
    },
    excerpt(value, maxLength) {
      const text = String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (text.length <= maxLength) return text;
      return `${text.slice(0, maxLength).trim()}…`;
    },
    formatNumber(value) {
      const num = Number(value) || 0;
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return String(num);
    },
  },
};
</script>

<style scoped>
.books-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  min-width: 0;
}

/* Featured */
.bf-book {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(220px, 0.8fr);
  min-height: 330px;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.bf-book:hover {
  border-color: rgba(231, 165, 74, 0.5);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.bf-book__content {
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
  min-width: 0;
}

.bf-book__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.bf-book__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: #9d6d33;
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.bf-book__label i {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.16);
}

.bf-book__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.bf-book__tags span {
  padding: 3px 7px;
  color: var(--text-secondary);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 9px;
}

.bf-book__title {
  overflow-wrap: anywhere;
  margin: 0 0 3px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.bf-book__title a {
  color: inherit;
  text-decoration: none;
}

.bf-book__title a:hover {
  color: var(--accent-hover);
}

.bf-book__author {
  margin: 0 0 var(--space-3);
  color: #9d6d33;
  font-family: var(--font-sans);
  font-size: 11px;
}

.bf-book__excerpt {
  display: -webkit-box;
  margin: 0 0 var(--space-4);
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.65;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.bf-book__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--line);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.bf-book__meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.bf-book__rating {
  color: #9d6d33 !important;
}

.bf-book__footer {
  margin-top: var(--space-3);
}

.bf-book__read {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 2px;
}

.bf-book__read:hover {
  color: var(--accent-hover);
}

.bf-book__read span {
  font-size: 8px;
}

.bf-book__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.13);
  text-decoration: none;
}

.bf-book__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 35%, rgba(10, 12, 13, 0.45)),
    radial-gradient(220px 180px at 80% 10%, rgba(255, 255, 255, 0.13), transparent 70%);
}

.bf-book__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bf-book__cover-initial {
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: 190px;
  font-weight: 700;
  line-height: 1;
}

.bf-book__cover-quote {
  position: absolute;
  z-index: 1;
  right: 18px;
  bottom: 26px;
  color: rgba(231, 165, 74, 0.72);
  font-family: var(--font-serif);
  font-size: 82px;
  line-height: 0.7;
}

.bf-book__cover-caption {
  position: absolute;
  z-index: 2;
  bottom: var(--space-4);
  left: var(--space-5);
  color: rgba(246, 239, 226, 0.7);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

/* Grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
}

.book-card {
  min-width: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  overflow: visible;
  transition: transform var(--transition-fast);
}

.book-card:hover {
  box-shadow: none;
  transform: translateY(-2px);
}

.book-card__cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4.1;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.13);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 22px rgba(25, 27, 28, 0.13);
  text-decoration: none;
  transition: box-shadow var(--transition-fast);
}

.book-card:hover .book-card__cover {
  box-shadow: 0 16px 30px rgba(25, 27, 28, 0.2);
}

.book-card__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-card__initial {
  font-family: var(--font-display);
  font-size: 76px;
  font-weight: 700;
  line-height: 1;
}

.book-card__quote {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: rgba(231, 165, 74, 0.7);
  font-family: var(--font-serif);
  font-size: 34px;
  line-height: 0.7;
}

.book-card__tag {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 2;
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

.book-card__body {
  padding-top: var(--space-2);
}

.book-card__body h3 {
  display: -webkit-box;
  margin: 0 0 2px;
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-card__body h3 a {
  color: inherit;
  text-decoration: none;
}

.book-card__body h3 a:hover {
  color: var(--accent-hover);
}

.book-card__author {
  margin: 0 0 4px;
  overflow: hidden;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-card__excerpt {
  display: -webkit-box;
  margin: 0 0 6px;
  overflow: hidden;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 8.5px;
  line-height: 1.5;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
}

.book-card__meta span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.book-card__rating {
  color: #9d6d33 !important;
}

.book-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.book-card__tags span {
  padding: 2px 6px;
  color: var(--text-muted);
  background: var(--paper);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8px;
}

@media (max-width: 900px) {
  .books-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .bf-book {
    grid-template-columns: minmax(0, 1fr) 200px;
    min-height: 300px;
  }

  .bf-book__content {
    padding: var(--space-5);
  }

  .bf-book__title {
  overflow-wrap: anywhere;
    font-size: 23px;
  }
}

@media (max-width: 700px) {
  .bf-book {
    grid-template-columns: 1fr;
  }

  .bf-book__cover {
    order: -1;
    width: min(190px, 58%);
    height: auto;
    min-height: 0;
    max-height: none;
    aspect-ratio: 3 / 4.1;
    margin: var(--space-3) auto 0;
    border-radius: var(--radius-lg);
  }

  .bf-book__cover-initial {
    font-size: 150px;
  }

  .bf-book__cover-quote {
    font-size: 64px;
  }

  .bf-book__content {
    padding: var(--space-4);
  }

  .books-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 360px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Mockup: compact catalogue cards ── */
.book-card__excerpt, .book-card__tags { display: none; }
.book-card__body { padding-top: 9px; }
.book-card__body h3 { margin: 0 0 4px; font-family: var(--font-display); font-size: 19px; line-height: 1.15; }
.book-card__author { margin-bottom: 8px; }
.book-card__meta { margin-top: 0; }
</style>
