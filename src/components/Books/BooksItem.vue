<template>
  <div class="card mb-3 shadow-sm">
    <div class="row g-0">
      <div class="col-md-2 col-12 d-flex justify-content-center align-items-center">
        {{console.log(book)}}
        <img v-if="book.images && book.images.length > 0" :src="book.images[0].image" class="img-fluid card-img-top"
          :alt="'Обложка книги ' + book.title" @load="onImageLoad(book.id)" v-show="loadedImages.includes(book.id)" />
        <img v-else src="https://via.placeholder.com/400x300?text=No+Image" class="img-fluid card-img-top"
          alt="No Image" />
      </div>
      <div class="col-md-10 col-12">
        <div class="card-body">
          <h5 class="card-title">
            <router-link :to="{ name: 'Book', params: { id: book.id } }">{{ book.title }}</router-link>
          </h5>
          <p class="card-text">Описание: {{ book.description.substring(0, 150) + "..." }}</p>
          <p class="card-text"><strong>Автор:</strong> {{ book.author }}</p>
          <p class="card-text"><strong>Дата создания:</strong> {{ formattedDate }}</p>
          <div class="text-end" v-if="false">
            <ButtonVue @click="removeBook" class="btn btn-danger">Удалить</ButtonVue>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BooksItem",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultImageUrl: '/images/books/Kingdom.png', // Замените на путь к вашему статическому изображению
      loadedImages: []
    };
  },
  methods: {
    removeBook() {
      this.$emit("remove-book", this.book.id);
    },

    onImageLoad(bookId) {
      if (!this.loadedImages.includes(bookId)) {
        this.loadedImages.push(bookId);
      }
    }
  },
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
};
</script>

<style scoped>
.card {
  border-radius: 15px;
}

.card-title {
  font-family: "Arial", sans-serif;
  font-weight: bold;
}

.card-text {
  font-family: "Arial", sans-serif;
}

.card-img-top {
  width: 100%;
  height: auto;
  border-radius: 10px 0px 0px 10px;
}

.btn {
  font-family: "Arial", sans-serif;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.img-fluid {
  object-fit: cover;
  height: 100%;
  width: 100%;
  max-width: 200px;
  max-height: 300px;
}

/* Media Queries */
@media (max-width: 768px) {
  .img-fluid {
    max-width: 100%;
    max-height: 100%;
  }

  .card-img-top {
    width: 100%;
    height: auto;
    border-radius: 10px 10px 0 0;
  }

  /* Center image in mobile view */
  .col-12.d-flex {
    justify-content: center;
    align-items: center;
  }

  .card-body {
    padding: 15px;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-text {
    font-size: 0.9rem;
  }
}
</style>
