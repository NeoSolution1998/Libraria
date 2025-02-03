<template>
    <div class="user_section__container">
        <div class="user_section__banner_block">
            <div class="user_section__banner">
                <div class="user_section__banner_icon">
                    <span class="icon-pencil"></span>
                </div>

                <img src="/images/user_default.jpg" alt="">
            </div>
        </div>

        <div class="user_section__content">
            <div>
                <h3>Роберт Мартин</h3>
                <p>robert@gmail.com</p>
                <div class="user_section__content_text">
                    <p>Автор</p>
                    <p>Креативщик</p>
                </div>

            </div>

            <div class="user_section__button">
                <button type="submit" class="followers_button">Подписаться</button>
                <button type="submit" class="message_button">Написать</button>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    name: "UserSection"
}
</script>
<style scoped>
/* Основные стили для десктопной версии */
.user_section__container {
    border-radius: 20px;
    background: linear-gradient(to bottom, var(--dark-muted) 40%, var(--white) 40%);
    padding: 15px;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.user_section__banner_block {
    display: flex;
    justify-content: center;
}

.user_section__banner {
    width: 300px;
    height: 300px;
    position: relative;
    display: inline-block;
}

.user_section__banner img {
    max-width: 100%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10%; border: 
    5px solid var(--white);
    display: block;
}

.user_section__banner_icon {
    background-color: var(--white);

    border-radius: 50%;
    width: 35px;
    height: 35px;
    position: absolute;
    right: -4px;
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--dark-muted);
    font-size: 20px;
}

.user_section__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.user_section__content div h3 {
    font-family: "Russo";
    font-size: 25px;
    margin-bottom: 5px;
}

.user_section__content_text {
    display: flex;
    gap: 5px;
}

.user_section__content div p {
    font-size: 18px;
    font-family: "Rubik-Medium";
    color: var(--gray);
    margin-bottom: 5px;
}

.user_section__button {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.followers_button {
    border: none;
    padding: 10px;
    background-color: var(--dark-muted);
    color: var(--white);
    border-radius: 8px;
}

.message_button {
    border: none;
    padding: 10px;
    background-color: var(--green-light);
    color: var(--white);
    border-radius: 8px;
}

/* Стили для мобильной версии */
@media (max-width: 1024px) {
    .user_section__container {
        background: linear-gradient(to bottom, var(--dark-muted) 40%, var(--white) 40%);
        align-items: center;
        padding: 0;
    }

    .user_section__banner_block {
        position: relative;
        width: 100%;
   
        /* Высота верхней части */
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    .user_section__banner {
        width: 200px;
        height: 200px;
      
        border-radius: 20%;

        position: absolute;
        bottom: -30px;
    }

    .user_section__banner img {
        border-radius: 20%;
    }

    .user_section__content {
        margin-top: 10px;
        text-align: center;
        gap: 15px;
        padding: 0 15px;
    }

    .user_section__content div h3 {
        font-size: 16px;
    }

    .user_section__content_text {
        justify-content: center;
        gap: 10px;
    }

    .user_section__content div p {
        font-size: 12px;
    }

    .user_section__button {
        gap: 5px;
        margin-bottom: 10px;
    }

    .followers_button,
    .message_button {
        width: 100%;
    padding: 5px;
    border-radius: 4px;
    font-size: 14px;
    }
}
/* Стили для мобильной версии */
@media (max-width: 1024px) {
    .user_section__container {
        background: linear-gradient(to bottom, var(--dark-muted) 40%, var(--white) 40%);
        align-items: center;
        padding: 0;
    }

    .user_section__banner_block {
        position: relative;
        width: 100%;
        height: 200px;
        /* Высота верхней части */
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    .user_section__banner {
        width: 200px;
        height: 200px;
       
        border-radius: 20%;

        position: absolute;
        bottom: -30px;
    }

    .user_section__banner img {
        border-radius: 20%;
    }

    .user_section__content {
        margin-top: 10px;
        text-align: center;
        gap: 15px;
        padding: 0 15px;
    }

    .user_section__content div h3 {
        font-size: 16px;
    }

    .user_section__content_text {
        justify-content: center;
        gap: 10px;
    }

    .user_section__content div p {
        font-size: 12px;
    }

    .user_section__button {
        gap: 5px;
        margin-bottom: 10px;
    }

    .followers_button,
    .message_button {
        width: 100%;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
    }
}
</style>