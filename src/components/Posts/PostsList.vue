<template>
  <div class="container">
    <div class="row">

      <div class="col-md-12 mb30">
        <div class="card">
          <div>
            <!-- Nav tabs -->
            <ul class="nav tabs-admin" role="tablist">
              <li role="presentation" class="nav-item">
                <a
                  class="nav-link active"
                  href="#t1"
                  aria-controls="t1"
                  role="tab"
                  data-toggle="tab"
                  >Последние посты</a
                >
              </li>

              <li role="presentation" class="nav-item">
                <a
                  class="nav-link "
                  href="#t1"
                  aria-controls="t1"
                  role="tab"
                  data-toggle="tab"
                  > Новости</a
                >
              </li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content admin-tab-content pt30">
              <div role="tabpanel" class="tab-pane active show" id="t1">
                <!-- СПИСОК ПоСТОВ СЮДА -->
                <ul class="Posts">
                  <posts-item
                    v-for="post in posts"
                    :key="post.id"
                    :post
                    class="activity-list list-unstyled"
                  ></posts-item>
                </ul>
              </div>

              <div role="tabpanel" class="tab-pane" id="t4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PostsList",
  props: {
    posts: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      defaultImageUrl: "/images/books/default2.png", // Замените на путь к вашему статическому изображению
    };
  },
  methods: {},
  computed: {
    formattedDate() {
      const date = new Date(this.post.updated_at);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  mounted() {
   /*  console.log("Данные компонента:", this.posts); */
  },
};
</script>


<style scoped>


.social-icon-sm {
  margin: 0 5px 5px 0;
  width: 30px;
  height: 30px;
  font-size: 18px;
  line-height: 30px !important;
  color: #555;
  text-shadow: none;
  border-radius: 3px;
  overflow: hidden;
  display: block;
  float: left;
  text-align: center;
  border: 1px solid #aaa;
}
.tabs-admin > .nav-item > .nav-link.active {
  border-color: #0073ff;
  color: #0073ff;
}

.tabs-admin > .nav-item > .nav-link {
  padding: 10px 15px;
  color: #555;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: -2px;
  border-bottom: 2px solid transparent;
}
.act-content span.text-small {
  display: block;
  color: #999;
  margin-bottom: 10px;
  font-size: 12px;
}

.text-small {
  font-size: 12px !important;
}
.admin-tab-content {
  padding: 10px 15px;
}

.pt30 {
  padding-top: 30px !important;
}
.card {
  margin-top: 10px;
  margin-bottom: 10px;
}
.card .card-title {
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-height: 28px;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 28px;
}

.mb20 {
  margin-bottom: 20px !important;
}
.pb20 {
  padding-bottom: 20px !important;
}

.pt20 {
  padding-top: 20px !important;
}
.text-small {
  font-size: 12px !important;
}

.text-muted {
  color: #999 !important;
}

.card .card-content {
  padding: 15px 15px;
}
.profile-header {
  background-size: cover;
  position: relative;
  overflow: hidden;
}
.profile-header .img-fluid.rounded-circle {
  max-width: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
  display: block;
}

</style>
