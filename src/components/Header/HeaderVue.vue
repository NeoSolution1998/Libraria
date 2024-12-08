<template>
  <div class="header-container">
    <!-- Навигация -->
    <NavMenu v-if="!isMobile" />
    <NavMenuBurger v-else :isMobileMenuOpen="isMobileMenuOpen" @toggleMenu="toggleMobileMenu" />

    <!-- Поиск и авторизация --> 
    
    <div class="header-auth">
      <SearchBar />
      <AuthButtons :isLoggedIn="isLoggedIn()" :user="user" @logout="logout" />
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapActions } from "vuex";
import NavMenu from "./Nav/NavMenu.vue";
import NavMenuBurger from "./Nav/NavMenuBurger.vue";
import SearchBar from "./SearchBar.vue";
import AuthButtons from "./AuthButtons.vue";

export default {
  name: "HeaderVue",
  components: {
    NavMenu,
    NavMenuBurger,
    SearchBar,
    AuthButtons,
  },
  data() {
    return {
      user: {},
      isMobile: false,
      isMobileMenuOpen: false,
    };
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
    isLoggedIn() {
      const authToken = Cookies.get("auth_token");
      return authToken && authToken.length > 0;
    },
    ...mapActions({
      logout: "header/logout",
    }),
  },
};
</script>

<style scoped>
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
.header-auth{
  display: flex;
  gap: 20px;
}
@media (max-width: 1024px) {
  .header-container {
    max-width: 1024px;
    height: 80px;
    padding-left: 30px;
    padding-right: 30px;
  }
}
.header-auth{
  gap: 10px;
}
@media (max-width: 640px) {
  .header-container {
    max-width: 640px;
    height: 70px;
    padding-left: 10px;
    padding-right: 10px;
  }
}

</style>
