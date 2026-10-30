<template>
  <div class="books-page">
    <header-vue />

    <main class="books-page__main">
      <section class="books-hero">
        <div class="container-wide books-hero__inner">
          <div class="books-hero__copy">
            <span class="books-hero__eyebrow">
              <i aria-hidden="true"></i>
              LIBRARIA · КАТАЛОГ
            </span>
            <h1 class="books-hero__title">
              Истории, <em>которые</em><br />
              стоит открыть
            </h1>
            <p class="books-hero__text">
              Найдите книгу под настроение: классика, фантастика, биографии
              и новые голоса — всё в одной библиотеке.
            </p>
            <div class="books-hero__meta">
              <span><b>{{ heroTotal || '—' }}</b> {{ bookWord(heroTotal) }}</span>
              <span class="books-hero__dot" aria-hidden="true"></span>
              <span>живая библиотека</span>
            </div>
          </div>

          <aside class="books-hero__aside">
            <div class="books-hero__quote">
              <span class="books-hero__quote-mark" aria-hidden="true">“</span>
              <p>Книга, которую вы искали, может оказаться на соседней полке.</p>
              <span class="books-hero__quote-author">Libraria</span>
            </div>

            <router-link v-if="user" :to="{ name: 'BookCreate' }" class="books-hero__cta">
              <span class="books-hero__cta-icon icon-pencil" aria-hidden="true"></span>
              <span>
                <b>Добавить книгу</b>
                <small>Поделиться находкой</small>
              </span>
              <span class="books-hero__cta-arrow icon-right-open" aria-hidden="true"></span>
            </router-link>
            <button v-else type="button" class="books-hero__cta" @click="handleLoginRequired">
              <span class="books-hero__cta-icon icon-pencil" aria-hidden="true"></span>
              <span>
                <b>Добавить книгу</b>
                <small>Войдите, чтобы добавить</small>
              </span>
              <span class="books-hero__cta-arrow icon-right-open" aria-hidden="true"></span>
            </button>
          </aside>
        </div>
      </section>

      <section class="books-page__body">
        <div class="container-wide">
          <BooksContainer />
        </div>
      </section>
    </main>

    <footer-vue />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BooksPage',
  data: () => ({
    heroTotal: 0,
  }),
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('books', ['totalBooks']),
  },
  watch: {
    totalBooks: {
      immediate: true,
      handler(value) {
        if (Number(value) > this.heroTotal) this.heroTotal = Number(value);
      },
    },
  },
  methods: {
    handleLoginRequired() {
      this.$router.push({ name: 'Login', query: { redirect: '/books/create' } });
    },
    bookWord(count) {
      const value = Number(count) || 0;
      const mod10 = value % 10;
      const mod100 = value % 100;
      if (mod10 === 1 && mod100 !== 11) return 'книга';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'книги';
      return 'книг';
    },
  },
};
</script>

<style scoped>
.books-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--paper);
}

.books-page__main {
  flex: 1;
}

.books-hero {
  position: relative;
  overflow: hidden;
  padding: var(--space-10) 0 var(--space-8);
  background:
    radial-gradient(900px 380px at 88% -20%, rgba(231, 165, 74, 0.14), transparent 65%),
    radial-gradient(700px 320px at -5% 20%, rgba(6, 105, 108, 0.06), transparent 60%),
    var(--paper);
  border-bottom: 1px solid var(--line);
}

.books-hero::after {
  content: '';
  position: absolute;
  right: -60px;
  bottom: -90px;
  width: 300px;
  height: 300px;
  border: 1px solid rgba(231, 165, 74, 0.18);
  border-radius: 50%;
  pointer-events: none;
}

.books-hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr);
  align-items: end;
  gap: var(--space-10);
}

.books-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.books-hero__eyebrow i {
  width: 22px;
  height: 1px;
  background: var(--accent);
}

.books-hero__title {
  max-width: 760px;
  margin: var(--space-4) 0 var(--space-4);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(38px, 5.2vw, 64px);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.books-hero__title em {
  color: var(--accent);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.books-hero__text {
  max-width: 540px;
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.books-hero__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
}

.books-hero__meta b {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
}

.books-hero__dot {
  width: 3px;
  height: 3px;
  background: var(--line-strong);
  border-radius: 50%;
}

.books-hero__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.books-hero__quote {
  position: relative;
  overflow: hidden;
  padding: var(--space-5);
  color: #f5efe3;
  background:
    radial-gradient(220px 160px at 90% 0%, rgba(231, 165, 74, 0.24), transparent 70%),
    var(--ink);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.books-hero__quote-mark {
  display: block;
  height: 34px;
  color: var(--accent);
  font-family: var(--font-serif);
  font-size: 62px;
  line-height: 0.9;
}

.books-hero__quote p {
  margin: 0 0 var(--space-3);
  color: var(--text-on-dark);
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  font-style: italic;
  line-height: 1.65;
}

.books-hero__quote-author {
  color: rgba(232, 225, 213, 0.5);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.books-hero__cta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  text-align: left;
  cursor: pointer;
  transition: border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.books-hero__cta:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.books-hero__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: 50%;
  font-size: var(--text-base);
}

.books-hero__cta > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.books-hero__cta b {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
}

.books-hero__cta small {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.books-hero__cta-arrow {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 9px;
  transition: transform var(--transition-fast), color var(--transition-fast);
}

.books-hero__cta:hover .books-hero__cta-arrow {
  color: var(--accent);
  transform: translateX(2px);
}

.books-page__body {
  padding: var(--space-8) 0 var(--space-16);
}

@media (max-width: 1024px) {
  .books-hero__inner {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .books-hero__aside {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }
}

@media (max-width: 640px) {
  .books-hero {
    padding: var(--space-6) 0 var(--space-5);
  }

  .books-hero__title {
    margin: var(--space-3) 0;
    font-size: clamp(32px, 10vw, 42px);
  }

  .books-hero__text {
    font-size: var(--text-sm);
  }

  .books-hero__meta {
    margin-top: var(--space-4);
  }

  .books-hero__aside {
    display: flex;
  }

  .books-hero__quote {
    display: none;
  }

  .books-page__body {
    padding: var(--space-5) 0 var(--space-10);
  }
}
</style>
