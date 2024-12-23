<template>
    <div class="profile_wall__container">
        <div class="tabs-container">
            <!-- Навигация -->
            <div class="tabs-navigation">
                <button v-for="tab in tabs" :key="tab.name" :class="['tab', { active: tab.name === activeTab }]"
                    @click="activeTab = tab.name">
                    <i :class="['tab-icon', tab.iconClass]"></i> <!-- Иконка -->
                    {{ tab.label }}
                </button>

            </div>
            <hr class="tabs_navigation__separator"/>
            <!-- Контент -->
            <div class="tabs-content">
                <component :is="activeTabComponent" />
            </div>
        </div>
    </div>

</template>
<script>
import BooksContent from './WallSectionContent/BooksContent.vue';
import LikedContent from './WallSectionContent/LikedContent.vue';
import PostsContent from './WallSectionContent/PostsContent.vue';
import ReviewsContent from './WallSectionContent/ReviewsContent.vue';
import SavedContent from './WallSectionContent/SavedContent.vue';

export default {
    name: "WallSection",
    data() {
        return {
            activeTab: 'posts', // Активная вкладка по умолчанию
            tabs: [
                { name: 'posts', label: 'Стена', component: PostsContent, iconClass: 'icon' },
                { name: 'books', label: 'Книги', component: BooksContent, iconClass: 'icon-' },
                { name: 'reviews', label: '', component: ReviewsContent, iconClass: 'icon-users' },
                { name: 'saved', label: '', component: SavedContent, iconClass: 'icon-bookmark' },
                { name: 'likes', label: '', component: LikedContent, iconClass: 'icon-heart' },
            ],
        };
    },
    computed: {
        activeTabComponent() {
            return this.tabs.find(tab => tab.name === this.activeTab)?.component || null;
        },
    },
}
</script>
<style scoped>
.profile_wall__container {
    background-color: var(--white);
    border-radius: 20px;
    padding: 40px;
}

.tabs-container {
    background-color: var(--white);
}

.tabs-navigation button {
    color: var();
    font-family: Russo;
    background-color: var(--white);
    border: none;
    font-size: 22px;
    padding: 20px;
}

.tabs-navigation button.active {
    color: var(--dark-muted);
    background-color: var(--light);
    border-radius: 10px;
}

.tabs-content {}

@media(max-width:640px) {
    .profile_wall__container {
        background-color: var(--white);
        border-radius: 8px;
        padding: 20px;
    }

    .tabs-container {
        background-color: var(--white);

    }

    .tabs-navigation {
        display: flex;
        flex-direction: row;

    }
.tabs_navigation__separator{
    margin: 10px 0 10px 0;

}
    .tabs-navigation button {
        color: var();
        background-color: var(--white);
        border: none;
        font-size: 16px;
        padding: 10px;
    }

    .tabs-navigation button.active {
        color: var(--dark-muted);
        background-color: var(--light);
        border-radius: 6px;
    }
}
</style>