<template>
    <div class="book-main-section" v-if="book?.id">
        <div class="book-main-section__header">
            <h1>{{ book.title }}</h1>
        </div>

        <div class="book-main-section__meta-grid">
            <div class="book-main-section__author">
                <span class="label">Автор:</span>
                <span class="value">{{ book.author }}</span>
            </div>

            <div class="book-main-section__range">
                <span class="label">Рейтинг:</span>
                <span class="value">
                    <span class="icon-star"></span> {{ book.rating || 0 }}
                </span>
            </div>
        </div>

        <div class="book-main-section__description">
            <h3>Описание</h3>
            <p>{{ book.description || 'Описание отсутствует' }}</p>
        </div>

        <div class="book-main-section__details">
            <dl class="book-main-section__details-list">
                <div class="book-main-section__details-item">
                    <dt>Возрастное ограничение</dt>
                    <dd>{{ book.age_restriction || '—' }}</dd>
                </div>
                <div class="book-main-section__details-item">
                    <dt>Дата выхода</dt>
                    <dd>{{ book.release_date ? formatDate(book.release_date) : '—' }}</dd>
                </div>
                <div class="book-main-section__details-item">
                    <dt>Дата добавления на сайт</dt>
                    <dd>{{ book.created_at ? formatDate(book.created_at) : '—' }}</dd>
                </div>
                <div class="book-main-section__details-item">
                    <dt>Последнее обновление</dt>
                    <dd>{{ book.updated_at ? formatDate(book.updated_at) : '—' }}</dd>
                </div>
                <div class="book-main-section__details-item">
                    <dt>Объем</dt>
                    <dd>{{ book.volume || '—' }}</dd>
                </div>
                <div class="book-main-section__details-item">
                    <dt>Количество глав</dt>
                    <dd>{{ book.chapters_count || '—' }}</dd>
                </div>
                <div class="book-main-section__details-item">
                    <dt>Издательство</dt>
                    <dd>{{ book.publisher || '—' }}</dd>
                </div>
                <div class="book-main-section__details-item">
                    <dt>Время чтения</dt>
                    <dd>{{ book.reading_time || '—' }}</dd>
                </div>
            </dl>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";

export default {
    name: 'BookMainSection',
    computed: {
        ...mapState({
            book: state => state.book.book,
        })
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return '—';
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }
}
</script>
<style scoped>
/* Using global styles from main.css with .book-main-section, .book-main-section__details, etc. */
</style>