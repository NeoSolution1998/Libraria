<template>
  <div class="header-dropdown">
    <button class="user-menu-button" id="DropdownMenuButton" @click="toggleDropdown">
      <div class="header-dropdown-avatar">
        <div v-if="imageLoaded" class="user-avatar">
          <img :src="user.images[0]?.image" alt="Аватарка пользователя" />
        </div>
        <div v-else class="user-avatar">
          <img src="/images/user_logo_default.jpg" alt="Default avatar" />
        </div>
      </div>
    </button>
    <ul v-if="isDropdownOpen" class="header-dropdown-menu">
      <li><router-link to="/profile" class="header-dropdown-item">Открыть профиль</router-link></li>
      <li><router-link to="/settings" class="header-dropdown-item">Настройки</router-link></li>
      <hr class="header-dropdown-divider" />
      <li class="header-dropdown-item" @click="$emit('logout')">Выход</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "UserAvatar",
  props: {
    user: Object,
  },
  data() {
    return {
      isDropdownOpen: false,
      imageLoaded: this.user?.images?.length > 0,
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
  },
};
</script>

<style scoped>
.header-dropdown {
  position: relative;
  height: 60px;
  width: 60px;
}

.user-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  height: 60px;
}

.header-dropdown-avatar {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border: 2px solid var(--bisque);
  border-radius: 50%;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #ffffff;
}

.header-dropdown-menu {
  position: absolute;
  right: -50%;
  top: 140%;
  width: 200px;
  background-color: var(--dark);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  list-style: none;
  display: block;
  padding: 4px;
  margin: 0%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header-dropdown-item {
  height: 30px;
  padding: 5px 5px;
  border-radius: 8px;
  font-family: 'Rubik-Medium';
  text-decoration: none;
  color: var(--bisque);
  cursor: pointer;
}

.header-dropdown-menu li {
  margin: 5px 0;
}

.header-dropdown-menu li:hover {
  background-color: var(--bisque);
  border-radius: 5px;
}

.header-dropdown-item:hover {
  color: var(--dark-muted);
}

.header-dropdown-divider {
  margin: 0;
  border: 0;
  height: 2px;
  background-color: #ccc;
}

@media (max-width: 1024px) {
  .header-dropdown-avatar {
    width: 60px;
    height: 60px;
  }

  .header-dropdown-menu {
    right: -40%;
    top: 125%;
    width: 200px;
    padding: 10px 0;
    padding: 4px;
    margin: 0%;
  }
}

@media (max-width: 640px) {
  .header-dropdown-avatar {
    width: 45px;
    height: 45px;
  }

  .header-dropdown {
    height: 45px;
    width: 45px;
  }

  .header-dropdown-menu {
    right: -10%;
    top: 125%;
    width: 150px;
    padding: 10px 0;
    padding: 4px;
    margin: 0%;
  }

  .header-dropdown-item {
    height: 30px;
    padding: 5px 5px;
    border-radius: 8px;
    font-size: 14px;
  }

  .header-dropdown-menu li {
    margin: 5px 0;
  }

  .user-menu-button {
    height: 45px;
  }
}

@media (max-width: 440px) {
  .header-dropdown-avatar {
    width: 40px;
    height: 40px;
  }

  .header-dropdown {
    height: 40px;
    width: 40px;
  }

  .header-dropdown-menu {
    right: -15%;
    top: 120%;
    width: 130px;
    padding: 10px 0;
    padding: 4px;
    margin: 0%;
  }

  .header-dropdown-item {
    height: 30px;
    padding: 5px 5px;
    border-radius: 8px;
    font-size: 12px;
  }

  .user-menu-button {
    height: 40px;
  }
}
</style>