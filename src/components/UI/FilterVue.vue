<template>
    <div class="filter-bar">
      <div v-for="filter in filters" :key="filter.name" class="filter">
        <label :for="filter.name">{{ filter.label }}</label>
        <select
          :id="filter.name"
          class="form-control"
          v-model="filter.value"
          @change="onFilterChange"
        >
          <option v-for="option in filter.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FilterVue",
    props: {
      filters: Array,
    },
    methods: {
      onFilterChange() {
        this.$emit("filter-change", this.filters);
      },
    },
  };
  </script>
  
  <style scoped>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .filter {
    flex: 1;
    min-width: 200px;
  }
  
  .filter label {
    display: block;
    margin-bottom: 5px;
  }
  
  .filter .form-control {
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  