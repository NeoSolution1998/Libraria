<template>
    <div class="book-sidebar-section" v-if="book?.id">
        <div class="book-cover-wrapper">
            <div class="book-cover-main">
                <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" @error="book.cover_image = null" loading="eager">
                <img v-else :src="fallbackCover" :alt="book.title" loading="eager">
                <div v-if="book.age_restriction" class="book-age-badge">{{ book.age_restriction }}+</div>
            </div>

            <div class="book-cover-stats" v-if="book">
                <div class="stat-item">
                    <span class="stat-value">{{ formatNumber(book.views_count) }}</span>
                    <span class="stat-label">Просмотров</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">{{ formatNumber(book.likes_count) }}</span>
                    <span class="stat-label">Лайков</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">{{ formatNumber(book.comments_count) }}</span>
                    <span class="stat-label">Комментариев</span>
                </div>
            </div>
        </div>

        <div class="book-tags" v-if="book.genres?.length || book.categories?.length || book.tags?.length">
            <span
                class="tag"
                v-for="genre in book.genres || book.categories || book.tags || []"
                :key="genre.id || genre"
            >{{ genre.name || genre }}</span>
        </div>

        <div class="book-sidebar-section__actions" v-if="book?.id">
            <router-link
                v-if="firstChapterId"
                :to="{ name: 'Chapter', params: { bookId: book.id, chapterId: firstChapterId } }"
                class="btn btn-primary btn-lg btn-read"
            >
                <span class="icon-play"></span> Читать с начала
            </router-link>
            <span v-else class="btn btn-primary btn-lg btn-read btn-read--disabled" aria-disabled="true">
                <span class="icon-play"></span> {{ chaptersLoading ? 'Ищем главы…' : 'Глав пока нет' }}
            </span>
            <router-link
                v-if="book.last_read_chapter_id"
                :to="{ name: 'Chapter', params: { bookId: book.id, chapterId: book.last_read_chapter_id } }"
                class="btn btn-secondary btn-lg btn-continue"
            >
                <span class="icon-bookmark"></span> Продолжить (Глава {{ book.last_read_chapter_number }})
            </router-link>
        </div>

        <div class="book-meta-info" v-if="book">
            <div class="meta-row">
                <span class="meta-label">Автор:</span>
                <span class="meta-value">{{ book.author }}</span>
            </div>
            <div class="meta-row" v-if="book.publisher">
                <span class="meta-label">Издательство:</span>
                <span class="meta-value">{{ book.publisher }}</span>
            </div>
            <div class="meta-row" v-if="book.release_date">
                <span class="meta-label">Год издания:</span>
                <span class="meta-value">{{ formatYear(book.release_date) }}</span>
            </div>
            <div class="meta-row" v-if="book.volume">
                <span class="meta-label">Объем:</span>
                <span class="meta-value">{{ book.volume }} стр.</span>
            </div>
            <div class="meta-row" v-if="book.chapters_count">
                <span class="meta-label">Глав:</span>
                <span class="meta-value">{{ book.chapters_count }}</span>
            </div>
            <div class="meta-row" v-if="book.reading_time">
                <span class="meta-label">Время чтения:</span>
                <span class="meta-value">{{ book.reading_time }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { mapState } from "vuex";

const fallbackCovers = [
    '/images/books/books_default1.jpg',
    '/images/books/books_default3.jpg',
    '/images/books/books_default4.jpg',
    '/images/books/books_default5.jpg',
    '/images/books/books_default6.jpg',
    '/images/books/books_default7.jpg',
];

export default {
    name: 'BookSidebarSection',
    data() {
        return {
            firstChapterId: null,
            chaptersLoading: false,
        };
    },
    computed: {
        ...mapState({
            book: state => state.book.book,
        }),
        fallbackCover() {
            const index = Math.abs(Number(this.book?.id) || 0) % fallbackCovers.length;
            return fallbackCovers[index];
        },
    },
    async mounted() {
        await this.loadFirstChapter();
    },
    methods: {
        async loadFirstChapter() {
            const bookId = this.book?.id || this.$route.params.id;

            if (!bookId) return;

            this.chaptersLoading = true;

            try {
                const token = Cookies.get('auth_token') || '';
                const response = await axios.get(
                    `${process.env.VUE_APP_API_URL}/api/v1/books/${bookId}/chapters`,
                    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
                );
                const data = response.data?.data || response.data;
                const chapters = Array.isArray(data) ? data : [];
                this.firstChapterId = chapters[0]?.id || null;
            } catch (error) {
                console.error('Не удалось получить первую главу:', error);
            } finally {
                this.chaptersLoading = false;
            }
        },
        formatNumber(num) {
            if (!num) return '0';
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num.toString();
        },
        formatYear(dateString) {
            if (!dateString) return '—';
            return new Date(dateString).getFullYear().toString();
        }
    }
}
</script>
<style scoped>
.btn-read--disabled {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 100%;
    opacity: 0.65;
    cursor: default;
}
</style>