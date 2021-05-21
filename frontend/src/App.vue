<template>
  <SimpleNavbar />
  <router-view v-slot="{ Component, route }">
    <!-- Use any custom transition and fallback to `fade` -->
    <transition
      :name="route.meta.transition || 'fade'"
      mode="out-in"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import SimpleNavbar from '@/components/NavBars/SimpleNavbar.vue';

import store from './store';

export default defineComponent({
  components: {
    SimpleNavbar,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    store.commit.setAuthPlugin(internalInstance?.appContext.config.globalProperties.$auth);
  },

});
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.05s ease;
}

.fade-enter-from,
.fade-leave-active {
  opacity: 0;
}

</style>
