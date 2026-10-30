<template>
  <section class="auth-section">
    <div class="auth-card">
      <span class="auth-card__kicker">НОВЫЙ ЧИТАТЕЛЬ</span>
      <h1 class="auth-card__title">Регистрация</h1>
      <p class="auth-card__subtitle">Создайте аккаунт — и библиотека запомнит ваши книги и прогресс.</p>

      <div v-if="generalError" class="auth-message auth-message--error" role="alert">
        {{ generalError }}
      </div>

      <form class="auth-form" @submit.prevent="submitRegistration">
        <label class="auth-field" :class="{ 'auth-field--error': errors.name }">
          <span>Имя</span>
          <input
            v-model.trim="userData.name"
            type="text"
            placeholder="Как вас зовут"
            autocomplete="name"
          >
          <small v-if="errors.name" class="auth-field__error">{{ errors.name }}</small>
        </label>

        <label class="auth-field" :class="{ 'auth-field--error': errors.email }">
          <span>Email</span>
          <input
            v-model.trim="userData.email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
          >
          <small v-if="errors.email" class="auth-field__error">{{ errors.email }}</small>
        </label>

        <label class="auth-field" :class="{ 'auth-field--error': errors.password }">
          <span>Пароль</span>
          <input
            v-model="userData.password"
            type="password"
            placeholder="Не менее 4 символов"
            autocomplete="new-password"
          >
          <small v-if="errors.password" class="auth-field__error">{{ errors.password }}</small>
        </label>

        <label class="auth-consent" :class="{ 'auth-consent--error': errors.consent }">
          <input v-model="consent" type="checkbox">
          <span>Даю согласие на обработку персональных данных</span>
        </label>
        <small v-if="errors.consent" class="auth-field__error">{{ errors.consent }}</small>

        <button type="submit" class="auth-submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Создаём аккаунт…" : "Зарегистрироваться" }}
          <span>↗</span>
        </button>
      </form>

      <p class="auth-card__footer">
        Уже есть аккаунт?
        <router-link :to="{ name: 'Login', query: $route.query }">Войти</router-link>
      </p>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RegistrationVue",
  data() {
    return {
      userData: {
        name: "",
        email: "",
        password: "",
      },
      consent: false,
      errors: {},
      generalError: "",
      isSubmitting: false,
    };
  },
  methods: {
    ...mapActions("auth", ["register"]),
    normalizeErrors(error) {
      const serverErrors = error?.errors || {};
      const normalized = {};

      Object.keys(serverErrors).forEach((key) => {
        const value = serverErrors[key];
        normalized[key] = Array.isArray(value) ? value[0] : String(value);
      });

      return normalized;
    },
    validateForm() {
      this.errors = {};
      this.generalError = "";

      if (!this.userData.name) {
        this.errors.name = "Укажите имя.";
      } else if (this.userData.name.length < 5) {
        this.errors.name = "Имя должно содержать не менее 5 символов.";
      } else if (this.userData.name.length > 50) {
        this.errors.name = "Имя должно содержать не более 50 символов.";
      }

      if (!this.userData.email) {
        this.errors.email = "Укажите email.";
      } else if (!/\S+@\S+\.\S+/.test(this.userData.email)) {
        this.errors.email = "Введите корректный email.";
      }

      if (!this.userData.password) {
        this.errors.password = "Укажите пароль.";
      } else if (this.userData.password.length < 4) {
        this.errors.password = "Пароль должен содержать не менее 4 символов.";
      } else if (this.userData.password.length > 40) {
        this.errors.password = "Пароль должен содержать не более 40 символов.";
      }

      if (!this.consent) {
        this.errors.consent = "Необходимо согласие на обработку данных.";
      }

      return Object.keys(this.errors).length === 0;
    },
    async submitRegistration() {
      if (this.isSubmitting || !this.validateForm()) return;

      this.isSubmitting = true;

      try {
        await this.register(this.userData);
        const redirect = this.$route.query.redirect || "/books";
        await this.$router.push(["/login", "/registration"].includes(redirect) ? "/books" : redirect);
      } catch (error) {
        this.errors = this.normalizeErrors(error);
        this.generalError = this.errors.email
          || this.errors.name
          || this.errors.password
          || error?.message
          || "Не удалось зарегистрироваться. Попробуйте ещё раз.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-section {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-10) var(--space-4) var(--space-16);
}

.auth-card {
  width: 100%;
  max-width: 460px;
  padding: var(--space-8);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.auth-card__kicker {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.auth-card__title {
  margin: var(--space-2) 0 var(--space-2);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: 1.15;
}

.auth-card__subtitle {
  margin-bottom: var(--space-5);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.auth-message {
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.5;
}

.auth-message--error {
  color: var(--danger);
  background: rgba(145, 32, 22, 0.08);
  border: 1px solid rgba(145, 32, 22, 0.18);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
}

.auth-field > span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-field input {
  width: 100%;
  height: 44px;
  padding: 0 var(--space-3);
  color: var(--ink);
  background: var(--surface-hover);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  outline: none;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.auth-field input:focus {
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.15);
}

.auth-field--error input {
  border-color: rgba(145, 32, 22, 0.5);
}

.auth-field__error {
  color: var(--danger);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
}

.auth-consent {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  line-height: 1.5;
  cursor: pointer;
}

.auth-consent input {
  margin-top: 2px;
  accent-color: var(--accent);
}

.auth-consent--error {
  color: var(--danger);
}

.auth-submit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 46px;
  margin-top: var(--space-1);
  padding: 0 var(--space-4);
  color: var(--text-on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.auth-submit:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.auth-submit:disabled {
  opacity: 0.65;
  cursor: default;
}

.auth-submit span {
  font-size: var(--text-lg);
}

.auth-card__footer {
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  text-align: center;
}

.auth-card__footer a {
  color: var(--accent-hover);
  font-weight: 500;
  text-decoration: none;
}

.auth-card__footer a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-section {
    padding: var(--space-6) var(--space-3) var(--space-10);
  }

  .auth-card {
    padding: var(--space-5);
  }

  .auth-card__title {
    font-size: var(--text-2xl);
  }
}
</style>
