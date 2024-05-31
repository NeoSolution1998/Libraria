<template>
  <form @submit.prevent="submitPost">
    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input-vue id="title" v-model="title" required />
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">Content</label>
      <input-vue class="form-control" id="content" v-model="content" required></input-vue>
    </div>
    <button-vue type="submit">Add Posts</button-vue>
  </form>
</template>

<script>


export default {
  data() {
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    submitPost() {
      const newPost = {
        id: Date.now(),
        title: this.title,
        content: this.content,
      };
      this.$emit("add-post", newPost);
      console.log('DSFDFDF');
      (this.title = ""), (this.content = "");
    },
  },
};
</script>

<style scoped>
/* Можно добавить стили для компонента, если нужно */
</style>
