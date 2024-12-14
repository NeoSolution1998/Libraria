<template>
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
</template>

<script>
export default {
    name: 'HowWorksSection',
}
</script>

<style scoped>
/* Основные стили секции */

.how-works-container {
    background-color: #f8f9fa;
    padding: 50px 0;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    font-family: 'Rubik-Medium';
}

h2 {
    font-size: 36px;
    margin-bottom: 40px;
    color: var(--dark);
}

/* Контейнер для иконок */
.icon-row {
    display: flex;
    flex-wrap: nowrap;
    /* Блоки будут переходить на новую строку на маленьких экранах */
    justify-content: space-between;
    gap: 20px;
}

.icon-block {
    flex: 1 1 30%;
    /* Блоки будут занимать 30% ширины, но будут гибкими */
    min-width: 250px;
    /* Минимальная ширина блока */
    max-width: 300px;
    /* Максимальная ширина блока */
    text-align: center;
    margin-bottom: 30px;
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

/* Медиа-запросы для адаптивности */
@media (max-width: 1920px) {
    h2 {
        font-size: 40px;
    }

    .icon-block i {
        font-size: 50px;
    }

    .icon-block h3 {
        font-size: 26px;
    }

    .icon-block p {
        font-size: 18px;
    }
}

@media (max-width: 1024px) {
    .icon-row {
        justify-content: center;
    }

    h2 {
        font-size: 32px;
    }

    .icon-block i {
        font-size: 44px;
    }

    .icon-block h3 {
        font-size: 22px;
    }

    .icon-block p {
        font-size: 16px;
    }
}

@media (max-width: 640px) {
    h2 {
        font-size: 28px;
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

@media (max-width: 440px) {
    .how-works-container {
        padding: 20px 0;
        width: 90%;
    }

    h2 {
        font-size: 24px;
        margin-bottom: 10px;

    }


    .icon-row {
        justify-content: center;
        /* Центрируем элементы */
        gap: 5px;
    }

    .icon-block {
        flex: 1 1 30%;
        max-width: 33%;
        min-width: 33%;
        margin-bottom: 0px;
    }

    .icon-block i {
        font-size: 20px;
    }

    .icon-block h3 {
        font-size: 12px;

    }

    .icon-block p {
        font-size: 8px;
        margin-bottom: 0px;
    }
}

@media (max-width: 320px) {
    h2 {
        font-size: 20px;
    }

    .icon-block i {
        font-size: 32px;
    }

    .icon-row {
        justify-content: center;
        align-items: center;
    }

    .icon-block {
        flex: 1 1 30%;
        /* Блоки продолжают занимать 30% */
    }

    .icon-block h3 {
        font-size: 16px;
    }

    .icon-block p {
        font-size: 12px;
    }
}
</style>
