<script setup lang="ts">
import Nav from '@/components/NavMenu/NavMenu.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Nav></Nav>
  <Suspense>
    <div class="page">
      <RouterView />
    </div>
  </Suspense>
</template>
