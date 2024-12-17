<template>
    <header-vue></header-vue>
    <Breadcrumbs></Breadcrumbs>
    <div class="container my-5">
        <h1 class="text-center mb-4">Добавить книгу</h1>
        <form @submit.prevent="submitBook" class="bg-light p-4 rounded shadow-sm">
            <div class="form-group mb-4">
                <label for="title" class="form-label">Название</label>
                <input type="text" id="title" class="form-control" v-model="book.title"
                    placeholder="Введите название книги" />
                <div class="text-danger mt-1" v-if="errors.title">{{ errors.title }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="author" class="form-label">Автор</label>
                <input type="text" id="author" class="form-control" v-model="book.author"
                    placeholder="Введите имя автора" />
                <div class="text-danger mt-1" v-if="errors.author">{{ errors.author }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="description" class="form-label">Описание</label>
                <textarea id="description" class="form-control" v-model="book.description" rows="5"
                    placeholder="Введите описание книги"></textarea>
                <div class="text-danger mt-1" v-if="errors.description">{{ errors.description }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="cover_image" class="form-label">Обложка (необязательно)</label>
                <input type="file" id="cover_image" class="form-control" @change="onFileChange" />
                <div class="text-danger mt-1" v-if="errors.cover_image">{{ errors.cover_image }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="author_bio" class="form-label">Биография автора (необязательно)</label>
                <input type="text" id="author_bio" class="form-control" v-model="book.author_bio"
                    placeholder="Введите биографию автора" />
                <div class="text-danger mt-1" v-if="errors.author_bio">{{ errors.author_bio }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="language" class="form-label">Язык (необязательно)</label>
                <input type="text" id="language" class="form-control" v-model="book.language"
                    placeholder="Введите язык книги" />
                <div class="text-danger mt-1" v-if="errors.language">{{ errors.language }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="rating" class="form-label">Рейтинг (необязательно)</label>
                <input type="number" id="rating" class="form-control" v-model="book.rating"
                    placeholder="Введите рейтинг книги" />
                <div class="text-danger mt-1" v-if="errors.rating">{{ errors.rating }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="number_of_pages" class="form-label">Количество страниц (необязательно)</label>
                <input type="number" id="number_of_pages" class="form-control" v-model="book.number_of_pages"
                    placeholder="Введите количество страниц" />
                <div class="text-danger mt-1" v-if="errors.number_of_pages">{{ errors.number_of_pages }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="categories" class="form-label">Категории (необязательно)</label>
                <select id="categories" class="form-control" multiple v-model="book.categories">
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
                <div class="text-danger mt-1" v-if="errors.categories">{{ errors.categories }}</div>
            </div>

            <button type="submit" class="btn btn-primary w-100">Добавить книгу</button>
        </form>
    </div>
    <footer-vue></footer-vue>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            book: {
                title: '',
                author: '',
                description: '',
                cover_image: null,
                author_bio: '',
                language: '',
                rating: null,
                number_of_pages: null,
                is_published: false,
                categories: []
            },
            errors: {},
            categories: [] // Список категорий для выбора
        };
    },
    created() {
        this.fetchCategories();
    },
    methods: {
        onFileChange(event) {
            this.book.cover_image = event.target.files[0];
        },
        async submitBook() {
            const formData = new FormData();
            formData.append('title', this.book.title);
            formData.append('author', this.book.author);
            formData.append('description', this.book.description);
            if (this.book.cover_image) {
                formData.append('cover_image', this.book.cover_image);
            }
            formData.append('author_bio', this.book.author_bio);
            formData.append('language', this.book.language);
            formData.append('rating', this.book.rating);
            formData.append('number_of_pages', this.book.number_of_pages);
            formData.append('is_published', this.book.is_published);
            formData.append('categories', this.book.categories);
        
            try {
                const response = await axios.post('/api/books', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Book created:', response.data);
                this.resetForm();
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.errors = error.response.data.errors;
                } else {
                    console.error('Ошибка при создании книги:', error);
                }
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get('/api/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Ошибка при загрузке категорий:', error);
            }
        },
        resetForm() {
            this.book = {
                title: '',
                author: '',
                description: '',
                cover_image: null,
                author_bio: '',
                language: '',
                rating: null,
                number_of_pages: null,
                is_published: false,
                categories: []
            };
            this.errors = {};
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
}

h1 {
    font-size: 2rem;
    font-weight: 700;
}

.form-label {
    font-weight: 500;
}

.form-control {
    border-radius: 0.375rem;
}

textarea.form-control {
    resize: vertical;
}

.btn-primary {
    background-color: #007bff;
    border: none;
    border-radius: 0.375rem;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.text-danger {
    font-size: 0.875rem;
    color: #dc3545;
}
</style>
