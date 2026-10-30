<template>
  <button
    type="submit"
    class="btn btn-primary"
    :class="[variant ? `btn-${variant}` : '', size ? `btn-${size}` : '', disabled ? 'btn-disabled' : '']"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ButtonVue",
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent', 'ghost', 'danger'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
};
</script>

<style scoped>
/* Using global styles from main.css - .btn, .btn-primary, .btn-secondary, .btn-accent, .btn-ghost, .btn-danger, .btn-sm, .btn-md, .btn-lg */
</style>