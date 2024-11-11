<template>
  <header class="menu">
    <nav class="menu__nav" :class="{ 'menu__nav--open': isOpen }">
      <RouterLink
        v-for="link in links"
        :onClick="handleToggleMenu"
        class="menu__nav__item"
        active-class="menu__nav__item--selected"
        :to="link.path"
        >{{ link.name }}</RouterLink
      >
    </nav>
    <button
      :onClick="handleToggleMenu"
      class="menu__button"
      :class="{ 'menu__button--open': isOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { routes } from '@/router'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const isOpen = ref(false)
const handleToggleMenu = () => (isOpen.value = !isOpen.value)
const links = routes
</script>

<style lang="scss">
.menu {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: end;
  transition: ease-in-out 200ms;
  z-index: 11;
  &__nav {
    position: absolute;
    right: -20rem;
    width: 320%;
    top: 0;
    display: flex;
    flex-direction: column;
    transition: ease-in 200ms;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0.4rem;
    background-color: var(--color-background-mute);
    box-shadow:
      0 0.5rem 1rem rgba(0, 0, 0, 0.24),
      0 6px 6px rgba(0, 0, 0, 0.46);
    &--open {
      right: 5rem;
      overflow: hidden;
    }
    &__item {
      color: var(--color-text);
      text-decoration: none;
      text-transform: uppercase;
      font-family: sans-serif;
      font-size: 1.4rem;
      padding: 1.6rem;
      margin: 0.4rem 0;
      width: 100%;
      text-align: center;
      transition: ease-in-out 200ms;
      border-radius: 1rem;
      &:hover {
        background-color: var(--vt-c-indigo);
      }
      &--selected {
        background-color: var(--vt-c-indigo);
      }
    }
  }

  &__button {
    border: none;
    background-color: var(--vt-c-black);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 5rem;
    margin: 0;
    padding: 1rem;
    cursor: pointer;
    transition: ease-in-out 200ms;
    position: relative;
    span {
      transition: ease-in-out 200ms;
      background-color: var(--vt-c-white);
      width: 100%;
      height: 0.2rem;
      margin: 0.2rem;
    }
  }
  &__button--open {
    span {
      &:first-child {
        transform: translateY(0.6rem) rotateZ(-45deg);
      }
      &:nth-child(2) {
        transform: rotateZ(-45deg);
      }
      &:last-child {
        transform: translateY(-0.6rem) rotateZ(45deg);
      }
    }
  }
}
</style>
