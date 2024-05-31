<template>
    <div class="sort-dropdown">
      <label for="sort">Сортировать по:</label>
      <select
        id="sort"
        class="form-control"
        v-model="selectedSort"
        @change="onSortChange"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    name: "SortVue",
    props: {
      options: Array,
    },
    data() {
      return {
        selectedSort: "",
      };
    },
    methods: {
      onSortChange() {
        this.$emit("sort-change", this.selectedSort);
      },
    },
  };
  </script>
  
  <style scoped>
  .sort-dropdown {
    margin-bottom: 20px;
  }
  
  .sort-dropdown label {
    display: block;
    margin-bottom: 5px;
  }
  
  .sort-dropdown .form-control {
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  