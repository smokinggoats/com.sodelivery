<template>
  <span
    class="loading"
    v-if="loading"
    :class="{
      [`loading--${size || 'default'}`]: true,
    }"
  ></span>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading: boolean
  size?: 'default' | 'large'
}>()
</script>

<style lang="scss" scoped>
.loading {
  aspect-ratio: 1;
  display: grid;
  border: 4px solid #0000;
  border-radius: 50%;
  border-color: #ccc #0000;
  animation: loadingAnim 1s infinite linear;
  &--default {
    width: 32px;
  }
  &--large {
    width: 64px;
  }
}
.loading::before,
.loading::after {
  content: '';
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
}
.loading::before {
  border-color: #f03355 #0000;
  animation: inherit;
  animation-duration: 0.5s;
  animation-direction: reverse;
}
.loading::after {
  margin: 8px;
}
@keyframes loadingAnim {
  100% {
    transform: rotate(1turn);
  }
}
</style>
