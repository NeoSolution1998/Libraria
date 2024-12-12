<template>
  <div>
    <div v-if="!isLoggedIn" class="auth-buttons">
      <router-link to="/login">
        <button type="button" class="auth-button login-button">Вход</button>
      </router-link>
      <router-link to="/registration">
        <button type="button" class="auth-button register-button">Регистрация</button>
      </router-link>
    </div>
    <UserAvatar v-else :user="user" @logout="$emit('logout')" />
    
  </div>
</template>

<script>
import UserAvatar from "./User/UserAvatar.vue";

export default {
  name: "AuthButtons",
  components: {
    UserAvatar,
  },
  props: {
    isLoggedIn: Boolean,
    user: Object,
  },
};
</script>

<style scoped>
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
  color: var(--bisque);
  border: 1px solid #525e75;
  font-size: 20px;
  font-family: "Rubik-Medium";
}

.login-button:hover {
  background-color: #525e75;
  color: white;
}

.register-button {
  background-color: var(--bisque);
  color:var(--dark);
  border: none;
  font-size: 20px;
  font-family: "Rubik-Medium";
}

.register-button:hover {
  background-color:  var(--bisque-hover)

}

@media (max-width: 1024px) {
  .auth-buttons {
    gap: 0.5rem;
  }

  .auth-button {
    padding: 0.5rem 1rem;
    font-size: 14px;
    border-radius: 6px;
    height: 46px;
  }
}

@media (max-width: 640px) {
  .auth-buttons {
    gap: 0.3rem;
  }

  .auth-button {
    padding: 0.3rem 0.5rem;
    font-size: 12px;
    border-radius: 6px;
    height: 35px;
  }
}

@media (max-width: 440px) {
  .auth-button{
    padding: 0.4rem 0.3rem;
    font-size: 10px;
    height: 32px;
  }
}

@media (max-width: 320px) {

}
</style>