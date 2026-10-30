<template>
  <div class="profile-page">
    <header-vue />
    <ProfileContainer />
    <footer-vue />
  </div>
</template>

<script>
import ProfileContainer from '@/components/Profile/ProfileContainer.vue';

export default {
  name: 'ProfilePage',
  components: {
    ProfileContainer,
  },
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--paper);
}

.profile-page :deep(.pp-page) {
  flex: 1;
  min-height: 0;
}
</style>
