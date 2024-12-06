<template>
  <div class="header-container">
    <!-- НАВИГАЦИЯ -->

    <div v-if="!isMobile" class="header-nav">
      <router-link to="/" class="logo">
        <i class="fas fa-book-reader"></i>
      </router-link>
      <router-link to="/books" class="nav-link" active-class="active">Книги</router-link>
      <router-link to="/posts" class="nav-link" active-class="active">Посты</router-link>
      <router-link to="/about" class="nav-link" active-class="active">О нас</router-link>
    </div>

    <!-- Иконка меню для мобильных устройств -->
    <button v-else class="menu-button icon-menu" @click="toggleMobileMenu"></button>

    <!-- Мобильное меню -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <router-link to="/books" class="mobile-nav-link" @click="closeMobileMenu">Книги</router-link>
      <router-link to="/posts" class="mobile-nav-link" @click="closeMobileMenu">Посты</router-link>
      <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">О нас</router-link>
    </div>

    <!--  -->
    <div class="header-auth">
      <!-- Поиск -->
      <div class="header-search">
        <input type="search" class="search-input" placeholder="Поиск..." aria-label="Поиск" />
      </div>

      <!-- AUTH -->
      <div class="header-auth-actions">
        <!-- Кнопки для неавторизованных пользователей -->
        <div v-if="!isLoggedIn()" class="auth-buttons">
          <router-link to="/login">
            <button type="button" class="auth-button login-button">Вход</button>
          </router-link>
          <router-link to="/registration">
            <button type="button" class="auth-button register-button">Регистрация</button>
          </router-link>
        </div>

        <!-- Выпадающее меню для авторизованных пользователей -->
        <div v-else class="header-dropdown">
          <button class="user-menu-button" id="DropdownMenuButton" @click="toggleDropdown"
            aria-expanded="isDropdownOpen">
            <div class="header-dropdown-avatar">
              <div v-if="imageLoaded && user.images.length > 0" alt="Аватарка пользователя" class="user-avatar">
                <img :src="user.images[0].image" />
              </div>

              <div v-else class="user-avatar">
                <img src="/images/user_logo_default.jpg" alt="">
              </div>
            </div>

          </button>

          <!-- Выпадающее меню -->
          <ul v-if="isDropdownOpen" class="header-dropdown-menu">
            <li>
              <router-link to="/profile" class="header-dropdown-item">Открыть профиль</router-link>
            </li>
            <li>
              <router-link to="/settings" class="header-dropdown-item">Настройки</router-link>
            </li>
            <li>
              <hr class="header-dropdown-divider" />
            </li>
            <li>
              <button class="header-dropdown-item" @click.prevent="$store.dispatch('header/logout')">Выход</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapActions } from "vuex";

export default {
  name: "HeaderVue",
  data() {
    return {
      user: {},
      imageLoaded: false,
      isDropdownOpen: false,  // Состояние выпадающего меню
      isMobile: false,       // Флаг для мобильного экрана
      isMobileMenuOpen: false // Состояние мобильного меню
    };
  },

  watch: {
    user(newUser) {
      if (newUser.images && newUser.images.length > 0) {
        this.imageLoaded = true;
      }
    }
  },

  created() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },

  destroyed() {
    window.removeEventListener("resize", this.checkMobile);
  },

  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 640;
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    // Переключение состояния выпадающего меню
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    isLoggedIn() {
      console.log('dfdfd');
      const authToken = Cookies.get("auth_token");
      return authToken && authToken.length > 0;
    },
    ...mapActions({
      fetchUserData: "header/fetchUserData",
      logout: "header/logout"
    }),
  },
};
</script>


<style>
/* ============================= */
/* ГЛАВНЫЕ СТИЛИ HEADER */
/* ============================= */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--dark);
  max-width: 1920px;
  height: 100px;
  width: 100%;
  margin: auto;
  padding-left: 40px;
  padding-right: 40px;
}

/* ============================= */
/* НАВИГАЦИЯ */
/* ============================= */
.header-nav {
  display: flex;
  align-items: center;
  background-color: var(--dark);
}

.logo {
  color: white;
  text-decoration: none;
  margin-right: 20px;
}

.logo i {
  font-size: 35px;
}

.nav-link {
  color: white;
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
/* ============================= */
/* Мобильное меню */
/* ============================= */
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
/* ============================= */
/* AUTHENTICATION */
/* ============================= */
.header-auth {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* Поиск */
.search-input {
  width: 100%;
  max-width: 500px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  font-size: 20px;
  font-family: "Rubik-Medium";
  outline: none;
}

.search-input:focus {
  border-color: #525e75;
  box-shadow: 0 0 4px rgba(82, 94, 117, 0.5);
}

/* Кнопки для входа и регистрации */
.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-button {
  padding: 10px 20px;
  font-size: 22px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.login-button {
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #525e75;
  font-size: 20px;
  font-family: "Rubik-Medium";
}

.login-button:hover {
  background-color: #525e75;
  color: white;
}

.register-button {
  background-color: var(--beige);
  color: #000000;
  border: none;
  font-size: 20px;
  font-family: "Rubik-Medium";
}

.register-button:hover {
  background-color: #d6b211;
  color: white;
}

/* ============================= */
/* ВЫПАДАЮЩЕЕ МЕНЮ */
/* ============================= */
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

/* ============================= */
/* АДАПТИВНОСТЬ */
/* ============================= */
@media (max-width: 1024px) {
  .header-container {
    max-width: 1024px;
    height: 80px;
    padding-left: 30px;
    padding-right: 30px;
  }

  .header-nav {
    margin-right: 20px;
  }

  .header-auth {
    gap: 10px;
  }

  .nav-link {
    border-radius: 4px;
    width: 60px;
    height: 60px;
    font-size: 14px;
  }

  .logo {
    margin-right: 10px;
  }

  .logo i {
    font-size: 30px;
  }

  .auth-buttons {
    gap: 0.5rem;
  }

  .auth-button {
    padding: 0.5rem 1rem;
    font-size: 14px;
    border-radius: 6px;
    height: 46px;
  }

  .search-input {
    max-width: 500px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
  }

  .header-dropdown {
    margin-left: 10px;
  }

  .header-dropdown-avatar {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 640px) {
  .header-container {
    max-width: 640px;
    height: 70px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .header-nav {
    margin-right: 20px;
  }

  .header-auth {
    gap: 10px;
  }

  .nav-link {
    border-radius: 4px;
    width: 50px;
    height: 50px;
    font-size: 12px;
  }

  .logo {
    margin-right: 10px;
  }

  .logo i {
    font-size: 25px;
  }

  .auth-buttons {
    gap: 0.5rem;
  }

  .auth-button {
    padding: 0.5rem 1rem;
    font-size: 12px;
    border-radius: 6px;
  }
}
</style>
