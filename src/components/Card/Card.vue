<template>
  <div class="card">
    <div class="card__title">
      <h3 class="card__title__text">
        {{ title }}
      </h3>
    </div>
    <hr class="card__divider" />
    <div class="card__content">
      <slot name="content"></slot>
    </div>
    <div class="card__action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string }>()
</script>

<style lang="scss">
:root {
  --card-background: var(--vt-c-white);
  --card-text: var(--vt-c-black);
  --card-button-background: var(--vt-c-black);
  --card-button-text: var(--vt-c-white-soft);
  --card-button-hover-background: var(--color-accent);
  --card-button-hover-text: var(--vt-c-white);
  --card-button-active-background: var(--vt-c-black-soft);
  --card-button-active-text: var(--vt-c-white);
}
.card {
  min-height: 12rem;
  width: 100%;
  border-radius: 1rem;
  box-shadow:
    0 0.5rem 1rem rgba(0, 0, 0, 0.24),
    0 6px 6px rgba(0, 0, 0, 0.46);
  background-color: var(--card-background);
  color: var(--card-text);
  padding: 0.8rem;

  &__divider {
    margin: 0.6rem 0;
  }
  &__title {
    &__text {
      text-transform: uppercase;
      font-weight: 100;
    }
  }
  &__content {
  }

  &__action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
    margin: 0.4rem 0 0 0;
  }
}
</style>
