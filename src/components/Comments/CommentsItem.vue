<template>
    <li class="post">  
      <!-- Сюда позже добавить ссылку на пользователя и добавить пользователю аватарку -->              
      <div class="float-left">
        <a href="#"
          ><img
            src="https://bootdey.com/img/Content/avatar/avatar6.png"
            alt=""
            class="img-fluid rounded-circle"
        /></a>
      </div>
      
      <div class="act-content">
        <div class="font400">
          <a href="#" class="font600">{{post.user.name}}</a>
        </div>
        <span class="text-small">11 Min Ago</span>
        <h5>{{post.title}}</h5>
        <p>
          {{ post.content}}
        </p>
        <img
          src=""
          alt=""
          class="img-fluid img-thumbnail"
        />
      </div>
    </li>
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
  