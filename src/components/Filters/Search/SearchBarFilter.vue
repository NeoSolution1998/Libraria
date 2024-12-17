<template>
    <div class="search_bar__filters">
        <div class="search_bar__input">
            <input type="text" class="search-input" placeholder="Поиск..." aria-label="Поиск">
        </div>

        <div class="search_bar__sorts">
            <SortSelectUI :options="sortOptions" v-model="selectedSort"></SortSelectUI>
        </div>

        <!-- Иконка сортировки для мобильной версии -->
        <div class="search_bar_sors_mobile">
            <div @click="toggleSortDropdown" title="сортировка" class="search_bar__sort_mobile">
                <span class="icon-filter-1"></span>
            </div>
            <div title="сортировка" class="search_bar__sort_mobile">
                <span class="icon-sort-alt-up" @click="toggleFiltersDropdown"></span>
            </div>
        </div>

        <SortDropdown v-if="isSortDropdownOpen"></SortDropdown>
        <FiltersDropdown v-if="isFiltersDropdownOpen"></FiltersDropdown>
    </div>
</template>

<script>


export default {
    name: "SearchBarFilter",
    data() {
        return {
            // Массив опций для селектора
            sortOptions: [
                { value: "name_asc", label: "По имени (A-Z)" },
                { value: "name_desc", label: "По имени (Z-A)" },
                { value: "date_asc", label: "По дате (по возрастанию)" },
                { value: "date_desc", label: "По дате (по убыванию)" },
                { value: "popular_desc", label: "По популярности (по убыванию)" },
                { value: "popular_ask", label: "По популярности (по убыванию)" },
            ],
            selectedSort: "name_asc",  // Текущая выбранная опция
            isSortDropdownOpen: true,
            isFiltersDropdownOpen: false,
        };
    },
    methods: {
        // Функция для обработки изменения сортировки по имени
        handleSortByName() {
            // Логика сортировки по имени
            // Например, сортировка массива по имени в порядке, выбранном в selectedSortByName
        },

        // Функция для обработки изменения сортировки по дате
        handleSortByDate() {
            // Логика сортировки по дате
            // Например, сортировка массива по дате в порядке, выбранном в selectedSortByDate
        },
        toggleSortDropdown() {
            console.log(this.isSortDropdownOpen);
            this.isSortDropdownOpen = !this.isSortDropdownOpen;
        },
        toggleFiltersDropdown() {
            console.log(this.isFiltersDropdownOpen);

            this.isFiltersDropdownOpen = !this.isFiltersDropdownOpen;
        },
    },

    watch: {
        // Слежение за изменением выбранной сортировки по имени
        selectedSortByName(newValue) {
            this.handleSortByName();
        },

        // Слежение за изменением выбранной сортировки по дате
        selectedSortByDate(newValue) {
            this.handleSortByDate();
        }
    }
}
</script>



<style scoped>
.search_bar__filters {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: var(--white);
    border-radius: 10px;
    padding-right: 20px;
    padding-left: 20px;
    overflow: hidden;
}

.search_bar__input {
    border-radius: 8px;
    border: none;
    outline: none;
    width: 100%;
    margin-right: 10px;
}

.search_bar__input input {
    font-family: "Russo";
    height: 60px;
    max-width: 600px;
    width: 100%;
    border: none;
    background-color: var(--light);
    padding-left: 20px;
    border-radius: 8px;
    font-size: 20px;
}



.search_bar__sort_mobile {
    display: none;
}

.search_bar__sorts {
    display: flex;
    gap: 10px;
}


.search_bar__sort_mobile:hover {
    background-color: var(--dark-muted);
}

.search_bar__sort_mobile {
    color: var(--dark);
    font-size: 30px;
}

.search_bar__sort_mobile:hover span {
    color: var(--white);
}

@media(max-width:1024px) {
    .search_bar__filters {
        height: 50px;
        padding: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
        border-radius: 6px;
        padding-right: 10px;
        padding-left: 10px;


    }

    .search_bar__input {
        border-radius: 6px;
        border: none;
        outline: none;
        width: 100%;

    }

    .search_bar__input input {
        height: 40px;
        max-width: 400px;
        outline: none;
        padding-left: 10px;
        border-radius: 4px;
        font-size: 16px;

    }

    .search_bar__sorts {
        display: none;
    }

    .search_bar_sors_mobile {
        display: flex;
        gap: 5px;
    }

    .search_bar__sort_mobile {
        font-size: 18px;
        color: var(--gray);
        height: 40px;
        width: 45px;
        border-radius: 6px;
        background-color: var(--light);

        display: flex;
        justify-content: center;
        align-items: center;
    }
}

@media(max-width:440px) {
    .search_bar__filters {
        height: 40px;
        border-radius: 6px;
    }

    .search_bar__input {
        border-radius: 6px;
        border: none;
        outline: none;
        width: 100%;

    }

    .search_bar__input input {
        height: 40px;
        max-width: 400px;
        padding-left: 10px;
        border-radius: 8px;
        font-size: 16px;

    }


    .search_bar__sorts {
        display: none;
    }

    .search_bar__sort_mobile {
        font-size: 18px;
        color: var(--gray);
        height: 40px;
        width: 45px;
        border-radius: 6px;
        background-color: var(--light);

        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>