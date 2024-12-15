<template>
    <div class="help-container">
        <div class="how-works-container">
            <h2>Как это работает?</h2>
            <div class="icon-row">
                <div class="icon-block">
                    <i class="icon-user-add-1"></i>
                    <h3>Регистрация</h3>
                    <p>Зарегистрируйтесь на нашем сайте</p>
                </div>
                <div class="icon-block">
                    <i class="icon-search"></i>
                    <h3>Поиск книг</h3>
                    <p>Найдите интересующие вас книги</p>
                </div>
                <div class="icon-block">
                    <i class="icon-forward"></i>
                    <h3>Читайте и делитесь</h3>
                    <p>Читайте книги и делитесь своими мыслями</p>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'HowWorksSection',
}
</script>

<style scoped>
.help-container {
    max-width: 1920px;
    margin: auto;
    background-color: var(--white);
}
.how-works-container {
    background-color: #f8f9fa;
    padding: 50px 20px;
    margin: 0 auto;
    text-align: center;
    font-family: 'Rubik-Medium', sans-serif;
    max-width: 1200px;
}

h2 {
    font-size: 36px;
    margin-bottom: 40px;
    color: var(--dark);
}

.icon-row {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 20px;
    flex-wrap: nowrap;
}

.icon-block {
    flex: 1 1 30%;
    max-width: calc(30% - 20px);
    /* Гарантируем, что блоки занимают 30% */
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.icon-block i {
    font-size: 48px;
    color: var(--dark);
    margin-bottom: 20px;
}

.icon-block h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: var(--dark);
}

.icon-block p {
    font-size: 16px;
    color: var(--dark);
}

/* Адаптивность */
@media (max-width: 1024px) {
    h2 {
        font-size: 32px;
    }

    .icon-block {
        max-width: calc(30% - 15px);
    }

    .icon-block i {
        font-size: 40px;
    }

    .icon-block h3 {
        font-size: 20px;
    }

    .icon-block p {
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .icon-row {
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
    }

    .icon-block {
        flex: 1 1 30%;
        max-width: calc(30% - 10px);
    }

    h2 {
        font-size: 28px;
    }

    .icon-block i {
        font-size: 36px;
    }

    .icon-block h3 {
        font-size: 18px;
    }

    .icon-block p {
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .icon-row {
        flex-wrap: wrap;
        gap: 10px;
    }

    .icon-block {
        flex: 1 1 100%;
        max-width: 100%;
    }

    h2 {
        font-size: 24px;
    }

    .icon-block i {
        font-size: 32px;
    }

    .icon-block h3 {
        font-size: 16px;
    }

    .icon-block p {
        font-size: 12px;
    }
}
</style>
