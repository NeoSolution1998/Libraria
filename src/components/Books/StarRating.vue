<template>
  <div class="stars" :class="{ 'stars--readonly': !editable, 'stars--sm': size === 'sm' }">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      class="stars__star"
      :class="{
        'is-active': star <= displayValue,
        'is-hovered': editable && star <= hovered,
      }"
      :disabled="!editable || busy"
      :aria-label="`Оценка ${star} из 5`"
      :aria-pressed="star <= Math.round(value)"
      @click="pick(star)"
      @mouseenter="hovered = editable ? star : 0"
      @mouseleave="hovered = 0"
      @focus="hovered = editable ? star : 0"
      @blur="hovered = 0"
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
        <path
          d="m12 3.6 2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.95 6.75 19.75l1-5.85L3.5 9.75l5.9-.85L12 3.6Z"
          fill="currentColor"
        />
      </svg>
    </button>

    <span v-if="showValue" class="stars__value">{{ valueLabel }}</span>
  </div>
</template>

<script>
export default {
  name: 'StarRating',
  props: {
    value: { type: Number, default: 0 },
    editable: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
    showValue: { type: Boolean, default: false },
    valueFormat: { type: String, default: 'compact' },
    busy: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
  },
  data() {
    return { hovered: 0 };
  },
  computed: {
    displayValue() {
      return this.hovered || Math.round(Number(this.value) || 0);
    },
    valueLabel() {
      const value = Number(this.value) || 0;
      if (!value) return 'Пока без оценок';

      const label = value.toFixed(1).replace('.', ',');
      if (this.valueFormat !== 'full') return label;

      if (!this.count) return `${label} из 5`;

      const mod10 = this.count % 10;
      const mod100 = this.count % 100;
      let word = 'оценок';
      if (mod10 === 1 && mod100 !== 11) word = 'оценка';
      else if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) word = 'оценки';

      return `${label} · ${this.count} ${word}`;
    },
  },
  methods: {
    pick(star) {
      if (!this.editable || this.busy) return;
      this.$emit('rate', star === Math.round(Number(this.value) || 0) ? 0 : star);
    },
  },
};
</script>

<style scoped>
.stars {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.stars__star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  color: var(--line-strong);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.15s ease, transform 0.15s ease;
}

.stars__star svg {
  display: block;
  width: 100%;
  height: 100%;
}

.stars__star.is-active {
  color: var(--gold);
}

.stars--readonly .stars__star {
  cursor: default;
}

.stars__star:not(:disabled):hover {
  transform: scale(1.08);
}

.stars__value {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* small variant */
.stars--sm {
  gap: 2px;
}

.stars--sm .stars__star {
  width: 14px;
  height: 14px;
}

.stars--sm .stars__value {
  margin-left: 6px;
  font-size: 11px;
}

@media (max-width: 900px) {
  .stars__star {
    width: 17px;
    height: 17px;
  }
}
</style>
