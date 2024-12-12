<template>
    <div class="menu-list-container">
        <!-- Контакты -->
        <div class="menu-list-contacts">
            <div class="menu-list-contacts-content">
                <h3>Напишите нам</h3>
                <p>dev.polonkoev@gmail.com</p>
            </div>
            <div class="menu-list-contacts-content">
                <h3>Телефон</h3>
                <p>+7 911 123 12 21</p>
            </div>
        </div>

        <!-- Ссылки -->
        <div class="menu-list-pages">
            <div class="menu-list-page">
                <router-link to="/" @click="$emit('toggleMenu')">
                    <p>Главная</p>
                </router-link>
                <router-link to="/books" @click="$emit('toggleMenu')">
                    <p>Книги</p>
                </router-link>
                <router-link to="/posts" @click="$emit('toggleMenu')">
                    <p>Посты</p>
                </router-link>
                <router-link to="/about" @click="$emit('toggleMenu')">
                    <p>О нас</p>
                </router-link>
            </div>
        </div>

        <!-- Кнопка закрытия меню -->
        <div class="menu-list-button" @click="$emit('toggleMenu')">
            <a>Закрыть</a>
        </div>
    </div>
</template>

<script>
export default {
    name: "MenuDialog",
};
</script>


<style scoped>
.menu-list-container {
    width: 100%;
    height: 100%;
    background-color: var(--dark);
    position: fixed;
    z-index: 0;
    padding: 0 10px;
    left: 0;
    overflow: hidden;
}


/* HEADER */
.menu-list-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    width: 100%;
}

.menu-list-header-logo img {
    width: 75px;
}

.menu-list-header-button {
    background: var(--bisque);
    border-radius: 8px;
    border: none;
    min-height: 27px;
    min-width: 118px;
    padding: 6px 10px;
    cursor: pointer;
}

.menu-list-header-button p {
    font-family: "Rubik-Medium";
    color: var(--dark);
    font-size: 12px;
    margin: 0;
}

/* CONTACTS */
.menu-list-contacts {
    display: flex;
    gap: 28px;
    justify-content: start;
    flex-wrap: wrap;
    margin-top: 20px;
    margin-bottom: 28px;
}

.menu-list-contacts-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.menu-list-contacts-content h3 {
    font-family: "Ubuntu";
    font-size: 12px;
    color: var(--bisque);
    margin: 0;
}

.menu-list-contacts-content p {
    font-family: "Ubuntu";
    font-size: 12px;
    color: var(--bisque);
    margin: 0;
}

/* PAGES */
.menu-list-pages {
    display: flex;
    flex-direction: column;
}

.menu-list-page p {
    min-width: 300px;
    font-family: "Rubik-Medium";
    font-size: 14px;
    color: var(--bisque);
    padding: 12px 0;
    margin: 0;
    border-bottom: 1px solid var(--bisque);
}

.menu-list-page p.active {
    background-color: #191d1d;
}

/* BUTTON */
.menu-list-button {
    display: flex;
    align-items: center;
    gap: 8px;
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--bisque);
    border: 1px solid var(--color-gray-40);
    border-radius: 10px;
    padding: 10px 12px;
    cursor: pointer;
}

.menu-list-button a {
    font-family: "Rubik-Medium";
    color: var(--dark);
    font-size: 14px;
    margin: 0;
}
</style>