import { createStore } from "vuex";
import { postsModule } from "./Posts/PostsModule";
import { booksModule } from "./Books/BooksModule";
import { paginationModule } from "./UI/PaginationModule";
import { headerModule } from "./Header/headerModule";

export default createStore({
    state: {
        domain: "http://127.0.0.1:8000"
    },
    modules: {
        posts: postsModule,
        books: booksModule,
        header: headerModule,
        pagination: paginationModule
      
    }
})