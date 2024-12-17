<template>
    <header-vue></header-vue>
    <Breadcrumbs></Breadcrumbs>
    <div class="container my-5">
        <h1 class="text-center mb-4">Создать пост</h1>
        <form @submit.prevent="submitPost" class="bg-light p-4 rounded shadow-sm">
            <div class="form-group mb-4">
                <label for="title" class="form-label">Заголовок</label>
                <input type="text" id="title" class="form-control" v-model="post.title" placeholder="Введите заголовок" />
                <div class="text-danger mt-1" v-if="errors.title">{{ errors.title }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="content" class="form-label">Контент</label>
                <textarea id="content" class="form-control" v-model="post.content" rows="5" placeholder="Введите контент"></textarea>
                <div class="text-danger mt-1" v-if="errors.content">{{ errors.content }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="book_id" class="form-label">ID книги</label>
                <input type="number" id="book_id" class="form-control" v-model="post.book_id" placeholder="Введите ID книги, или выберите из списка" />
                <div class="text-danger mt-1" v-if="errors.book_id">{{ errors.book_id }}</div>
            </div>

            <div class="form-group mb-4">
                <label for="image" class="form-label">Изображение (необязательно)</label>
                <input type="file" id="image" class="form-control" @change="onFileChange" />
                <div class="text-danger mt-1" v-if="errors.image">{{ errors.image }}</div>
            </div>

            <button type="submit" class="btn btn-outline-dark w-100">Создать</button>
        </form>
    </div>
    <footer-vue></footer-vue>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            post: {
                title: '',
                content: '',
                book_id: null,
                image: null
            },
            errors: {}
        };
    },
    methods: {
        onFileChange(event) {
            this.post.image = event.target.files[0];
        },
        async submitPost() {
            const formData = new FormData();
            formData.append('title', this.post.title);
            formData.append('content', this.post.content);
            if (this.post.book_id) {
                formData.append('book_id', this.post.book_id);
            }
            if (this.post.image) {
                formData.append('image', this.post.image);
            }

            try {
                const response = await axios.post('/api/posts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Post created:', response.data);
                this.post = { title: '', content: '', book_id: null, image: null };
                this.errors = {};
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.errors = error.response.data.errors;
                } else {
                    console.error('Ошибка при создании поста:', error);
                }
            }
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
