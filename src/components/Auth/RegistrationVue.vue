<template>
  <div class="auth-body">
    <div class="auth-container">
      <div class="auth-content">
        <div class="auth-card">
          <h3 class="auth-title">Регистрация</h3>
          <p class="auth-subtitle">Начинай читать сегодня.</p>
          <form @submit.prevent="registerUser">
            <div class="auth-input-group" :class="{ 'has-error': errors.name }">
              <input v-model="userData.name" class="auth-input" type="text" name="name"
                placeholder="Введите полное имя" />
              <div v-if="errors.name" class="auth-error">{{ errors.name }}</div>
            </div>

            <div class="auth-input-group" :class="{ 'has-error': errors.email }">
              <input v-model="userData.email" class="auth-input" type="email" name="email"
                placeholder="E-mail Address" />
              <div v-if="errors.email" class="auth-error">{{ errors.email }}</div>
            </div>

            <div class="auth-input-group" :class="{ 'has-error': errors.password }">
              <input v-model="userData.password" class="auth-input" type="password" name="password"
                placeholder="Введите пароль" />
              <div v-if="errors.password" class="auth-error">{{ errors.password }}</div>
            </div>

            <div class="auth-checkbox">
              <input class="auth-checkbox-input" type="checkbox" v-model="consent" id="invalidCheck" />
              <label for="invalidCheck" class="auth-checkbox-label">
                Даю согласие на обработку данных
              </label>
              <div v-if="errors.consent" class="auth-error">{{ errors.consent }}</div>
            </div>

            <div class="auth-button-container">
              <button type="submit" class="auth-button">Зарегистрироваться</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "RegistrationVue",
  data() {
    return {
      userData: {
        name: "",
        email: "",
        password: "",
      },
      consent: false,
      errors: {}, // Для хранения ошибок
    };
  },
  methods: {
    validateForm() {
      this.errors = {}; // Сброс ошибок

      if (!this.userData.name.trim()) {
        this.errors.name = "Поле является обязательным!";
      }
      if (!this.userData.email.trim()) {
        this.errors.email = "Email field cannot be blank!";
      } else if (!/\S+@\S+\.\S+/.test(this.userData.email)) {
        this.errors.email = "Введите корректный email!";
      }
      if (!this.userData.password.trim()) {
        this.errors.password = "Password field cannot be blank!";
      } else if (this.userData.password.length < 6) {
        this.errors.password = "Пароль должен содержать не менее 6 символов!";
      }
      if (!this.consent) {
        this.errors.consent = "Вы должны согласиться на обработку данных!";
      }

      // Возвращает true, если ошибок нет
      return Object.keys(this.errors).length === 0;
    },
    async registerUser() {
      if (!this.validateForm()) {
        return; // Прерываем отправку, если есть ошибки
      }

      try {
        const response = await axios.post(
          "http://45.131.40.15/api/v1/auth/register",
          this.userData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const token = response.data.success.token;
        Cookies.set("auth_token", token);
        const prevPageUrl = localStorage.getItem("prevPageUrl");
        this.$router.push(prevPageUrl || "/");
      } catch (error) {
        console.error("Ошибка регистрации", error.response?.data);
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors;
        }
      }
    },
  },
};
</script>

<style scoped>
.auth-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: linear-gradient(to right, #3d3f64, #bcbed8);
  font-family: "Rubik-Regular";
}

.auth-container {
  max-width: 600px;
  width: 100%;
  padding: 20px;
}

.auth-content {
  background: #ffffff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.auth-card {
  text-align: center;
}

.auth-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.auth-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.auth-input-group {
  margin-bottom: 20px;
  text-align: left;
}

.auth-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
}

.auth-input:focus {
  border-color: #4e54c8;
  outline: none;
}

.auth-error {
  color: #d9534f;
  font-size: 12px;
  margin-top: 5px;
}

.auth-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.auth-checkbox-input {
  margin-right: 10px;
}

.auth-checkbox-label {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.auth-button-container {
  text-align: center;
}

.auth-button {
  background: linear-gradient(135deg, #2b5876, #4e4376);
  border: none;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.auth-button:hover {
  background: linear-gradient(135deg, #4e4376, #2b5876);
}

.auth-input-group.has-error .auth-input {
  border-color: #d9534f;
}

.auth-input-group.has-error .auth-error {
  color: #d9534f;
}
</style>
