<template>
    <div class="profile-component__container">

        <div class="profile_header_section">
            <!-- <ProfileHeader></ProfileHeader> -->
        </div>
        <div class="profile_main_section">
            <ProfileMain></ProfileMain>
        </div>
        <div class="profile_sidebar_section">
            <ProfileSidebar></ProfileSidebar>
        </div>
    </div>
</template>
<script>

export default {
    name: "ProfileContainer"
}
</script>
<style scoped>
.profile-component__container {
    margin: auto;
    max-width: 1920px;
    padding: 30px 30px;
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main";
    grid-template-columns: 1fr 4fr;
    column-gap: 20px;
}


.profile_sidebar_section {
    grid-area: sidebar;
}

.profile_header_section {
    grid-area: header;
}

.profile_main_section {
    grid-area: main;
}

@media(max-width:1024px) {
    .profile-component__container {
        max-width: 1024px;
        padding: 20px 20px;
        grid-template-areas:
            "header"
            "sidebar"
            "main";
        grid-template-columns: 1fr;
        row-gap: 10px;
    }

    .profile-component__container {

        padding: 20px 20px;
    }
}

@media(max-width:640px) {
    .profile-component__container {
        max-width: 640px;
        padding: 10px 10px;
    }
}
</style>