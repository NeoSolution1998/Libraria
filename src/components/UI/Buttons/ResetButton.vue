<template>
  <button
    class="btn btn-ghost btn-sm"
    @click="resetFilters"
    :disabled="disabled"
  >
    <slot>Сбросить фильтры</slot>
  </button>
</template>

<script>
export default {
  name: "ResetButton",
  props: {
    onReset: {
      type: Function,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    resetFilters() {
      if (!this.disabled) {
        this.onReset();
      }
    },
  },
};
</script>

<style scoped>
/* Using global styles from main.css - .btn, .btn-ghost, .btn-sm */
</style>