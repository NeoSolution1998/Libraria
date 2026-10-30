<template>
  <header-vue></header-vue>
  <PostDetail :id="$route.params.id"></PostDetail>
  <footer-vue></footer-vue>
</template>

<script>
export default {
  name: "PostPage",
};
</script>

<style scoped>
</style>