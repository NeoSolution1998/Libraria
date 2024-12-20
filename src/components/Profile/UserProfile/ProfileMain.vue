<template>
    <div class="profile_main__container">
        <div  class="profile_main__section">
            <MainSection></MainSection>
        </div>
        <div class="profile_wall__section">
            <WallSection></WallSection>
        </div> 
    </div>
</template>
<script>

export default {
    name: "ProfileMain"
}
</script>
<style scoped>
.profile_main__container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
}
</style>