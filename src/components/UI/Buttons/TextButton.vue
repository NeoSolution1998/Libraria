<template>
    <button type="submit" class="btn">
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    name: "TextButton",
  };
  </script>
  
  <style scoped>
  .btn {
    background-color: var(--dark);
    color: var(--white);
    font-family: 'Ubuntu-Bold';
    font-size: 16px;
    padding: 12px 24px;
    border: 1px solid var(--bisque);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn:hover {

    background-color: var(--dark-blue);
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--dark-blue);
  }
  
  .btn:focus {
    outline: none; /* Убираем стандартный фокус */

    color: var(--white); /* Сохраняем цвет текста */
  }
  
  .btn:active {
    background-color: var(--dark-blue);
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--dark-blue);
  }
  
  
  
  @media (max-width:440px) {
    .btn {
  
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 6px;
    }
  
    .btn:hover {
      border-radius: 6px;
    }
  
  
  }
  @media (max-width:340px) {
    .btn {
  
      font-size: 10px;
      padding: 6px 8px;
      border-radius: 6px;
    }
  
    .btn:hover {
      border-radius: 6px;
    }
  
  
  }
  </style>
  