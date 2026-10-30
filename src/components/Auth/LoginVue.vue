<template>
  <section class="auth-section">
    <div class="auth-card">
      <span class="auth-card__kicker">ДОСТУП К БИБЛИОТЕКЕ</span>
      <h1 class="auth-card__title">Добро пожаловать</h1>
      <p class="auth-card__subtitle">Войдите, чтобы продолжить чтение и вернуться к сохранённым книгам.</p>

      <div v-if="errorMessage" class="auth-message auth-message--error" role="alert">
        {{ errorMessage }}
      </div>

      <form class="auth-form" @submit.prevent="submitLogin">
        <label class="auth-field">
          <span>Email</span>
          <input
            v-model.trim="userData.email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          >
        </label>

        <label class="auth-field">
          <span>Пароль</span>
          <input
            v-model="userData.password"
            type="password"
            placeholder="Ваш пароль"
            autocomplete="current-password"
            required
          >
        </label>

        <div class="auth-options">
          <label class="auth-checkbox">
            <input v-model="rememberMe" type="checkbox">
            <span>Запомнить меня</span>
          </label>
          <a href="mailto:dev.polonkoev@gmail.com?subject=Восстановление%20пароля%20Libraria" class="auth-link">
            Забыли пароль?
          </a>
        </div>

        <button type="submit" class="auth-submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Входим…" : "Войти" }}
          <span>↗</span>
        </button>
      </form>

      <p class="auth-card__footer">
        Нет аккаунта?
        <router-link :to="{ name: 'Registration', query: $route.query }">Зарегистрироваться</router-link>
      </p>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginVue",
  data() {
    return {
      userData: {
        email: "",
        password: "",
      },
      errorMessage: "",
      rememberMe: false,
      isSubmitting: false,
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async submitLogin() {
      if (this.isSubmitting) return;

      this.errorMessage = "";
      this.isSubmitting = true;

      try {
        await this.login(this.userData);
      } catch (error) {
        const errors = error?.errors || {};
        const firstError = Object.values(errors)[0];
        this.errorMessage = Array.isArray(firstError)
          ? firstError[0]
          : firstError || error?.message || "Неверные учётные данные.";
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

.auth-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.auth-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  cursor: pointer;
}

.auth-checkbox input {
  accent-color: var(--accent);
}

.auth-link {
  color: var(--accent-hover);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
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
