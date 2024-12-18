<template>
    <div class="search_bar__filters">
        <div class="search_bar__input">
            <input type="text" class="search-input" placeholder="Поиск..." aria-label="Поиск">
        </div>

        <div class="search_bar__sorts">
            <SortSelectUI :options="sortOptions" v-model="selectedSort"></SortSelectUI>
        </div>

        <!-- Иконка сортировки для мобильной версии -->
        <div class="search_bar__sorts_mobile">
            <div @click="toggleFiltersDropdown" title="сортировка" class="search_bar__sort_mobile">
                <span class="icon-filter-1"></span>
            </div>
            <div title="сортировка" class="search_bar__sort_mobile">
                <span class="icon-sort-alt-up" @click="toggleSortDropdown"></span>
            </div>
        </div>
        <div class="search_bar__dropdown-block">
            <SortDropdown v-if="isSortDropdownOpen" @click="toggleSortDropdown"></SortDropdown>
        </div>

    </div> 
    <div class="search_bar__dropdown-block">
    <FiltersDropdown v-if="isFiltersDropdownOpen" @click="toggleFiltersDropdown"  ></FiltersDropdown>    
    </div>
    
</template>

<style scoped>
.search_bar__filters {
    position: relative;
    height: 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: var(--white);
    border-radius: 10px;
    padding-right: 20px;
    padding-left: 20px;
    padding-bottom: 10px;

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
    justify-content: end;
    gap: 10px;
}


.search_bar__sort_mobile:hover {
    background-color: var(--dark);
}

.search_bar__sort_mobile {
    color: var(--dark);
    font-size: 30px;
}

.search_bar__sort_mobile:hover span {
    color: var(--white);
}

.search_bar__dropdown-block {

    display: none;
}

@media(max-width:1024px) {
    .search_bar__filters {
        height: 55px;
        padding: 10px;
        margin-top: 5px;
        margin-bottom: 20px;
        border-radius: 6px;
        padding-right: 20px;
        padding-left: 20px;
        grid-template-columns: 4fr 1fr;
        grid-template-areas:
            "search sort"
            "dropdown dropdown";
    }

    .search_bar__input {
        grid-area: search;
        border-radius: 6px;
        display: flex;
        align-items: center;
        border: none;
        outline: none;
        width: 100%;

    }

    .search_bar__input input {
        height: 45px;
        max-width: 100%;
        outline: none;
        padding-left: 10px;
        border-radius: 4px;
        font-size: 16px;
        margin-right: 10px;

    }

    .search_bar__sorts {
        display: none;
    }

    .search_bar__sorts_mobile {
        display: flex;
        justify-content: end;
        gap: 5px;
        grid-area: sort;
    }

    .search_bar__sort_mobile {
        font-size: 18px;
        color: var(--gray);
        height: 45px;
        width: 45px;
        border-radius: 6px;
        background-color: var(--light);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .search_bar__dropdown-block {
        display: flex;
        grid-template-columns: 1fr;
        width: 100%;
        justify-content: end;
        align-items: center;
        grid-area: dropdown;
    }
}

@media(max-width:640px) {
    .search_bar__filters {
        height: 55px;
        padding: 10px;
        margin-top: 5px;
        margin-bottom: 20px;
        border-radius: 6px;
        padding-right: 10px;
        padding-left: 10px;
    }
}

@media(max-width:440px) {
    .search_bar__filters {
        height: 45px;
        margin-bottom: 10px;
        border-radius: 6px;
    }

    .search_bar__input {
        border-radius: 6px;
        border: none;
        outline: none;
        width: 100%;

    }

    .search_bar__input input {
        height: 35px;
        max-width: 400px;
        padding-left: 10px;
        border-radius: 8px;
        font-size: 14px;

    }

    .search_bar__sorts {
        display: none;
    }

    .search_bar__sorts_mobile {}

    .search_bar__sort_mobile {
        font-size: 14px;
        color: var(--gray);
        height: 35px;
        width: 35px;
        border-radius: 6px;
        background-color: var(--light);

        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>

<script>
export default {
    name: "SearchBarFilter",
    data() {
        return {
            sortOptions: [
                { value: "name_asc", label: "По имени (A-Z)" },
                { value: "name_desc", label: "По имени (Z-A)" },
                { value: "date_asc", label: "По дате (по возрастанию)" },
                { value: "date_desc", label: "По дате (по убыванию)" },
                { value: "popular_desc", label: "По популярности (по убыванию)" },
                { value: "popular_ask", label: "По популярности (по убыванию)" },
            ],
            selectedSort: "name_asc", 
            isSortDropdownOpen: false,
            isFiltersDropdownOpen: false,
        };
    },
    methods: {

        handleSortByName() {
        },

        handleSortByDate() {
        },
        toggleSortDropdown() {
            this.isSortDropdownOpen = !this.isSortDropdownOpen;
        },
        toggleFiltersDropdown() {
            this.isFiltersDropdownOpen = !this.isFiltersDropdownOpen;
        },
    },

    watch: {
        selectedSortByName(newValue) {
            this.handleSortByName();
        },
        selectedSortByDate(newValue) {
            this.handleSortByDate();
        }
    }
}
</script>