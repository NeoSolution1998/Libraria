<template>
    <div>
      <button class="menu-button icon-menu" @click="$emit('toggleMenu')"></button>
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        
        <router-link to="/books" class="mobile-nav-link" @click="$emit('toggleMenu')">Книги</router-link>
        <router-link to="/posts" class="mobile-nav-link" @click="$emit('toggleMenu')">Посты</router-link>
        <router-link to="/about" class="mobile-nav-link" @click="$emit('toggleMenu')">О нас</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NavMenuBurger",
    props: {
      isMobileMenuOpen: Boolean,
    },
  };
  </script>
  
  <style scoped>
.menu-button {
  background: none;
  border: none;
  font-size: 25px;
  color: white;
  cursor: pointer;
}

.mobile-menu {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  background-color: var(--dark);
  z-index: 100;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-nav-link {
  color: white;
  text-decoration: none;
  font-size: 18px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  background-color: #525e75;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.mobile-nav-link:hover {
  background-color: #f1ddbf;
  color: #26292e;
}

  </style>
  