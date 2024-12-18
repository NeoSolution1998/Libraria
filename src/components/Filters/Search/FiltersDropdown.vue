<template>
    <transition name="slide-up">
        <div class="filters_dropdown__container" v-if="isVisible">
            <div class="filters_dropdown__header">
                <h1>Фильтры</h1>
                <button class="close-btn" @click="closeModal">
                    <span class="icon-cancel-1"></span>
                </button>
            </div>

            <!-- Блок с прокруткой -->
            <div class="filters_dropdown__block" ref="scrollableBlock">
                <div class="filters_dropdown__section">
                    <CategoryFilter></CategoryFilter>
                </div>
                <div class="filters_dropdown__section">
                    <DateFilter></DateFilter>
                </div>
                <div class="filters_dropdown__section">
                    <RangeFilter></RangeFilter>
                </div>
                <div class="filters_dropdown__section">
                    <TagFilter></TagFilter>
                </div>
                <div class="filters_dropdown__button">
                    <TextButton>Сбросить все фильтры</TextButton>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    name: "FiltersDropdown",
    props: {
        isVisible: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        closeModal() {
            this.$emit("toggleFiltersDropdown");
        },
        
        handleTouchStart(event) {
            
        },
    },
    data() {
        return {
            startY: 0,
        };
    },
};
</script>

<style scoped>
.filters_dropdown__container {
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: var(--white);
    color: var(--dark);
    font-family: "Russo";
    padding: 10px 20px;

    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
    overflow: scroll;
    top: 48px;
    /* Отключаем прокрутку основного контейнера */
}

.filters_dropdown__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filters_dropdown__block {
    flex: 1;
    overflow-y: auto;
overflow: scroll;
    /* Включаем прокрутку внутри блока */
    padding: 10px 0;
}

.filters_dropdown__section {
    margin-bottom: 20px;
}

.filters_dropdown__button {
    margin-top: 20px;
}

.close-btn {
    font-size: 35px;
    background: var(--white);
    color: var(--red);
    border: none;
    height: 35px;
    width: 35px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Анимации появления/ухода модалки */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease;
}

.slide-up-enter {
    transform: translateY(100%);
}

.slide-up-leave-to {
    transform: translateY(100%);
}
</style>
