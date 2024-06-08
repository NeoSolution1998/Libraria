<template>
  <div class="container">
    <div class="main-body">
      <div class="row gutters-sm">
        <div class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex flex-column align-items-center text-center">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar7.png"
                  alt="Admin"
                  class="rounded-circle"
                  width="150"
                />
                <div class="mt-3">
                  <h4>{{ user.name }}</h4>
                  <p>Автор, креативщик</p>
                  <p>Россия</p>
                  <div class="d-grid gap-2 d-md-block">
                    <button class="btn btn-outline-dark mb-2 test">Добавить в друзья</button>
                    <button class="btn btn-outline-dark mb-2 test">Написать сообщение</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-8">
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Full Name</h6>
                </div>
                <div class="col-sm-9">{{ user.name }}</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Email</h6>
                </div>
                <div class="col-sm-9">{{ user.email }}</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Телефон</h6>
                </div>
                <div class="col-sm-9">(239) 816-9029</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Telegram</h6>
                </div>
                <div class="col-sm-9">(320) 380-4539</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-3">
                  <h6 class="mb-0">Адрес</h6>
                </div>
                <div class="col-sm-9">Россия. РИ</div>
              </div>
              <hr />
              <div class="row">
                <div class="col-sm-12">
                  <a
                    class="btn btn-info me-2"
                    target="__blank"
                    href="https://www.bootdey.com/snippets/view/profile-edit-data-and-skills"
                    >Редактировать</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileVue",
  props: ["user"],
};
</script>

<style>
.container {
  padding-top: 10px;
}

.test {
  margin-left: 5px;
}
</style>
