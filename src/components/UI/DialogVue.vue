<template>
  <div class="dialog" v-if="show" @click.stop="hideDialog">
    <div @click.stop class="dialog_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "DialogVue",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hideDialog() {
        this.$emit('update:show', false);
    },
  },
};
</script>

<style>
.dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.dialog_content {
  background: white;
  border-radius: 20px;
  padding: 50px;
  margin: 20px;
  min-width: 500px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
