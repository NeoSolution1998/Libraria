<template>
  <div>
    <div v-if="post" class="container">
      <div class="main-body">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <div class="w-100">
                  {{ console.log(post) }}
                  <img
                    src="https://u.9111s.ru/uploads/202301/18/696d4101c5253a70f08f4f0d165b5092.jpg"
                    class="post-image img-fluid mb-3"
                    alt="post.title"
                  />
                </div>

              </div>
              <div class="col-md-9">
                <div>
                  <icon-vue class="float-right book-save-icon" name="attach" title="Save Post"></icon-vue>
                  <h1>Название поста: {{ post.title }}</h1>
                </div>
                <div class=""><rating-vue class=""></rating-vue></div>
              </div>
              <h2>Содержание</h2>
              <div style="margin: 10px 10px 10px 10px" v-html="post.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Загрузка данных книги...</p>
    </div>
  </div>
</template>


<script>
export default {
  name: "PostsItem",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultImageUrl: "/images/posts/default2.png", // Замените на путь к вашему статическому изображению
    };
  },
  methods: {},
  computed: {
    formattedDate() {
      const date = new Date(this.book.updated_at);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  mounted() {
    console.log("Данные компонентаdd:", this.post);
  },
};
</script>
<style scoped>
.post {
  background-color: rgb(245, 247, 246);
  border-radius: 3%;
  margin-bottom: 10px;
  padding: 10px;
}
.post-image {
  border-radius: 2%;
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

.act-content {
  overflow: hidden;
}
.act-content span.text-small {
  display: block;
  color: #999;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>
