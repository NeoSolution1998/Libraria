<template>
    <div class="filters__range">
        <div class="filters__range_header">
            <label>Рейтинг</label>
            <ResetButton :onReset="resetRangeFilter">Сбросить</ResetButton>
        </div>

        <div class="rating">
            <span v-for="star in 5" :key="star" @click="setRating(star)" @mouseover="hoverRating(star)"
                @mouseleave="resetHover" :class="{ filled: star <= (hoveredRating || selectedRating) }">
                <icon-vue class="icon-star"></icon-vue>
            </span>
        </div>
        <p>Выбранный рейтинг: {{ selectedRating }}</p>
    </div>
</template>

<script>
export default {
    name: "RangeFilter",
    data() {
        return {
            selectedRating: 0, // Текущий выбранный рейтинг
            hoveredRating: 0,  // Рейтинг при наведении
        };
    },
    methods: {
        setRating(rating) {
            this.selectedRating = rating; // Устанавливаем выбранный рейтинг
        },
        hoverRating(rating) {
            this.hoveredRating = rating; // Обновляем значение при наведении
        },
        resetHover() {
            this.hoveredRating = 0; // Сбрасываем hover, если мышь ушла
        },
        resetRangeFilter() {
            this.selectedRating = 0;
        }
    }
};
</script>

<style scoped>
.filters__range {
    display: flex;
    flex-direction: column;

}

.filters__range_header {
    display: flex;
    justify-content: space-between
}

.filters__range_header label {
    font-size: 18px;
}

.filters__range p {
    color: var(--blue);
    margin-bottom: 5px;
}

.rating {
    display: flex;
    gap: 0px;
    font-size: 30px;
    color: #ccc;
    cursor: pointer;
}

.rating span {
    transition: color 0.2s ease-in-out;
}

.rating span.filled {
    color: #ffc107;
    /* Цвет для заполненной звезды (золотой) */
}

.rating span:hover {
    transform: scale(1.2);
    /* Небольшое увеличение при наведении */
}

@media(max-width:440px) {


    .filters__range_header label {
        font-size: 14px;
    }

    .filters__range p {
        color: var(--blue);
        margin-bottom: 5px;
        font-size: 14px;
    }

    .rating {
        display: flex;
        gap: 0px;
        font-size: 18px;
        color: #ccc;
        cursor: pointer;
    }

    .rating span {
        transition: color 0.2s ease-in-out;
    }

    .rating span.filled {
        color: #ffc107;
        /* Цвет для заполненной звезды (золотой) */
    }

    .rating span:hover {
        transform: scale(1.2);
        /* Небольшое увеличение при наведении */
    }
}
</style>
