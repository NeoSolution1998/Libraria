<template>
  <div class="auth">
    <router-link :to="{ name: 'Home' }" class="auth__brand">
      <span class="auth__mark">
        <img src="/images/logo.svg" alt="" />
      </span>
      <strong>Libraria</strong>
    </router-link>

    <p class="auth__lead">Вернитесь к своей следующей главе</p>

    <form class="auth-card" @submit.prevent="submit">
      <h1>Вход в аккаунт</h1>

      <label class="field">
        <span class="field__label">Электронная почта</span>
        <span class="field__control">
          <span class="icon-mail-alt field__icon" aria-hidden="true"></span>
          <input
            v-model.trim="form.email"
            type="email"
            placeholder="example@mail.com"
            autocomplete="email"
            required
          />
        </span>
      </label>

      <label class="field">
        <span class="field__label">
          Пароль
          <router-link :to="{ name: 'Login' }" class="field__hint">Забыли пароль?</router-link>
        </span>
        <span class="field__control">
          <span class="icon-lock field__icon" aria-hidden="true"></span>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
          <button type="button" class="field__eye" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'" @click="showPassword = !showPassword">
            <span :class="showPassword ? 'icon-eye-off' : 'icon-eye'" aria-hidden="true"></span>
          </button>
        </span>
      </label>

      <label class="check">
        <input v-model="form.remember" type="checkbox" />
        <span>Запомнить меня на этом устройстве</span>
      </label>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <button type="submit" class="auth-submit" :disabled="sending">
        {{ sending ? 'Входим…' : 'Войти' }}
      </button>

      <div class="auth-or"><span>или</span></div>

      <div class="auth-socials">
        <button type="button" class="auth-social" disabled>
          <b>G</b>
          Google
        </button>
        <button type="button" class="auth-social" disabled>
          <b>Я</b>
          Яндекс
        </button>
      </div>
    </form>

    <p class="auth-alt">
      Ещё нет аккаунта?
      <router-link :to="{ name: 'Registration' }">Создать сейчас</router-link>
    </p>

    <p class="auth-quote">
      «Книги — это зеркало. И если в него смотрится обезьяна, то из него не может выглянуть лик апостола».
      <span>— Георг Кристоф Лихтенберг</span>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginPage',
  data() {
    return {
      form: { email: '', password: '', remember: true },
      showPassword: false,
      sending: false,
      error: '',
    };
  },
  methods: {
    ...mapActions('auth', ['login']),

    async submit() {
      if (this.sending) return;
      this.sending = true;
      this.error = '';

      try {
        await this.login({ email: this.form.email, password: this.form.password });
      } catch (e) {
        this.error = e?.message || 'Не удалось войти. Проверьте почту и пароль.';
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 46px 24px 56px;
  background: var(--paper);
}

.auth__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  text-decoration: none;
}

.auth__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: var(--accent);
  border-radius: 8px;
}

.auth__mark img {
  width: 19px;
  height: 19px;
}

.auth__brand strong {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.auth__lead {
  margin: 18px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.auth-card {
  box-sizing: border-box;
  width: 477px;
  max-width: 100%;
  margin-top: 34px;
  padding: 34px 40px 30px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(30, 33, 36, 0.05);
}

.auth-card h1 {
  margin: 0 0 26px;
  font-family: var(--font-display);
  font-size: 27px;
  font-weight: 500;
  letter-spacing: -0.02em;
  text-align: center;
  color: var(--ink);
}

.field {
  display: block;
  margin-bottom: 16px;
}

.field__label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 7px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.field__hint {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  color: var(--text-secondary);
  text-decoration: none;
}

.field__hint:hover {
  color: var(--accent);
}

.field__control {
  position: relative;
  display: flex;
  align-items: center;
}

.field__icon {
  position: absolute;
  left: 14px;
  font-size: 13px;
  color: var(--text-muted);
}

.field__control input {
  width: 100%;
  height: 46px;
  padding: 0 40px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink);
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
}

.field__control input:focus {
  border-color: var(--accent);
}

.field__eye {
  position: absolute;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 13px;
  color: var(--text-muted);
  background: none;
  border: 0;
  cursor: pointer;
}

.check {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 4px 0 20px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.check input {
  width: 15px;
  height: 15px;
  accent-color: var(--accent);
}

.auth-error {
  margin: 0 0 14px;
  font-size: 12px;
  color: var(--danger);
}

.auth-submit {
  width: 100%;
  height: 46px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-on-accent);
  background: var(--accent);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.auth-submit:hover:not(:disabled) {
  background: var(--accent-hover);
}

.auth-submit:disabled {
  opacity: 0.7;
  cursor: default;
}

.auth-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  font-size: 11px;
  color: var(--text-muted);
}

.auth-or::before,
.auth-or::after {
  flex: 1;
  height: 1px;
  background: var(--line);
  content: '';
}

.auth-socials {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.auth-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  cursor: pointer;
}

.auth-social b {
  font-size: 12px;
}

.auth-alt {
  margin: 26px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.auth-alt a {
  margin-left: 4px;
  font-weight: 500;
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid var(--line-strong);
}

.auth-quote {
  max-width: 520px;
  margin: 40px 0 0;
  font-family: var(--font-display);
  font-size: 12px;
  font-style: italic;
  line-height: 1.6;
  text-align: center;
  color: var(--text-muted);
}

.auth-quote span {
  display: block;
  margin-top: 6px;
  font-style: normal;
  font-size: 10px;
  letter-spacing: 0.04em;
}

@media (max-width: 560px) {
  .auth {
    padding: 28px 16px 40px;
  }

  .auth-card {
    padding: 26px 20px 24px;
  }

  .auth-card h1 {
    font-size: 23px;
  }
}
</style>
