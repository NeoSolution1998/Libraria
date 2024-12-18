<template>
    <div class="pagination__container">
        <div class="pagination__list">
            <!-- Стрелка "В начало" показывается, если не на первой странице и если первая страница не отображается -->
            <div class="pagination__item-icon" v-if="currentPage > 1 && !pagesToShow.includes(1)" @click="goToPage(1)"
                aria-label="First">
                <icon-vue class="icon-fast-backward-1"></icon-vue>
            </div>

            <!-- Стрелка "Назад" показывается, если есть страница назад -->
            <div class="pagination__item-icon" v-if="currentPage > 1" @click="prevPage" aria-label="Previous">
                <icon-vue class="icon-to-start-2"></icon-vue>
            </div>

            <!-- Отображаем страницы -->
            <div class="pagination__item" v-for="page in pagesToShow" :key="page"
                :class="{ active: page === currentPage }" @click="goToPage(page)">
                <span>{{ page }}</span>
            </div>

            <!-- Стрелка "Вперед" показывается, если есть страница вперед и если последняя страница не отображается -->
            <div class="pagination__item-icon" v-if="currentPage < totalPages && !pagesToShow.includes(totalPages)"
                @click="nextPage" aria-label="Next">
                <icon-vue class="icon-to-end-1"></icon-vue>
            </div>

            <!-- Стрелка "В конец" показывается, если не на последней странице и если последняя страница не отображается -->
            <div class="pagination__item-icon" v-if="currentPage < totalPages && !pagesToShow.includes(totalPages)"
                @click="goToPage(totalPages)" aria-label="Last">
                <icon-vue class="icon-fast-forward-1"></icon-vue>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PaginationUI",
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            inputPage: this.currentPage,
        };
    },
    computed: {
        pagesToShow() {
            const range = [];

            // Если текущая страница - первая, показываем страницы 1-4
            if (this.currentPage === 1) {
                range.push(1, 2, 3, 4);
            }
            // Если текущая страница - последняя, показываем последние 4 страницы
            else if (this.currentPage === this.totalPages) {
                range.push(this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
            }
            // В остальных случаях показываем текущую и соседние страницы
            else {
                range.push(this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2);
            }

            // Убираем страницы за пределами диапазона
            return range.filter(page => page > 0 && page <= this.totalPages);
        }
    },
    methods: {
        prevPage() {
            if (this.currentPage > 1) {
                this.$emit("page-changed", this.currentPage - 1);
                this.scrollToTop(); // Прокрутка в начало
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.$emit("page-changed", this.currentPage + 1);
                this.scrollToTop(); // Прокрутка в начало
            }
        },
        goToPage(page) {
            this.$emit("page-changed", page);
            this.scrollToTop(); // Прокрутка в начало
        },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
};
</script>

<style scoped>
.pagination__container {
    padding: 10px;
    padding-bottom: 40px;
}

.pagination__list {
    display: flex;
    justify-content: center;
    gap: 6px;
}

.pagination__item {
    display: flex;
    align-items: center;
    padding: 7px 15px;
    background-color: var(--white);
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    font-family: "Russo";
    font-size: 16px;
    color: var(--dark);
    outline: none;
}

.pagination__item-icon {
    padding: 7px 10px;
    background-color: var(--white);
    border-radius: 6px;
    cursor: pointer;
}



/* Стили для активной страницы */
.pagination__item.active {
    background-color: var(--dark);
    color: var(--white);
}

/* Стили для текста внутри активной страницы */
.pagination__item.active span {
    color: var(--white);
}

/* Стили при наведении или фокусе на другие страницы */
.pagination__item:hover,
.pagination__item-icon:hover,
.pagination__item:focus {
    background-color: var(--dark);
    color: var(--white);
}

.pagination__item:hover span,
.pagination__item:focus span {
    color: var(--white);
}

/* Убираем выделение при клике и фокусе на мобильных устройствах */
.pagination__item:active,
.pagination__item:focus {
    outline: none;
    /* Убираем контур */
    box-shadow: none;
    /* Убираем тень (если она появляется) */
}

.icon-fast-backward-1 {
    padding-right: 8px;
}

.icon-fast-forward-1 {
    padding-right: 8px;
}

@media(max-width: 768px) {
    .pagination__container {
        padding: 8px;
        padding-bottom: 20px;
        overflow: hidden;
    }

    .pagination__list {
        display: flex;
        justify-content: center;
        gap: 4px;
    }



    .pagination__item {
        padding: 5px 15px;
        border-radius: 6px;
        font-size: 14px;
        touch-action: manipulation;
    }

    .pagination__item-icon {
        padding: 6px 8px;
        border-radius: 6px;
    }

    .icon-fast-backward-1 {
        padding-right: 8px;
    }

    .icon-fast-forward-1 {
        padding-right: 8px;
    }
}

@media(max-width: 440px) {
    .pagination__container {
        padding: 8px;
        padding-bottom: 20px;
        overflow: hidden;
    }

    .pagination__list {
        display: flex;
        justify-content: center;
        gap: 4px;
    }

    .pagination__item {
        padding: 5px 13px;
        border-radius: 6px;
        font-size: 14px;
    }

    .pagination__item-icon {
        padding: 5px 5px;
        border-radius: 6px;
    }

    .icon-fast-backward-1 {
        padding-right: 8px;

    }

    .icon-fast-forward-1 {
        padding-right: 8px;
    }

    .icon-fast-backward-1,
    .icon-to-end-1,
    .icon-to-start-2,
    .icon-fast-forward-1 {

        font-size: 14px;
    }

}
</style>
