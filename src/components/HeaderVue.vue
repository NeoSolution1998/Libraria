<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <router-link
          to="/"
          class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
        >
          <div class="logo">
            <img :src="logoSrc" alt="Логотип библиотеки" />
          </div>
        </router-link>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <router-link to="/" class="nav-link px-2 text-secondary" active-class="active"
              >Главная</router-link
            >
          </li>
          <li>
            <router-link
              to="/books"
              class="nav-link px-2 text-white"
              active-class="active"
              >Книги</router-link
            >
          </li>
          <li>
            <router-link
              to="/posts"
              class="nav-link px-2 text-white"
              active-class="active"
              >Посты</router-link
            >
          </li>
          <li>
            <router-link
              to="/about"
              class="nav-link px-2 text-white"
              active-class="active"
              >О нас</router-link
            >
          </li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" @submit.prevent="logout">
          <input
            type="search"
            class="form-control form-control-dark"
            placeholder="Поиск..."
            aria-label="Поиск"
          />
        </form>

        <div class="text-end">
          <!-- Условный рендеринг кнопок входа и регистрации -->
          <div v-if="!isLoggedIn()">
            <router-link to="/login">
              <button type="button" class="btn btn-outline-light me-2">Вход</button>
            </router-link>
            <router-link to="/registration">
              <button type="button" class="btn btn-warning">Регистрация</button>
            </router-link>
          </div>
          <!-- Выпадающее меню пользователя, отображается только если пользователь авторизован -->
          <div v-else class="dropdown">
            <button
              class="btn btn-outline-light dropdown-toggle d-flex align-items-center"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="userAvatar || 'https://bootdey.com/img/Content/avatar/avatar6.png'"
                alt="Аватарка пользователя"
                class="user-avatar rounded-circle me-2"
              />
              {{ userName }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <li>
                <router-link to="/profile" class="dropdown-item">Открыть профиль</router-link>
              </li>
              <li>
                <router-link to="/settings" class="dropdown-item">Настройки</router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item" @click.prevent="logout">Выход</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "HeaderVue",
  data() {
    return {
      logoSrc: "/images/logo.png", // Указываем путь к изображению логотипа
      defaultAvatar: "/images/default-avatar.png", // Путь к аватарке по умолчанию
      userName: "", // Имя пользователя
      userAvatar: "", // URL аватарки пользователя
    };
  },
  methods: {
    isLoggedIn() {
      const authToken = Cookies.get("auth_token");
      return authToken && authToken.length > 0;
    },
    async logout() {
      try {
        const authToken = Cookies.get("auth_token");

        if (!authToken) {
          console.error("Токен аутентификации не найден");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/v1/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        Cookies.remove("auth_token");
        this.$router.push("/login");
      } catch (error) {
        console.error("Ошибка при выходе из системы", error);
        // Дополнительная обработка ошибок, если необходимо
      }
    },
    async fetchUserData() {
      const authToken = Cookies.get("auth_token");

      if (authToken) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/v1/auth/user", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          this.userName = response.data.name;
          this.userAvatar = response.data.avatar;
        } catch (error) {
          console.error("Ошибка получения данных пользователя", error);
        }
      }
    },
  },
  mounted() {
    if (this.isLoggedIn()) {
      this.fetchUserData();
    }
  },
};
</script>

<style>
header {
  background: linear-gradient(to left, #2c3e50, #2b4157); /* Градиентный фон */
  color: #fff;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
}

.logo img {
  height: 50px;
  margin-left: 10px;
  margin-right: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
}
</style>
