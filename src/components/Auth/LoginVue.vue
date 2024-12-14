<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h3>Добро пожаловать!</h3>
        <p>Войдите, чтобы продолжить.</p>
      </div>

      <!-- Отображение ошибки -->
      <div v-if="errorMessage" class="auth-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="loginUser">
        <div class="input-group">
          <input v-model="userData.email" class="auth-input" type="email" placeholder="E-mail" required />
          <div class="input-icon">
            <i class="fas fa-envelope"></i>
          </div>
        </div>

        <div class="input-group">
          <input v-model="userData.password" class="auth-input" type="password" placeholder="Пароль" required />
          <div class="input-icon">
            <i class="fas fa-lock"></i>
          </div>
        </div>

        <div class="auth-options">
          <div>
            <input type="checkbox" id="rememberMe" v-model="rememberMe" />
            <label for="rememberMe">Запомнить меня</label>
          </div>
          <a href="#" class="forgot-password">Забыли пароль?</a>
        </div>

        <button type="submit" class="auth-button">Войти</button>
      </form>

      <div class="auth-footer">
        <p>
          Нет аккаунта? <a href="/registration">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginVue",

  data() {
    return {
      userData: {
        email: "",
        password: "",
      },
      errorMessage: "", // Для хранения сообщения об ошибке
      rememberMe: false,
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),

    async loginUser() {
      this.errorMessage = ""; // Сбрасываем сообщение об ошибке перед попыткой входа
      try {
        await this.login(this.userData);
        console.log("Успешный вход в систему");
      } catch (error) {
        console.error("Ошибка входа", error.response?.data);
        this.errorMessage = error.response?.data?.message || "Произошла ошибка. Попробуйте еще раз.";
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: linear-gradient(135deg, #9cb2c0, #a8a8a8);
  font-family: "Rubik-Regular";
  padding: 10px;
}

.auth-card {
  background: var(--dark);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.auth-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--light);
}

.auth-header p {
  font-size: 14px;
  color: var(--light-hover);
  margin-bottom: 20px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.auth-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
}

.input-icon {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: var(--dark);
}

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--light-hover);
  margin-bottom: 20px;
}

.auth-options div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-options div label {
  margin: 0%;
  padding-left: 5px;
}

.auth-options a {
  color: var(--bisque);
  text-decoration: none;
}

.auth-options a:hover {
  text-decoration: underline;
}

.auth-button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #2b5876, #4e4376);
  background: var();
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.auth-button:hover {
  background: linear-gradient(135deg, #4e4376, #2b5876);
}

.auth-footer {
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-top: 5px;
}

.auth-footer a {
  color: var(--bisque);
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.auth-error {
  color: #d9534f;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}
</style>