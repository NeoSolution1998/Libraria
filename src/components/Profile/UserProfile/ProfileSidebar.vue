<template>
    <div class="profile_sidebar__container">
        <div class="sidebar__user_section">
            <UserSection></UserSection>
        </div>
        <div class="sidebar__friends_section">
            <FriendsSection></FriendsSection>
        </div>
        <div class="sidebar__followers_section">
            <FollowersSection></FollowersSection>
        </div>
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

    .sidebar__friends_section {
        display: none;
    }

    .sidebar__followers_section {
        display: none;
    }
}
</style>