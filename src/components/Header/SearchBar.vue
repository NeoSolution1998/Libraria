<template>
  <div 
    class="header-search" 
    :class="{ 'input-active': isActive }" 
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <input
      ref="searchInput"
      type="text"
      class="search-input"
      placeholder="Поиск..."
      aria-label="Поиск"
      v-model="searchText"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <i class="icon-search search-btn"></i>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      searchText: "", // Текст в поле ввода
      isActive: false, // Состояние активного поля
    };
  },
  methods: {
    handleFocus() {
      this.isActive = true; // Открываем поле при фокусе
    },
    handleBlur() {
      // Закрываем поле только если текста нет
      if (this.searchText.trim() === "") {
        this.isActive = false;
      }
    },
    handleMouseOver() {
      // Автоматически фокусируем поле при наведении
      this.$refs.searchInput.focus();
    },
    handleMouseLeave() {
      // При выходе мыши снимаем фокус, если текста нет
      if (this.searchText.trim() === "") {
        this.isActive = false;
      }
    },
  },
};
</script>

<style scoped>
.header-search {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Прижимаем элементы к правой стороне */
}

.search-btn {
  color: var(--bisque);
  width: 50px;
  height: 40px;
  border-radius: 50%;
  background: var(--dark-muted);
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  position: relative;
  z-index: 1;
}

.search-input {
  border: none;
  background: var(--dark-muted);
  outline: none;
  color: var(--bisque);
  font-size: 16px;
  line-height: 30px;
  padding: 0 10px;
  height: 50px;
  width: 50px; /* Скрываем поле ввода */
  transition: width 0.4s ease;
  border-radius: 20px;
  position: absolute;
  right: 0; /* Закрепляем правую сторону */
  z-index: 0; /* Поле будет за кнопкой */
}

.header-search:hover > .search-input,
.header-search.input-active > .search-input {
  width: 240px; /* Расширяем поле ввода */
  padding-left: 10px;
}

.header-search:hover > .search-btn,
.header-search.input-active > .search-btn {
  background: var(--dark-muted);
}

@media (max-width: 640px) {
  .header-search:hover > .search-input,
.header-search.input-active > .search-input {
  width: 180px; /* Расширяем поле ввода */
  padding-left: 10px;
}
}
</style>
