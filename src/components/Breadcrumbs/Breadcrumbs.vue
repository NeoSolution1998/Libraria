<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <!-- Если это не последний элемент, делаем ссылку -->
        <router-link v-if="crumb.path && index < breadcrumbs.length - 1" :to="crumb.path">
          {{ crumb.text }}
        </router-link>
        <!-- Последний элемент не является ссылкой -->
        <span v-else>{{ crumb.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: "Breadcrumbs",
  computed: {
    breadcrumbs() {
      // Получаем массив breadcrumb из текущего маршрута
      return this.$route.meta.breadcrumb || [];
    },
  },
};
</script>

<style scoped>
/* Using global styles from main.css - .breadcrumbs, .breadcrumbs ol, .breadcrumbs li, .breadcrumbs li a */
</style>