<template>
    <div class="filters_dropdown__container">
        <h1>Фильтры</h1>

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
</template>

<script>
export default {
    name: "FiltersDropdown",
}
</script>

<style scoped>
.filters_dropdown__container {
    width: 100%;
    height: 100vh;
    background-color: var(--white);
    color: var(--dark);
    font-family: "Russo";
    padding: 30px 20px 20px 20px;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    border: 3px solid var(--light);
}
</style>