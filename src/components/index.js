import ButtonVue from "@/components/UI/Buttons/ButtonVue.vue";
import TextButton from "./UI/Buttons/TextButton.vue";
import ResetButton from "./UI/Buttons/ResetButton.vue";
import InputVue from "@/components/UI/InputVue.vue";
import DialogVue from "@/components/UI/DialogVue.vue";
import PaginationVue from "@/components/UI/PaginationVue.vue";
import FilterVue from "@/components/UI/FilterVue.vue";
import SearchVue from "@/components/UI/SearchVue.vue";
import SortVue from "@/components/UI/SortVue.vue";
import RatingVue from '@/components/UI/RatingVue.vue';

/* FILTERS */
import FiltersVue from "./UI/Filters/FiltersVue.vue";
import CategoryFilter from "./UI/Filters/CategoryFilter.vue";
import RangeFilter from "./UI/Filters/RangeFilter.vue";
import SearchBarFilter from "./UI/Filters/SearchBarFilter.vue";
import DateFilter from "./UI/Filters/DateFilter..vue";
import TagFilter from "./UI/Filters/TagFilter.vue";

/* HOME PAGE COMPONENTS */
import WelcomeSection from '@/components/Home/WelcomeSection.vue';
import HowWorksSection from '@/components/Home/HowWorksSection.vue';
import PopularBooks from "./Home/PopularBooks.vue";

/* HEADER AND FOOTER */
import HeaderVue from "@/components/Header/HeaderVue.vue";
import FooterVue from "@/components/FooterVue.vue";

/* BOOKS */
import BooksList from "@/components/Books/BooksList.vue";
import BooksItem from "@/components/Books/BooksItem.vue";
import BookVue from '@/components/Books/BookVue.vue';
import PopularBookSeries from "@/components/Books/PopularBookSeries.vue";

/* POSTS */
import PostsList from "@/components/Posts/PostsList.vue";
import PostsItem from "@/components/Posts/PostsItem.vue";
import PopularPosts from "@/components/Posts/PopularPosts.vue";
import PostsHeader from "./Posts/PostsHeader.vue";
import PostsVue from "./Posts/PostsVue.vue";
import PostsListComponent from "./Posts/PostsListComponent.vue";

/* PROFILE */
import ProfileVue from "@/components/Profile/ProfileVue.vue";
import SettingsVue from "@/components/Profile/SettingsVue.vue";

/* COMMENTS */
import CommentsVue from "@/components/Comments/CommentsVue.vue";
import Comments from "@/components/Comments/Comments.vue";

/* AUTH */
import AuthVue from "@/components/Auth/AuthVue.vue";
import LoginVue from "@/components/Auth/LoginVue.vue";
import RegistrationVue from "@/components/Auth/RegistrationVue.vue";

/* SUBSCRIPTION */
import SubscriptionVue from "@/components/SubscriptionVue.vue";

/* ICONS */
import IconVue from '@/components/Icons/IconVue.vue';
import FontelloIcons from '@/components/Icons/FontelloIcons.vue';

export default [
    /* UI */
    ButtonVue,
    TextButton,
    ResetButton,

    InputVue,
    DialogVue,
    HeaderVue,
    FooterVue,
    BooksItem,
    BooksList,
    PaginationVue,
    SearchVue,
    SortVue,
    FilterVue,
    PostsList,
    PostsItem,
    AuthVue,
    RegistrationVue,
    LoginVue,
    SettingsVue,
    ProfileVue,
    BookVue,
    SubscriptionVue,
    CommentsVue,
    Comments,
    IconVue,
    FontelloIcons,
    PopularPosts,
    RatingVue,
    PopularBookSeries,
    WelcomeSection,
    HowWorksSection,
    PopularBooks,

    /* Posts */
    PostsHeader,
    PostsVue,
    PostsListComponent,

    /* Filters */
    FiltersVue,
    CategoryFilter,
    RangeFilter,
    SearchBarFilter,
    DateFilter,
    TagFilter
];
