<template>
    <div class="dropdown-dialog-container" v-if="isOpen">
      <div class="dropdown-dialog">
        <ul class="dropdown-menu">
          <li>
            <router-link to="/profile" class="dropdown-item" @click="closeDialog">
              Открыть профиль
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="dropdown-item" @click="closeDialog">
              Настройки
            </router-link>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <button class="dropdown-item" @click="logout">Выход</button>
          </li>
        </ul>
        <button class="dialog-close-button" @click="closeDialog">Закрыть</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "UserMenuDropdown",
    props: {
      isOpen: {
        type: Boolean,
        required: true,
      },
    },
    methods: {
      closeDialog() {
        this.$emit("close");
      },
      logout() {
        this.$emit("logout");
        this.closeDialog();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Контейнер диалога */
  .dropdown-dialog-container {
    
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* Затемнение фона */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  }
  
  /* Само диалоговое окно */
  .dropdown-dialog {
    background-color: var(--dark);
    border-radius: 10px;
    padding: 20px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
    position: relative;
  }
  
  /* Список меню */
  .dropdown-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  /* Элементы меню */
  .dropdown-item {
    font-family: "Rubik-Medium", sans-serif;
    font-size: 16px;
    color: var(--bisque);
    text-decoration: none;
    text-align: center;
    padding: 12px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  /* Разделитель */
  .dropdown-divider {
    border: none;
    border-top: 1px solid var(--bisque);
    margin: 0;
  }
  
  /* Кнопка закрытия */
  .dialog-close-button {
    font-family: "Rubik-Medium", sans-serif;
    font-size: 14px;
    color: var(--dark);
    background-color: var(--bisque);
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease;
    width: 100%;
  }
  
  .dialog-close-button:hover {
    background-color: #ffd8a8;
  }
  
  /* Анимации */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  /* Медиазапросы */
  @media (min-width: 640px) {
    .dropdown-dialog {
      padding: 30px;
    }
  
    .dropdown-item {
      font-size: 18px;
    }
  
    .dialog-close-button {
      font-size: 16px;
    }
  }
  </style>
  