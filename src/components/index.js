import ButtonVue from "@/components/UI/Buttons/ButtonVue.vue";
import TextButton from "./UI/Buttons/TextButton.vue";
import ResetButton from "./UI/Buttons/ResetButton.vue";

import SortSelectUI from "./UI/Selects/SortSelectUI.vue";

import InputVue from "@/components/UI/InputVue.vue";
import DialogVue from "@/components/UI/DialogVue.vue";
import PaginationVue from "@/components/UI/PaginationVue.vue";
import FilterVue from "@/components/UI/FilterVue.vue";
import SearchVue from "@/components/UI/SearchVue.vue";
import SortVue from "@/components/UI/SortVue.vue";
import RatingVue from '@/components/UI/RatingVue.vue';

/* FILTERS */
import FiltersVue from "@/components/Filters/FiltersVue.vue";
import CategoryFilter from "@/components/Filters/CategoryFilter.vue";
import RangeFilter from "@/components/Filters/RangeFilter.vue";
import SearchBarFilter from "@/components/Filters/Search/SearchBarFilter.vue";
import DateFilter from "@/components/Filters/DateFilter..vue";
import TagFilter from "@/components/Filters/TagFilter.vue";
import SortDropdown from "./Filters/Search/SortDropdown.vue";
import FiltersDropdown from "./Filters/Search/FiltersDropdown.vue";

/* HOME PAGE COMPONENTS */
import WelcomeSection from '@/components/Home/WelcomeSection.vue';
import HowWorksSection from '@/components/Home/HowWorksSection.vue';
import PopularBooks from "./Home/PopularBooks.vue";

/* HEADER AND FOOTER */
import HeaderVue from "@/components/Header/HeaderVue.vue";
import FooterVue from "@/components/FooterVue.vue";

/* BOOKS */
import BooksList from "@/components/Books/old/BooksList.vue";
import BooksItem from "@/components/Books/old/BooksItem.vue";
import BookVue from '@/components/Books/old/BookVue.vue';
import PopularBookSeries from "@/components/Books/old/PopularBookSeries.vue";

/* POSTS */
import PostsList from "@/components/Posts/old/PostsList.vue";
import PostsItem from "@/components/Posts/old/PostsItem.vue";
import PopularPosts from "@/components/Posts/old/PopularPosts.vue";

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
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs.vue";
import VuexComponent from "./vuexComponent.vue";

/* Books */
import BooksContainer from "./Books/BooksContainer.vue";
import BooksListComponent from "./Books/BooksListComponent.vue";

export default [
    /* UI */
    ButtonVue,
    TextButton,
    ResetButton,

    SortSelectUI,
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
    VuexComponent,

    /* Posts */
    PostsHeader,
    PostsVue,
    PostsListComponent,

    /* Books */
    BooksContainer,
    BooksListComponent,

    /* Filters */
    FiltersVue,
    CategoryFilter,
    RangeFilter,
    SearchBarFilter,
    DateFilter,
    TagFilter,
    SortDropdown,
    FiltersDropdown,

    Breadcrumbs,
];
