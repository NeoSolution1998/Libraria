<template>
    <i :class="iconClass"></i>
  </template>
  
  <script>
  export default {
    name: 'IconVue',
    props: {
      name: {
        type: String,
        required: true
      }
    },
    computed: {
      iconClass() {
        return `icon-${this.name}`;
      }
    }
  };
  </script>
  
  <style scoped>
  i {
    font-size: 1em; /* Установите начальный размер иконки */
  }
  </style>
  