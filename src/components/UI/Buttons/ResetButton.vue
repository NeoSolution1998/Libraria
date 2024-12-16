<template>
  <button class="reset-button" @click="resetFilters">
    <slot></slot>
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
  },
  methods: {
    resetFilters() {
      this.onReset();
    },
  },
};
</script>

<style scoped>
.reset-button {
  background: none;
  border: none;
  color: var(--blue);
  text-decoration:none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  transition: color 0.2s ease-in-out;
}

.reset-button:hover {
  color: var(--red);
}
</style>
