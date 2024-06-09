<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
      >
        

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">

          <li><router-link
            to="/"
            class="d-flex align-items-center mb-2 mr-3 mb-lg-0 text-white text-decoration-none"
          >
            <i class="fas fa-book-reader fa-2x"></i>
            <!-- Добавляем иконку вместо логоытипа -->
          </router-link></li>

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
              to="/vuex"
              class="nav-link px-2 text-white"
              active-class="active"
              >VueX</router-link
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

        <div class="text-end">
          <div class="row">
            <div class="col-6 col-lg-auto mb-3 mb-lg-0 me-lg-3">
              <form >
                <input
                  type="search"
                  class="search-header form-control form-control-dark"
                  placeholder="Поиск..."
                  aria-label="Поиск"
                />
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
              <!-- Выпадающее меню пользователя, отображается только если пользователь авторизован -->
              <div v-else class="dropdown">
                <button
                  class="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    :src="
                      userAvatar || 'https://bootdey.com/img/Content/avatar/avatar6.png'
                    "
                    alt="Аватарка пользователя"
                    class="user-avatar rounded-circle me-2"
                  />
                  {{ userName }}
                </button>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <router-link to="/profile" class="dropdown-item"
                      >Открыть профиль</router-link
                    >
                  </li>
                  <li>
                    <router-link to="/settings" class="dropdown-item"
                      >Настройки</router-link
                    >
                  </li>
                  <li><hr class="dropdown-divider" /></li>
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
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "HeaderVue",

  methods: {
    isLoggedIn() {
      const authToken = Cookies.get("auth_token");
      return authToken && authToken.length > 0;
    },
    ...mapActions({
      fetchUserData: "header/fetchUserData",
      logout: "header/logout"
    }),
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

.search-header {
  max-width: 300px;
  width: 100%;
}
</style>
