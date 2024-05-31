<template>
  <posts-item v-for="post in posts" :key="post.id" :post ></posts-item>
</template>

<script>
export default {
  name: "PostsList",
  props: {
    posts: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      defaultImageUrl: "/images/books/default2.png", // Замените на путь к вашему статическому изображению
    };
  },
  methods: {},
  computed: {
    formattedDate() {
      const date = new Date(this.post.updated_at);
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  mounted() {
/*     console.log("Данные компонента:", this.posts); */
  },
};
</script>

<style scoped>
</style>
