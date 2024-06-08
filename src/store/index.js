import { createStore } from "vuex";
import { postModule } from "./Posts/PostModule";

export default createStore({
    modules: {
        posts: postModule
    }
})