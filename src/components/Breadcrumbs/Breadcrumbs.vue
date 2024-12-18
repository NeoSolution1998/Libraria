<template>
  <nav class="breadcrumbs">
    <ul>
      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <!-- Если это не последний элемент, делаем ссылку -->
        <router-link v-if="crumb.path && index < breadcrumbs.length - 1" :to="crumb.path">
          {{ crumb.text }}
        </router-link>
        <!-- Последний элемент не является ссылкой -->
        <span v-else>{{ crumb.text }}</span>
      </li>
    </ul>
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
.breadcrumbs {
  max-width: 1920px;
  margin: auto;
  background-color: var(--white);
  padding: 10px;
  padding-left: 30px;
  font-family: "Russo";
}

.breadcrumbs ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

.breadcrumbs li {
  margin-right: 10px;
  font-size: 16px;
  color: var(--gray);
}

.breadcrumbs li::after {
  content: ">";
  margin-left: 10px;
  color: var(--gray);
}

.breadcrumbs li:last-child::after {
  content: "";
}

@media(max-width:1024px) {
  .breadcrumbs {
    padding-left: 20px;
  }
}

@media(max-width:640px) {
  .breadcrumbs {
    padding-left: 10px;
  }
}

@media(max-width:440px) {
  .breadcrumbs {

    padding: 5px;
    padding-left: 10px;
  }

  .breadcrumbs li {
    margin-right: 10px;
    font-size: 14px;
  }
}
</style>