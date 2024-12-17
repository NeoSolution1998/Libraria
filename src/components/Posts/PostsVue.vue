<template>
    <div class="posts__container">
        <div class="search__block">
            <SearchBarFilter></SearchBarFilter>
        </div>
        <div class="filters__block">
            <FiltersVue></FiltersVue>
        </div>
        <div class="posts__section">
        </div>
        <div class="posts_block">
            <posts-list-component v-if="posts && posts.length"></posts-list-component>
            <div v-else class="posts__empty">
                <p>Постов пока нет или произошла ошибка при загрузке данных.</p>
            </div>
        </div>

    </div>

</template>
<script>

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {

    name: "PostsVue",
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
        ...mapMutations({}),
    },

    mounted() {
        this.fetchPosts();
    },
};
</script>

<style>
.posts__container {
    max-width: 1920px;
    margin: auto;
    padding-top: 10px;
    padding: 10px;
    display: grid;
    grid-template-areas:
        "search search "
        "filters posts ";
    gap: 15px;

}

.posts__section {
    display: none;
}

.search__block {
    grid-area: search;
}

.filters__block {
    grid-area: filters;
}

.posts__block {
    grid-area: posts;
    display: flex;
    justify-content: start;
}

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
        gap: 0px;
    }

    .filters__block {
        display: none;
    }

    .posts__section {
        display: block;
        border: 2px solid var(--default);
    }
}
</style>