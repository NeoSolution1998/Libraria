<template>
  <footer class="footer ">
    <div class="footer-top bg-dark  border-top  border-opacity-10 py-8">
      <div class="container bg-dark">
        <div class="row gy-5">
          <div class="col-lg-8 pe-xxl-10">
            <div class="row gy-5">
              <div class="col-6 col-lg-4">
                <h5 class="text-white footer-title-01">О нас</h5>
                <ul class="list-unstyled footer-link-01 m-0">
                  <li><a class="text-white text-opacity-75" href="#">О проекте</a></li>
                  <li><a class="text-white text-opacity-75" href="#">Блог</a></li>
                  <li>
                    <a class="text-white text-opacity-75" href="#">Наша команда</a>
                  </li>
                  <li>
                    <a class="text-white text-opacity-75" href="#">Контакты</a>
                  </li>
                </ul>
              </div>
              <div class="col-6 col-lg-4">
                <h5 class="text-white footer-title-01">Информация</h5>
                <ul class="list-unstyled footer-link-01 m-0">
                  <li>
                    <a class="text-white text-opacity-75" href="#">Служба поддержки</a>
                  </li>
       
                  <li>
                    <a class="text-white text-opacity-75" href="#">Условия использования</a>
                  </li>
                </ul>
              </div>
              <div class="col-6 col-lg-4">
                <h5 class="text-white footer-title-01">Помощь</h5>
                <ul class="list-unstyled footer-link-01 m-0">
                  <li><a class="text-white text-opacity-75" href="#">Свяжитесь с нами</a></li>
                  <li><a class="text-white text-opacity-75" href="#">Часто задаваемые вопросы</a></li>
                  <li>
                    <a class="text-white text-opacity-75" href="#">Руководство пользователя</a>
                  </li>
                  <li><a class="text-white text-opacity-75" href="#">Мобильное приложение</a></li>
                  <li>
                    <a class="text-white text-opacity-75" href="#">Местоположение библиотек</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <h5 class="text-white footer-title-01 fs-5">
              Подпишитесь на нашу рассылку и получите 15% скидку на следующую книгу.
            </h5>
            <div>
              <form class="d-flex flex-row mb-2 p-1 bg-white input-group">
                <input
                  type="email"
                  class="form-control rounded border-0"
                  placeholder="Ваш Email"
                />
                <button class="btn btn-secondary flex-shrink-0" type="submit">
                  Подписаться
                </button>
              </form>
              <p class="fs-sm text-white text-opacity-75">
                Я согласен получать новости от онлайн-библиотеки
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom bg-dark small py-3 border-top border-white border-opacity-10">
      <div class="container">
        <div class="row">
          <div class="col-md-6 text-center text-md-start py-1">
            <p class="m-0 text-white text-opacity-75">
              © 2024 Все права защищены. Онлайн-библиотека.
            </p>
          </div>
          <div class="col-md-6 text-center text-md-end py-1">
            <ul
              class="nav justify-content-center justify-content-md-end list-unstyled footer-link-01 m-0"
            >

              <li class="p-0 mx-3 ms-md-0 me-md-3">
                <a href="#" class="text-white text-opacity-75">Часто задаваемые вопросы</a>
              </li>
              <li class="p-0 mx-3 ms-md-0 me-md-3">
                <a href="#" class="text-white text-opacity-75">Получить котировку</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterVue",
};
</script>

<style>
.footer {
  background: linear-gradient(to left, #000000, #000102); /* Градиентный фон */
  color: #fff;
}
.wrapper > * {
  flex: 0 0 auto;
}

a {
  text-decoration: none;
  background-color: transparent;
}

.py-8 {
  padding-top: 3.5rem !important;
  padding-bottom: 3.5rem !important;
}

.footer-link-01 li + li {
  padding-top: 0.8rem;
}

.footer-title-01 {
  font-size: 16px;
  margin: 0 0 20px;
  font-weight: 600;
}

.footer-title-01 {
  font-size: 16px;
  margin: 0 0 20px;
  font-weight: 600;
}

.footer-link-01 li + li {
  padding-top: 0.8rem;
}

@media (max-width: 991.98px) {
  .footer-link-01 li + li {
    padding-top: 0.6rem;
  }
}

.footer-link-01 a {
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.footer-link-01 a:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: auto;
  right: 0;
  width: 0;
  height: 1px;
  transition: ease all 0.35s;
  background: currentColor;
}

.footer-link-01 a:hover:after {
  left: 0;
  right: auto;
  width: 100%;
}
</style>
