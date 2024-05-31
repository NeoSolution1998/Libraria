<template>
    <div class="search-bar">
      <input
        type="text"
        class="form-control"
        v-model="searchQuery"
        @input="onSearch"
        placeholder="Поиск..."
      />
    </div>
  </template>
  
  <script>
  export default {
    name: "SearchVue",
    data() {
      return {
        searchQuery: "",
      };
    },
    methods: {
      onSearch() {
        this.$emit("search", this.searchQuery);
      },
    },
  };
  </script>
  
  <style scoped>
  .search-bar {
    margin-bottom: 20px;
  }
  
  .search-bar .form-control {
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  