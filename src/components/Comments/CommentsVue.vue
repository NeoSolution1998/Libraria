<template>
  <div class="container bg-white pl-4 pr-4 pb-4 pt-3 mb-3">
    <h6><icon-vue name="chat"></icon-vue> Комментарии 5</h6>
    <hr class="pb-2" />

    <!-- FIRST COMMENT -->
    <div class="comment mb-5">
      <div class="row">
        <div class="col-1">
          <div class="img-user-icon float-left w-100">
            <img
              src="https://bootdey.com/img/Content/avatar/avatar6.png"
              alt=""
              class="img-fluid rounded-circle"
            />
          </div>
        </div>

        <div class="col-11">
          <icon-vue class="float-right" name="dot-3"></icon-vue>
          <h6 class="m-0">Ruslan</h6>
          <span class="comment-data text-small">11 Min Ago</span>

          <div class="comment-content float-right mt-3">
            <div class="font400">
              <a href="#" class="font600"></a>
            </div>
            <p class="w-100">
              Некоторый заполнитель для компонента сворачивания. Эта панель по умолчанию
              скрыта, но открывается, когда пользователь активирует соответствующий
              триггер.
            </p>
            <img
              src="http://localhost:8080/images/books/Kingdom.png"
              alt=""
              class="img-fluid img-comment img-thumbnail mb-3"
            />
            <div>
              <icon-vue name="reply"></icon-vue><icon-vue name="heart-empty"></icon-vue>
            </div>
            <hr />
          </div>
          <!-- ОТВЕТ НА КОММЕНТ 1 -->

          <div class="comment">
            <div class="row">
              <div class="col-1">
                <div class="img-user-icon float-left w-100">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar3.png"
                    alt=""
                    class="img-fluid rounded-circle"
                  />
                </div>
              </div>

              <div class="col-11">
                <icon-vue class="float-right" name="dot-3"></icon-vue>
                <h6 class="m-0">Марина</h6>
                <span class="comment-data text-small">11 Min Ago</span>

                <div class="comment-content float-right mt-3">
                  <div class="font400">
                    <a href="#" class="font600"></a>
                  </div>
                  <p>
                    Некоторый заполнитель для компонента сворачивания. Эта панель по
                    умолчанию скрыта, но открывается, когда пользователь активирует
                    соответствующий триггер.
                  </p>
                  <div>
                    <icon-vue name="reply"></icon-vue
                    ><icon-vue name="heart-empty"></icon-vue>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- ОТВЕТ НА КОММЕНТ 2 -->
          <div class="comment">
            <div class="row">
              <div class="col-1">
                <div class="img-user-icon float-left w-100">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                    alt=""
                    class="img-fluid rounded-circle"
                  />
                </div>
              </div>

              <div class="col-11">
                <icon-vue class="float-right" name="dot-3"></icon-vue>
                <h6 class="m-0">Мигель</h6>
                <span class="comment-data text-small">11 Min Ago</span>

                <div class="comment-content float-right mt-3">
                  <div class="font400">
                    <a href="#" class="font600"></a>
                  </div>
                  <p>
                    Некоторый заполнитель для компонента сворачивания. Эта панель по
                    умолчанию скрыта, но открывается, когда пользователь активирует
                    соответствующий триггер.
                  </p>
                  <div>
                    <icon-vue name="reply"></icon-vue
                    ><icon-vue name="heart-empty"></icon-vue>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECOND -->
    <div class="comment">
      <div class="row">
        <div class="col-1">
          <div class="img-user-icon float-left w-100">
            <img
              src="https://bootdey.com/img/Content/avatar/avatar5.png"
              alt=""
              class="img-fluid rounded-circle"
            />
          </div>
        </div>

        <div class="col-11">
          <icon-vue class="float-right" name="dot-3"></icon-vue>
          <h6 class="m-0">Ruslan</h6>
          <span class="comment-data text-small">11 Min Ago</span>

          <div class="comment-content float-right mt-3">
            <div class="font400">
              <a href="#" class="font600"></a>
            </div>
            <p>
              Некоторый заполнитель для компонента сворачивания. Эта панель по умолчанию
              скрыта, но открывается, когда пользователь активирует соответствующий
              триггер.
            </p>

            <div>
              <icon-vue name="reply"></icon-vue><icon-vue name="heart-empty"></icon-vue>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CommentsVue",
};
</script>
<style scoped>
.img-comment {
  max-width: 150px;
  max-height: 100%;
  margin: 0%;
  padding: 0%;
}
.img-user-icon {
  max-width: 50px;
  margin-left: 20%;
  padding: 0%;
}
.container {
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Добавление тени */
}

.post {
  background-color: rgb(245, 247, 246);
  border-radius: 3%;
  margin-bottom: 10px;
  padding: 10px;
}
.activity-list .float-left {
  margin-right: 10px;
  width: 40px;
  height: 40px;
  float: left;
  display: block;
  border-radius: 50%;
  background-color: #eee;
  font-size: 20px;
  line-height: 100%;
  line-height: 43px;
  text-align: center;
}
.activity-list .float-left a {
  display: inline-block;
  color: #999;
}

.comment-content {
  overflow: hidden;
}

.comment-content span.text-small {
  display: block;
  color: #999;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>
