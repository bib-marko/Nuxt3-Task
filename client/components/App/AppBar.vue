<script setup lang="ts">
import { mergeProps } from 'vue'

const drawer = useState('drawer')
const route = useRoute()
const breadcrumbs = computed(() => {
  return route!.matched
    .filter(
      (item) =>
        item.meta && item.meta.title && !(item.meta?.breadcrumb === 'hidden'),
    )
    .map((r) => ({
      title: r.meta.title!,
      disabled:
        r.meta?.breadcrumb === 'disabled' || r.path === route.path || false,
      to: r.path,
    }))
})
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-breadcrumbs :items="breadcrumbs"> </v-breadcrumbs>
    <v-spacer />
    <div id="app-bar"></div>
    <v-menu location="bottom">
      <template #activator="{ props: menu }">
        <v-tooltip location="bottom">
          <template #activator="{ props: tooltip }">
            <v-btn icon large v-bind="mergeProps(menu, tooltip)" class="ml-1">
              <v-icon icon="mdi-account-circle" size="36" />
            </v-btn>
          </template>
          <span>{{ 'User'}}</span>
        </v-tooltip>
      </template>
    </v-menu>
  </v-app-bar>
</template>
