<template>
  <div class="posts-page">
    <header-vue />

    <main class="posts-page__main">
      <section class="posts-hero">
        <div class="container-wide posts-hero__inner">
          <div class="posts-hero__copy">
            <span class="posts-hero__eyebrow">
              <i aria-hidden="true"></i>
              LIBRARIA · КНИЖНЫЙ БЛОГ
            </span>
            <h1 class="posts-hero__title">
              Посты, <em>которые</em><br />
              хочется обсуждать
            </h1>
            <p class="posts-hero__text">
              Заметки о книгах, авторах и читательском опыте. Делитесь
              впечатлениями, находите единомышленников и открывайте новые истории.
            </p>
            <div class="posts-hero__meta">
              <span><b>{{ heroTotal || '—' }}</b> {{ publicationWord(heroTotal) }}</span>
              <span class="posts-hero__dot" aria-hidden="true"></span>
              <span>живой разговор о литературе</span>
            </div>
          </div>

          <aside class="posts-hero__aside">
            <div class="posts-hero__quote">
              <span class="posts-hero__quote-mark" aria-hidden="true">“</span>
              <p>
                Хорошая книга — это разговор, который начинается с автора
                и продолжается с читателем.
              </p>
              <span class="posts-hero__quote-author">Libraria</span>
            </div>

            <router-link
              v-if="user"
              to="/posts/create"
              class="posts-hero__cta"
            >
              <span class="posts-hero__cta-icon icon-pencil" aria-hidden="true"></span>
              <span>
                <b>Написать пост</b>
                <small>Поделиться мыслями</small>
              </span>
              <span class="posts-hero__cta-arrow icon-right-open" aria-hidden="true"></span>
            </router-link>
            <button
              v-else
              type="button"
              class="posts-hero__cta"
              @click="handleLoginRequired"
            >
              <span class="posts-hero__cta-icon icon-pencil" aria-hidden="true"></span>
              <span>
                <b>Написать пост</b>
                <small>Войдите, чтобы опубликовать</small>
              </span>
              <span class="posts-hero__cta-arrow icon-right-open" aria-hidden="true"></span>
            </button>
          </aside>
        </div>
      </section>

      <section class="posts-page__body">
        <div class="container-wide">
          <PostsContainer />
        </div>
      </section>
    </main>

    <footer-vue />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PostsPage',
  data: () => ({
    heroTotal: 0,
  }),
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('posts', ['totalPosts']),
  },
  watch: {
    totalPosts: {
      immediate: true,
      handler(value) {
        if (Number(value) > this.heroTotal) {
          this.heroTotal = Number(value);
        }
      },
    },
  },
  methods: {
    publicationWord(count) {
      const value = Number(count) || 0;
      const mod10 = value % 10;
      const mod100 = value % 100;

      if (mod10 === 1 && mod100 !== 11) return 'публикация';
      if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'публикации';
      return 'публикаций';
    },
    handleLoginRequired() {
      this.$router.push({ name: 'Login', query: { redirect: '/posts/create' } });
    },
  },
};
</script>

<style scoped>
.posts-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--paper);
}

.posts-page__main {
  flex: 1;
}

/* ============================================================
   Hero
   ============================================================ */
.posts-hero {
  position: relative;
  overflow: hidden;
  padding: var(--space-10) 0 var(--space-8);
  background:
    radial-gradient(900px 380px at 88% -20%, rgba(231, 165, 74, 0.14), transparent 65%),
    radial-gradient(700px 320px at -5% 20%, rgba(6, 105, 108, 0.06), transparent 60%),
    var(--paper);
  border-bottom: 1px solid var(--line);
}

.posts-hero::after {
  content: '';
  position: absolute;
  right: -40px;
  bottom: -60px;
  width: 260px;
  height: 260px;
  border: 1px solid rgba(231, 165, 74, 0.18);
  border-radius: 50%;
  pointer-events: none;
}

.posts-hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr);
  align-items: end;
  gap: var(--space-10);
}

.posts-hero__eyebrow {
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

.posts-hero__eyebrow i {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--accent);
}

.posts-hero__title {
  max-width: 760px;
  margin: var(--space-4) 0 var(--space-4);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(38px, 5.2vw, 64px);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.posts-hero__title em {
  color: var(--accent);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.03em;
}

.posts-hero__text {
  max-width: 560px;
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

.posts-hero__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
}

.posts-hero__meta b {
  margin-right: 2px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
}

.posts-hero__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--line-strong);
}

.posts-hero__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.posts-hero__quote {
  position: relative;
  padding: var(--space-5) var(--space-5) var(--space-4);
  background: var(--ink);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.posts-hero__quote::after {
  content: '';
  position: absolute;
  inset: auto -30px -60px auto;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(231, 165, 74, 0.28), transparent 70%);
}

.posts-hero__quote-mark {
  display: block;
  height: 34px;
  color: var(--accent);
  font-family: var(--font-serif);
  font-size: 62px;
  line-height: 0.9;
}

.posts-hero__quote p {
  position: relative;
  z-index: 1;
  margin: 0 0 var(--space-3);
  color: var(--text-on-dark);
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  font-style: italic;
  line-height: 1.65;
}

.posts-hero__quote-author {
  position: relative;
  z-index: 1;
  color: rgba(232, 225, 213, 0.55);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.posts-hero__cta {
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

.posts-hero__cta:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.posts-hero__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  color: var(--text-on-accent);
  background: var(--accent);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
}

.posts-hero__cta > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.posts-hero__cta b {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
}

.posts-hero__cta small {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
}

.posts-hero__cta-arrow {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 10px;
  transition: transform var(--transition-fast), color var(--transition-fast);
}

.posts-hero__cta:hover .posts-hero__cta-arrow {
  color: var(--accent);
  transform: translateX(2px);
}

/* ============================================================
   Body
   ============================================================ */
.posts-page__body {
  padding: var(--space-8) 0 var(--space-16);
}

@media (max-width: 1024px) {
  .posts-hero__inner {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .posts-hero__aside {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }
}

@media (max-width: 640px) {
  .posts-hero {
    padding: var(--space-6) 0 var(--space-5);
  }

  .posts-hero__title {
    margin: var(--space-3) 0;
    font-size: clamp(32px, 10vw, 42px);
  }

  .posts-hero__text {
    font-size: var(--text-sm);
  }

  .posts-hero__meta {
    margin-top: var(--space-4);
  }

  .posts-hero__aside {
    display: flex;
  }

  .posts-hero__quote {
    display: none;
  }

  .posts-page__body {
    padding: var(--space-5) 0 var(--space-10);
  }
}
</style>
