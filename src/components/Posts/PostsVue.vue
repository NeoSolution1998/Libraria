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
            <posts-list-component></posts-list-component>
        </div>

    </div>

</template>
<script>
export default {
    name: "PostsVue",
    data() {
        return {
            filtersVisible: false,
        }
    }
}
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