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
        <li><hr class="header-dropdown-divider" /></li>
        <li><button class="header-dropdown-item" @click="$emit('logout')">Выход</button></li>
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
  width: 70px;
  height: 70px;
  overflow: hidden;
  border: 3px solid #ccc;
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
  right: 0;
  top: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  list-style: none;
  display: block;
}

.header-dropdown-item {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #525e75;
  cursor: pointer;
}

.header-dropdown-item:hover {
  background-color: #f1ddbf;
  color: #26292e;
}

.header-dropdown-divider {
  margin: 0.5rem 0;
  border: 0;
  height: 1px;
  background-color: #ccc;
}

@media (max-width: 1024px) {
  .header-dropdown-avatar {
    width: 60px;
    height: 60px;
  }
}

  </style>
  