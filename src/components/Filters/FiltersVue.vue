<template>
    <div class="filters__container">
        <h1>Фильтры</h1>

        <div class="filters__section">
            <CategoryFilter></CategoryFilter>
        </div>

        <div class="filters__section">
            <DateFilter></DateFilter>
        </div>

        <div class="filters__section">
            <RangeFilter></RangeFilter>
        </div>

        <div class="filters__section">
            <TagFilter></TagFilter>
        </div>

        <div class="filters__button">
            <TextButton>Сбросить все фильтры</TextButton>
        </div>
    </div>
</template>

<script>
export default {
    name: "FiltersVue"
};
</script>

<style scoped>
.filters__container {
    max-width: 400px;
    width: 100%;
    padding: 30px;
    border-radius: 8px;
    background-color: var(--white);
    font-family: "Russo";
}

.filters__container h1 {
    margin-bottom: 20px;
    color: var(--dark);
}

.filters__section {
    padding-bottom: 5px;
    padding-top: 5px;
    border-bottom: 2px solid var(--light);
}

.filters__button {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}


</style>
