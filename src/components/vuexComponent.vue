<template>
  <header-vue></header-vue>
 
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
  name: "vuexComponent",
  data() {
    return {
     
    };
  },
}
</script>
<style scoped>
.vuex-container {
  margin: auto;
  max-width: 1920px;
  display: grid;
  grid-template-areas:
    "search search"
    "filters books";
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto auto;
  column-gap: 5px;
  row-gap: 10px;
}

.grid-list1 {
  grid-area: search;
  background-color: var(--green);
}

.grid-list2 {
  background-color: var(--blue);
  grid-area: filters;
  align-self: start;

}

.grid-list3 {
  background-color: var(--red);
  grid-area: books;
  align-self: start;
}
</style>
