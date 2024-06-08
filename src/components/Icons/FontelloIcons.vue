<template>
    <div class="icon-container m-5">
      <div class="icon-item" v-for="icon in icons" :key="icon">
        <icon-vue :name="icon"></icon-vue>
        <span>{{ icon }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
  name: 'FontelloIcons',
  data() {
    return {
      icons: [
        // Ваши существующие иконки...
        'mail',
        'search',
        'heart-empty',
        'heart',
        'star-empty',
        'star',
        'bell',
        'chat',
        'forward',
        'basket',
        'cog',
        'down-open',
        'right-open',
        'up-open',
        'left-open',
        'filter',
        'menu',
        'comment-empty',
        'bell-alt',
        'reply',
        'reply-all',
        'flickr',
        'sliders',
        'share',
        'bell-off',
        'cart-plus',
        'cart-arrow-down',
        'user-plus',
        // Новые иконки...
        'reply-1',
        'menu-1',
        'dot-3',
        'user-add-outline',
        'user-delete-outline',
        'user-delete',
        'user-add',
        'play-circle2',
        'play',
        'vcard',
        'thumbs-up',
        'thumbs-down',
        'eye',
        'cancel',
        'cancel-squared',
        'cancel-circled',
        'plus-circled',
        'star-empty-1',
        'star-1',
        'heart-empty-1',
        'user',
        'user-add-1',
        'users',
        'video',
        'picture',
        'camera',
        'layout',
        'note',
        'check',
        'search-1',
        'mail-1',
        'attach',
        'quote',
        'pencil',
        'cog-1',
        'share-1',
        'adjust',
        'light-up',
        'megaphone',
      ],
    };
  },
};

  </script>
  
  <style scoped>
  .icon-container {
    display: flex;
    flex-wrap: wrap;
  }
  .icon-item {
    width: 100px;
    text-align: center;
    margin: 10px;
  }
  .icon-item i {
    font-size: 2em;
    display: block;
  }
  </style>
  