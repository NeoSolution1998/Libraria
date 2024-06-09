<template>
  <header-vue></header-vue>
  <div class="container">
    <h1 class="text-center text-body-secondary">ТУТ У НАС ПОСТЫ</h1>

    <!-- Используем v-for для отображения каждого поста -->
    <div class="container">
      <div class="posts row m-3">
        <div class="col-md-8 col-sm-12">
          <img
            class="img-post img-fluid img-thumbnail"
            src="https://u.9111s.ru/uploads/202301/18/696d4101c5253a70f08f4f0d165b5092.jpg"
            alt=""
          />
        </div>

        <div class="col-md-4 col-sm-12">
          <h2 class="text-center"><strong>Post about</strong></h2>
          <p class="text-center text-body-secondary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae quibusdam
            consequuntur itaque iste impedit nesciunt necessitatibus inventore incidunt
            voluptate earum fugiat illo animi, enim at. Esse sit impedit suscipit est
            voluptate repudiandae qui iusto soluta incidunt omnis numquam neque accusamus
            inventore non illum error quidem expedita, dolorum, vero nobis laudantium.
          </p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-12" v-for="number in numbers" :key="number">
        <div class="card mb-4 ml-3">
          <img src="https://via.placeholder.com/400" class="card-img-top p-2" alt="#" />
          <div class="card-body">
            <h5 class="card-title">Заголовок карточки</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
              Author: <strong>Andrey</strong>
            </h6>
            <p class="card-text">
              Небольшой пример текста, который должен основываться на названии карточки и
              составлять основную часть содержимого карты.
            </p>

            <div class="row align-items-center">
              <div class="col-2">
                <a href="#" @click.prevent="icon" title="В избранное">
                  <icon-vue class="w-100" name="star-empty"></icon-vue>
                </a>
              </div>
              <div class="col-2">
                <a href="#" @click.prevent="icon" title="В избранное">
                  <icon-vue class="w-100" name="heart-empty"></icon-vue>
                </a>
              </div>
              <div class="col text-end">
                <a href="#" @click.prevent="icon" title="В избранное">
                  <icon-vue class="w-100" name="chat"></icon-vue>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Колонка с икноками -->
  <div class="container bg-white mt-5">
    <h2>Fontello Icons</h2>
    <fontello-icons></fontello-icons>
  </div>

  <footer-vue></footer-vue>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      numbers: [4, 2, 3],
    };
  },
  methods: {
    ...mapActions({
      fetchPosts: "fetchPosts",
    }),
    ...mapMutations({}),
  },
  mounted() {
    this.fetchPosts();
  },

  computed: {
    ...mapState({}),
    ...mapGetters({}),
  },
};
</script>
<style scoped>
.posts {
  border-radius: 3%;
  background-color: rgb(222, 226, 241);
  padding: 1%;
}
.img-post {
  border-radius: 3%;
}
</style>
