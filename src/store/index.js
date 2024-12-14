import { createStore } from "vuex";
import { postsModule } from "./Posts/PostsModule";
import { booksModule } from "./Books/BooksModule";
import { imagesModule } from "./Image/ImagesModule";
import { chaptersModule } from "./Chapters/ChaptersModule";
import { commentsModule } from "./Comments/CommentsModule";
import { paginationModule } from "./UI/PaginationModule";
import { headerModule } from "./Header/headerModule";
import { authModule } from './Auth/AuthModule';

export default createStore({
    state: {
        domain: process.env.VUE_APP_API_URL,
    },
    modules: {
        auth: authModule, // Управление авторизацией и регистрацией
        header: headerModule, // Управление состоянием хедера
        posts: postsModule,
        books: booksModule,
        comments: commentsModule,
        pagination: paginationModule,
        chapters: chaptersModule,
        images: imagesModule
    }
})