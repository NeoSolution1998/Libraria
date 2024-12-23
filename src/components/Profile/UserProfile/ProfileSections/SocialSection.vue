<template>
    <div class="profile_social__container">
        <div class="social_section__list">
            <div class="social_section__item">
                <p>Github</p> <p>www.github.com</p>

            </div>
            <hr class="social_section__separator">
            <div class="social_section__item">
                <p>Telegram</p><p>@robertmartin</p>
            </div>
            <hr class="social_section__separator">
            <div class="social_section__item">
                <p>vk</p> <p>www.vk.ru</p>
            </div>
            <hr class="social_section__separator">
            <div class="social_section__item">
                <p>Habr</p><p>wwww.habr.ru</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "SocialSection"
}
</script>

<style scoped>
.profile_social__container {
    background-color: var(--white);
    border-radius: 10px;
    padding: 20px
}

.social_section__list {}

.social_section__item {
    display: flex;
    justify-content: space-between;
}
.social_section__separator{
    margin: 5px 0 5px 0;
}
</style>