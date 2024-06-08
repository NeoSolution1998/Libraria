<template>
  <div class="container">
    <h2>Популярные книги</h2>
    <div class="row">
      <div class="col-md-4 col-sm-6" v-for="(book, index) in books" :key="index">
        <div class="card mb-30">
          <a class="card-img-tiles" href="#" data-abc="true">
            <div class="inner">
              <div class="main-img">
                <img
                  :src="`/images/books/${book.image}`"
                  alt="Category"
                  class="book-image"
                />
              </div>
            </div>
          </a>
          <div class="card-body text-center">
            <h4 class="card-title">{{ book.title }}</h4>
            <p class="text-muted">{{ book.price }}</p>
            <router-link :to="{ name: 'Book', params: { id: book.id } }">
              <a class="btn btn-outline-primary btn-sm" href="#" data-abc="true"
                >Читать</a
              ></router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopularBooks",
  data() {
    return {
      books: [
        { id: 1, title: "Book 1", image: "GoT.png", price: "Starting from $10" },
        { id: 3, title: "Book 2", image: "Kingdom.png", price: "Starting from $15" },
        { id: 2, title: "Book 3", image: "potter.png", price: "Starting from $20" },
      ],
    };
  },
};
</script>

<style>
body {
  background-color: #eee;
}
.mt-100 {
  margin-top: 100px;
}
.card {
  border-radius: 7px !important;
  border-color: #ffffff;
}

.mb-30 {
  margin-bottom: 30px !important;
}

.card-img-tiles {
  display: block;
  border-bottom: 5px solid #000203;
}

a {
  color: #073b12;
  text-decoration: none !important;
}

.card-img-tiles > .inner {
  display: table;
  width: 100%;
}

.card-img-tiles .main-img,
.card-img-tiles .thumblist {
  display: table-cell;
  width: 65%;
  padding: 15px;
  vertical-align: middle;
}

.card-img-tiles .main-img > img:last-child,
.card-img-tiles .thumblist > img:last-child {
  margin-bottom: 0;
}

.card-img-tiles .main-img > img,
.card-img-tiles .thumblist > img {
  display: block;
  width: 100%;
  margin-bottom: 6px;
}

.book-image {
  width: 100%;
  height: 500px; /* Фиксированная высота для изображений */
  object-fit: cover; /* Заполнение контейнера с сохранением пропорций */
  border-radius: 7px; /* Округление углов для изображений */
}
</style>
