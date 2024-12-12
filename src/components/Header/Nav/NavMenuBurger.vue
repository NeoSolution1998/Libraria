<template>
  <div>
    <!-- Кнопка меню -->
    <button
      class="menu-button icon-menu"
      :class="{ 'icon-open': isMobileMenuOpen }"
      @click="$emit('toggleMenu')"
    >
      <!-- Иконка для кнопки -->
    </button>

    <!-- Мобильное меню -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <!-- Передаем событие toggleMenu в MenuDialog -->
      <MenuDialog @toggleMenu="$emit('toggleMenu')" />
    </div>
  </div>
</template>

<script>
import MenuDialog from './MenuDialog.vue';

export default {
  name: "NavMenuBurger",
  props: {
    isMobileMenuOpen: Boolean, // Получаем состояние из родителя
  },
  components: {
    MenuDialog,
  },
};
</script>


<style scoped>
.menu-button {
  background: none;
  border: none;
  font-size: 25px;
  color: white;
  cursor: pointer;
  z-index: 100;
}

/* Стили для активного состояния */
.icon-menu {
  color: var(--bisque);
}


</style>
