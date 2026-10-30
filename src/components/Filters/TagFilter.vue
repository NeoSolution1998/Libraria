<template>
    <div class="filters__tag">
        <div class="filters__tag_header">
            <label>Теги</label>
            <ResetButton v-if="selectedTags.length" :onReset="resetTagsFilter">Сбросить</ResetButton>
        </div>

        <p v-if="isMaxTagsReached" class="max-tags-warning">Можно выбрать не более 10 тегов.</p>
        <div v-if="loadingTags" class="tags-loading">Загрузка тегов…</div>
        <p v-else-if="loadError" class="tags-error">{{ loadError }}</p>

        <div v-else class="tags">
            <button
                v-for="tag in visibleTags"
                :key="tag"
                type="button"
                :class="{ selected: selectedTags.includes(tag) }"
                @click="toggleTag(tag)"
            >
                #{{ tag }}
            </button>
        </div>

        <button v-if="hasMoreTags" type="button" class="show-more-button" @click="loadMoreTags">
            Показать ещё
        </button>

        <div v-if="selectedTags.length" class="selected-tags">
            <span v-for="tag in selectedTags" :key="tag" class="selected-tag">#{{ tag }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
import Cookies from 'js-cookie';
import ResetButton from '@/components/UI/Buttons/ResetButton.vue';

export default {
    name: "TagFilter",
    components: {
        ResetButton,
    },
    computed: {
        ...mapGetters('books', ['selectedTags']),
        isMaxTagsReached() {
            return this.selectedTags.length >= 10;
        },
        hasMoreTags() {
            return this.currentIndex < this.tags.length;
        },
    },
    data() {
        return {
            tags: [],
            visibleTags: [],
            loadStep: 10,
            currentIndex: 0,
            loadingTags: true,
            loadError: null,
        };
    },
    methods: {
        ...mapMutations('books', ['setSelectedTags', 'setCurrentPage']),
        async fetchTags() {
            try {
                const authToken = Cookies.get("auth_token") ?? "";
                const response = await axios.get(
                    `${process.env.VUE_APP_API_URL}/api/v1/categories`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            Accept: 'application/json',
                        },
                    }
                );

                const data = response.data?.data || response.data;
                this.tags = (Array.isArray(data) ? data : []).map((category) => category.name);
                this.loadMoreTags();
            } catch (error) {
                console.error('Ошибка при загрузке тегов:', error);
                this.loadError = 'Не удалось загрузить теги.';
            } finally {
                this.loadingTags = false;
            }
        },
        toggleTag(tag) {
            let next;

            if (this.selectedTags.includes(tag)) {
                next = this.selectedTags.filter((item) => item !== tag);
            } else if (!this.isMaxTagsReached) {
                next = [...this.selectedTags, tag];
            } else {
                return;
            }

            this.setSelectedTags(next);
            this.setCurrentPage(1);
            this.fetchBooks();
        },
        loadMoreTags() {
            const nextIndex = this.currentIndex + this.loadStep;
            this.visibleTags = this.tags.slice(0, nextIndex);
            this.currentIndex = nextIndex;
        },
        resetTagsFilter() {
            this.setSelectedTags([]);
            this.setCurrentPage(1);
            this.fetchBooks();
        },
        fetchBooks() {
            this.$store.dispatch('books/fetchBooks', 1);
        },
    },
    mounted() {
        this.fetchTags();
    },
};
</script>

<style scoped>
.filters__tag {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--space-4);
}

.filters__tag_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
}

.filters__tag_header label {
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    font-weight: 600;
}

.tags-loading,
.tags-error {
    margin: var(--space-2) 0 0;
    color: var(--text-muted);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
}

.tags-error {
    color: var(--danger);
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
}

.tags button {
    padding: 5px 9px;
    color: var(--text-secondary);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-full);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.tags button:hover {
    color: var(--accent);
    border-color: var(--accent);
}

.tags button.selected {
    color: var(--text-on-accent);
    background: var(--accent);
    border-color: var(--accent);
}

.show-more-button {
    align-self: flex-start;
    margin-top: var(--space-2);
    padding: 0;
    color: var(--text-muted);
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--line);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    cursor: pointer;
}

.show-more-button:hover {
    color: var(--accent);
    border-color: var(--accent);
}

.selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-3);
    padding-top: var(--space-2);
    border-top: 1px dashed var(--line);
}

.selected-tag {
    color: var(--accent-hover);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
}

.max-tags-warning {
    margin: 0 0 var(--space-2);
    color: var(--danger);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
}
</style>
