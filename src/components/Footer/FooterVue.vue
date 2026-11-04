<template>
  <footer class="site-footer">
    <div class="footer__inner">
      <div class="footer__grid">
        <div class="footer__brand">
          <router-link :to="{ name: 'Home' }" class="footer__logo" aria-label="Libraria — на главную">
            <span class="footer__logo-mark">
              <img src="/images/logo.svg" alt="" />
            </span>
            <strong>Libraria</strong>
          </router-link>

          <p class="footer__about">
            Цифровая библиотека и сообщество читателей: книги по главам, посты о
            прочитанном и живые обсуждения.
          </p>

          <blockquote class="footer__quote">
            <p>«Хорошая книга — точно беседа с умным человеком».</p>
            <cite>— Л. Толстой</cite>
          </blockquote>
        </div>

        <nav class="footer__col" aria-label="Библиотека">
          <h3>Библиотека</h3>
          <router-link :to="{ name: 'Home' }">Главная</router-link>
          <router-link :to="{ name: 'Books' }">Книги</router-link>
          <router-link :to="{ name: 'Posts' }">Посты</router-link>
          <router-link :to="{ name: 'PostCreate' }">Написать пост</router-link>
          <router-link :to="{ name: 'BookCreate' }">Добавить книгу</router-link>
        </nav>

        <nav class="footer__col" aria-label="Аккаунт">
          <h3>Аккаунт</h3>
          <template v-if="user">
            <router-link :to="{ name: 'Profile' }">Мой профиль</router-link>
            <button type="button" @click="logout">Выйти</button>
          </template>
          <template v-else>
            <router-link :to="{ name: 'Login' }">Войти</router-link>
            <router-link :to="{ name: 'Registration' }">Регистрация</router-link>
          </template>
        </nav>

        <aside class="footer__note">
          <h3>Читайте в своём ритме</h3>
          <p>
            Библиотека запоминает последнюю открытую главу — можно вернуться к
            книге в любой момент и продолжить с того же места.
          </p>
        </aside>
      </div>

      <div class="footer__bottom">
        <span>© {{ year }} Libraria. Все права защищены.</span>
        <span>Сделано для внимательного чтения</span>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'FooterVue',
  computed: {
    ...mapGetters('auth', ['user']),
    year() {
      return new Date().getFullYear();
    },
  },
  methods: {
    ...mapActions('auth', ['logout']),
  },
};
</script>

<style scoped>
.site-footer {
  background: var(--cream);
  color: var(--ink);
  border-top: 1px solid var(--line);
}

.footer__inner {
  box-sizing: border-box;
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer__grid {
  display: grid;
  grid-template-columns: 34.4% 17.3% 17.2% 31.1%;
  gap: 0;
  padding: 56px 0 48px;
}

.footer__brand {
  min-width: 0;
  padding-right: 40px;
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  text-decoration: none;
}

.footer__logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--accent);
}

.footer__logo-mark img {
  width: 18px;
  height: 18px;
}

.footer__logo strong {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.footer__about {
  max-width: 280px;
  margin: 18px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.footer__quote {
  max-width: 340px;
  margin: 22px 0 0;
  padding-left: 16px;
  border-left: 1px solid var(--gold);
}

.footer__quote p {
  margin: 0;
  font-family: var(--font-display);
  font-size: 14px;
  font-style: italic;
  line-height: 1.45;
  color: var(--text-secondary);
}

.footer__quote cite {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-style: normal;
  color: var(--text-muted);
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}

.footer__col h3 {
  margin: 0 0 8px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}

.footer__col a,
.footer__col button {
  width: fit-content;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--text-secondary);
  background: none;
  border: 0;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer__col a:hover,
.footer__col button:hover {
  color: var(--accent);
}

.footer__note {
  min-height: 152px;
  padding: 26px 24px;
  border-radius: 14px;
  background: var(--paper);
}

.footer__note h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.footer__note p {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 0;
  font-size: 12px;
  color: var(--text-muted);
  border-top: 1px solid var(--line);
}

@media (max-width: 1024px) {
  .footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    padding: 40px 0 32px;
  }

  .footer__brand {
    padding-right: 0;
  }

  .footer__note {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .footer__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .footer__note {
    grid-column: auto;
  }

  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
