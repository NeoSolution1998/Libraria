<template>
    <div class="subscriptions__container">
        <div class="subscriptions__header">
            <!-- <h1>Выберите план подписки</h1> -->
        </div>
        <div class="subscriptions__list">
            <div class="subscriptions__list_item" v-for="subscription in subscriptions" :key="subscription.id">
                <div class="subscriptions__item_header">
                    <h2>{{ subscription.name }}</h2>
                    <p class="access-level">{{ subscription.access_level }}</p>
                </div>
                <div class="subscriptions__item_content">
                    <p>Доступ к тысячам книг</p>
                    <p><strong>Без рекламы</strong></p>
                    <p><strong>Стать автором</strong></p>
                    <p>Ежемесячные обновления</p>
                    <p>Скидки на книги и аудиокниги</p>
                </div>
                <div class="subscriptions__item_footer">
                    <p class="duration">Длительность: {{ subscription.duration_months }} мес</p>
                    <p class="price">Цена: {{ subscription.price }}р</p>
                    <div class="cta">
                        <a href="#" class="subscribe-btn">Оформить подписку</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";


export default {

    name: "SubscriptionsComponent",
    data() {
        return {

        }
    },
    computed: {
        ...mapState({
            subscriptions: state => state.subscriptions.subscriptions,
        }),
    },
    methods: {
        ...mapActions({
            getSubscriptions: "subscriptions/getSubscriptions",

        }),
    },

    mounted() {
        this.getSubscriptions();
    },
};
</script>

<style scoped>
.subscriptions__container {
    max-width: 1600px;
    margin: auto;
    padding: 10px 40px;
}

.subscriptions__header {
    text-align: center;
    margin-bottom: 40px;
}

.subscriptions__header h1 {
    font-size: 48px;
    font-weight: 200;
    color: var(--dark-muted);
    font-family: "Russo";
    text-shadow: 0px 4px 10px rgba(94, 114, 62, 0.4);
}

.subscriptions__list {
    max-width: 1600px;
    margin: auto;
    margin-top: 40px;
    padding: 50px 20px;
    background-color: var(--white);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    font-family: "Rubik-Medium";
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
}

.subscriptions__list_item {
    padding: 20px;
    border-radius: 15px;
    background: linear-gradient(145deg, #ffffff, #ececff);
    box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.1), -8px -8px 15px rgba(255, 255, 255, 1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.subscriptions__list_item:hover {
    transform: translateY(-5px);
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.2);
}

.subscriptions__item_header {
    background: linear-gradient(90deg, #15588f 0%, #143764 100%);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    color: #fff;
    box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.2);
}

.subscriptions__item_header h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
}

.subscriptions__item_header p {
    font-size: 14px;
    font-weight: 500;
    margin: 5px 0 0;
    opacity: 0.8;
}

.subscriptions__item_content {
    margin: 20px 0;
    color: #333;
    font-size: 16px;
    line-height: 1.6;
}

.subscriptions__item_content p {
    margin: 5px 0;
    position: relative;
    padding-left: 20px;
}

.subscriptions__item_content p::before {
    content: "✔";
    position: absolute;
    left: 0;
    color: #15588f;
    font-weight: bold;
}

.subscriptions__item_footer {
    padding: 15px;
    background: linear-gradient(145deg, #ffffff, #f1f1ff);
    border-radius: 10px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.duration {
    font-size: 14px;
    color: #666;
}

.price {
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0;
    color: var(--dark-muted);
}

.cta {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    background: linear-gradient(90deg, #0b8542 0%, #29962e 100%);
    padding: 10px 20px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.cta:hover {
    background: linear-gradient(90deg, #1a661a 0%, #187437 100%);
    transform: scale(1.05);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

.cta a {
    text-decoration: none;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
}

.subscribe-btn {
    font-size: 16px;
}

/* Стили для крупных экранов (1024px и больше) */
@media (max-width: 1024px) {
    .subscriptions__container {
        padding: 20px 15px;
    }
    .subscriptions__header{
        margin-bottom: 0;
    }
    .subscriptions__header h1 {
        font-size: 36px;
        
    }

    /* Делаем список горизонтальным слайдером */
    .subscriptions__list {
        display: flex;
        overflow-x: auto;
        gap: 20px;
        margin-top: 0px;
        scroll-snap-type: x mandatory;
        padding: 10px; /* Дополнительный отступ для удобства */
    }

    /* Стили для каждого элемента внутри слайдера */
    .subscriptions__list_item {
        flex: 0 0 100%; /* Занимает 90% ширины видимой области */
        max-width: 100%;
        scroll-snap-align: center; /* Центрирование элемента */
        padding: 15px;
        border-radius: 10px;
        background: linear-gradient(145deg, #ffffff, #ececff);
        box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.1), -8px -8px 15px rgba(255, 255, 255, 1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .subscriptions__list_item:hover {
        transform: scale(1.02);
    }

    .subscriptions__item_header h2 {
        font-size: 22px;
    }

    .subscriptions__item_content {
        font-size: 14px;
    }

    .price {
        font-size: 18px;
    }

    .cta {
        padding: 8px 15px;
    }

    .cta a {
        font-size: 14px;
    }

    /* Скрываем вертикальные полосы прокрутки */
    .subscriptions__list::-webkit-scrollbar {
        display: none;
    }
    .subscriptions__list {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
}

/* Стили для средних экранов (640px - 1024px) */
@media (max-width: 640px) {
    .subscriptions__container {
        padding: 20px 10px;
    }

    .subscriptions__header h1 {
        font-size: 30px;
    }

    .subscriptions__list {
        display: flex;
        overflow-x: auto;
        gap: 15px;
        scroll-snap-type: x mandatory;
        padding: 10px;
    }

    .subscriptions__list_item {
        flex: 0 0 100%; /* Занимает 90% ширины видимой области */
        max-width: 100%;
        padding: 15px;
        border-radius: 10px;
    }

    .subscriptions__item_header {
        padding: 10px;
    }

    .subscriptions__item_header h2 {
        font-size: 20px;
    }

    .subscriptions__item_content {
        font-size: 13px;
    }

    .price {
        font-size: 16px;
    }

    .cta {
        padding: 8px 12px;
    }

    .cta a {
        font-size: 14px;
    }
}

/* Стили для небольших экранов (440px и меньше) */
@media (max-width: 440px) {
    .subscriptions__container {
        padding: 20px 10px;
    }

    .subscriptions__header h1 {
        font-size: 24px;
    }

    .subscriptions__list {
        display: flex;
        overflow-x: auto;
        gap: 15px;
        scroll-snap-type: x mandatory;
        padding: 10px;
    }

    .subscriptions__list_item {
        flex: 0 0 100%;
        max-width: 100%;
        padding: 10px;
        border-radius: 8px;
    }

    .subscriptions__item_header {
        padding: 8px;
    }

    .subscriptions__item_header h2 {
        font-size: 18px;
    }

    .subscriptions__item_content {
        font-size: 12px;
    }

    .subscriptions__item_content p {
        padding-left: 15px;
    }

    .price {
        font-size: 14px;
    }

    .cta {
        padding: 6px 10px;
        border-radius: 20px;
    }

    .cta a {
        font-size: 12px;
    }
}

</style>