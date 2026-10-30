<template>
  <teleport to="body">
    <transition name="pe-fade">
      <div v-if="visible" class="pe-overlay" @click.self="close">
        <div class="pe-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
          <header class="pe-head">
            <div>
              <span class="pe-kicker">НАСТРОЙКИ ПРОФИЛЯ</span>
              <h2 id="profile-edit-title">Редактировать профиль</h2>
            </div>
            <button type="button" class="pe-close" aria-label="Закрыть" @click="close">
              <span class="icon-cancel-1" aria-hidden="true"></span>
            </button>
          </header>

          <form class="pe-form" @submit.prevent="submitForm">
            <div class="pe-media">
              <div
                class="pe-banner"
                :class="{ 'has-image': bannerPreview }"
                :style="bannerPreview ? { backgroundImage: `url(${bannerPreview})` } : null"
              >
                <div class="pe-banner__shade"></div>
                <label class="pe-banner__upload">
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" @change="onBannerChange" />
                  <span class="icon-camera" aria-hidden="true"></span>
                  Изменить обложку
                </label>
              </div>

              <div class="pe-avatar-row">
                <div class="pe-avatar">
                  <img v-if="avatarPreview" :src="avatarPreview" alt="Аватар" />
                  <span v-else>{{ initials }}</span>
                  <label class="pe-avatar__upload" aria-label="Изменить аватар">
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" @change="onAvatarChange" />
                    <span class="icon-camera" aria-hidden="true"></span>
                  </label>
                </div>
                <div class="pe-avatar-hint">
                  <strong>{{ form.name || 'Ваше имя' }}</strong>
                  <span>Аватар и обложка видны в профиле и комментариях.</span>
                </div>
              </div>
            </div>

            <div class="pe-grid">
              <label class="pe-field">
                <span>Имя <i>*</i></span>
                <input v-model.trim="form.name" type="text" maxlength="50" placeholder="Как вас зовут" required />
              </label>

              <label class="pe-field">
                <span>Email <i>*</i></span>
                <input v-model.trim="form.email" type="email" maxlength="50" placeholder="you@example.com" required />
              </label>

              <label class="pe-field">
                <span>Дата рождения</span>
                <input v-model="form.birth_date" type="date" :max="today" />
              </label>

              <label class="pe-field">
                <span>Город</span>
                <input v-model.trim="form.city" type="text" maxlength="100" placeholder="Где вы читаете" />
              </label>

              <label class="pe-field">
                <span>Telegram</span>
                <input v-model.trim="form.telegram" type="text" maxlength="100" placeholder="@username" />
              </label>

              <label class="pe-field">
                <span>Телефон</span>
                <input v-model.trim="form.phone" type="tel" maxlength="30" placeholder="+7 (XXX) XXX-XX-XX" />
              </label>

              <label class="pe-field">
                <span>GitHub</span>
                <input v-model.trim="form.github" type="text" maxlength="100" placeholder="username" />
              </label>

              <label class="pe-field">
                <span>VK</span>
                <input v-model.trim="form.vk" type="text" maxlength="100" placeholder="username" />
              </label>

              <label class="pe-field">
                <span>Habr</span>
                <input v-model.trim="form.habr" type="text" maxlength="100" placeholder="username" />
              </label>

              <label class="pe-field pe-field--full">
                <span>О себе <b>{{ form.about.length }}/1000</b></span>
                <textarea
                  v-model="form.about"
                  rows="4"
                  maxlength="1000"
                  placeholder="Несколько слов о том, что вы читаете и любите обсуждать…"
                ></textarea>
              </label>
            </div>

            <section class="pe-password">
              <button type="button" class="pe-password__toggle" @click="changePassword = !changePassword">
                <span class="icon-lock" aria-hidden="true"></span>
                {{ changePassword ? 'Не менять пароль' : 'Сменить пароль' }}
              </button>

              <div v-if="changePassword" class="pe-password__fields">
                <label class="pe-field">
                  <span>Новый пароль</span>
                  <input v-model="form.password" type="password" autocomplete="new-password" placeholder="Минимум 4 символа" />
                </label>
                <label class="pe-field">
                  <span>Повторите пароль</span>
                  <input v-model="form.password_confirm" type="password" autocomplete="new-password" placeholder="Ещё раз" />
                </label>
              </div>
            </section>

            <p v-if="error" class="pe-error" role="alert">{{ error }}</p>

            <footer class="pe-actions">
              <button type="button" class="pe-btn pe-btn--ghost" :disabled="saving" @click="close">
                Отмена
              </button>
              <button type="submit" class="pe-btn pe-btn--primary" :disabled="saving">
                <span v-if="saving" class="pe-spinner" aria-hidden="true"></span>
                <span v-else class="icon-ok" aria-hidden="true"></span>
                {{ saving ? 'Сохраняем…' : 'Сохранить' }}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { mapActions } from 'vuex';

const emptyForm = () => ({
  name: '',
  email: '',
  birth_date: '',
  city: '',
  telegram: '',
  phone: '',
  github: '',
  vk: '',
  habr: '',
  about: '',
  password: '',
  password_confirm: '',
});

export default {
  name: 'EditProfileModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:visible', 'saved'],
  data() {
    return {
      form: emptyForm(),
      avatarFile: null,
      bannerFile: null,
      avatarPreview: '',
      bannerPreview: '',
      changePassword: false,
      saving: false,
      error: '',
    };
  },
  computed: {
    initials() {
      return String(this.form.name || this.user?.name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },
    today() {
      return new Date().toISOString().slice(0, 10);
    },
  },
  watch: {
    visible(value) {
      document.body.style.overflow = value ? 'hidden' : '';
      if (value) this.resetForm();
    },
    user: {
      deep: true,
      handler() {
        if (this.visible) this.resetForm();
      },
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    ...mapActions('auth', ['updateUser']),

    resetForm() {
      const user = this.user || {};

      this.form = {
        name: user.name || '',
        email: user.email || '',
        birth_date: user.birth_date || '',
        city: user.city || '',
        telegram: user.telegram || '',
        phone: user.phone || '',
        github: user.github || '',
        vk: user.vk || '',
        habr: user.habr || '',
        about: user.about || '',
        password: '',
        password_confirm: '',
      };

      this.avatarFile = null;
      this.bannerFile = null;
      this.avatarPreview = user.avatar || '';
      this.bannerPreview = user.banner_image || '';
      this.changePassword = false;
      this.saving = false;
      this.error = '';
    },
    close() {
      if (this.saving) return;
      this.$emit('update:visible', false);
    },
    handleKeydown(event) {
      if (event.key === 'Escape' && this.visible) {
        this.close();
      }
    },
    onAvatarChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      this.avatarFile = file;
      this.avatarPreview = URL.createObjectURL(file);
    },
    onBannerChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      this.bannerFile = file;
      this.bannerPreview = URL.createObjectURL(file);
    },
    validate() {
      if (!this.form.name || this.form.name.length < 2) {
        return 'Имя должно быть не короче 2 символов.';
      }
      if (!this.form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        return 'Введите корректный email.';
      }
      if (this.changePassword) {
        if (this.form.password.length < 4) {
          return 'Пароль должен быть не короче 4 символов.';
        }
        if (this.form.password !== this.form.password_confirm) {
          return 'Пароли не совпадают.';
        }
      }
      return '';
    },
    async submitForm() {
      if (this.saving) return;

      this.error = this.validate();
      if (this.error) return;

      const payload = {
        name: this.form.name,
        email: this.form.email,
        birth_date: this.form.birth_date,
        city: this.form.city,
        telegram: this.form.telegram,
        phone: this.form.phone,
        github: this.form.github,
        vk: this.form.vk,
        habr: this.form.habr,
        about: this.form.about,
      };

      if (this.changePassword) {
        payload.password = this.form.password;
        payload.password_confirm = this.form.password_confirm;
      }
      if (this.avatarFile) payload.avatar = this.avatarFile;
      if (this.bannerFile) payload.banner_image = this.bannerFile;

      this.saving = true;
      this.error = '';

      try {
        await this.updateUser(payload);
        this.$emit('saved');
        this.$emit('update:visible', false);
      } catch (error) {
        this.error = this.errorMessage(error);
      } finally {
        this.saving = false;
      }
    },
    errorMessage(error) {
      const errors = error?.errors;

      if (errors && typeof errors === 'object') {
        const first = Object.values(errors)[0];
        if (Array.isArray(first)) return first[0];
        if (first) return String(first);
      }

      return error?.message || 'Не удалось сохранить профиль. Попробуйте ещё раз.';
    },
  },
};
</script>

<style scoped>
.pe-overlay {
  position: fixed;
  inset: 0;
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  background: rgba(14, 16, 17, 0.58);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.pe-modal {
  width: min(780px, 100%);
  max-height: min(92vh, 900px);
  overflow-y: auto;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-2xl);
  box-shadow: 0 30px 90px rgba(10, 12, 13, 0.4);
}

.pe-head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6) var(--space-4);
  background: #fff;
  border-bottom: 1px solid var(--line);
}

.pe-kicker {
  display: block;
  margin-bottom: 2px;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.pe-head h2 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.pe-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  color: var(--text-muted);
  background: var(--paper);
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.pe-close:hover {
  color: #fff;
  background: var(--danger);
}

.pe-form {
  padding: var(--space-5) var(--space-6) var(--space-6);
}

/* Media */
.pe-media {
  overflow: hidden;
  margin-bottom: var(--space-5);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
}

.pe-banner {
  position: relative;
  height: 138px;
  background:
    radial-gradient(300px 160px at 85% 0%, rgba(231, 165, 74, 0.3), transparent 70%),
    linear-gradient(135deg, #18201e, #2b3530 55%, #7f633c);
  background-size: cover;
  background-position: center;
}

.pe-banner__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 35%, rgba(10, 12, 13, 0.5));
}

.pe-banner__upload {
  position: absolute;
  right: var(--space-3);
  bottom: var(--space-3);
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  color: #f5efe3;
  background: rgba(15, 17, 18, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  backdrop-filter: blur(7px);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 500;
  cursor: pointer;
}

.pe-banner__upload:hover {
  border-color: var(--accent);
}

.pe-banner__upload input,
.pe-avatar__upload input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.pe-banner__upload span {
  color: var(--accent);
  font-size: 10px;
}

.pe-avatar-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
}

.pe-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  overflow: visible;
  color: #17191b;
  background: linear-gradient(135deg, #f1c884, var(--accent));
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 6px 16px rgba(25, 27, 28, 0.15);
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
}

.pe-avatar > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.pe-avatar__upload {
  position: absolute;
  right: -3px;
  bottom: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #17191b;
  background: var(--accent);
  border: 2px solid #fff;
  border-radius: 50%;
  font-size: 8px;
  cursor: pointer;
}

.pe-avatar-hint {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pe-avatar-hint strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
}

.pe-avatar-hint span {
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

/* Fields */
.pe-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3) var(--space-4);
}

.pe-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.pe-field > span {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.pe-field > span i {
  color: var(--danger);
  font-style: normal;
}

.pe-field > span b {
  color: var(--text-muted);
  font-size: 8.5px;
  font-weight: 400;
}

.pe-field input,
.pe-field textarea {
  width: 100%;
  padding: 9px 11px;
  color: var(--ink);
  background: var(--paper);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  outline: none;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  resize: vertical;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.pe-field input:focus,
.pe-field textarea:focus {
  background: #fff;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(231, 165, 74, 0.12);
}

.pe-field--full {
  grid-column: 1 / -1;
}

/* Password */
.pe-password {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--line);
}

.pe-password__toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  color: #9d6d33;
  background: transparent;
  border: 0;
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
  cursor: pointer;
}

.pe-password__toggle span {
  font-size: 9px;
}

.pe-password__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.pe-error {
  margin: var(--space-4) 0 0;
  padding: var(--space-2) var(--space-3);
  color: var(--danger);
  background: rgba(145, 32, 22, 0.06);
  border: 1px solid rgba(145, 32, 22, 0.16);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  line-height: 1.45;
}

/* Actions */
.pe-actions {
  position: sticky;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  padding-bottom: 2px;
  background: #fff;
  border-top: 1px solid var(--line);
}

.pe-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), opacity var(--transition-fast);
}

.pe-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

.pe-btn--ghost {
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--line);
}

.pe-btn--ghost:hover {
  color: var(--ink);
  border-color: var(--ink);
}

.pe-btn--primary {
  color: var(--text-on-accent);
  background: var(--accent);
  border: 1px solid var(--accent);
}

.pe-btn--primary:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.pe-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(23, 25, 27, 0.3);
  border-top-color: #17191b;
  border-radius: 50%;
  animation: pe-spin 0.8s linear infinite;
}

@keyframes pe-spin {
  to { transform: rotate(360deg); }
}

.pe-fade-enter-active,
.pe-fade-leave-active {
  transition: opacity var(--transition-base);
}

.pe-fade-enter-from,
.pe-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .pe-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .pe-modal {
    width: 100%;
    max-height: 94vh;
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
    border-bottom: 0;
  }

  .pe-head {
    padding: var(--space-4);
  }

  .pe-head h2 {
    font-size: var(--text-xl);
  }

  .pe-form {
    padding: var(--space-4) var(--space-4) max(var(--space-5), env(safe-area-inset-bottom));
  }

  .pe-banner {
    height: 112px;
  }

  .pe-grid,
  .pe-password__fields {
    grid-template-columns: 1fr;
  }

  .pe-field--full {
    grid-column: auto;
  }

  .pe-actions {
    flex-direction: row;
  }

  .pe-btn {
    flex: 1;
    width: auto;
  }
}
</style>
