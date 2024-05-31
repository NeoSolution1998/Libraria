<template>
  <div class="post mb-4">
    <div class="row">
      <div class="col-xs-12 col-sm-5 col-md-5 col-lg-4">

        <div class="post-type post-img">
          <a href="#">
            <img
              :src="post.imageUrl"
              class="img-fluid"
              :alt="'Image for ' + post.title"
            />
          </a>
        </div>

        <div class="author-info author-info-2">
          <ul class="list-unstyled">
            <li>
              <div class="info">
                <p>Дата публикации:</p>
                <strong>{{ post.created_at }}</strong>
              </div>
            </li>
            <li>
              <div class="info">
                <p>Количество комментариев:</p>
                <strong>{{ post.comments }}</strong>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-xs-12 col-sm-7 col-md-7 col-lg-8">
        <div class="caption">
          <h3 class="md-heading">
            <a href="#">{{ post.title }}</a>
          </h3>
          <p>{{ post.content }}</p>
          <a class="btn btn-primary" href="#" role="button">Читать далее</a>
        </div>
      </div>
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
      defaultImageUrl: "/images/books/default2.png", // Замените на путь к вашему статическому изображению
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
/* Стили для изображений в постах */
.post-img img {
  border-radius: 5px;
  max-height: 200px; /* Уменьшение размера изображения */
}

/* Стили для информации об авторе и дате публикации */
.author-info {
  padding: 10px 0;
}

.author-info .info p {
  margin-bottom: 5px;
}

/* Стили для кнопки "Читать далее" */
.caption .btn {
  margin-top: 10px;
}

/* Стили для поста */
.post {
  background-color: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}
</style>
