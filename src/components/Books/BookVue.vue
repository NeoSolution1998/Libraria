<template>
  <div>
    <div v-if="book" class="container">
      <div class="main-body">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <div class="w-100">
                  <img
                    :src="book.cover_image || defaultCoverImage"
                    class="book-image img-fluid mb-3"
                    :alt="book.title"
                  />
                </div>

                <div class="button-container">
                  <button-vue class="btn-outline-dark mb-2 mr-4">Скачать</button-vue>
                  <button-vue class="btn-outline-dark">Читать</button-vue>
                </div>
              </div>
              <div class="col-md-9">
                <div>
                  <icon-vue class="float-right book-save-icon " name="attach" title="Save Book"></icon-vue>
                  <h1>{{ book.title }}</h1>
                </div>
                
                <p><strong>Автор книги:</strong> {{ book.author }}</p>
                <div class=""><rating-vue class=""></rating-vue></div>
                <p><strong>Описание:</strong> {{ book.description }}</p>
                <icon-vue class="book-tag-icon" name="megaphone"></icon-vue>
                <p v-if="book.price"><strong>Цена:</strong> {{ book.price }} ₽</p>
                <p><strong>Язык:</strong> {{ book.language }}</p>
                <p><strong>Число страниц:</strong> {{ book.number_of_pages }}</p>
                <p><strong>Количество глав:</strong> {{ book.number_of_chapters }}</p>
                <p><strong>Биография автора:</strong> {{ book.author_bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <div
          v-for="chapter in book.chapters"
          :key="chapter.id"
          class="card mb-3 shadow-sm"
        >
          <div class="card-body">
            <h5 class="card-title">{{ chapter.title }}</h5>
            <p class="card-text">{{ chapter.content }}</p>
            <p class="card-text"><strong>Номер главы:</strong> {{ chapter.number }}</p>
            <p class="card-text"><strong>Длительность:</strong> {{ chapter.duration }}</p>
            <p class="card-text"><strong>Персонажи:</strong> {{ chapter.characters }}</p>
            <p v-if="chapter.images" class="card-text">
              <strong>Изображения:</strong> {{ chapter.images }}
            </p>
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
  name: "BookVue",
  data() {
    return {
      defaultCoverImage: "/images/books/Kingdom.png",
    };
  },
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>

.book-save-icon {
  font-size: 30px;
}
.book-tag-icon {
  font-size: 30px;
}
.book-image {
  border-radius: 2%;
}

.btn-primary {
  padding: 10px;
  margin-right: 200px;
}

.img-fluid {
  width: 100%;
  height: auto;
  max-width: 300px;
  max-height: 400px; /* Устанавливаем максимальную высоту для обложки */
}
.card {
  border-radius: 15px;
}
.card-title {
  font-size: 1.5em;
  font-weight: bold;
}
.card-text {
  font-size: 1.2em;
}
.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.button-container .btn {
  width: 100%;
}
</style>
