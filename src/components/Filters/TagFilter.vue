<template>
    <div class="filters__tag">
        <div class="filters__tag_header">
            <label>Теги</label>
            <ResetButton :onReset="resetTagsFilter">Сбросить</ResetButton>
        </div>
        <p v-if="isMaxTagsReached" class="max-tags-warning">
            Вы можете выбрать не более 10 тегов.
        </p>
        <div class="tags">
            <span v-for="tag in visibleTags" :key="tag" @click="toggleTag(tag)"
                :class="{ selected: selectedTags.includes(tag) }">
                #{{ tag }}
            </span>
        </div>
        <button v-if="hasMoreTags" @click="loadMoreTags" class="show-more-button">Показать еще</button>
        <div>
            <p>Выбранные теги:</p>
        </div>
        <div class="selected-tags">

            <span v-for="tag in selectedTags" :key="tag" class="selected-tag">
                #{{ tag }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "TagFilter",
    data() {
        return {
            tags: [
                "Фантастика", "Детектив", "История", "Романтика", "Приключения", "Фэнтези", "Триллер",
                "Документалистика", "Научная литература", "Юмор", "Психология", "Биография",
                "Путешествия", "Мистика", "Драма", "Комедия", "Поэзия", "Философия",
                "Кулинария", "Мода", "Спорт", "Технологии", "Искусство", "Музыка",
                "Кино", "Наука", "Образование", "Здоровье", "Природа", "Астрономия"
            ],
            // Список видимых тегов
            visibleTags: [],
            // Список выбранных тегов
            selectedTags: [],
            // Сколько тегов показываем за один раз
            loadStep: 10,
            // Текущая позиция загрузки
            currentIndex: 0
        };
    },
    computed: {
        // Проверяем, достигнут ли максимум выбранных тегов
        isMaxTagsReached() {
            return this.selectedTags.length >= 10;
        },
        // Проверяем, есть ли еще теги для загрузки
        hasMoreTags() {
            return this.currentIndex < this.tags.length;
        }
    },
    methods: {
        // Переключение выбора тегов
        toggleTag(tag) {
            if (this.selectedTags.includes(tag)) {
                // Удаляем тег, если он уже выбран
                this.selectedTags = this.selectedTags.filter((t) => t !== tag);
            } else if (!this.isMaxTagsReached) {
                // Добавляем тег, если он не выбран и максимум не достигнут
                this.selectedTags.push(tag);
            }
        },
        // Загружаем дополнительные теги
        loadMoreTags() {
            const nextIndex = this.currentIndex + this.loadStep;
            this.visibleTags = this.tags.slice(0, nextIndex);
            this.currentIndex = nextIndex;
        },
        resetTagsFilter() {
            this.selectedTags = [];
        }
    },
    mounted() {
        // Изначально загружаем первые 10 тегов
        this.loadMoreTags();
    }
};
</script>

<style scoped>
.filters__tag {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.filters__tag_header {
    display: flex;
    justify-content: space-between;
}

.filters__tag_header label {
    font-size: 18px;
}

.tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

span {
    padding: 5px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    user-select: none;
    font-size: 14px;
}

span.selected {
    background-color: var(--green-light);
    color: white;
    border-color: var(--green-light);
}

.show-more-button {
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: var(--green-light);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease-in-out;
}

.show-more-button:hover {
    background-color: #0056b3;
}

.selected-tags {

    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.selected-tags p {
    font-size: 16px;
    margin-bottom: 0px;
}

.selected-tag {
    background-color: #f8f9fa;
    padding: 5px 5px;
    border-radius: 4px;
}

.max-tags-warning {
    color: red;
    font-size: 16px;
    margin-top: 10px;
}

@media(max-width:440px) {
    .filters__tag {
        margin-bottom: 6px;
    }

    .filters__tag_header label {
        font-size: 14px;
    }

    .tags {
        gap: 3px;
        flex-wrap: wrap;
    }

    span {
        padding: 3px 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 10px;
    }

    .show-more-button {
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease-in-out;
    }

    .show-more-button:hover {
        background-color: #0056b3;
    }

    .selected-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .selected-tags p {
        font-size: 14px;
        margin-bottom: 0px;
    }

    .selected-tag {
        background-color: var(--green);
        padding: 4px 4px;
        border-radius: 4px;
    }

    .max-tags-warning {
        color: red;
        font-size: 12px;
        margin-top: 10px;
        margin: 0px
    }


}
</style>
