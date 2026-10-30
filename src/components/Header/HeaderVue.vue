<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled, 'is-open': mobileOpen }">
    <div class="site-header__inner">
      <router-link :to="{ name: 'Home' }" class="site-brand" aria-label="Libraria — главная">
        <span class="site-brand__mark">
          <img src="/images/logo.svg" alt="" class="site-brand__logo" />
        </span>
        <span class="site-brand__text">
          <strong>Libraria<span>.</span></strong>
          <small>цифровая библиотека</small>
        </span>
      </router-link>

      <nav class="site-nav" aria-label="Основная навигация">
        <router-link :to="{ name: 'Home' }" class="site-nav__link">
          Главная
          <span class="site-nav__dot" aria-hidden="true"></span>
        </router-link>
        <router-link :to="{ name: 'Books' }" class="site-nav__link">
          Книги
          <span class="site-nav__dot" aria-hidden="true"></span>
        </router-link>
        <router-link :to="{ name: 'Posts' }" class="site-nav__link">
          Посты
          <span class="site-nav__dot" aria-hidden="true"></span>
        </router-link>
      </nav>

      <div class="site-header__actions">
        <template v-if="user">
          <router-link :to="{ name: 'PostCreate' }" class="site-write">
            <span class="icon-pencil" aria-hidden="true"></span>
            <span>Написать</span>
          </router-link>
          <user-avatar :user="user" @logout="handleLogout" />
        </template>

        <template v-else>
          <router-link :to="{ name: 'Login' }" class="site-login">Войти</router-link>
          <router-link :to="{ name: 'Registration' }" class="site-register">Регистрация</router-link>
        </template>

        <button
          type="button"
          class="site-burger"
          :class="{ 'is-active': mobileOpen }"
          :aria-expanded="mobileOpen"
          aria-controls="site-mobile-menu"
          aria-label="Меню"
          @click="toggleMobile"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <transition name="site-menu">
      <div v-if="mobileOpen" id="site-mobile-menu" class="site-mobile">
        <div class="site-mobile__inner">
          <div v-if="user" class="site-mobile__profile">
            <div class="site-mobile__avatar">
              <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
              <span v-else>{{ userInitials }}</span>
            </div>
            <div class="site-mobile__profile-info">
              <strong>{{ user.name }}</strong>
              <span>{{ user.email }}</span>
            </div>
            <router-link :to="{ name: 'Profile' }" class="site-mobile__profile-link">
              Профиль
              <span class="icon-right-open" aria-hidden="true"></span>
            </router-link>
          </div>

          <nav class="site-mobile__nav" aria-label="Мобильная навигация">
            <router-link :to="{ name: 'Home' }" class="site-mobile__link">
              <span class="site-mobile__number">01</span>
              <span>Главная</span>
              <span class="icon-right-open" aria-hidden="true"></span>
            </router-link>
            <router-link :to="{ name: 'Books' }" class="site-mobile__link">
              <span class="site-mobile__number">02</span>
              <span>Книги</span>
              <span class="icon-right-open" aria-hidden="true"></span>
            </router-link>
            <router-link :to="{ name: 'Posts' }" class="site-mobile__link">
              <span class="site-mobile__number">03</span>
              <span>Посты</span>
              <span class="icon-right-open" aria-hidden="true"></span>
            </router-link>
            <router-link v-if="user" :to="{ name: 'Profile' }" class="site-mobile__link">
              <span class="site-mobile__number">04</span>
              <span>Профиль</span>
              <span class="icon-right-open" aria-hidden="true"></span>
            </router-link>
          </nav>

          <div class="site-mobile__actions">
            <router-link
              v-if="user"
              :to="{ name: 'PostCreate' }"
              class="site-mobile__primary"
            >
              <span class="icon-pencil" aria-hidden="true"></span>
              Написать пост
            </router-link>
            <button v-if="user" type="button" class="site-mobile__logout" @click="handleLogout">
              Выйти из аккаунта
            </button>

            <template v-else>
              <router-link :to="{ name: 'Login' }" class="site-mobile__primary">
                Войти в библиотеку
              </router-link>
              <router-link :to="{ name: 'Registration' }" class="site-mobile__secondary">
                Создать аккаунт
              </router-link>
            </template>
          </div>

          <p class="site-mobile__note">
            Libraria — место для книг, заметок и разговоров о прочитанном.
          </p>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
import Cookies from 'js-cookie';
import { mapActions, mapGetters } from 'vuex';
import UserAvatar from './User/UserAvatar.vue';

export default {
  name: 'HeaderVue',
  components: {
    UserAvatar,
  },
  data() {
    return {
      scrolled: false,
      mobileOpen: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    userInitials() {
      return String(this.user?.name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },
  },
  watch: {
    '$route.fullPath'() {
      this.closeMobile();
    },
    mobileOpen(value) {
      document.body.style.overflow = value ? 'hidden' : '';
    },
  },
  mounted() {
    if (Cookies.get('auth_token') && !this.user) {
      this.fetchUser();
    }

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', this.handleKeydown);
    this.handleScroll();
  },
  beforeUnmount() {
    document.body.style.overflow = '';
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout',
      fetchUser: 'auth/fetchUser',
    }),
    handleScroll() {
      this.scrolled = window.scrollY > 8;
    },
    handleResize() {
      if (window.innerWidth > 900) {
        this.closeMobile();
      }
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.closeMobile();
      }
    },
    toggleMobile() {
      this.mobileOpen = !this.mobileOpen;
    },
    closeMobile() {
      this.mobileOpen = false;
    },
    async handleLogout() {
      this.closeMobile();
      await this.logout();
    },
  },
};
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  color: #f5efe3;
  background:
    radial-gradient(900px 150px at 84% -35%, rgba(231, 165, 74, 0.16), transparent 70%),
    linear-gradient(120deg, #141719 0%, #1b2023 52%, #23282c 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  transition: box-shadow var(--transition-base), background-color var(--transition-base);
}

.site-header::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, transparent 2%, var(--accent) 28%, #f4cd87 50%, var(--accent) 72%, transparent 98%);
  opacity: 0.75;
  pointer-events: none;
}

.site-header.is-scrolled {
  box-shadow: 0 14px 34px rgba(12, 14, 15, 0.25);
}

.site-header__inner {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  width: 100%;
  max-width: 1280px;
  height: var(--header-height);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Brand */
.site-brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
  color: inherit;
  text-decoration: none;
}

.site-brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(231, 165, 74, 0.28);
  border-radius: 13px;
  transition: background-color var(--transition-fast), transform var(--transition-fast), border-color var(--transition-fast);
}

.site-brand:hover .site-brand__mark {
  background: rgba(231, 165, 74, 0.14);
  border-color: rgba(231, 165, 74, 0.6);
  transform: rotate(-3deg);
}

.site-brand__logo {
  width: 26px;
  height: auto;
}

.site-brand__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1;
}

.site-brand__text strong {
  color: #f7f1e6;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.035em;
}

.site-brand__text strong span {
  color: var(--accent);
}

.site-brand__text small {
  color: rgba(232, 225, 213, 0.48);
  font-family: var(--font-sans);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* Desktop nav */
.site-nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.site-nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 38px;
  padding: 0 var(--space-4);
  color: rgba(245, 239, 227, 0.7);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.site-nav__link:hover {
  color: #f7f1e6;
  background: rgba(255, 255, 255, 0.055);
}

.site-nav__link.router-link-active {
  color: var(--accent);
  background: rgba(231, 165, 74, 0.1);
}

.site-nav__dot {
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.site-nav__link.router-link-active .site-nav__dot {
  opacity: 1;
  transform: scale(1);
}

/* Right actions */
.site-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
  flex-shrink: 0;
}

.site-write {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 38px;
  padding: 0 var(--space-4);
  color: #17191b;
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 6px 18px rgba(231, 165, 74, 0.18);
  transition: background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.site-write:hover {
  background: #f0b35e;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(231, 165, 74, 0.25);
}

.site-write span:first-child {
  font-size: 12px;
}

.site-login {
  padding: 0 var(--space-2);
  color: rgba(245, 239, 227, 0.72);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.site-login:hover {
  color: var(--accent);
}

.site-register {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 var(--space-4);
  color: #f7f1e6;
  border: 1px solid rgba(245, 239, 227, 0.24);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast);
}

.site-register:hover {
  color: var(--accent);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(231, 165, 74, 0.6);
}

/* Burger */
.site-burger {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  margin-left: var(--space-1);
  border: 1px solid rgba(245, 239, 227, 0.16);
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.site-burger:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(231, 165, 74, 0.5);
}

.site-burger span {
  display: block;
  width: 16px;
  height: 1.5px;
  background: #f5efe3;
  border-radius: 2px;
  transition: transform var(--transition-base), opacity var(--transition-base);
}

.site-burger.is-active span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}

.site-burger.is-active span:nth-child(2) {
  opacity: 0;
}

.site-burger.is-active span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* Mobile menu */
.site-mobile {
  position: fixed;
  top: var(--header-height);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 990;
  overflow-y: auto;
  color: #f5efe3;
  background:
    radial-gradient(700px 380px at 90% -5%, rgba(231, 165, 74, 0.16), transparent 65%),
    linear-gradient(145deg, #141719 0%, #1b2023 60%, #22272b 100%);
}

.site-mobile__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  max-width: 560px;
  min-height: 100%;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5) var(--space-10);
}

.site-mobile__profile {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
}

.site-mobile__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  overflow: hidden;
  color: #17191b;
  background: linear-gradient(135deg, #f2c987, var(--accent));
  border: 2px solid rgba(231, 165, 74, 0.55);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
}

.site-mobile__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.site-mobile__profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.site-mobile__profile-info strong {
  overflow: hidden;
  color: #f7f1e6;
  font-family: var(--font-display);
  font-size: var(--text-base);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-mobile__profile-info span {
  overflow: hidden;
  color: rgba(232, 225, 213, 0.52);
  font-family: var(--font-sans);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-mobile__profile-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 6px 10px;
  color: var(--accent);
  border: 1px solid rgba(231, 165, 74, 0.3);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.site-mobile__profile-link span {
  font-size: 8px;
}

.site-mobile__nav {
  display: flex;
  flex-direction: column;
}

.site-mobile__link {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-2);
  color: #f5efe3;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-display);
  font-size: clamp(24px, 6vw, 32px);
  font-weight: 500;
  letter-spacing: -0.03em;
  text-decoration: none;
  transition: color var(--transition-fast), padding-left var(--transition-fast);
}

.site-mobile__link:hover,
.site-mobile__link.router-link-active {
  color: var(--accent);
  padding-left: var(--space-4);
}

.site-mobile__number {
  color: rgba(231, 165, 74, 0.6);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.site-mobile__link span:last-child {
  margin-left: auto;
  color: rgba(245, 239, 227, 0.35);
  font-size: 11px;
}

.site-mobile__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.site-mobile__primary,
.site-mobile__secondary,
.site-mobile__logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 50px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.site-mobile__primary {
  color: #17191b;
  background: var(--accent);
  border: 1px solid var(--accent);
}

.site-mobile__secondary {
  color: #f5efe3;
  background: transparent;
  border: 1px solid rgba(245, 239, 227, 0.2);
}

.site-mobile__logout {
  color: rgba(245, 239, 227, 0.58);
  background: transparent;
  border: 1px solid transparent;
  font-weight: 500;
}

.site-mobile__logout:hover {
  color: #f5efe3;
}

.site-mobile__note {
  margin: auto 0 0;
  color: rgba(232, 225, 213, 0.34);
  font-family: var(--font-sans);
  font-size: 10px;
  line-height: 1.6;
}

.site-menu-enter-active,
.site-menu-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.site-menu-enter-from,
.site-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 900px) {
  .site-mobile {
    top: 64px;
  }

  .site-header__inner {
    height: 64px;
    gap: var(--space-3);
    padding: 0 var(--space-4);
  }

  .site-brand__mark {
    width: 36px;
    height: 36px;
    border-radius: 11px;
  }

  .site-brand__logo {
    width: 22px;
  }

  .site-brand__text strong {
    font-size: 18px;
  }

  .site-brand__text small {
    display: none;
  }

  .site-nav {
    display: none;
  }

  .site-write,
  .site-login,
  .site-register {
    display: none;
  }

  .site-burger {
    display: flex;
  }

  .site-header__actions {
    gap: var(--space-2);
  }
}

@media (max-width: 360px) {
  .site-brand__text {
    display: none;
  }
}
</style>
