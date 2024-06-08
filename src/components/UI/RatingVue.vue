<template>
    <div class="wrap">
      <div class="stars mb-3">
        <h5>Рейтинг</h5>
        <label v-for="index in 5" :key="index" :for="'star' + index" class="rate" :class="{ 'rate-active': index <= rating }" @click="selectRating(index)">
          <input type="radio" name="radio1" :id="'star'+index" :value="'star'+index">
          <i :class="['far', 'fa-star', 'star', 'star-' + index]"></i>
        </label>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RatingVue',
    data() {
      return {
        rating: 0
      };
    },
    methods: {
      selectRating(index) {
        // Set the selected rating
        this.rating = index;
      }
    }
  };
  </script>
  
  <style scoped>
  .wrap {
    width: fit-content;
    height: fit-content;
  }
  
  .stars {
    display: inline-block;
    cursor: pointer;
  }
  
  .star {
    color: #91a6ff !important;
  }
  
  .rate {
    display: inline-block;
    margin: 0;
    padding: 0;
    font-size: 25px;
    cursor: pointer;
  }
  
  .rate input[type="radio"] {
    display: none;
  }
  
  .rate-active {
    color: #ffc107 !important;
  }
  </style>
  