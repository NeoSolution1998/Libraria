<template>
  <div ref="root" class="ua">
    <button
      type="button"
      class="ua__trigger"
      :class="{ 'is-open': isOpen }"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      aria-label="Меню пользователя"
      @click="toggle"
    >
      <span class="ua__avatar">
        <img
          v-if="avatarUrl && !imageFailed"
          :src="avatarUrl"
          :alt="user?.name || 'Пользователь'"
          @error="imageFailed = true"
        />
        <span v-else>{{ initials }}</span>
      </span>
      <span class="ua__online" aria-hidden="true"></span>
      <span class="ua__name">{{ user?.name || 'Читатель' }}</span>
      <span class="ua__chevron" aria-hidden="true">⌄</span>
    </button>

    <transition name="ua-drop">
      <div v-if="isOpen" class="ua-menu" role="menu">
        <div class="ua-menu__head">
          <span class="ua-menu__avatar">
            <img
              v-if="avatarUrl && !imageFailed"
              :src="avatarUrl"
              :alt="user?.name || 'Пользователь'"
            />
            <span v-else>{{ initials }}</span>
          </span>
          <div class="ua-menu__identity">
            <strong>{{ user?.name || 'Читатель' }}</strong>
            <span>{{ user?.email || '' }}</span>
          </div>
        </div>

        <div class="ua-menu__divider" aria-hidden="true"></div>

        <router-link :to="{ name: 'Profile' }" class="ua-menu__link" role="menuitem" @click="close">
          <span class="icon-user-circle-o" aria-hidden="true"></span>
          <span>Мой профиль</span>
          <span class="icon-right-open ua-menu__chevron" aria-hidden="true"></span>
        </router-link>

        <div class="ua-menu__divider" aria-hidden="true"></div>

        <button type="button" class="ua-menu__logout" role="menuitem" @click="handleLogout">
          <span class="icon-cancel-1" aria-hidden="true"></span>
          <span>Выйти</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  emits: ['logout'],
  data() {
    return {
      isOpen: false,
      imageFailed: false,
    };
  },
  computed: {
    avatarUrl() {
      return this.user?.avatar || this.user?.images?.[0]?.image || '';
    },
    initials() {
      return String(this.user?.name || 'L')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('');
    },
  },
  watch: {
    avatarUrl() {
      this.imageFailed = false;
    },
    '$route.fullPath'() {
      this.close();
    },
  },
  mounted() {
    document.addEventListener('mousedown', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    close() {
      this.isOpen = false;
    },
    handleOutsideClick(event) {
      if (this.isOpen && !this.$refs.root?.contains(event.target)) {
        this.close();
      }
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.close();
      }
    },
    handleLogout() {
      this.close();
      this.$emit('logout');
    },
  },
};
</script>

<style scoped>
.ua {
  position: relative;
  flex-shrink: 0;
}

.ua__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.ua__trigger:hover,
.ua__trigger.is-open {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(231, 165, 74, 0.45);
}

.ua__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  overflow: hidden;
  color: #17191b;
  background: linear-gradient(135deg, #f1c884, var(--accent));
  border: 2px solid rgba(231, 165, 74, 0.65);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.ua__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ua__online {
  position: absolute;
  right: 1px;
  bottom: 2px;
  width: 9px;
  height: 9px;
  background: #63b47f;
  border: 2px solid #1b2023;
  border-radius: 50%;
}

.ua-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 1200;
  width: 252px;
  padding: var(--space-2);
  color: #f5efe3;
  background:
    radial-gradient(220px 140px at 100% 0%, rgba(231, 165, 74, 0.14), transparent 70%),
    #1b2023;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(10, 12, 13, 0.4);
}

.ua-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 16px;
  width: 10px;
  height: 10px;
  background: #1b2023;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
}

.ua-menu__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
}

.ua-menu__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  overflow: hidden;
  color: #17191b;
  background: linear-gradient(135deg, #f1c884, var(--accent));
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
}

.ua-menu__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ua-menu__identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ua-menu__identity strong {
  overflow: hidden;
  color: #f7f1e6;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ua-menu__identity span {
  overflow: hidden;
  color: rgba(232, 225, 213, 0.48);
  font-family: var(--font-sans);
  font-size: 9.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ua-menu__divider {
  height: 1px;
  margin: var(--space-1) var(--space-2);
  background: rgba(255, 255, 255, 0.08);
}

.ua-menu__link,
.ua-menu__logout {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: 9px var(--space-3);
  color: rgba(245, 239, 227, 0.78);
  background: transparent;
  border: 0;
  border-radius: 9px;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.ua-menu__link:hover,
.ua-menu__logout:hover {
  color: var(--accent);
  background: rgba(255, 255, 255, 0.055);
}

.ua-menu__link span:first-child,
.ua-menu__logout span:first-child {
  width: 16px;
  color: rgba(231, 165, 74, 0.8);
  font-size: 11px;
  text-align: center;
}

.ua-menu__chevron {
  margin-left: auto;
  color: rgba(245, 239, 227, 0.25) !important;
  font-size: 8px !important;
}

.ua-menu__logout {
  color: rgba(245, 239, 227, 0.55);
}

.ua-drop-enter-active,
.ua-drop-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.ua-drop-enter-from,
.ua-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 900px) {
  .ua__trigger {
    width: 36px;
    height: 36px;
  }

  .ua__avatar {
    width: 32px;
    height: 32px;
    font-size: 10px;
  }

  .ua-menu {
    right: -4px;
    width: 240px;
  }
}

/* ── Redesign: name + light dropdown ── */
.ua__trigger {
  width: auto; height: 40px; gap: 8px; padding: 3px 10px 3px 4px;
  background: var(--cream); border: 1px solid var(--line); border-radius: 999px;
}
.ua__trigger:hover, .ua__trigger.is-open { background: #fff; border-color: var(--accent); }
.ua__avatar { width: 30px; height: 30px; color: #fff; background: var(--accent); border: 0; font-size: 10px; }
.ua__name {
  max-width: 120px; overflow: hidden; color: var(--ink); font-family: var(--font-sans);
  font-size: 12px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap;
}
.ua__chevron { color: var(--text-muted); font-size: 12px; line-height: 1; }
.ua__online { right: 8px; bottom: 7px; border-color: var(--cream); }
.ua-menu { color: var(--ink); background: var(--cream); border-color: var(--line); box-shadow: 0 20px 50px rgba(30, 33, 36, 0.14); }
.ua-menu::before { background: var(--cream); border-color: var(--line); }
.ua-menu__avatar { color: #fff; background: var(--accent); }
.ua-menu__identity strong { color: var(--ink); }
.ua-menu__identity span { color: var(--text-muted); }
.ua-menu__divider { background: var(--line); }
.ua-menu__link, .ua-menu__logout { color: var(--text-secondary); }
.ua-menu__link:hover, .ua-menu__logout:hover { color: var(--accent); background: var(--accent-light); }
.ua-menu__link span:first-child, .ua-menu__logout span:first-child { color: var(--accent); }
.ua-menu__chevron { color: var(--text-muted) !important; }
.ua-menu__logout { color: var(--text-secondary); }
@media (max-width: 900px) {
  .ua__trigger { width: auto; height: 36px; padding: 2px 8px 2px 2px; }
  .ua__avatar { width: 28px; height: 28px; }
  .ua__name { display: none; }
  .ua__chevron { display: none; }
  .ua__online { right: 2px; bottom: 2px; }
}
</style>
