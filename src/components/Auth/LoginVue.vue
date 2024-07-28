<template>
  <div class="form-body">
    <div class="row">
      <div class="form-holder">
        <div class="form-content">
          <div class="form-items">
            <h3>Авторизация</h3>
            <p>Введите логин и пароль.</p>
            <form class="requires-validation" @submit.prevent="loginUser" novalidate>
              <div class="col-md-12">
                <input
                  class="form-control"
                  v-model="userData.email"
                  type="email"
                  name="email"
                  placeholder="E-mail Address"
                  required
                />
                <div class="valid-feedback">Email field is valid!</div>
                <div class="invalid-feedback">Email field cannot be blank!</div>
              </div>

              <div class="col-md-12">
                <input
                  class="form-control"
                  v-model="userData.password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>

              <div class="form-button mt-3">
                <button id="submit" type="submit" class="btn btn-primary">Войти</button>
              </div>
            </form>
            <p>
              Нет аккаунта?
              <router-link to="/registration">Зарегистрируйтесь.</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "LoginVue",

  data() {
    return {
      userData: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/login", {
          email: this.userData.email,
          password: this.userData.password,
        });

        console.log("Авторизация успешна", response.data);

        const token = response.data.success.token;
        console.log(token);
        Cookies.set("auth_token", token);

        const prevPageUrl = localStorage.getItem("prevPageUrl");
        this.$router.push(prevPageUrl || "/");
      } catch (error) {
        console.error("Ошибка аутентификации", error.response.data);
        // Дополнительная обработка ошибки, например, вывод сообщения пользователю
      }
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;900&display=swap");

*,
body {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
}

.form-body {
  background-image: url("/public/images/main/4.jpg"); /* Замените на путь к вашему изображению */
  background-size: cover; /* Изображение будет масштабироваться, чтобы полностью покрывать элемент */
  background-position: center; /* Центрируйте изображение */
  background-repeat: no-repeat;
  background-size: 100%; /* Избегайте повторения изображения */
}
.form-holder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100px;
}

.form-holder .form-content {
  position: relative;
  text-align: center;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-align-items: center;
  align-items: center;
  padding: 60px;
}

.form-content .form-items {
  background-color: rgb(130, 182, 174);
  border: 3px solid #fff;
  padding: 40px;
  display: inline-block;
  width: 100%;
  min-width: 540px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  text-align: left;
  -webkit-transition: all 0.4s ease;
  transition: all 0.4s ease;
}

.form-content h3 {
  color: #fff;
  text-align: left;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 5px;
}

.form-content p {
  color: #fff;
  text-align: left;
  font-size: 17px;
  font-weight: 300;
  line-height: 20px;
  margin-bottom: 30px;
}

.form-content input[type="text"],
.form-content input[type="password"],
.form-content input[type="email"],
.form-content select {
  width: 100%;
  padding: 9px 20px;
  text-align: left;
  border: 0;
  outline: 0;
  border-radius: 6px;
  background-color: #fff;
  font-size: 15px;
  font-weight: 300;
  color: #8d8d8d;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  margin-top: 16px;
}

.btn-primary {
  background: linear-gradient(to left, #2c3e50, #2b4157);
  outline: none;
  border: 0px;
  box-shadow: none;
}
</style>
