<template>
  <router-view v-slot="{ Component, route }">
    <suspense>
      <template #default>
        <!-- Use any custom transition and fallback to `fade` -->
        <transition
          :name="route.meta.transition || 'fade'"
          mode="out-in"
        >
          <div>
            <component :is="Component" />
          </div>
        </transition>
      </template>
      <template #fallback>
        Loading...
      </template>
    </suspense>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';

import store from './store';

export default defineComponent({
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
