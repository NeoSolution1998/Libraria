<template>
    <div class="sort_dropdown__container">
        
        
    </div>
</template>

<script>
export default {
    name: "SortDropdown",
    sortOptions: [
                { value: "name_asc", label: "По имени (A-Z)" },
                { value: "name_desc", label: "По имени (Z-A)" },
                { value: "date_asc", label: "По дате (по возрастанию)" },
                { value: "date_desc", label: "По дате (по убыванию)" },
                { value: "popular_desc", label: "По популярности (по убыванию)" },
                { value: "popular_ask", label: "По популярности (по убыванию)" },
            ],
            selectedSort: "name_asc",  // Текущая выбранная опция
};
</script>
<style scoped>
.sort_dropdown__container{
    width: 200px;
   
    background-color: aqua;
    border-radius: 8px;
    position: absolute;
    top: 10%;
    left: 88%;
z-index: 100;
}
</style>
