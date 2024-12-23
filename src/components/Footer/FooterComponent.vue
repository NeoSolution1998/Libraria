<template>
    <div class="footer-container">
        <!-- ABOUT -->
        <div class="about">
            <div class="logo">
                <img src="/images/logo.svg" alt="Logo" />
                <p>GDL IT</p>
            </div>

            <div class="footer-about-text">
                <p>
                    <span class="text-company-name">GDL</span> — ведущая компания в IT-разработках,
                    специализирующаяся на инновационных решениях. Мы сочетаем глубокие знания
                    технологий с креативным подходом, чтобы помогать бизнесам эффективно
                    реализовывать свои стратегии и амбиции.
                </p>
            </div>

            <div class="social">
                <p class="social-link">VK</p>
                <p class="social-link">TG</p>
                <p class="social-link">WA</p>
            </div>
        </div>
        <!-- NAV -->
        <div class="nav">
            <div class="text-header dropdown">
                <h2>Навигация:</h2>
                <div class="dropdown-icon" @click="toggleDropdown('nav')">
                    <img v-if="!dropdowns.nav" src="" class="drowdown-icon icon-down-open" />
                    <img v-else  class="drowdown-icon icon-up-open" />
                </div>
            </div>

            <div class="nav-items dropdown-content" :class="{ show: dropdowns.nav }">
                <p><a class="footer-navigation-text">Услуги</a></p>
                <p><a class="footer-navigation-text">Тарифы</a></p>
                <p><a class="footer-navigation-text">Отзывы</a></p>
                <p><a class="footer-navigation-text">Кейсы</a></p>
                <p><a class="footer-navigation-text">Контакты</a></p>
            </div>
        </div>
        <!--  -->
        <div class="services">
            <div class="text-header dropdown">
                <h2>Наши услуги:</h2>
                <div class="dropdown-icon" @click="toggleDropdown('services')">
                    <img v-if="!dropdowns.services" />
                    <img v-else />
                </div>
            </div>

            <div class="services-items dropdown-content" :class="{ show: dropdowns.services }">
                <p><a class="footer-services-text">Интернет-магазин</a></p>
                <p><a class="footer-services-text">Лендинг</a></p>
                <p><a class="footer-services-text">Корпоративный сайт</a></p>
                <p><a class="footer-services-text">Маркетплейс</a></p>
                <p><a class="footer-services-text">Файловый микросервис</a></p>
                <p><a class="footer-services-text">API-микросервис</a></p>
                <p><a class="footer-services-text">3D партнер</a></p>
            </div>
        </div>
        <!--  -->
        <div class="contact-number">
            <div class="text-header dropdown">
                <h2>Контактный номер:</h2>
                <div class="dropdown-icon" @click="toggleDropdown('contactNumber')">
                    <img v-if="!dropdowns.contactNumber" />
                    <img v-else />
                </div>
            </div>

            <div class="dropdown-content" :class="{ show: dropdowns.contactNumber }">
                <p class="footer-contact-text">+7 926 798 62 24</p>
                <p class="footer-contact-text">+7 962 945 25 65</p>
            </div>
        </div>
        <!--  -->
        <div class="mail">
            <div class="text-header dropdown">
                <h2>Почта:</h2>
                <div class="dropdown-icon" @click="toggleDropdown('email')">
                    <img v-if="!dropdowns.email" />
                    <img v-else />
                </div>
            </div>

            <div class="dropdown-content" :class="{ show: dropdowns.email }">
                <p class="footer-contact-text">infoyourcompany@com</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FooterComponent',
    data() {
        return {
            dropdowns: {
                nav: true,
                services: true,
                contactNumber: true,
                email: true,
            },
        };
    },
    methods: {
        toggleDropdown(section) {
            this.dropdowns[section] = !this.dropdowns[section];
        },
    },
};
</script>

<style scoped>
.footer-container {
    max-width: 1920px;
    margin: auto;
    background-color: var(--dark);
    padding: 40px 10px 52px;
    display: grid;
    grid-template-areas:
        "about"
        "nav"
        "services"
        "contact-number"
        "mail";
}

/* ABOUT */
.about {
    grid-area: about;
}

.nav {
    grid-area: nav;
}

.services {
    grid-area: services;
}

.contact-number {
    grid-area: contact-number;
}

.mail {
    grid-area: mail;
}

.footer-about-text {
    font-size: 16px;
    margin-top: 20px;
}

/* ABOUT */
.about {
    display: grid;
    grid-template-areas: "logo social" "about-text about-text";
}

.logo {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    color: var(--bisque);
    font-family: "Russo";
    gap: 6px;
    align-items: center;
    font-size: 14px;
    grid-area: logo;
}

.logo img {
    width: 18px;
}

.logo p {
    margin-bottom: 0px;
}

.footer-about-text {
    font-size: 14px;
    color: var(--white);
    margin-top: 12px;
    grid-area: about-text;
}

.footer-about-text span {
    font-family: "Russo";
}

.social {
    color: var(--white);
    display: flex;
    gap: 10px;
    grid-area: social;
    justify-content: end;
    align-items: center;
}

/* //////////// */
.text-header {
    width: 180px;
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 20px;
}

.text-header h2 {
    font-family: "Russo";
    font-size: 14px;
    color: var(--bisque);
}

.text-header img {
    cursor: pointer;
    margin: 10px 0;
    display: flex;
    gap: 10px;
    width: 18px;
}

.dropdown-content {
    display: none;
    margin-top: 5px;
}

.dropdown-content p {
    margin-top: 18px;
    font-size: 14px;
    color: var(--white);
}

.dropdown-content.show {
    display: block;
}

.footer-services-text,
.footer-navigation-text {
    all: unset;

}

.icon-down-open{
    color: var(--white);
}
..icon-up-open{
    color: var(--white);
}
@media (min-width: 320px) {
    .footer-container {
        padding: 40px 10px 52px;
    }

    .footer-about-text {
        font-size: 16px;
        margin-top: 20px;
    }

    /* ABOUT */
    .logo {
        gap: 6px;
        font-size: 18px;
    }

    .logo img {
        width: 24px;
    }

    .footer-about-text {
        font-size: 14px;
        margin-top: 12px;
    }

    .social {
        gap: 24px;
    }

    /* //////////// */
    .text-header {
        width: 300px;
        gap: 10px;
        margin-top: 20px;
    }

    .text-header h2 {
        font-size: 18px;
    }

    .text-header img {
        margin: 10px 0;
        gap: 10px;
        width: 18px;
    }

    .dropdown-content p {
        margin-top: 18px;
        font-size: 14px;
    }
}

@media (min-width: 640px) {
    .footer-container {
        display: grid;
        grid-template-areas:
            "about about"
            "nav services"
            "contact-number mail";
        padding: 40px 10px 52px;
        column-gap: 60px;
    }

    /* ABOUT */
    .about {
        margin-right: 100px;
    }

    .footer-about-text {
        font-size: 16px;
        margin-top: 20px;
    }

    .footer-about-text {
        font-size: 16px;
        margin-top: 20px;
    }

    .social {
        display: flex;
        gap: 24px;
    }

    /* //////////// */
    .text-header {
        min-width: 200px;
        width: 100%;
        gap: 10px;
        margin-top: 20px;
    }

    .text-header h2 {
        font-size: 20px;
    }

    .text-header img {
        margin: 10px 0;
        gap: 10px;
        width: 18px;
    }

    .text-header div {
        display: none;
    }

    .dropdown-content {
        margin-top: 5px;
    }

    .dropdown-content p {
        margin-top: 18px;
        font-size: 16px;
    }
}

@media (min-width: 1024px) {
    .footer-container {
        display: grid;
        grid-template-areas:
            "about nav services"
            "about contact-number mail";
        padding: 60px 42px 80px;
        column-gap: 70px;
    }

    /* ABOUT */
    .about {
        margin-right: 0px;
        grid-template-areas:
            "logo"
            "about-text"
            "social";
    }

    .logo {
        align-items: center;
        margin-top: 20px;
    }

    .logo img {
        width: 24px;
    }

    .footer-about-text {
        font-size: 16px;
        margin-top: 20px;
        max-width: 400px;
        margin-bottom: 170px;
    }

    .footer-about-text {
        font-size: 16px;
        margin-top: 20px;
        min-width: 320px;
    }

    .social {
        display: flex;
        justify-content: start;
        align-items: end;
        gap: 24px;
        margin-top: 10px;
    }

    /* //////////// */
    .text-header {
        width: 100%;
        gap: 10px;
        margin-top: 20px;
    }

    .text-header h2 {
        font-size: 20px;
    }

    .text-header img {
        margin: 10px 0;
        gap: 10px;
        width: 18px;
    }

    .dropdown-content {
        margin-top: 5px;
    }

    .dropdown-content p {
        margin-top: 18px;
        font-size: 16px;
    }

    .drowdown-icon {
        display: none;
    }
}

@media (min-width: 1366px) {
    .footer-container {
        display: grid;
        grid-template-areas:
            "about nav services contact-number"
            "about nav services mail";
        padding: 60px 42px 80px;
        column-gap: 70px;
    }

    /* ABOUT */
    .about {
        margin-right: 0px;
        grid-template-areas:
            "logo"
            "about-text"
            "social";
    }

    .logo {
        align-items: center;
        margin-top: 20px;
    }

    .logo img {
        width: 24px;
    }

    .footer-about-text {
        font-size: 18px;
        margin-top: 20px;
        margin-bottom: 90px;
        max-width: 400px;
        min-width: 320px;
    }

    .social {
        display: flex;
        justify-content: start;
        align-items: end;
        gap: 24px;
        margin-top: 10px;
    }

    /* //////////// */
    .text-header {
        width: 100%;
        gap: 10px;
        margin-top: 20px;
    }

    .text-header h2 {
        font-size: 20px;
    }

    .text-header img {
        margin: 10px 0;
        gap: 10px;
        width: 18px;
    }

    .dropdown-content {
        margin-top: 5px;
    }

    .dropdown-content p {
        margin-top: 12px;
        font-size: 18px;
    }
}

@media (min-width: 1920px) {
    .footer-container {
        padding: 80px 140px 100px;
    }

    /* ABOUT */
    .logo {
        align-items: center;
        margin-top: 20px;
    }

    .logo img {
        width: 24px;
    }

    .footer-about-text {
        font-size: 18px;
        margin-top: 20px;
        margin-bottom: 90px;
        max-width: 400px;
        min-width: 320px;
    }

    .social {
        display: flex;
        justify-content: start;
        align-items: end;
        gap: 24px;
        margin-top: 10px;
    }

    /* //////////// */
    .text-header {
        width: 100%;
        gap: 10px;
        margin-top: 20px;
    }

    .text-header h2 {
        font-size: 26px;
    }

    .text-header img {
        margin: 10px 0;
        gap: 10px;
        width: 18px;
    }

    .dropdown-content {
        margin-top: 5px;
    }

    .dropdown-content p {
        margin-top: 18px;
        font-size: 20px;
    }
}
</style>