<template>
    <div class="posts__container">
        <div class="posts__container_blocks">
            <div class="posts_search__block">
                <SearchBarFilter></SearchBarFilter>
            </div>
            <div class="posts_filters__block">
                <FiltersVue></FiltersVue>
            </div>

            <div class="posts_block">
                <posts-list-component v-if="posts && posts.length"></posts-list-component>
                <div v-else class="posts__empty">
                    <!-- TODO сделать красивую ошибку. Лучше сделать отдельными компонентами ошибки -->
                    <p>Постов пока нет или произошла ошибка при загрузке данных.</p>
                </div>
            </div>
        </div>

        <div class="posts_pagination">
            <PaginationUI :totalPages="totalPages" :currentPage="currentPage" @page-changed="handlePageChange">
            </PaginationUI>
        </div>
    </div>

</template>
<script>

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {

    name: "PostsContainer",
    data() {
        return {
            filtersVisible: false,
        }
    },

    computed: {
        ...mapState({
            posts: state => state.posts.posts,
            totalPages: state => state.posts.totalPages,
            currentPage: state => state.posts.currentPage,
        }),
    },
    methods: {
        ...mapActions({
            fetchPosts: "posts/fetchPosts",

        }),
        ...mapMutations({
            setCurrentPage: "posts/setCurrentPage",
        }),
        handlePageChange(newPage) {
            this.setCurrentPage(newPage);
            this.fetchPosts();
        },
    },

    mounted() {
        this.fetchPosts();
    },
};
</script>

<style>
.posts__container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
}

.posts__container_blocks {
    max-width: 1920px;
    margin: auto;
    display: grid;
    grid-template-areas:
        "search search "
        "filters posts ";
    grid-template-columns: 1fr 3.5fr;
    row-gap: 10px;
    column-gap: 10px;
}

.posts__section {
    display: none;
}

.posts_search__block {
    grid-area: search;
    background-color: var(--white);
}

.posts_filters__block {
    grid-area: filters;
}

.posts__block {
    grid-area: posts;
    display: flex;
    justify-content: start;
}

.posts_pagination {}

.posts__empty {
    background-color: aliceblue;
    width: 100%;
    padding: 40px;
    border-radius: 10px;
}

@media(max-width:1024px) {
    .posts__container {
        max-width: 1024px;
        margin: auto;
        padding: 0px;
        display: grid;
        grid-template-areas:
            "search"
            "filters"
            "posts";
        background-color: var(--white);
        grid-template-columns: auto;
        gap: 0px;
    }

    .posts_filters__block {
        display: none;
    }

    .posts__section {
        display: block;
        border: 2px solid var(--default);
    }
}
</style>