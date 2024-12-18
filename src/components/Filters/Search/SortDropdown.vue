<template>
    <div class="sort_dropdown__container" @click="closeDropdown">
        <!-- Список сортировки -->
        <ul class="sort_dropdown__list" @click.stop>
            <li v-for="(option, index) in options" :key="index"
                :class="['sort_dropdown__list_item', { active: option === selectedSort }]"
                @click="selectOption(option)">
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "SortDropdown",
    data() {
        return {
            options: [
                "По имени (A-Z)",
                "По имени (Z-A)",
                "По популярности (вверх)",
                "По популярности (вниз)",
                "По дате (сначала новые)",
                "По дате (сначала старые)",
            ], // Опции выбора
            selectedSort: null, // Выбранная опция
        };
    },
    methods: {
        selectOption(option) {
            this.selectedSort = option;
        },
    },
    methods: {
        handleOutsideClick(event) {
            this.$emit('toggleSortDropdown');
        },
        selectOption(option) {
            this.selectedSort = option;
            this.$emit('toggleSortDropdown');
        },
    },
};
</script>

<style scoped>
.sort_dropdown__container {
    position: relative;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    font-family: "Russo";
    background-color: var(--light);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 5px;
    z-index: 10; 
}


.sort_dropdown__list {
    width: 100%;
    max-width: 200px;
    background-color: var(--light);
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    border-radius: 8px;
}

.sort_dropdown__list_item {
    padding: 8px 10px;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
    font-size: 12px;
    color: var(--dark-muted);
    text-align: center;
    margin: 0px 0px;
}

.sort_dropdown__list_item:last-child {
    border-bottom: none;
}

.sort_dropdown__list_item:hover {
    background-color: var(--light);
}

.sort_dropdown__list_item.active {
    background-color: var(--dark);
    color: var(--white);
}

@media (max-width: 440px) {
    .sort_dropdown__container {
    max-width: 150px;
    border-radius: 4px;
    margin-top: 5px;
}

/* Список сортировки */
.sort_dropdown__list {
    max-width: 150px;
    border-radius: 8px;
}

.sort_dropdown__list_item {
    padding: 6px 8px;
    font-size: 10px;
}
}
</style>
