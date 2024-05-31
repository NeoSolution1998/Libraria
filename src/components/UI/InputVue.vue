<template>
    <input class="form-control" type="text" @input="updateInput">
  </template>
  
  <script>
  export default {
    name: "InputVue",
    props: {
        modelValue: [String, Number]
    },
    methods: {
        updateInput(event){
            this.$emit('update:modelValue', event.target.value)
        }
    },
  };
  </script>
  
  <style>
  </style>
  