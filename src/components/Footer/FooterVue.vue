<template>
  <footer class="sf">
    <div class="container-wide sf__top">
      <div class="sf__brand">
        <router-link :to="{ name: 'Home' }" class="sf__logo">
          <span class="sf__logo-mark">
            <img src="/images/logo.svg" alt="" />
          </span>
          <span>
            <strong>Libraria<span>.</span></strong>
            <small>цифровая библиотека</small>
          </span>
        </router-link>

        <p class="sf__about">
          Место, где книги встречаются с читателями. Читайте, сохраняйте
          любимое и обсуждайте прочитанное.
        </p>

        <div class="sf__quote">
          <span aria-hidden="true">“</span>
          История начинается с первой страницы.
        </div>
      </div>

      <div class="sf__columns">
        <nav class="sf__column" aria-label="Библиотека">
          <h4>Библиотека</h4>
          <router-link :to="{ name: 'Home' }">Главная</router-link>
          <router-link :to="{ name: 'Books' }">Книги</router-link>
          <router-link :to="{ name: 'Posts' }">Посты</router-link>
          <router-link v-if="user" :to="{ name: 'PostCreate' }">Написать пост</router-link>
          <router-link v-if="user" :to="{ name: 'BookCreate' }">Добавить книгу</router-link>
        </nav>

        <nav class="sf__column" aria-label="Аккаунт">
          <h4>Аккаунт</h4>
          <template v-if="user">
            <router-link :to="{ name: 'Profile' }">Мой профиль</router-link>
            <button type="button" @click="logout">Выйти</button>
          </template>
          <template v-else>
            <router-link :to="{ name: 'Login' }">Войти</router-link>
            <router-link :to="{ name: 'Registration' }">Создать аккаунт</router-link>
          </template>
        </nav>

        <div class="sf__column sf__column--note">
          <h4>Читайте в своём ритме</h4>
          <p>
            Libraria помогает находить книги, вести читательский дневник
            и делиться впечатлениями с теми, кто читает так же внимательно.
          </p>
          <span class="sf__badge">Онлайн-библиотека</span>
        </div>
      </div>
    </div>

    <div class="container-wide sf__bottom">
      <span>© {{ year }} Libraria. Все права защищены.</span>
      <span class="sf__bottom-note">Сделано с любовью к книгам</span>
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
.sf {
  margin-top: var(--space-16);
  color: #f5efe3;
  background:
    radial-gradient(700px 300px at 88% 0%, rgba(231, 165, 74, 0.12), transparent 65%),
    linear-gradient(150deg, #141719 0%, #1b2023 55%, #22272b 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.sf__top {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.3fr);
  gap: var(--space-12);
  padding-top: var(--space-12);
  padding-bottom: var(--space-10);
}

.sf__brand {
  min-width: 0;
}

.sf__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: inherit;
  text-decoration: none;
}

.sf__logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(231, 165, 74, 0.28);
  border-radius: 13px;
}

.sf__logo-mark img {
  width: 25px;
  height: auto;
}

.sf__logo strong {
  display: block;
  color: #f7f1e6;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1;
}

.sf__logo strong span {
  color: var(--accent);
}

.sf__logo small {
  display: block;
  margin-top: 3px;
  color: rgba(232, 225, 213, 0.42);
  font-family: var(--font-sans);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.sf__about {
  max-width: 420px;
  margin: var(--space-5) 0 0;
  color: rgba(232, 225, 213, 0.58);
  font-family: var(--font-sans);
  font-size: 11px;
  line-height: 1.7;
}

.sf__quote {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--space-5);
  padding: 8px 13px;
  color: rgba(245, 239, 227, 0.65);
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  font-family: var(--font-serif);
  font-size: 10px;
  font-style: italic;
}

.sf__quote span {
  color: var(--accent);
  font-size: 20px;
  line-height: 0.8;
}

.sf__columns {
  display: grid;
  grid-template-columns: 0.75fr 0.75fr 1.3fr;
  gap: var(--space-8);
}

.sf__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.sf__column h4 {
  margin: 0 0 var(--space-2);
  color: var(--accent);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.sf__column a,
.sf__column button {
  padding: 0;
  color: rgba(245, 239, 227, 0.62);
  background: transparent;
  border: 0;
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 400;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.sf__column a:hover,
.sf__column button:hover {
  color: var(--accent);
}

.sf__column--note p {
  margin: 0;
  color: rgba(232, 225, 213, 0.5);
  font-family: var(--font-sans);
  font-size: 10.5px;
  line-height: 1.65;
}

.sf__badge {
  display: inline-flex;
  margin-top: var(--space-2);
  padding: 4px 9px;
  color: rgba(231, 165, 74, 0.85);
  background: rgba(231, 165, 74, 0.08);
  border: 1px solid rgba(231, 165, 74, 0.2);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 8px;
  letter-spacing: 0.04em;
}

.sf__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-4);
  padding-bottom: var(--space-5);
  color: rgba(232, 225, 213, 0.32);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-family: var(--font-sans);
  font-size: 9px;
}

.sf__bottom-note {
  color: rgba(232, 225, 213, 0.24);
}

@media (max-width: 900px) {
  .sf {
    margin-top: var(--space-10);
  }

  .sf__top {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    padding-top: var(--space-8);
  }

  .sf__columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-6);
  }

  .sf__column--note {
    grid-column: 1 / -1;
  }
}

@media (max-width: 520px) {
  .sf__columns {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
  }

  .sf__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
