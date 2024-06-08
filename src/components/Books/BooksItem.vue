<template>
  <div class="card mb-3 shadow-sm">
    <div class="row g-0">
      <div class="col-md-3">
        <img :src="book.imageUrl || defaultImageUrl" class="img-fluid rounded-start" :alt="'Обложка книги ' + book.title">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">
            <router-link :to="{ name: 'Book', params: { id: book.id } }">{{ book.title }}</router-link>
          </h5>
          <p class="card-text">Описание: {{ book.description }}</p>
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
    };
  },
  methods: {
    removeBook() {
      console.log('bookItem');
      this.$emit("remove-book", this.book.id);
    },
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
  mounted() {
    /* console.log("Данные компонента:", this.book); */
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
  max-height: 300px;/* Устанавливаем максимальную высоту для обложки */
  padding: 10px;
}
</style>
