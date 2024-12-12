<template>
  <div class="header-nav">
    <router-link to="/" class="logo">
      <img src="/images/logo.svg" alt="Logo">
    </router-link>
    <router-link to="/books" class="nav-link" active-class="active">Книги</router-link>
    <router-link to="/posts" class="nav-link" active-class="active">Посты</router-link>
    <router-link to="/about" class="nav-link" active-class="active">О нас</router-link>
    <router-link to="/vuex" class="nav-link" active-class="active">vuex</router-link>
  </div>
</template>

<script>
export default {
  name: "NavMenu",
};
</script>

<style scoped>
.header-nav {
  display: flex;
  align-items: center;
  background-color: var(--dark);
}
.logo img {
  filter: hue-rotate(90deg) brightness(1.2) contrast(1.5);
}

.logo {
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  max-height: 100%;
  object-fit: contain;
  /* Поддерживаем пропорции */
  transition: transform 0.3s ease;
  /* Добавляем анимацию */
}

.logo img:hover {
  transform: scale(1.1);
  /* Легкое увеличение при наведении */
}

.nav-link {
  color: var(--bisque);
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
  width: 90px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: 'Rubik-Medium';
}

.nav-link:hover {
  background-color: #525e75;
  color: #d7eaea;
}

.nav-link.active {
  background-color: #191d1d;
}

@media (max-width: 1024px) {
  .logo {
    margin-right: 10px;
  }

  .logo img {
    height: 40px;
  }

  .nav-link {
    width: 70px;
    height: 70px;
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  .logo img {
    height: 30px;
  }

  .nav-link {
    width: 60px;
    height: 60px;
    font-size: 14px;
  }
}
</style>
