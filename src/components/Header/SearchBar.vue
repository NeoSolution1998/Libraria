<template>
  <div 
    class="header-search" 
    :class="{ 'input-active': isActive }"
    @click="handleClick"
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
    handleClick() {
      // При клике активируем поле и фокусируем его
      this.isActive = true;
      this.$refs.searchInput.focus();
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
  transition: transform 0.2s ease; /* Добавляем плавность увеличения */
}

.search-input {
  border: none;
  background: var(--dark-muted);
  color: var(--bisque);
  outline: none;
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

.icon-search {
  font-size: 20px;
  color: var(--bisque);
}

.header-search.input-active > .search-input {
  width: 240px; /* Расширяем поле ввода */
  padding-left: 10px;
}

.header-search.input-active > .search-btn {
  background: var(--dark-muted);
}

@media (max-width: 640px) {
  .icon-search{
    font-size: 14px;
  }
  .search-input {
    height: 35px;
    width: 35px;
    font-size: 14px;
  }
  .search-btn {
    width: 35px;
    height: 35px;
  }
  .header-search.input-active > .search-input {
    width: 180px; /* Уменьшенное расширение на мобильных */
    padding-left: 10px;
  }

}

@media (max-width: 440px) {
  .icon-search{
    font-size: 14px;
  }
  .search-input {
    height: 32px;
    width: 32px;
    font-size: 14px;
  }
  .search-btn {
    width: 32px;
    height: 32px;
  }
  .header-search.input-active > .search-input {
    width: 150px; /* Уменьшенное расширение на мобильных */
    padding-left: 10px;
  }
}
@media (max-width: 320px){
  .header-search.input-active > .search-input {
    width: 140px; /* Уменьшенное расширение на мобильных */
    padding-left: 10px;
  }
}
</style>

