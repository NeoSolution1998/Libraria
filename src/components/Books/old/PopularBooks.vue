<template>
  <div class="container-fluid mt-5 bg-dark ">
    <h2 class="mb-4 text-white pt-4">Популярные книги</h2>
    <div class="row p-5 justify-content-center">
      <div
        class="col-lg-3 col-md-4 col-sm-6 mb-4"
        v-for="(book, index) in books"
        :key="index"
      >
        <div class="card shadow-sm w-100 h-100">
          <img
            :src="'/images/books/' + book.image"
            class="card-img-top"
            alt="Book Image"
          />
          <div class="card-body">
            <h5 class="card-title">{{ book.title }}</h5>
            <p class="card-text">{{ book.description }}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="author">{{ book.author }}</span>
              <span class="rating">
                <i v-for="star in 5" :key="star" class="fa" :class="{'fa-star': star <= book.rating, 'fa-star-o': star > book.rating}"></i>
              </span>
            </div>
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
        {
          id: 1,
          title: "Игра Престолов",
          image: "GoT.png",
          price: "Starting from $10",
          author: "Роберт Мартин",
          rating: 4,
          description: "Описание книги Игра Престолов.",
        },
        {
          id: 3,
          title: "Обреченное королевство",
          image: "Kingdom.png",
          price: "Starting from $15",
          author: "Роберт Мартин",
          rating: 5,
          description: "Описание книги Обреченное королевство.",
        },
        {
          id: 2,
          title: "Гарри Поттер",
          image: "potter.png",
          price: "Starting from $20",
          author: "Джоан Роулинг",
          rating: 4,
          description: "Описание книги Гарри Поттер.",
        },
        {
          id: 4,
          title: "Игра Престолов",
          image: "GoT.png",
          price: "Starting from $10",
          author: "Роберт Мартин",
          rating: 4,
          description: "Описание книги Игра Престолов.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.row {
  max-width: 1400px;
  margin: 0% auto;
}
.container-fluid {
  border-radius: 3%;
}
.card {
  width: 220px;
  max-width: 400px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  width: 100%;
  height: 300px;
  object-fit: contain;
  padding: 10px;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-text {
  flex-grow: 1;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.author {
  font-size: 0.9rem;
  color: #6c757d;
}

.rating {
  color: #ffc107;
}

.rating .fa {
  margin-right: 2px;
}
</style>

<!-- Don't forget to include Font Awesome for the stars -->
<!-- <head> or <body> section of your index.html -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
