<template>
    <div class="profile_main_section__container">
        <div class="main_section__header">
            <h3 class="main_section__header__name">Robert Martin</h3>
            <p>Сегодня, в 11:36</p>
        </div>
        <hr class="profile__separator" />

        <div class="profile_main_section__content">

            <div class="profile_main_section__details">
                <div class="profile_main_section__details-column">
                    <h5>Дата роджения:</h5>
                    <p>14.11.1967</p>
                </div>
                <hr class="profile__separator" />
                <div class="profile_main_section__details-column">
                    <h5>Город:</h5>
                    <p>Вашингтон</p>
                </div>
                <hr class="profile__separator" />
                <div class="profile_main_section__details-column">
                    <h5>Telegram:</h5>
                    <p>@robertMartin</p>
                </div>
                <hr class="profile__separator" />
                <div class="profile_main_section__details-column">
                    <h5>Телефон:</h5>
                    <p>938 2832 2323</p>
                </div>
                <hr class="profile__separator" />
                <div class="profile_main_section__details-column">
                    <h5>Дата регистрации:</h5>
                    <p>17.01.2024</p>
                </div>
            </div>

            <!--  <div class="profile_main_section__links">
                <p class="profile_main_section__link">Мои книги</p>
                <p class="profile_main_section__link">Мои статьи</p>
            </div> -->

            <!-- <div class="profile_main_section__stats">
                <div class="profile_main_section__stats-item">

                    <p class="profile_main_section__stats-label">Книг</p>
                    <p class="profile_main_section__stats-number">12</p>
                </div>
                <div class="profile_main_section__stats-item">

                    <p class="profile_main_section__stats-label">Прочитано</p>
                    <p class="profile_main_section__stats-number">10</p>
                </div>
                <div class="profile_main_section__stats-item">

                    <p class="profile_main_section__stats-label">Сохранено</p>
                    <p class="profile_main_section__stats-number">57</p>
                </div>
                <div class="profile_main_section__stats-item">

                    <p class="profile_main_section__stats-label">Лайки</p>
                    <p class="profile_main_section__stats-number">245</p>
                </div>
                <div class="profile_main_section__stats-item">

                    <p class="profile_main_section__stats-label">Друзья</p>
                    <p class="profile_main_section__stats-number">24</p>
                </div>
                <div class="profile_main_section__stats-item">

                    <p class="profile_main_section__stats-label">Подписчики</p>
                    <p class="profile_main_section__stats-number">56</p>
                </div>
            </div> -->
        </div>
    </div>

</template>
<script>
export default {
    name: "MainSection"
}
</script>
<style scoped>
.profile_main_section__container {
    background-color: var(--white);
    padding: 40px;
    border-radius: 30px;
}

.main_section__header {
    display: flex;
    justify-content: space-between;
    align-items: end;
}

.main_section__header__name {
    font-family: Russo;
    font-size: 30px;
    color: var(--dark-muted);
    margin: 0px;

}

.main_section__header p {
    font-family: Rubik-Medium;
    color: var(--gray);
    margin: 0%;

}

.profile__separator {
    margin-top: 5px;
    margin: 0px;
}

/*  */
.profile_main_section__content {
    display: grid;
    grid-template-areas:
        "details details"
        'stats stats';
    grid-template-columns: 2fr 4fr;
    gap: 10px;
}

.profile_main_section__details {
    grid-area: details;
    display: flex;
    flex-direction: column;

    background-color: var(--white);
    border-radius: 20px;
    padding: 10px 20px;
    margin-top: 10px;

}

.profile_main_section__details-column {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    gap: 40px;
}

.profile_main_section__details-column p {
    display: flex;
    flex-direction: column;
    align-items: end;
    color: var(--gray);
    font-size: 22px;

}

.profile_main_section__details-column h5 {
    display: flex;
    flex-direction: column;
    font-size: 22px;
    font-family: Russo;
    color: var(--dark-muted);

}

/*  */
.profile_main_section__links {
    grid-area: links;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;


}

.profile_main_section__link {}

.profile_main_section__stats {
    grid-area: stats;
    background-color: var(--light);
    border-radius: 20px;
    padding: 10px 40px;
    display: flex;
    gap: 10px;
    justify-content: center;

}

.profile_main_section__stats-item {
    font-family: Russo;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    width: 120px;

}

.profile_main_section__stats-number {
    font-size: 30px;
    color: var(--green-light);
}

.profile_main_section__stats-label {
    font-size: 20px;
}

@media(max-width:640px) {
    .profile_main_section__container {
        background-color: var(--white);
        padding: 20px 15px;
        border-radius: 10px;
    }

    .main_section__header {
        display: flex;
        justify-content: space-between;
        align-items: start;
    }

    .main_section__header h3 {

        font-size: 18px;
    }

    .main_section__header p {

        font-size: 14px;
    }

    .profile_main_section__links {
        flex-direction: row;
        justify-content: center;
        gap: 20px;
    }

    .profile_main_section__link {}

    .profile_main_section__content {
        display: grid;
        grid-template-areas:
            "details"
            'links'
            'stats';
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .profile_main_section__details {
        grid-area: details;
        display: flex;
        justify-content: space-between;
        background-color: var(--light);
        border-radius: 10px;
        padding: 1px 10px;
        margin-top: 10px;
    }

    .profile_main_section__details-column h5 {
        font-size: 16px;
    }

    .profile_main_section__details-column p {
        font-size: 14px;

    }

    .profile_main_section__stats {
        grid-area: stats;
        overflow: scroll;
        border-radius: 8px;
    }

    .profile_main_section__stats-item {
        font-family: Russo;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        width: 120px;
    }

    .profile_main_section__stats-number {
        font-size: 20px;
        color: var(--green-light);
    }

    .profile_main_section__stats-label {
        font-size: 14px;
    }
}
</style>