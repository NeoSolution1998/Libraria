<template>
    <div :class="[isNightMode ? 'night-mode' : 'day-mode']" :style="{ backgroundColor: pageBackgroundColor }">
        <header-vue></header-vue>

        <div class="container">
            <div class="chapter-selector-container">
                <div class="btn-group dropend">
                    <button type="button" class="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Выберите главу
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="chapter in allChapters" :key="chapter.id">
                            <a class="dropdown-item" @click="selectChapter(chapter.id)">
                                {{ chapter.title }}
                            </a>
                        </li>
                    </ul>
                </div>
                <button @click="toggleSettingsPanel" class="settings-button">
                    <i class="fas fa-cogs"></i>
                </button>
            </div>

            <div v-if="showSettingsPanel" class="settings-panel">
                <div>
                    <label for="textSize">Размер текста:</label>
                    <input type="range" id="textSize" min="14" max="30" v-model="textSize">
                </div>
                <div>
                    <label for="textColor">Цвет текста:</label>
                    <input type="color" id="textColor" v-model="textColor">
                </div>
                <div>
                    <label for="pageBackgroundColor">Цвет фона страницы:</label>
                    <input type="color" v-model="pageBackgroundColor">
                </div>
            </div>

            <div class="main-body">
                <div class="card" :style="cardStyles">
                    <div class="card-body chapter-content" :style="chapterStyles">
                        <div v-if="chapter">
                            <h1>{{ chapter.title }}</h1>
                            <p>{{ chapter.content }}</p>
                        </div>
                        <div v-else>
                            <p>Загрузка главы...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="navigation-buttons">
                <button @click="goToPreviousChapter" class="btn btn-outline-dark mx-2" :disabled="!canGoToPreviousChapter"><</button>
                <button class="btn btn-outline-dark mx-2">
                    <router-link :to="{ name: 'Book', params: { id: this.$route.params.bookId } }" style="text-decoration: none; color: inherit;">
                        Оглавление
                    </router-link>
                </button>
                <button @click="goToNextChapter" class="btn btn-outline-dark mx-2" :disabled="!canGoToNextChapter">></button>
            </div>
        </div>

        <footer-vue></footer-vue>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "Chapter",

    data() {
        return {
            isNightMode: false,
            textSize: 16,
            textColor: "#000000",
            pageBackgroundColor: "#ffffff",
            showSettingsPanel: false,
        };
    },

    computed: {
        ...mapState('chapters', {
            chapter: state => state.chapter,
            allChapters: state => state.allChapter || [], // Инициализируем как пустой массив
        }),

        chapterStyles() {
            return {
                fontSize: `${this.textSize}px`,
                color: this.textColor,
            };
        },

        cardStyles() {
            return {
                backgroundColor: this.pageBackgroundColor,
                color: this.textColor,
            };
        },

        canGoToPreviousChapter() {
            const index = this.allChapters.findIndex(chapter => chapter.id === this.chapter?.id);
            return index > 0;
        },

        canGoToNextChapter() {
            const index = this.allChapters.findIndex(chapter => chapter.id === this.chapter?.id);
            return index >= 0 && index < this.allChapters.length - 1;
        },
    },

    methods: {
        ...mapActions('chapters', {
            fetchChapter: "fetchChapter",
            fetchAllChapters: "fetchAllChapters",
        }),

        toggleSettingsPanel() {
            this.showSettingsPanel = !this.showSettingsPanel;
        },

        selectChapter(chapterId) {
            const { bookId } = this.$route.params;
            this.$router.push({ name: 'Chapter', params: { bookId, chapterId } });
            this.fetchChapter({ bookId, chapterId });
        },

        fetchAllChaptersIfNeeded() {
            if (!this.allChapters.length) {
                const { bookId } = this.$route.params;
                this.fetchAllChapters(bookId);
            }
        },

        goToPreviousChapter() {
            const currentChapterIndex = this.allChapters.findIndex(chapter => chapter.id === this.chapter.id);
            if (currentChapterIndex > 0) {
                const previousChapterId = this.allChapters[currentChapterIndex - 1].id;
                this.selectChapter(previousChapterId);
            }
        },

        goToNextChapter() {
            const currentChapterIndex = this.allChapters.findIndex(chapter => chapter.id === this.chapter.id);
            if (currentChapterIndex < this.allChapters.length - 1) {
                const nextChapterId = this.allChapters[currentChapterIndex + 1].id;
                this.selectChapter(nextChapterId);
            }
        },
    },

    mounted() {
        const { bookId, chapterId } = this.$route.params;
        this.fetchChapter({ bookId, chapterId });
        this.fetchAllChaptersIfNeeded();
    },

    watch: {
        '$route.params.bookId': function(newBookId) {
            this.fetchAllChaptersIfNeeded();
        },
    },
};
</script>

<style scoped>
.day-mode {
    color: #000000;
    background-color: #ffffff;
}

.night-mode {
    color: #f5f5f5;
    background-color: #333333;
}

.chapter-selector-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.settings-button {
    background: #414242; 
    color: #ffffff; 
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.settings-button i {
    font-size: 20px;
}

.settings-panel {
    top: 60px;
    right: 10px; 
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #ffffff;
    border: 1px solid #dddddd; 
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    z-index: 999; 
}

.settings-panel {
    color: #000000; 
}

.settings-panel label {
    margin-right: 10px;
}

.settings-panel input[type="range"] {
    width: 100px; 
}

.settings-panel input[type="color"] {
    margin-left: 10px;
}

.container {
    padding: 20px;
}

.main-body {
    margin-top: 20px;
}

.card {
    border-radius: 15px;
    padding: 20px;
}

.card-body {
    border-radius: 15px;
}

.chapter-content {
    padding: 20px;
    border-radius: 15px;
}

/* Кнопки "Назад", "Далее", "Оглавление" */
.navigation-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
</style>
