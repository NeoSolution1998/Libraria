<template>
  <header-vue></header-vue>
  <div class="vuex-container">
    <h1 class="text-center text-body-secondary">ТУТ У НАС ПОСТЫ</h1>
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
}
</script>
<style scoped>
.vuex-container {
  margin: auto;
}
</style>
