<template>
  <div class="auth">
    <router-link :to="{ name: 'Home' }" class="auth__brand">
      <span class="auth__mark">
        <img src="/images/logo.svg" alt="" />
      </span>
      <strong>Libraria</strong>
    </router-link>

    <p class="auth__lead">Станьте частью сообщества внимательных читателей</p>

    <form class="auth-card" @submit.prevent="submit">
      <h1>Создать аккаунт</h1>

      <div class="fields-row">
        <label class="field">
          <span class="field__label">Имя</span>
          <span class="field__control">
            <input v-model.trim="form.firstName" type="text" placeholder="Иван" autocomplete="given-name" required />
          </span>
        </label>

        <label class="field">
          <span class="field__label">Фамилия</span>
          <span class="field__control">
            <input v-model.trim="form.lastName" type="text" placeholder="Иванов" autocomplete="family-name" />
          </span>
        </label>
      </div>

      <label class="field">
        <span class="field__label">Электронная почта</span>
        <span class="field__control">
          <span class="icon-mail-alt field__icon" aria-hidden="true"></span>
          <input v-model.trim="form.email" type="email" placeholder="example@mail.com" autocomplete="email" required />
        </span>
      </label>

      <label class="field">
        <span class="field__label">Пароль</span>
        <span class="field__control">
          <span class="icon-lock field__icon" aria-hidden="true"></span>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Придумайте надёжный пароль"
            autocomplete="new-password"
            required
          />
          <button type="button" class="field__eye" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'" @click="showPassword = !showPassword">
            <span :class="showPassword ? 'icon-eye-off' : 'icon-eye'" aria-hidden="true"></span>
          </button>
        </span>
        <span class="field__note">Минимум 8 символов, включая цифры и спецсимволы</span>
      </label>

      <label class="check check--terms">
        <input v-model="form.terms" type="checkbox" />
        <span>
          Я принимаю условия
          <a href="#" @click.prevent>Пользовательского соглашения</a>
          и
          <a href="#" @click.prevent>Политики конфиденциальности</a>
        </span>
      </label>

      <label class="check">
        <input v-model="form.newsletter" type="checkbox" />
        <span>Хочу получать рекомендации книг и лучшие посты недели на почту</span>
      </label>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <button type="submit" class="auth-submit" :disabled="sending">
        {{ sending ? 'Создаём…' : 'Зарегистрироваться' }}
      </button>

      <div class="auth-or"><span>или через соцсети</span></div>

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
      Уже есть аккаунт?
      <router-link :to="{ name: 'Login' }">Войти</router-link>
    </p>

    <div class="auth-social-icons" aria-hidden="true">
      <span class="icon-paper-plane"></span>
      <span class="icon-bookmark"></span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RegistrationPage',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        terms: false,
        newsletter: true,
      },
      showPassword: false,
      sending: false,
      error: '',
    };
  },
  methods: {
    ...mapActions('auth', ['register']),

    async submit() {
      if (this.sending) return;

      if (!this.form.terms) {
        this.error = 'Примите условия Пользовательского соглашения и Политики конфиденциальности.';
        return;
      }

      this.sending = true;
      this.error = '';

      try {
        const name = `${this.form.firstName} ${this.form.lastName}`.trim();
        await this.register({ name, email: this.form.email, password: this.form.password });
        this.$router.push({ name: 'Home' });
      } catch (e) {
        this.error = e?.message || 'Не удалось создать аккаунт. Проверьте данные.';
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
  padding: 22px 24px 46px;
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
  width: 530px;
  max-width: 100%;
  margin-top: 30px;
  padding: 32px 40px 28px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(30, 33, 36, 0.05);
}

.auth-card h1 {
  margin: 0 0 24px;
  font-family: var(--font-display);
  font-size: 27px;
  font-weight: 500;
  letter-spacing: -0.02em;
  text-align: center;
  color: var(--ink);
}

.fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: block;
  margin-bottom: 16px;
}

.field__label {
  display: block;
  margin-bottom: 7px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
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

.fields-row .field__control input {
  padding: 0 14px;
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

.field__note {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.check {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 14px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
  cursor: pointer;
}

.check input {
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
  margin-top: 2px;
  accent-color: var(--accent);
}

.check a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid var(--line-strong);
}

.auth-error {
  margin: 0 0 14px;
  font-size: 12px;
  color: var(--danger);
}

.auth-submit {
  width: 100%;
  height: 46px;
  margin-top: 4px;
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
  opacity: 0.6;
  cursor: default;
}

.auth-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
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

.auth-alt {
  margin: 24px 0 0;
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

.auth-social-icons {
  display: flex;
  gap: 18px;
  margin-top: 26px;
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 560px) {
  .auth {
    padding: 20px 16px 36px;
  }

  .auth-card {
    padding: 26px 20px 22px;
  }

  .fields-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
