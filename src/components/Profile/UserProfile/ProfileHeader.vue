<template>
    <div class="profile_header__container">
        <div class="profile_header__banner">
            <img src="/images/home/3.jpg" alt="">
        </div>

    </div>
</template>
<script>
export default {
    name: "ProfileHeader"
}
</script>
<style scoped>
.profile_header__container {
    padding-bottom: 20px;
    max-width: 1920px;
    overflow: hidden;
}

.profile_header__banner {
    border-radius: 20px;
    height: 300px;
    overflow: hidden;

}

.profile_header__container img {
    width: 100%;
    height: 100%;
    object-fit: cover;

}

@media(max-width:1024px) {
    .profile_header__container {
        padding-bottom: 10px;
    }
    .profile_header__banner {
        height: 150px;
        border-radius: 10px;
    }
}

@media(max-width:440px) {
    .profile_header__container {
        max-width: 1920px;
        overflow: hidden;
    }

    .profile_header__banner {
        height: 100px;
        border-radius: 6px;

    }
}
</style>