<template>
    <div class="posts__container">
        <div class="search__block">
            <SearchBarFilter></SearchBarFilter>
        </div>
        <div class="filters__block">
            <FiltersVue></FiltersVue>
        </div>
        <div class="posts_block">
            <posts-list-component></posts-list-component>
        </div>

    </div>

</template>
<script>

export default {
    name: "PostsVue"
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
        padding: 10px;
        display: grid;
        grid-template-areas:
            "search "
            "filters"
            "posts ";

    }

    .filters__block {
        display: none;
    }

}
</style>