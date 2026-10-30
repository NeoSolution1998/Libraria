<template>
    <nav class="pagination" aria-label="Pagination">
        <!-- Стрелка "В начало" показывается, если не на первой странице и если первая страница не отображается -->
        <button
            class="pagination__item pagination__item--icon"
            v-if="currentPage > 1 && !pagesToShow.includes(1)"
            @click="goToPage(1)"
            aria-label="First page"
        >
            <icon-vue class="icon-fast-backward-1"></icon-vue>
        </button>

        <!-- Стрелка "Назад" показывается, если есть страница назад -->
        <button
            class="pagination__item pagination__item--icon"
            v-if="currentPage > 1"
            @click="prevPage"
            aria-label="Previous page"
        >
            <icon-vue class="icon-to-start-2"></icon-vue>
        </button>

        <!-- Отображаем страницы -->
        <button
            class="pagination__item"
            v-for="page in pagesToShow"
            :key="page"
            :class="{ 'pagination__item--active': page === currentPage }"
            @click="goToPage(page)"
            :aria-label="'Page ' + page"
            :aria-current="page === currentPage ? 'page' : undefined"
        >
            <span>{{ page }}</span>
        </button>

        <!-- Стрелка "Вперед" показывается, если есть страница вперед и если последняя страница не отображается -->
        <button
            class="pagination__item pagination__item--icon"
            v-if="currentPage < totalPages && !pagesToShow.includes(totalPages)"
            @click="nextPage"
            aria-label="Next page"
        >
            <icon-vue class="icon-to-end-1"></icon-vue>
        </button>

        <!-- Стрелка "В конец" показывается, если не на последней странице и если последняя страница не отображается -->
        <button
            class="pagination__item pagination__item--icon"
            v-if="currentPage < totalPages && !pagesToShow.includes(totalPages)"
            @click="goToPage(totalPages)"
            aria-label="Last page"
        >
            <icon-vue class="icon-fast-forward-1"></icon-vue>
        </button>
    </nav>
</template>

<script>
import IconVue from '@/components/Icons/IconVue.vue';

export default {
    name: "PaginationUI",
    components: {
        IconVue
    },
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
/* Using global styles from main.css - .pagination, .pagination__item, .pagination__item--active, .pagination__item--icon, .pagination__ellipsis */
</style>