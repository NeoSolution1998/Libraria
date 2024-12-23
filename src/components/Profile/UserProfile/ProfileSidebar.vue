<template>
    <div class="profile_sidebar__container">
        <div class="sidebar_user_section">
            <UserSection></UserSection>
        </div>
        <div class="sidebar_social__section">
            <SocialSection></SocialSection>
        </div>
     <!--    <div class="sidebar_friends__section">
            <FriendsSection></FriendsSection>
        </div>
        <div class="sidebar_followers__section">
            <FollowersSection></FollowersSection>
        </div> -->
    </div>
</template>
<script>

export default {
    name: "ProfileSidebar"
}
</script>
<style scoped>
.profile_sidebar__container {
    display: grid;
    grid-template-columns: 1rf;
    gap: 10px;
}

.sidebar__friends_section {}

.sidebar__followers_section {}

@media(max-width:1024px) {
    .profile_sidebar__container {}

    .sidebar_friends__section {
        display: none;
    }

    .sidebar_followers__section {
        display: none;
    }

    .sidebar_social__section {
        display: none;
    }
}
</style>