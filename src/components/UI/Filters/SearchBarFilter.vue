<template>
    <div class="search_bar__filters">
        <div class="search_bar__input">
            <input type="text" class="search-input" placeholder="Поиск..." aria-label="Поиск">
        </div>
        <div title="сортировка" class="search_bar__sort">
            <span class="icon-cog"></span>
        </div>
    </div>
</template>
<script>
export default {
    name: "SearchBarFilter"
}
</script>

<style scoped>
.search_bar__filters {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: var(--white);
    border-radius: 10px;
    padding-right: 40px;
    padding-left: 40px;
    overflow: hidden;
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

.search_bar__input input:hover {
    background-color: var(--dark-muted);
    color: var(--white);
}

.search_bar__sort {
    height: 60px;
    width: 60px;
    background-color: var(--light);
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.search_bar__sort:hover {
    background-color: var(--dark-muted);
}

.search_bar__sort {
    color: var(--dark);
    font-size: 30px;
}

.search_bar__sort:hover span {
    color: var(--white);
}

@media(max-width:1024px) {
    .search_bar__filters {
        height: 70px;
        padding: 10px;
        border-radius: 6px;
        padding-right: 20px;
        padding-left: 20px;
    }

    .search_bar__input {
        border-radius: 6px;
        border: none;
        outline: none;
        width: 100%;

    }

    .search_bar__input input {
        height: 50px;
        max-width: 400px;
        padding-left: 15px;
        border-radius: 8px;
        font-size: 16px;
    }

    .search_bar__input input:hover {
        background-color: var(--light);
        color: var(--white);
    }

    .search_bar__sort {
        height: 50px;
        width: 50px;
        border-radius: 6px;
    }

    .search_bar__sort {
        font-size: 26px;
    }
}

@media(max-width:440px) {
    .search_bar__filters {
        height: 60px;
        padding: 10px;
        border-radius: 6px;
        padding-right: 10px;
        padding-left: 10px;
    }

    .search_bar__input {
        border-radius: 6px;
        border: none;
        outline: none;
        width: 100%;

    }

    .search_bar__input input {
        height: 40px;
        max-width: 350px;
        padding-left: 10px;
        margin-right: 20px;
        border-radius: 8px;
        font-size: 14px;
    }

    .search_bar__input input:hover {
        background-color: var(--light);
        color: var(--white);
    }

    .search_bar__sort {
        height: 40px;
        width: 40px;
        border-radius: 6px;
    }

    .search_bar__sort {
        font-size: 22px;
    }
}
</style>