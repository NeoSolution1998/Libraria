<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <router-link to="/" class="d-flex align-items-center mb-2 mr-3 mb-lg-0 text-white text-decoration-none">
              <i class="fas fa-book-reader fa-2x"></i>
            </router-link>
          </li>
          <li>
            <router-link to="/books" class="nav-link px-2 text-white" active-class="active">Книги</router-link>
          </li>
          <li>
            <router-link to="/vuex" class="nav-link px-2 text-white" active-class="active">VueX</router-link>
          </li>
          <li>
            <router-link to="/posts" class="nav-link px-2 text-white" active-class="active">Посты</router-link>
          </li>
          <li>
            <router-link to="/about" class="nav-link px-2 text-white" active-class="active">О нас</router-link>
          </li>
        </ul>

        <div class="text-end">
          <div class="row">
            <div class="col-6 col-lg-auto mb-3 mb-lg-0 me-lg-3">
              <form>
                <input type="search" class="search-header form-control form-control-dark" placeholder="Поиск..."
                  aria-label="Поиск" />
              </form>
            </div>

            <div class="col-6 col-lg-auto mb-3 mb-lg-0 me-lg-3">
              <div v-if="!isLoggedIn()">
                <router-link to="/login">
                  <button type="button" class="btn btn-outline-light me-2">Вход</button>
                </router-link>
                <router-link to="/registration">
                  <button type="button" class="btn btn-warning">Регистрация</button>
                </router-link>
              </div>
              <div v-else class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" id="dropdownMenuButton"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <img v-if="imageLoaded && user.images.length > 0" :src="user.images[0].image"
                    alt="Аватарка пользователя" class="user-avatar rounded-circle me-2" />
                  <div v-else class="placeholder-avatar"></div>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                  <li>
                    <router-link to="/profile" class="dropdown-item">Открыть профиль</router-link>
                  </li>
                  <li>
                    <router-link to="/settings" class="dropdown-item">Настройки</router-link>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <button class="dropdown-item" @click.prevent="$store.dispatch('header/logout')">Выход</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import { mapActions } from "vuex";

export default {
  name: "HeaderVue",
  data() {
    return {
      user: {},
      imageLoaded: false,
    };
  },

  watch: {
    user(newUser) {
      if (newUser.images && newUser.images.length > 0) {
        this.imageLoaded = true;
      }
    }
  },

  methods: {
    isLoggedIn() {
      const authToken = Cookies.get("auth_token");
      return authToken && authToken.length > 0;
    },
    ...mapActions({
      fetchUserData: "header/fetchUserData",
      logout: "header/logout"
    }),
    async getUser() {
      try {
        const authToken = Cookies.get("auth_token") ?? "";
        const response = await axios.get("http://127.0.0.1:8000/api/v1/user/getUserWithToken", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("USER", response.data);
        this.user = response.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
  mounted() {
    if (this.isLoggedIn()) {
      this.getUser();
    }
  },
};
</script>

<style>
header {
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

.placeholder-avatar {
  width: 40px;
  height: 40px;
  background-color: #ccc;
  border-radius: 50%;
}

.search-header {
  max-width: 300px;
  width: 100%;
}
</style>
